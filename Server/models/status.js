const Joi = require("joi");

const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 1024,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
  },
  updatedOn: {
    type: Date,
    default: () => Date.now(),
  },
});

const Status = mongoose.model("Status", statusSchema);

function validateStatus(status) {
  const schema = Joi.object({
    date: Joi.date().required(),
    description: Joi.string().min(4).max(1024).required(),
    user: Joi.objectId().required(),
  });

  return schema.validate(status);
}

module.exports.Status = Status;
module.exports.validateStatus = validateStatus;