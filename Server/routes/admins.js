const { Admin, validateAdmin } = require("../models/admin");
const _ = require('lodash');
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");
const express = require("express");

const router = express.Router();

router.post("/", async (req, res, next) => {
  const { error } = validateAdmin(req.body);
  if (error) return res.status(400).send(error.message);

  const isAdmin = await Admin.findOne({ $or: [{ email: req.body.email }, { mobile: req.body.mobile }] });
  if (isAdmin) return res.status(400).send(`${(isAdmin.email == req.body.email) ? "Email" : "Phone Number"} is already used`);

  // req.body.dob += "Z"; //this needs to be uncommented if the type of dob in AdminSchema is Date for the best.

  const salt = await bcrypt.genSalt(12);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const admin = await Admin.create(req.body);

  // res.send(admin);
  // res.send(_.pick(admin, ['_id', 'email', 'mobile', 'fname', 'lname', 'password']));

  const token = admin.generateAuthToken();
  res.header('x-auth-token', token).send(JSON.stringify(_.pick(admin, ['_id', 'email', 'mobile', 'fname', 'lname', 'password'])));

});

module.exports = router;
