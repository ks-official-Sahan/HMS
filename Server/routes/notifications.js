const { Notification } = require("../models/notification");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const _id = require("../middleware/_id");

const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

/* User*/

// Get notifications of relavent user
router.get("/user", auth, async (req, res) => {

  const notifications = await Notification.find({
    user: req.user._id,
    receiver: "User",
  })
    .sort({ datetime: -1 })
    .limit((req.query.limit)?5:0)
    .select({ user: 0 });
  res.send(JSON.stringify(notifications));
});

// Get notification count (user)
router.get("/count/user", auth, async (req, res) => {
  const count = await Notification.find({
    user: req.user._id,
    seen: false,
    receiver: "User",
  }).countDocuments();
  res.send(JSON.stringify(count));
});

// update seen for user
router.put("/user", auth, async (req, res) => {
  const notifications = await Notification.updateMany(
    { seen: false, receiver: "User", user: req.user._id },
    { seen: true }
  );

  res.send(JSON.stringify(notifications));
});


/* Admin */ 

// Get all notifications
router.get("/admin", [auth, admin], async (req, res) => {
  const notifications = await Notification.find()
    .sort({ datetime: -1 })
    .limit((req.query.limit)?5:0)
    .populate("user", { nwi: 1, _id: 1 });

  res.send(JSON.stringify(notifications));
});

// Get notification count (admin)
router.get("/count/admin", auth, async (req, res) => {
  const count = await Notification.find({
    seen: false,
    receiver: "Admin",
  }).countDocuments();
  res.send(JSON.stringify(count));
});

// update seen for admin
router.put("/admin", auth, admin, async (req, res) => {
  const notifications = await Notification.updateMany(
    { seen: false, receiver: "Admin" },
    { seen: true }
  );

  res.send(JSON.stringify(notifications));
});


/* Delete */

// Delete relevent notification
router.delete("/:id", [auth, _id], async (req, res) => {
  const notification = await Notification.findByIdAndDelete(req.params.id);

  if (!notification)
    return res.status(400).send("The notification with given id wasn't exists");

  res.send(notification);
});

module.exports = router;
