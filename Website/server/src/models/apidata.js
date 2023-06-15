const mongoose = require("mongoose");
const Joi = require("joi");

const dataSchema = new mongoose.Schema({
  time: { type: Date, required: false },
  topic: { type: String, required: false },
  value: { type: String, required: false },
  group: { type: String, required: false },
});

const Data = mongoose.model("data", dataSchema);
const validate = (data) => {
  const schema = Joi.object({
    time: Joi.string(),
    topic: Joi.string(),
    value: Joi.string(),
    group: Joi.string(),
  });
  return schema.validate(data);
};
module.exports = { Data, validate };
