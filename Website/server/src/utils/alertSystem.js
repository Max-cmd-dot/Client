const { Group } = require("../models/group.js");
const { Notification } = require("../models/notificationdata.js");
const { Alarms } = require("../models/alarms.js");
const { Data } = require("../models/apidata.js");

// Constants
const AIR_TEMPERATURE_THRESHOLD = 20.0;
const SOIL_MOISTURE_AREA_1_THRESHOLD = 1000;
const count_water_sensors = 3;

async function getAllGroups() {
  try {
    const groups = await Group.find({});

    return groups.map((group) => group.name);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
async function checkLastMessage(group) {
  // Calculate the timestamp 1 hour ago
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  // Query the database for temperature values within the last 1 hour
  const query = {
    time: { $gte: oneHourAgo },
    group: group,
  };

  const result = await Data.find(query).sort({ _id: -1 }).limit(1);
  // Check if there is any temperature data within the last 1 hour
  if (result.length === 0) {
    // Perform your alert action here
    // For example, send an email or trigger a notification
    await createNotificationAndAlarm(
      group,
      "No data received",
      "No data received in the last 1 hour.",
      "active"
    );
  } else {
    await createNotificationAndAlarm(
      group,
      "No data received",
      "Received data in the last 1 hour.",
      "passive"
    );

    return true;
  }
}
async function createNotificationAndAlarm(
  group,
  topic,
  message,
  state,
  threshold
) {
  await createNotification(group, message, state, threshold);

  const query_alarm = {
    topic: topic,
  };
  const update_alarm = {
    $set: {
      time: new Date(),
      state: state,
      message: message,
    },
  };
  await Alarms.findOneAndUpdate(query_alarm, update_alarm, {
    upsert: true,
  });
}
async function createNotification(group, message, threshold) {
  const post = {
    time: new Date(),
    message: message,
    status: "not handeled",
    ignore: "false",
    group: group,
  };

  if (threshold) {
    post.treshhold = threshold;
  }
  await Notification.create(post);
}
async function checkThreshold(value, threshold) {
  return parseFloat(value) < threshold;
}
async function checkData(group, topic, threshold, message) {
  const fifteen_minutes_ago = new Date(Date.now() - 15 * 60 * 1000);

  const query = {
    time: { $gte: fifteen_minutes_ago },
    topic: topic,
    group: group,
  };

  const result = await Data.find(query).sort({ time: -1 }).limit(1);

  if (result.length === 0) {
    await createNotification(
      group,
      `No ${message} data received in the last 15 minutes.`,
      "active"
    );
  } else {
    const latest_data = result[0];
    const value = latest_data["value"];

    if (await checkThreshold(value, threshold)) {
      await createNotification(
        group,
        `${message} too high!`,
        "active",
        threshold
      );
    } else {
      await createNotification(group, `${message} ok.`, "passive");
    }
  }
}

async function checkAll() {
  try {
    const groups = await getAllGroups();

    const checks = groups.map(async (group) => {
      console.log("Checking group: " + group);
      if (await checkLastMessage(group)) {
        const groupChecks = [
          checkData(
            group,
            "esp/air/temperature",
            AIR_TEMPERATURE_THRESHOLD,
            "Temperature"
          ),
        ];
        for (let i = 1; i <= count_water_sensors; i++) {
          groupChecks.push(
            checkData(
              group,
              `esp/ground/moisture/${i}`,
              SOIL_MOISTURE_AREA_1_THRESHOLD,
              `Soil moisture ${i}`
            )
          );
        }
        return Promise.all(groupChecks);
      }
    });

    await Promise.all(checks);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
module.exports.checkAll = checkAll;
