const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  time: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
const validate = (User) => {
  const schema = Joi.object({
    time: { type: String, required: true },
  });
  return schema.validate(User);
};
module.exports = { User, validate };
