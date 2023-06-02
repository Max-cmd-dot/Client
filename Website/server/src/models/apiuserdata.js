const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  group: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

const validate = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    group: Joi.string().required().label("Group"),
  });
  return schema.validate(user);
};

module.exports = { User, validate };
