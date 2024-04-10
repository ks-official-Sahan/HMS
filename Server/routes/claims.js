const { Claim, validateClaim } = require("../models/claim");
const { Notification } = require("../models/notification");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const _id = require("../middleware/_id");

const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// get claims for the relevant user
router.get("/user", auth, async (req, res) => {
  const claims = await Claim.find({ user: req.user._id })
    .sort({ appliedOn: -1, date: -1 })
    .select("-user -_id -__v")
    .limit(10);
  res.send(JSON.stringify(claims));
});

// get detail about relevant claim
router.get("/:_id", auth, async (req, res) => {
  const claim = await Claim.find({
    _id: req.params._id,
    user: req.user._id,
  });

  if (!claim) return res.status(400).send("Invalid Claim");
  res.send(JSON.stringify(claim));
});

// get all claims (admin)
router.post("/admin", [auth, admin], async (req, res) => {
  // const claims = await Claim.find({ date: { $gt: Date.now() } })
  const claims = await Claim.find()
    .sort({ date: 1, status: -1, appliedOn: 1 })
    .populate("updatedBy", { nwi: 1, _id: 1 })
    .populate("user", { nwi: 1, _id: 1 });

    res.send(JSON.stringify(claims));
});

//request claim
router.post("/", auth, async (req, res) => {
  req.body.userId = req.user._id;
  const { error } = validateClaim(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const claim = await Claim.create({
    date: req.body.date,
    description: req.body.description,
    user: req.user._id,
    // user: req.body._id,
  });

  await Notification.create({
    user: req.user._id,
    receiver: "Admin",
    target: {
      type: "Claim",
      id: claim._id,
    },
    message: `${req.user.nwi} has requested for a claim on ${req.body.date}`,
  });

  res.send(JSON.stringify([claim]));
});

// update a claim (admin)
router.put("/", [auth, admin, _id], async (req, res) => {
  const claim = await Claim.findOne({ _id: req.body._id }).populate(
    "user",
    "nwi _id"
  );
  if (!claim) return res.status(400).send("Invalid Claim");

  claim.status = req.body.status; //Approved or Rejected
  claim.updatedBy = req.user._id;
  await claim.save();

  await Notification.create({
    user: claim.user._id,
    target: {
      type: "Claim",
      id: claim._id,
    },
    message: `Claim on ${claim.date} of ${claim.user.nwi} has been ${
      req.body.status === "Approve" ? "approved" : "rejected"
    }.`,
  });

  res.send(JSON.stringify(claim));
});

// cancel claim request (user)
router.delete("/:id", [auth, _id], async (req, res) => {
  const claim = await Claim.findByIdAndDelete(req.params.id);

  if (!claim)
    return res.status(400).send("The claim with given id wasn't exists");

  // const notification = await Notification.findOneAndDelete({ "target.id": req.params.id });
  await Notification.deleteMany({ "target.id": req.params.id });

  res.send(claim);
});

module.exports = router;
