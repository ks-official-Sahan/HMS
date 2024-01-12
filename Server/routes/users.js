const { User, validateUser, validateUserUpdate } = require("../models/user");
const _ = require('lodash');
const bcrypt = require("bcrypt");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const mongoose = require("mongoose");
const express = require("express");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const user = await User.find()
    .select("-password -_id -fname -lname -address._id -__v -registeredOn")
    .populate("position", "-_id -__v")
    .populate("department", "-_id -__v")
    .populate("address.province", "-_id -__v");

  res.send(JSON.stringify(user));
});

router.get("/user", auth, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id })
    .select("-password -_id -fname -lname -address._id -__v -registeredOn")
    .populate("position", "-_id -__v")
    .populate("department", "-_id -__v")
    .populate("address.province", "-_id -__v");
  if (!user) return res.status(400).send("Cannot find the user");

  res.send(JSON.stringify(user));
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.message);

  const isUser = await User.findOne({ $or: [{ email: req.body.email }, { mobile: req.body.mobile }] });
  if (isUser) return res.status(400).send(`${(isUser.email == req.body.email) ? "Email" : "Phone Number"} is already used`);

  // req.body.dob += "Z"; //this needs to be uncommented if the type of dob in userSchema is Date for the best.
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const user = await User.create(req.body);

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(JSON.stringify(_.pick(user, ['_id', 'email', 'mobile', 'fname', 'lname', 'password'])));
});

router.put("/user", auth, async (req, res) => {
  const { error } = validateUserUpdate(_.pick(req.body, ['address', 'email', 'mobile']));
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ _id: req.user._id });
  if (!user) return res.status(401).send("Something Failed");

  if (req.body.password) {
    if (req.body.password !== "" && req.body.password.value === req.body.cPassword.value) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
      user.password = req.body.password;
    } else {
      return res.status(400).send("Passwords doesn't match")
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
  
  await user.save();
  res.send(JSON.stringify(user));
});

module.exports = router;
