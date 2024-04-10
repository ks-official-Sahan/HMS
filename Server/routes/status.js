const { Status, validateStatus } = require("../models/status");
const { Notification } = require("../models/notification");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const _id = require("../middleware/_id");

const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// status for the relevant user
router.get("/user", auth, async (req, res) => {
  const status = await Status.find({ user: req.user._id })
    .sort({ updatedOn: -1, date: -1 })
    .select("-user -__v -_id")
    .limit(10);
  res.send(JSON.stringify(status));
});

// get detail about relevant user's status
router.get("/:_id", [auth, admin], async (req, res) => {
  const status = await Status.find({ user: req.params._id })
    .sort({date: -1, updatedOn: 1});

  if (!status) return res.status(400).send("Invalid Status");
  res.send(JSON.stringify(status));
});

// // get all status (admin)
// router.post("/admin", [auth, admin], async (req, res) => {
//   const status = await Status.find()
//     .sort({ updatedOn: 1, date: 1 })
//     .populate("user", { nwi: 1, _id: 1 });

//   res.send(JSON.stringify(status));
// });

// submit status
router.post("/", auth, async (req, res) => {
  req.body.user = req.user._id;
  // const { error } = validateStatus(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  const status = await Status.create({
    // date: req.body.date,
    // description: req.body.description,
    stat1: req.body.stat1,
    stat2: req.body.stat2,
    stat3: req.body.stat3,
    stat4: req.body.stat4,
    stat5: req.body.stat5,
    stat6: req.body.stat6,
    stat7: req.body.stat7,
    stat8: req.body.stat8,
    stat9: req.body.stat9,
    stat10: req.body.stat10,
    stat11: req.body.stat11,
    stat12: req.body.stat12,
    user: req.user._id,
  });  

  const notification = await Notification.create({
    user: req.user._id,
    receiver: 'Admin',
    target: {
      type: "Status",
      id: status._id,
    },  
    message: `${req.user.nwi} has submitted a health status on ${req.body.date}`,
  });  

  res.send(JSON.stringify([status]));
});  

// delete status (user)
router.delete("/:id", [auth, _id], async (req, res) => {
  const status = await Status.findByIdAndDelete(req.params.id);

  if (!status)
    return res.status(400).send("The claim with given id wasn't exists");

  // const notification = await Notification.findOneAndDelete({ "target.id": req.params.id });
  await Notification.deleteMany({ "target.id": req.params.id });

  res.send(status);
});

module.exports = router;
