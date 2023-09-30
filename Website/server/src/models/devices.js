const mongoose = require("mongoose");
const Joi = require("joi");

const devicesSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  group: { type: String, required: true },
  type: { type: String, required: true },
});

const Device = mongoose.model("devices", devicesSchema);

const validate = (device) => {
  const schema = Joi.object({
    group: Joi.string().required().label("group"),
  });
  return schema.validate(device);
};
const validate_new_device_request = (device) => {
  const schema = Joi.object({
    group: Joi.string().required().label("group"),
    deviceId: Joi.string().required().label("deviceId"),
    type: Joi.string().required().label("group"),
  });
  return schema.validate(device);
};

module.exports = { Device, validate, validate_new_device_request };
