const router = require("express").Router();
const { Notification, validate } = require("../models/notificationdata");

router.get("/latestdata/notifications", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const notifications = await Notification.find({ ignore: "false" }).sort({
      _id: -1,
    });
    if (notifications) return res.json(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.post("/notifications/ignore", async (req, res) => {
  try {
    const { time } = req.body;

    // Convert the time to a JavaScript Date object
    const formattedTime = new Date(time);

    // Find the notification with the given time
    const notification = await Notification.findOne({
      time: formattedTime,
    });
    if (!notification) {
      return res.status(404).send({ message: "Notification not found" });
    }

    // Update the 'ignore' value to true
    notification.ignore = "true";
    await notification.save();

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
