const fs = require("fs");
const express = require("express");
const router = express.Router();
const path = require("path");
const { Device } = require("../models/devices");

router.get("/", async (req, res) => {
  const deviceId = req.headers.deviceid;
  try {
    const device = await Device.findOne({ deviceId });

    if (!device) {
      return res
        .status(400)
        .json({ message: "Invalid device ID or device not found" });
    }
    res.json({
      group: device.group,
      host: "eu-central-1.aws.data.mongodb-api.com",
      url: "/app/data-vycfd/endpoint/data/v1",
      apiKey:
        "wvNMOVt8Ad5sd3surfPXFePxxPIJLYe29bSnETeQqwIH7smcbzUM2Lt2t9fbOiDb",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/update", async (req, res) => {
  res.json({
    type: "esp32-fota-http",
    version: "1.0.1",
    url: "http://192.168.178.121:8080/api/hardware/download",
  });
});
router.get("/download", async (req, res) => {
  const utilsDir = path.join(__dirname, "..", "utils");
  const file = `${utilsDir}/firmware.bin`;
  res.download(file); // Set disposition and send it.
});
module.exports = router;
