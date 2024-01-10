const { Leave, validateLeave } = require("../models/leave");
const { Notification } = require("../models/notification");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const _id = require("../middleware/_id");

const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// get leaves for the relevant user
router.get("/user", auth, async (req, res) => {
  const leaves = await Leave.find({ user: req.user._id })
    .sort({ appliedOn: -1, date: -1 })
    .select("-user -_id -__v")
    .limit(10);
  res.send(JSON.stringify(leaves));
});

// get detail about relevant leave
router.get("/:_id", auth, async (req, res) => {
  const leave = await Leave.find({
    _id: req.params._id,
    user: req.user._id,
  });

  if (!leave) return res.status(400).send("Invalid Leave");
  res.send(JSON.stringify(leave));
});

// get all leaves (admin)
router.post("/admin", [auth, admin], async (req, res) => {
  const leaves = await Leave.find()
    .sort({ appliedOn: 1, date: 1 })
    .populate("user", { nwi: 1, _id: 1 });

  res.send(JSON.stringify(leaves));
});

//request leave
router.post("/", auth, async (req, res) => {
  req.body.userId = req.user._id;
  const { error } = validateLeave(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const leave = await Leave.create({
    date: req.body.date,
    description: req.body.description,
    user: req.user._id,
    // userId: req.body._id,
  });  

  const notification = await Notification.create({
    user: req.user._id,
    receiver: 'Admin',
    target: {
      type: "Leave",
      id: leave._id,
    },  
    message: `${req.user.nwi} has requested for a leave on ${req.body.date}`,
  });  

  res.send(JSON.stringify([leave]));
});  

// update a leave (admin)
router.put("/:id", [auth, admin, _id], async (req, res) => {
  const leave = await Leave.findOne({
    _id: req.body._id,
    user: req.user._id,
  }).populate("user", "nwi");
  if (!leave) return res.status(400).send("Invalid Leave");

  leave.status = req.body.status;
  await leave.save();

  const notification = await Notification.create({
    user: req.user._id,
    target: {
      type: "Leave",
      id: leave._id,
    },
    message: `Leave on ${req.body.date} of ${req.user.nwi} has been ${req.body.status === "Approve" ? "approved" : "rejected"}.`,
  });

  res.send(JSON.stringify(leave));
});

// cancel leave request (user)
router.delete("/:id", [auth, _id], async (req, res) => {
  const leave = await Leave.findByIdAndDelete(req.params.id);

  if (!leave)
    return res.status(400).send("The leave with given id wasn't exists");

  // const notification = await Notification.findOneAndDelete({ "target.id": req.params.id });
  await Notification.deleteMany({ "target.id": req.params.id });

  res.send(leave);
});

module.exports = router;
