const { Leave, validateLeave } = require("../models/leave");
const { Notification } = require("../models/notification");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const _id = require("../middleware/_id");

const express = require("express");
const mongoose = require("mongoose");
const { User } = require("../models/user");

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
  const leaves = await Leave.find({ date: { $gt: Date.now() } })
    .sort({ date: 1, status: -1, appliedOn: 1 })
    .populate("updatedBy", { nwi: 1, _id: 1 })
    .populate("user", { nwi: 1, _id: 1 });

  res.send(JSON.stringify(leaves));
});

//request leave
router.post("/", auth, async (req, res) => {
  const user = await User.findOne({ _id: req.user_id });
  if (user.availableLeaves === 0)
    return res.status(400).send(`${user.nwi} has 0 leaves left for this year`);

  req.body.userId = req.user._id; // to parse for validation
  const { error } = validateLeave(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const leave = await Leave.create({
    date: req.body.date,
    description: req.body.description,
    user: req.user._id,
    // userId: req.body._id,
  });

  // // check if the leave is a medical leave
  // if (req.body.ifMedical) {
  //   leave.ifMedical = true;
  //   await leave.save();
  // }

  // // Update users available no.leaves, but it's better to update on leave status.
  // user.availableLeaves -= 1;
  // await user.save();

  await Notification.create({
    user: req.user._id,
    receiver: "Admin",
    target: {
      type: "Leave",
      id: leave._id,
    },
    message: `${req.user.nwi} has requested for a leave on ${req.body.date}`,
  });

  res.send(JSON.stringify([leave]));
});

// update a leave (admin)
router.put("/", [auth, admin, _id], async (req, res) => {
  const leave = await Leave.findOne({ _id: req.body._id }).populate(
    "user",
    "nwi _id"
  );
  if (!leave) return res.status(400).send("Invalid Leave");

  const user = await User.findOne({ _id: leave.user });
  if (user.availableLeaves === 0)
    return res.status(400).send(`${user.nwi} has 0 leaves left for this year`);

  leave.status = req.body.status;
  leave.updatedBy = req.user._id;
  await leave.save();

  if (leave.status === "Approve") {
    user.availableLeaves -= 1;
    await user.save();
  }

  await Notification.create({
    user: leave.user._id,
    target: {
      type: "Leave",
      id: leave._id,
    },
    receiver: "User",
    message: `Leave on ${leave.date} of ${leave.user.nwi} has been ${
      req.body.status === "Approve" ? "approved" : "rejected"
    }.`,
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
