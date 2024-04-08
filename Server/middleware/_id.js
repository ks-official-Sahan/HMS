const Joi = require("joi");

module.exports = function (req, res, next) {
  // console.log(req.body);
  const { error } = validateId({ _id: req.body._id });
  if (error) return res.status(400).send("Invalid ID");
  next();
};

function validateId(_id) {
  const schema = Joi.object({
    _id: Joi.objectId().required(),
  });

  return schema.validate(_id);
}

module.exports.validateId = validateId;
