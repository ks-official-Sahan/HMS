const Joi = require("joi");

const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  stat1: String,
  stat2: String,
  stat3: String,
  stat4: String,
  stat5: String,
  stat6: String,
  stat7: String,
  stat8: String,
  stat9: String,
  stat10: String,
  stat11: String,
  stat12: String,
  date: {
    type: String,
    default: () => Date.now(),
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
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
    user: Joi.objectId().required(),
  });

  return schema.validate(status);
}

module.exports.Status = Status;
module.exports.validateStatus = validateStatus;
