const express = require("express");
const router = express.Router();
const {
  validate,
  validate_current_state,
  Action,
} = require("../models/actions");

router.get("/", async (req, res) => {
  try {
    const { group, object, value } = req.query;
    const { error } = validate(req.query);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    if (!error) {
      const data = await Action.findOne({ group: group, object: object });
      if (data) {
        data.value = value; // set the value property to "off"
        await data.save(); // save the updated data object to the database
        return res.status(200).send({ message: "actions success" });
      } else {
        return res.status(400).send({ message: "no data found" });
      }
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.log("error");
  }
});
router.get("/current_state", async (req, res) => {
  try {
    const { group } = req.query;
    const { error } = validate_current_state(req.query);
    if (error) {
      console.log("error validating");
      return res.status(400).send({ message: error.details[0].message });
    }
    if (!error) {
      const data = await Action.find({ group: group });
      if (data.length > 0) {
        return res.status(200).send({ message: data });
      }
      if (data.length === 0) console.log("no data found");
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.log("internal server error" + error);
  }
});
router.post("/update", async (req, res) => {
  try {
    const { object, group, automations } = req.body;

    // Validate the data here...
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const updatedAction = await Action.findOneAndUpdate(
      { object, group },
      { $set: { automations } },
      { new: true }
    );

    if (!updatedAction)
      return res.status(404).send({ message: "Action not found" });

    res.status(200).send({ message: "Data updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.log("error", error);
  }
});
router.get("/get_automations", async (req, res) => {
  try {
    const { groupId, deviceName } = req.query;

    const action = await Action.findOne({ group: groupId, object: deviceName });

    if (!action) return res.status(404).send({ message: "Action not found" });

    res.status(200).send(action);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.log("error", error);
  }
});
module.exports = router;
