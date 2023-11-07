const express = require("express");
const router = express.Router();
const { User } = require("../models/user"); // assuming user.js is in the same directory
const Joi = require("joi");

router.post("/:userId", async (req, res) => {
  // validate the request body first
  const newEmail = req.body.newEmail;
  console.log(newEmail);
  const userId = req.params.userId;
  console.log(userId);

  const schema = Joi.object({
    newEmail: Joi.string().email().required(),
  });

  const { error } = schema.validate({ newEmail });
  if (error) return res.status(400).send(error.details[0].message);

  //find user by id
  let user = await User.findById(userId);
  if (!user) return res.status(404).send("User not found.");

  // update email
  user.email = newEmail;
  user = await user.save();

  res.send({ message: "Email changed successfully" });
});

module.exports = router;
//must be an internel server error please relogin and try agian. if the eror presis, please kontact the support
