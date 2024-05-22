const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
  try {
    console.log("requested");
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).send({ message: "Invalid Email or Password" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Email or Password" });

    const token = user.generateAuthToken();
    const userid = user._id;
    const group = user.group;
    console.log("group " + group);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.cookie("userId", userid, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.cookie("groupId", group, {
      httpOnly: false,
      secure: false,
      sameSite: "None",
    });
    res.status(200).send({
      data: {
        userId: userid,
        group,
      },
      message: "Logged in successfully",
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = router;
