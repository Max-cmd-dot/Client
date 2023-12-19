const mongoose = require("mongoose");
const Joi = require("joi");

const notificationSchema = new mongoose.Schema({
  time: { type: Date, required: false },
  topic: { type: String, required: false },
  value: { type: String, required: false },
  ignore: { type: String, required: false },
  group: { type: String, required: false }
});

const Notification = mongoose.model("Notification", notificationSchema);

const validate = notification => {
  const schema = Joi.object({
    time: Joi.string(),
    topic: Joi.string(),
    value: Joi.string(),
    ignore: Joi.string(),
    groupe: Joi.string()
  });

  return schema.validate(notification);
};

module.exports = { Notification, validate };
//# sourceMappingURL=notificationdata.js.map