const express = require("express");
const router = express.Router();
const { validate } = require("../models/actions");
const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://127.0.0.1:1883");

client.on("connect", () => {
  console.log("Connected to MQTT broker");
});

client.on("error", (error) => {
  console.error(`Error connecting to MQTT broker: ${error}`);
});

router.get("/", async (req, res) => {
  try {
    const { group, object, value } = req.query;
    const { error } = validate(req.query);
    console.log(req.query);
    console.log("actions");
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    if (!error) {
      console.log("actions success");
      client.publish(`actions/${group}/${object}`, value);
      return res.status(200).send({ message: "actions success" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.log("error");
  }
});

module.exports = router;
