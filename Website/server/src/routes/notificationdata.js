const router = require("express").Router();
const {
  Notification,
  validate,
  validate_alarms,
} = require("../models/notificationdata");
router.get("/latestdata/notifications", async (req, res) => {
  try {
    const groupId = req.query.groupId;
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const notifications = await Notification.find({
      ignore: "false",
      group: groupId,
    }).sort({
      _id: -1,
    });
    if (notifications) return res.json(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.get("/alarms", async (req, res) => {
  try {
    const groupId = req.query.groupId;
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const notifications = await Notification.find({
      ignore: "false",
      group: groupId,
    }).sort({
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
    const groupId = req.query.groupId;
    console.log("time");
    console.log(time);
    // Convert the time to a JavaScript Date object
    const formattedTime = new Date(time);
    console.log("formattedTime");
    console.log(formattedTime);
    // Find the notification with the given time
    const notification = await Notification.findOne({
      time: formattedTime,
      group: groupId,
    });
    console.log("notification");
    console.log(notification);
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
