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
app.get("/", (res) => {
  res.send("Running...");
});
app.get("/api", (res) => {
  res.send("Running API...");
});

// Call the testFunctions function
checkAll().catch(console.error);
module.exports = app;

// Call the checkAll() function every full hour
setInterval(() => {
  const date = new Date();
  if (date.getMinutes() === 0 && date.getSeconds() === 0) {
    checkAll().catch(console.error);
  }
}, 1000); // Check every second

//create server for backend on port 8080
const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
