const Joi = require("joi");

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: () => Date.now(),
    required: true,
  },
  message: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 1024,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  admin: {
    type: mongoose.Types.ObjectId,
    ref: "Admin",
  },
  deletedBy: {
    type: mongoose.Types.ObjectId,
    ref: "Admin",
  },
  deletedMsg: {
    type: String,
    minLength: 1,
    maxLength: 1024,
  }
});

const Message = mongoose.model("Message", messageSchema);

module.exports.Message = Message;
