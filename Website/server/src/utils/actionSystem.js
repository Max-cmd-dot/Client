// Step 1: Import necessary modules or files
const { Action } = require("../models/actions.js");
const { Data } = require("../models/apidata.js");
// Step 2: Define the function and specify its parameters
async function getAllAutomations() {
  try {
    // Find all actions with an automations field
    const actions = await Action.find({ automations: { $exists: true } });

    // Check if any actions were found
    if (!actions || actions.length === 0) {
      return { status: 404, message: "No actions with automations found" };
    }

    // Extract the automations from each action
    const allAutomations = actions.map((action) => action.automations);

    return { status: 200, automations: allAutomations };
  } catch (error) {
    console.log("error", error);
    return { status: 500, message: "Internal Server Error" };
  }
}
async function getSensorValue(groupId) {
  try {
    const data = await Data.find({
      $or: [
        { topic: "esp/ground/moisture/1" },
        { topic: "esp/air/temperature" },
        { topic: "esp/air/humidity" },
        { topic: "esp/ground/light/lux" },
        { topic: "esp/ground/light/red" },
        { topic: "esp/ground/light/green" },
        { topic: "esp/ground/light/blue" },
        { topic: "esp/ground/light/clear" },
        { topic: "esp/air/pressure" },
        { topic: "esp/ground/moisture/2" },
        { topic: "esp/ground/moisture/3" },
      ],
      group: groupId,
    })
      .sort({ _id: -1 })
      .limit(11);
    if (data) return data.value;
  } catch (error) {
    console.log(error);
  }
}
async function updateActionsBasedOnAutomations() {
  try {
    // Get all automations
    const { automations } = await getAllAutomations();
    // Flatten the automations array
    const flattenedAutomations = automations.flat();
    // Iterate over each automation
    for (let i = 0; i < flattenedAutomations.length; i++) {
      const { object, group, timeAutomations, sensorAutomations } =
        flattenedAutomations[i];

      // Iterate over each time automation
      for (let j = 0; j < timeAutomations.length; j++) {
        const { time } = timeAutomations[j];

        // Check if the current time fits the automation time
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        const [automationHour, automationMinute] = time.split(":");

        if (
          currentHour === parseInt(automationHour) &&
          currentMinute === parseInt(automationMinute)
        ) {
          // Update the action
          const updatedAction = await Action.findOneAndUpdate(
            { object, group },
            { $set: { value: "off" } },
            { new: true }
          );

          if (!updatedAction) {
            console.log(
              `Action not found for object: ${object} and group: ${group}`
            );
          } else {
            console.log(
              `Data updated successfully for object: ${object} and group: ${group}`
            );
          }
        }
      }

      // Handle sensor/value-based automations
      for (let k = 0; k < sensorAutomations.length; k++) {
        const { sensor, condition, value } = sensorAutomations[k];

        // Get the current sensor value
        // This would require a database query or API call depending on how your system is set up
        const currentSensorValue = await getSensorValue(sensor);

        // Check if the current sensor value meets the condition
        if (
          (condition === "above" && currentSensorValue > value) ||
          (condition === "below" && currentSensorValue < value)
        ) {
          // Update the action
          const updatedAction = await Action.findOneAndUpdate(
            { object, group },
            { $set: { value: "off" } },
            { new: true }
          );

          if (!updatedAction) {
            console.log(
              `Action not found for object: ${object} and group: ${group}`
            );
          } else {
            console.log(
              `Data updated successfully for object: ${object} and group: ${group}`
            );
          }
        }
      }
    }
  } catch (error) {
    console.log("error", error);
  }
}
// Step 7: Define a new function that calls updateActionsBasedOnAutomations
async function automationSystem() {
  try {
    // Step 8: Call the updateActionsBasedOnAutomations function
    await updateActionsBasedOnAutomations();
  } catch (error) {
    // Step 10: Handle any errors
    console.log("error", error);
  }
}

module.exports = {
  automationSystem,
};
