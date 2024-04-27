const fs = require("fs");
const express = require("express");
const router = express.Router();
const path = require("path");
const { Device } = require("../models/devices");

//häufigstes problem deviceId wird nicht gefunden
//device Ids müssen beim onboarding in die Datenbank geschrieben werden
router.get("/", async (req, res) => {
  const deviceId = req.headers.deviceid;
  try {
    const device = await Device.findOne({ deviceId });
    console.log("Device ID: ", deviceId);
    if (!device) {
      console.error("Device not found");
      return res
        .status(400)
        .json({ message: "Invalid device ID or device not found" });
    }
    console.log("Device found");
    res.json({
      group: device.group,
      host: "eu-central-1.aws.data.mongodb-api.com",
      url: "/app/data-vycfd/endpoint/data/v1",
      apiKey:
        "wvNMOVt8Ad5sd3surfPXFePxxPIJLYe29bSnETeQqwIH7smcbzUM2Lt2t9fbOiDb",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
router.get("/update", async (req, res) => {
  console.log(`Update firmware.bin from ${__dirname}`);
  res.json({
    type: "esp32-fota-http",
    version: "1.0.4",
    url: "http://192.168.178.121:8080/api/hardware/download",
  });
});
router.get("/download", async (req, res) => {
  console.log(`Download firmware.bin from ${__dirname}`);
  const utilsDir = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "Scripts",
    "Hardware",
    "OTA_Esp32",
    ".pio",
    "build",
    "az-delivery-devkit-v4"
  );
  const alternative_dir = path.join(__dirname, "..", "utils");
  const file = `${utilsDir}/firmware.bin`;
  res.download(file); // Set disposition and send it.
});
module.exports = router;
