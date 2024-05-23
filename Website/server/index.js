require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const connection = require("./db");

// Import routes
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

connection();

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.178.121:3000",
  "https://nexaharvest.com",
];
console.log("Allowed Origins:", allowedOrigins);

// CORS middleware configuration
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Origin:", origin); // Debugging log
      if (!origin) return callback(null, true); // Allow requests with no origin (mobile apps, curl requests)
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        console.log("CORS Error:", msg); // Debugging log
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Enable pre-flight for all routes
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
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

// Simple routes for testing
app.get("/", (req, res) => {
  res.send("Running...");
});

app.get("/api", (req, res) => {
  res.send("Running API...");
});

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

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
