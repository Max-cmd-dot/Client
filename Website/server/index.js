require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const dataRoutes = require("./routes/apidata");
const password_resetRoutes = require("./routes/passwordReset");
const notificationRoutes = require("./routes/notificationdata");
const apiuserdataRoutes = require("./routes/apiuserdata");

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

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
