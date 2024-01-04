const { User, validateUser } = require("../models/user");
const _ = require('lodash');
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");
const express = require("express");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.message);

  const isUser = await User.findOne({ $or: [{ email: req.body.email }, { mobile: req.body.mobile }] });
  if (isUser) return res.status(400).send(`${(isUser.email == req.body.email) ? "Email" : "Phone Number"} is already used`);

  // req.body.dob += "Z"; //this needs to be uncommented if the type of dob in userSchema is Date for the best.

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const user = await User.create(req.body);

  // res.send(user);
  // res.send(_.pick(user, ['_id', 'email', 'mobile', 'fname', 'lname', 'password']));

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(JSON.stringify(_.pick(user, ['_id', 'email', 'mobile', 'fname', 'lname', 'password'])));

});

module.exports = router;
