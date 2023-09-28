const mongoose = require("mongoose");
const Joi = require("joi");

const actionsSchema = new mongoose.Schema({
  pump: { type: String, required: true },
});

const Action = mongoose.model("Action", actionsSchema);

const validate = (action) => {
  const schema = Joi.object({
    pump: Joi.string().required().label("Pump"),
    value: Joi.string().required().label("On/Offs"),
  });
  return schema.validate(action);
};

module.exports = { Action, validate };
