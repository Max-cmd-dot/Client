const express = require("express");
const router = express.Router();
const {
  validate,
  Device,
  validate_new_device_request,
} = require("../models/devices");

router.get("/", async (req, res) => {
  try {
    const { group } = req.query;
    const { error } = validate(req.query);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    if (!error) {
      const data = await Device.find({ group: group });
      if (data) {
        return res.status(200).send({ message: data });
      } else {
        return res.status(400).send({ message: "no data found" });
      }
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.log(error);
  }
});
router.get("/create", async (req, res) => {
  try {
    const { deviceId, group, type } = req.query;
    const { error } = validate_new_device_request(req.query);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    const device = new Device({ deviceId, group, type });
    if (!error) {
      await device.save();
      res.status(201).send({ message: "Device created successfully" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
    console.log(error);
  }
});

module.exports = router;
