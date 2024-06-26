const { Admin, validateAdmin, validateAdminUpdate } = require("../models/admin");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const auth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");

const mongoose = require("mongoose");
const express = require("express");

const router = express.Router();

// router.get("/", [auth, isAdmin], async (req, res) => {
//   const admin = await Admin.find()
//     .select("-password -_id -fname -lname -address._id -__v -registeredOn")
//     .populate("position", "-_id -__v");
//   if (!admin)
//     return res.status(400).send("Cannot find any admins with this Email");

//   res.send(JSON.stringify(admin));
// });

router.get("/admin", [auth, isAdmin], async (req, res) => {
  const admin = await Admin.findOne({ _id: req.user._id })
    .select("-password -_id -address._id -__v -registeredOn")
    .populate("position", "-_id -__v");
  if (!admin)
    return res.status(400).send("Cannot find any admins with this Email");

  res.send(JSON.stringify(admin));
});

router.post("/", async (req, res, next) => {
  const { error } = validateAdmin(req.body);
  if (error) return res.status(400).send(error.message);

  const isAdmin = await Admin.findOne({
    $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
  });
  if (isAdmin)
    return res
      .status(400)
      .send(
        `${
          isAdmin.email == req.body.email ? "Email" : "Phone Number"
        } is already used`
      );

  // req.body.dob += "Z"; //this needs to be uncommented if the type of dob in AdminSchema is Date for the best.

  const salt = await bcrypt.genSalt(12);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const admin = await Admin.create(req.body);

  // res.send(admin);
  // res.send(_.pick(admin, ['_id', 'email', 'mobile', 'fname', 'lname', 'password']));

  const token = admin.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(
      JSON.stringify(
        _.pick(admin, ["_id", "email", "mobile", "fname", "lname", "password"])
      )
    );
});

router.put("/", [auth, isAdmin], async (req, res) => {
  const { error } = validateAdminUpdate(_.pick(req.body, ["email", "mobile"]));
  if (error) return res.status(400).send(error.details[0].message);

  const admin = await Admin.findOne({ _id: req.user._id });
  if (!admin) return res.status(401).send("Something Failed");

  const admins = await Admin.find({
    $and: [
      { $or: [{ email: req.body.email }, { mobile: req.body.mobile }] },
      { _id: { $ne: admin._id } },
    ],
  });
  if (admins.length > 0)
    return res
      .status(400)
      .send(
        `${
          admins[0].email == req.body.email ? "Email" : "Phone Number"
        } is already used`
      );

  admin.email = req.body.email;
  admin.mobile = req.body.mobile;

  if (req.body.password) {
    if (
      req.body.oPassword !== "" &&
      req.body.password !== "" &&
      req.body.password.value === req.body.cPassword.value
    ) {
      const validPassword = await bcrypt.compare(
        req.body.oPassword,
        admin.password
      );
      if (!validPassword)
        return res.status(400).send("Incorrect current password");

      const salt = await bcrypt.genSalt(12);
      req.body.password = await bcrypt.hash(req.body.password, salt);
      admin.password = req.body.password;
    } else {
      return res.status(400).send("Passwords doesn't match");
    }
  }

  await admin.save();

  res.send(JSON.stringify(admin));
});

module.exports = router;
