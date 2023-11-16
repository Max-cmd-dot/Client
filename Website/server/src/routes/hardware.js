const express = require("express");
const router = express.Router();
const { Device } = require("../models/devices");

router.get("/hardware", async (req, res) => {
  const { deviceId } = req.body;

  try {
    const device = await Device.findOne({ deviceId });

    if (!device) {
      return res
        .status(400)
        .json({ message: "Invalid device ID or device not found" });
    }

    res.json({
      host: "eu-central-1.aws.data.mongodb-api.com",
      url: "/app/data-vycfd/endpoint/data/v1",
      apiKey:
        "wvNMOVt8Ad5sd3surfPXFePxxPIJLYe29bSnETeQqwIH7smcbzUM2Lt2t9fbOiDb",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
