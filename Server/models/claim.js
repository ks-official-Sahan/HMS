const Joi = require("joi");

const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  date: {
    type: Date,
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
    ref: "User",
  },
  appliedOn: {
    type: Date,
    default: () => Date.now(),
  },
  status: {
    type: String,
    default: "Pending",
  },
  updatedBy: {
    type: mongoose.Types.ObjectId,
    ref: "Admin"
  }
});

const Claim = mongoose.model("Claim", claimSchema);

function validateClaim(claim) {
  const schema = Joi.object({
    date: Joi.date().required(),
    description: Joi.string().min(4).max(1024).required(),
    userId: Joi.objectId().required(),
  });

  return schema.validate(claim);
}

module.exports.Claim = Claim;
module.exports.validateClaim = validateClaim;