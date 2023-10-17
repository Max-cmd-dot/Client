const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const { Group } = require("../models/group");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    console.log(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already exists!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = Object.assign({}, req.body, { password: hashPassword });
    await new User(newUser).save();

    // Add the user's name to the group specified in the request body

    console.log(
      "Adding user to group: ",
      req.body.group,
      " with name: ",
      req.body.lastName + req.body.firstName
    );
    const name = req.body.firstName + req.body.lastName;
    console.log(name);
    const filter = { name: req.body.group };
    const update = { $push: { employee: name } };
    const options = { new: true, upsert: true };

    const group = await Group.findOneAndUpdate(filter, update, options);
    const group2 = await Group.findOne({ name: req.body.group });
    console.log("Group:hhhhh ", group2);
    console.log("Group:bb ", group);
    if (!group) {
      console.log("Invalid group name");
      return res.status(400).send({ message: "Invalid group name" });
    }

    // Parse the employee field into an array
    const employeeArray = group.employee ? group.employee.split(",") : [];

    // Add the new employee to the array
    employeeArray.push(req.body.name);

    // Convert the array back into a string and update the employee field
    group.employee = employeeArray.join(",");
    await group.save();

    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.log("Error in creating user: ", error);
  }
});

module.exports = router;
