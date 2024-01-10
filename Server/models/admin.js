const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  title: String,
  fname: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
    trim: true,
  },
  lname: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
    trim: true,
  },
  nwi: {
    //nameWithInitials
    type: String,
    minLength: 5,
    maxLength: 200,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minLength: 5,
    maxLength: 255,
  },
  password: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 1024,
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
    minLength: 8,
    maxLength: 12,
  },
  position: {
    type: mongoose.Types.ObjectId,
    ref: "Position",
  },
  registeredOn: {
    type: Date,
    default: () => Date.now(),
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
});

adminSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      mobile: this.mobile,
      fname: this.fname,
      lname: this.lname,
      nwi: this.nwi,
      isAdmin: this.isAdmin,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const Admin = mongoose.model("Admin", adminSchema);

function validateAdmin(admin) {
  const schema = Joi.object({
    title: Joi.string().required().min(2).max(5),
    fname: Joi.string().required().min(2).max(100),
    lname: Joi.string().required().min(2).max(100),
    nwi: Joi.string().required().min(5).max(200),
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string()
      .required()
      .min(4)
      .max(255)
      .regex(/^[a-zA-Z0-9]{3,30}$/),
    mobile: Joi.number().required(),
    position: Joi.objectId().required(),
  });

  return schema.validate(admin);
}

function validateAdminUpdate(admin) {
  if (admin.password.trim() !== admin.cPassword.trim()) return ("Passwords doesn't match");

  const schema = Joi.object({
    position: Joi.objectId(),
    mobile: Joi.string().min(9).max(14),
    email: Joi.string().min(5).max(255).email(),
    password: Joi.string()
      .min(4)
      .max(255)
      .regex(/^[a-zA-Z0-9]{3,30}$/),
  });

  return schema.validate(admin);
}

module.exports.Admin = Admin;
module.exports.validateAdmin = validateAdmin;
module.exports.validateAdminUpdate = validateAdminUpdate;
