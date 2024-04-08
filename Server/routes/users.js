const { User, validateUser, validateUserUpdate } = require("../models/user");
const { Notification } = require("../models/notification");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const mongoose = require("mongoose");
const express = require("express");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const user = await User.find()
    .select("-password -fname -lname -address._id -__v -registeredOn")
    .sort("-status")
    .populate("position", "-_id -__v")
    .populate("updatedBy", "nwi")
    .populate("department", "-_id -__v")
    .populate("address.province", "-_id -__v");

  res.send(JSON.stringify(user));
});

router.get("/user", auth, async (req, res) => {
  res.send(await getUser(res, req.user._id));
});

router.get("/user/:_id", [auth, admin], async (req, res) => {
  res.send(await getUser(res, req.params._id));
});

async function getUser(res, id) {
  const user = await User.findOne({ _id: id })
    .select("-password -_id -address._id -__v -registeredOn")
    .populate("position", "-_id -__v")
    .populate("department", "-_id -__v")
    .populate("updatedBy", "-__v")
    .populate("address.province", "-_id -__v");
  if (!user) return res.status(400).send("Cannot find the user");

  return JSON.stringify(user);
}

// Registering User
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.message);

  const isUser = await User.findOne({
    $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
  });
  if (isUser)
    return res
      .status(400)
      .send(
        `${
          isUser.email == req.body.email ? "Email" : "Phone Number"
        } is already used`
      );

  // req.body.dob += "Z"; //this needs to be uncommented if the type of dob in userSchema is Date for the best.
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const user = await User.create(req.body);

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(
      JSON.stringify(
        _.pick(user, ["_id", "email", "mobile", "fname", "lname", "password"])
      )
    );
});

// Updating User
router.put("/user", auth, async (req, res) => {
  const { error } = validateUserUpdate(
    _.pick(req.body, ["address", "email", "mobile"])
  );
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ _id: req.user._id });
  if (!user) return res.status(401).send("Something Failed");

  await updateUser(req, res, user);
});

router.put("/user/:id", [auth, admin], async (req, res) => {
  const { error } = validateUserUpdate(
    _.pick(req.body, ["address", "email", "mobile"])
  );
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ _id: req.params.id });
  if (!user) return res.status(400).send("Something Failed");

  if (req.body.updateStatus) {
    await updateUserStatus(req, res, user);
  } else {
    await updateUser(req, res, user);
  }
});

async function updateUserStatus(req, res, user) {
  if (req.user.isAdmin) {
    user.status = !user.status;

    user.updatedBy = req.user._id;
    await user.save();

    const notification = await Notification.create({
      user: user._id,
      receiver: "Admin",
      target: {
        type: "User Update",
        id: user._id,
      },
      message: `${req.user.nwi} has ${
        user.status ? "activated" : "deactivated"
      } ${user.nwi}.`,
    });
  }

  res.send(JSON.stringify(user));
}

async function updateUser(req, res, user) {
  const users = await User.find({
    $and: [
      { $or: [{ email: req.body.email }, { mobile: req.body.mobile }] },
      { _id: { $ne: user._id } },
    ],
  });

  if (users.length > 0)
    return res
      .status(400)
      .send(
        `${
          user[0].email == req.body.email ? "Email" : "Phone Number"
        } is already used`
      );

  if (req.body.password) {
    if (
      req.body.oPassword !== "" &&
      req.body.password !== "" &&
      req.body.password.value === req.body.cPassword.value
    ) {
      const validPassword = await bcrypt.compare(
        req.body.oPassword,
        user.password
      );
      if (!validPassword)
        return res.status(400).send("Incorrect current password");

      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
      user.password = req.body.password;
    } else {
      return res.status(400).send("Passwords doesn't match");
    }
  }

  user.email = req.body.email;
  user.mobile = req.body.mobile;
  user.address = {
    line1: req.body.address.line1,
    line2: req.body.address.line2,
    line3: req.body.address.line3,
    zipcode: req.body.address.zipcode,
    province: req.body.address.province,
  };

  if (req.user.isAdmin) {
    user.dob = req.body.dob;
    user.position = req.body.position;
    user.department = req.body.department;

    user.updatedBy = req.user._id;
  }

  await user.save();
  res.send(JSON.stringify(user));
}

module.exports = router;
