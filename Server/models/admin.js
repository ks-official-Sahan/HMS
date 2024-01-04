const Joi = require("joi");
const jwt = require('jsonwebtoken');
const config = require('config');

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
  nwi: { //nameWithInitials
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
    ref: "position",
  },
  registeredOn: {
    type: Date,
    default: () => Date.now(),
  },
  isAdmin: {
    type: Boolean,
    default: true,
  }
});

adminSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get("jwtPrivateKey"));
  return token;
}

const Admin = mongoose.model("Admin", adminSchema);

function validateAdmin(admin) {
  const schema = Joi.object({
    title: Joi.string().required().min(2).max(5),
    fname: Joi.string().required().min(2).max(100),
    lname: Joi.string().required().min(2).max(100),
    nwi: Joi.string().required().min(5).max(200),
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(4).max(255).regex(/^[a-zA-Z0-9]{3,30}$/),
    mobile: Joi.number().required(),
    position: Joi.objectId().required(),
  });

  return schema.validate(admin);
}

exports.Admin = Admin;
exports.validateAdmin = validateAdmin;