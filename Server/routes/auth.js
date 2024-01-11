const { User } = require("../models/user");
const { Admin } = require("../models/admin");
const _ = require("lodash");
const Joi = require("joi");
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");
const express = require("express");

const router = express.Router();

router.post("/user", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send("Cannot find any users with this Email");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Incorrect password");

    if (!user.status) return res.status(401).send("Your account has been disabled");

    // res.send(user);
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(token);
});

router.post("/admin", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const admin = await Admin.findOne({ email: req.body.email });
  if (!admin)
    return res.status(400).send("Cannot find any admins with this Email");

  const validPassword = await bcrypt.compare(req.body.password, admin.password);
  if (!validPassword) return res.status(400).send("Incorrect password");

  // res.send(admin);
  const token = admin.generateAuthToken();
  // res.header('x-auth-token', token).send(JSON.stringify(_.pick(admin, ['_id', 'email', 'mobile', 'fname', 'lname', 'password'])));
  res.header('x-auth-token', token).send(JSON.stringify(token));
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(4).max(255),
  });
  return schema.validate(user);
}

module.exports = router;
