const Joi = require("joi");
const jwt = require('jsonwebtoken');
const config = require('config');

const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
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
  user: {
    type: mongoose.Types.ObjectId,
    ref: "users",
  },
  appliedOn: {
    type: Date,
    default: () => Date.now(),
  },
  status: {
    type: Boolean,
    default: false,
  }
});

const Leave = mongoose.model("Leave", leaveSchema);

function validateLeave(leave) {
  const schema = Joi.object({
    fname: Joi.string().required().min(2).max(100),
    lname: Joi.string().required().min(2).max(100),
    nwi: Joi.string().required().min(5).max(200),
    email: Joi.string().required().min(5).max(255).email(),
    mobile: Joi.number().required(),
    userId: Joi.objectId().required(),
  });

  return schema.validate(admin);
}

exports.Leave = Leave;
exports.validateLeave = validateLeave;