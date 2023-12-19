const { Group } = require("../models/group.js");
const { Notification } = require("../models/notificationdata.js");
const { Alarms } = require("../models/alarms.js");
const { Data } = require("../models/apidata.js");

let AIR_TEMPERATURE_MIN_THRESHOLD;
let AIR_TEMPERATURE_MAX_THRESHOLD;
let SOIL_MOISTURE_MIN_THRESHOLD;
let SOIL_MOISTURE_MAX_THRESHOLD;

// Fetch the group settings from the database
Group.findOne({ name: "Group A" })
  .then((group) => {
    if (!group || !group.settings) {
      console.log("Group not found or no settings available");
      return;
    }

    // Assign the settings to the threshold variables
    group.settings.forEach((setting) => {
      if (setting.tempMin) AIR_TEMPERATURE_MIN_THRESHOLD = setting.tempMin;
      if (setting.tempMax) AIR_TEMPERATURE_MAX_THRESHOLD = setting.tempMax;
      if (setting.moistureMin)
        SOIL_MOISTURE_MIN_THRESHOLD = setting.moistureMin;
      if (setting.moistureMax)
        SOIL_MOISTURE_MAX_THRESHOLD = setting.moistureMax;
    });
  })
  .catch((err) => console.error(err));
const count_water_sensors = 3;

/**
 * Retrieves all groups from the database.
 * @returns {Promise<string[]>} An array of group names.
 * @throws {Error} If an error occurs while retrieving the groups.
 */
async function getAllGroups() {
  try {
    const groups = await Group.find({});

    return groups.map((group) => group.name);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
/**
 * Retrieves all groups and their thresholds from the database.
 * @returns {Promise<Object[]>} An array of objects, each containing a group name and its thresholds.
 * @throws {Error} If an error occurs while retrieving the groups and their thresholds.
 */
async function getGroupThresholds() {
  try {
    const groups = await getAllGroups();
    const groupThresholds = [];

    for (let groupName of groups) {
      const group = await Group.findOne({ name: groupName });

      const thresholds = {
        airTemperatureMin:
          group.airTemperatureMin || AIR_TEMPERATURE_MIN_THRESHOLD,
        airTemperatureMax:
          group.airTemperatureMax || AIR_TEMPERATURE_MAX_THRESHOLD,
        soilMoistureMin: group.soilMoistureMin || SOIL_MOISTURE_MIN_THRESHOLD,
        soilMoistureMax: group.soilMoistureMax || SOIL_MOISTURE_MAX_THRESHOLD,
      };

      groupThresholds.push({ groupName, thresholds });
    }

    return groupThresholds;
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
/**
 * Checks the last message for a given group within the last 1 hour.
 * If there is no message within the last 1 hour, performs an alert action.
 * If there is a message within the last 1 hour, creates a notification and alarm.
 * @param {string} group - The group to check for the last message.
 * @returns {boolean} - Returns true if there is a message within the last 1 hour, otherwise false.
 */
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
  minThreshold,
  maxThreshold
) {
  await createNotification(group, message, state, minThreshold, maxThreshold);

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

async function createNotification(
  group,
  message,
  state,
  minThreshold,
  maxThreshold
) {
  const post = {
    time: new Date(),
    message: message,
    status: "not handeled",
    ignore: state,
    group: group,
  };

  if (minThreshold && maxThreshold) {
    post.minThreshold = minThreshold;
    post.maxThreshold = maxThreshold;
  }
  await Notification.create(post);
}

async function checkThreshold(value, minThreshold, maxThreshold) {
  return parseFloat(value) < minThreshold || parseFloat(value) > maxThreshold;
}
async function checkData(group, topic, minThreshold, maxThreshold, message) {
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

    if (await checkThreshold(value, minThreshold, maxThreshold)) {
      await createNotification(
        group,
        `${message} out of range!`,
        "active",
        minThreshold,
        maxThreshold
      );
    } else {
      await createNotification(group, `${message} within range.`, "passive");
    }
  }
}

async function checkAll() {
  try {
    const groupThresholds = await getGroupThresholds();

    const checks = groupThresholds.map(async ({ groupName, thresholds }) => {
      console.log("Checking group: " + groupName);
      if (await checkLastMessage(groupName)) {
        const groupChecks = [
          checkData(
            groupName,
            "esp/air/temperature",
            thresholds.airTemperatureMin,
            thresholds.airTemperatureMax,
            "Temperature"
          ),
        ];
        for (let i = 1; i <= count_water_sensors; i++) {
          groupChecks.push(
            checkData(
              groupName,
              `esp/ground/moisture/${i}`,
              thresholds.soilMoistureMin,
              thresholds.soilMoistureMax,
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
