const Joi = require("joi");

module.exports = function (req, res, next) {
  console.log(req.body);
  const schema = Joi.object({
    _id: Joi.objectId().required(),
  });

  const { error } = schema.validate({ _id: req.body._id });
  if (error) return res.status(400).send("Invalid ID");
  next();
};
