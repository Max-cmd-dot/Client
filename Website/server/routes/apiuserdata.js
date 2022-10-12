const router = require("express").Router();
const { User } = require("../models/apiuserdata");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ _id: req.body.id });
    //console.log(user);
    if (!user) return res.status(401).send({ message: "Invalid login" });

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.log("error");
  }
});

const validate = (id) => {
  const schema = Joi.object({
    id: Joi.string().required().label("id"),
  });
  return schema.validate(id);
};

module.exports = router;
