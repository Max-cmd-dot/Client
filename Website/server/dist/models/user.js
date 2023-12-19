const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  group: { type: String, required: true } // Assuming the user's associated group is stored in the 'group' field
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, group: this.group }, process.env.JWTPRIVATEKEY, {
    expiresIn: "7d"
  });
  return token;
};

const User = mongoose.model("user", userSchema);

const validate = data => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    group: Joi.string().required().label("Group") // Adding group validation
  });
  return schema.validate(data);
};

module.exports = { User, validate };
//# sourceMappingURL=user.js.map