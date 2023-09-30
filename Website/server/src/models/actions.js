const mongoose = require("mongoose");
const Joi = require("joi");

const actionsSchema = new mongoose.Schema({
  object: { type: String, required: true },
  group: { type: String, required: true },
  value: { type: String, required: true },
});

const Action = mongoose.model("actions", actionsSchema);

const validate = (action) => {
  const schema = Joi.object({
    object: Joi.string().required().label("Object"),
    group: Joi.string().required().label("On/Offs"),
    value: Joi.string().required().label("On/Offs"),
  });
  return schema.validate(action);
};
const validate_current_state = (action) => {
  const schema = Joi.object({
    group: Joi.string().required().label("On/Offs"),
  });
  return schema.validate(action);
};

module.exports = { Action, validate, validate_current_state };
