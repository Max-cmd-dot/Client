const mongoose = require("mongoose");
const Joi = require("joi");

const actionsSchema = new mongoose.Schema({
  object: { type: String, required: true },
  group: { type: String, required: true },
  value: { type: String, required: false },
  automations: [
    {
      timeAutomations: [
        {
          action: { type: String, required: true },
          time: { type: String, required: true },
          frequency: { type: String, required: true },
        },
      ],
      sensorAutomations: [
        {
          action: { type: String, required: true },
          sensor: { type: String, required: true },
          condition: { type: String, required: true },
          value: { type: String, required: true },
        },
      ],
    },
  ],
});

const Action = mongoose.model("actions", actionsSchema);

const validate = (action) => {
  const schema = Joi.object({
    object: Joi.string().required().label("Object"),
    group: Joi.string().required(),
    value: Joi.string(),
    automations: Joi.array()
      .items(
        Joi.object({
          timeAutomations: Joi.array()
            .items(
              Joi.object({
                _id: Joi.string().optional(),
                action: Joi.string().optional(),
                time: Joi.string().optional(),
                frequency: Joi.string().optional(),
              }).optional()
            )
            .optional(),
          sensorAutomations: Joi.array()
            .items(
              Joi.object({
                _id: Joi.string().optional(),
                action: Joi.string().optional(),
                sensor: Joi.string().optional(),
                condition: Joi.string().optional(),
                value: Joi.string().optional(),
              }).optional()
            )
            .optional(),
        })
      )
      .optional(),
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
