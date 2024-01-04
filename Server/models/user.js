const Joi = require("joi");
const jwt = require('jsonwebtoken');
const config = require('config');

const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  line1: {
    type: String,
    required: true,
  },
  line2: {
    type: String,
    required: true,
  },
  line3: {
    type: String,
    required: true,
  },
  zipcode: {
    type: String,
    require: true,
  },
  province: {
    type: mongoose.Types.ObjectId,
    ref: "province",
  },
});

const userSchema = new mongoose.Schema({
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
  dob: { //dateOfBirth
    type: String, //dob has to be stored as a String, because saving it as a Date will store the time with 00s by default
    required: true,
  },
  position: {
    type: mongoose.Types.ObjectId,
    ref: "position",
  },
  department: {
    type: mongoose.Types.ObjectId,
    ref: "department",
  },
  address: {
    type: addressSchema,
    required: true,
  },
  registeredOn: {
    type: Date,
    default: () => Date.now(),
  },
  // isAdmin: {
  //   type: Boolean,
  //   default: false,
  // }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  return token;
}

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    title: Joi.string().required().min(2).max(5),
    fname: Joi.string().required().min(2).max(100),
    lname: Joi.string().required().min(2).max(100),
    nwi: Joi.string().required().min(5).max(200),
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(4).max(255).regex(/^[a-zA-Z0-9]{3,30}$/),
    mobile: Joi.number().required(),
    dob: Joi.date().required(),
    address: {
      line1: Joi.string().required().min(2).max(255),
      line2: Joi.string().required().min(2).max(255),
      line3: Joi.string().required().min(2).max(255),
      zipcode: Joi.string().required().min(5).max(9),
      province: Joi.objectId().required(),
    },
    position: Joi.objectId().required(),
    department: Joi.objectId().required(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;