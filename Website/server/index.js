//const fs = require("fs");
//const https = require("https");
require("dotenv").config();
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

app.get("/", (req, res) => {
  res.send("Running...");
});
app.get("/api", (req, res) => {
  res.send("Running API...");
});
module.exports = app;
//const options = {
//  key: fs.readFileSync("key.pem"),
//  cert: fs.readFileSync("cert.pem"),
//};
const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
//https
//.createServer(options, app)
//.listen(port, console.log(`server runs on port ${port}`));
