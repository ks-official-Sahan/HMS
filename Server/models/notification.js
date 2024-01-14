const Joi = require("joi");

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  target: {
    type: {
      type: String,
      required: true,
    },
    id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  message: String,
  datetime: {
    type: Date,
    default: () => Date.now(),
  },
  receiver: {
    type: String,
    default: "User",
  },
  seen: {
    type: Boolean,
    default: false,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

function validateNotification(data) {
  const schema = Joi.object({
    type: Joi.string().required(),
    message: Joi.string().required(),
    userId: Joi.objectId().required(),
  });

  return schema.validate(data);
}

module.exports.Notification = Notification;
module.exports.validateNotification = validateNotification;
