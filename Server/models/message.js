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
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports.Message = Message;
