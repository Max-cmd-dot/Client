const router = require("express").Router();
const { Notification, validate } = require("../models/notificationdata");
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

router.post("/notifications/ignore", async (req, res) => {
  try {
    const { time, times } = req.body;
    const groupId = req.query.groupId;

    if (times) {
      // If times is defined, ignore all notifications with those times
      const formattedTimes = times.map((t) => new Date(t));
      await Notification.updateMany(
        { time: { $in: formattedTimes }, group: groupId },
        { ignore: "true" }
      );
    } else if (time) {
      // If time is defined, handle it as a single notification
      const formattedTime = new Date(time);
      const notification = await Notification.findOne({
        time: formattedTime,
        group: groupId,
      });
      if (!notification) {
        return res.status(404).send({ message: "Notification not found" });
      }
      notification.ignore = "true";
      await notification.save();
    } else {
      // If neither time nor times is defined, return an error
      return res.status(400).send({ message: "No time or times provided" });
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.get("/latestdata/github", async (req, res) => {
  fetch(
    "https://api.github.com/repos/Max-cmd-dot/BLL/commits?sha=main&per_page=10"
  )
    .then((response) => response.json())
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("An error occurred while fetching data from GitHub");
    });
});
module.exports = router;
