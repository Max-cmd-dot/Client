require("dotenv").config();

// pages imports
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./src/routes/users");
const authRoutes = require("./src/routes/auth");
const dataRoutes = require("./src/routes/apidata");
const password_resetRoutes = require("./src/routes/passwordReset");
const notificationRoutes = require("./src/routes/notificationdata");
const apiuserdataRoutes = require("./src/routes/apiuserdata");
const groupRoutes = require("./src/routes/groupRoutes");
const actionsRoutes = require("./src/routes/actions");
const devicesRoutes = require("./src/routes/devices");
const historyChart = require("./src/routes/historyChart");
const emailchangeRoutes = require("./src/routes/changeEmail");
const hardwareRoutes = require("./src/routes/hardware");
const alarmsRoutes = require("./src/routes/alarmsData");
const { checkAll } = require("./src/utils/alertSystem");
const { automationSystem } = require("./src/utils/actionSystem");

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/password-reset", password_resetRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/apiuserdata", apiuserdataRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/actions", actionsRoutes);
app.use("/api/devices", devicesRoutes);
app.use("/api/historyChart", historyChart);
app.use("/api/changeEmail", emailchangeRoutes);
app.use("/api/hardware", hardwareRoutes);
app.use("/api/alarms", alarmsRoutes);

// for routing through backend, and also for testing
app.get("/", (req, res) => {
  res.send("Running...");
});
app.get("/api", (req, res) => {
  res.send("Running API...");
});
/**
 * This script sets up two timers to periodically call the `automationSystem` and `checkAll` functions.
 *
 * The `automationSystem` function is called every minute. This function checks all automations and updates the actions
 * based on the automation data. It handles both time-based and sensor/value-based automations.
 *
 * The `checkAll` function is called every full hour. The specifics of what this function does are not detailed here.
 *
 * The timers are set up using the `setInterval` function. Each time the functions are called, a message is logged to the console.
 *
 * Note: There is no cleanup logic to clear the timers, as this script is presumably running in a Node.js environment where the timers should continue running indefinitely.
 */
// Set up a timer to call the automationSystem function every minute
setInterval(() => {
  console.log("Calling automationSystem");
  automationSystem();
}, 60 * 1000);

// Set up a timer to call the checkAll() function every full hour
setInterval(() => {
  const date = new Date();
  if (date.getMinutes() === 0) {
    console.log("Calling checkAll");
    checkAll().catch(console.error);
  }
}, 60 * 1000); // Check every minute
//create server for backend on port 8080
const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
