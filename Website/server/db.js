const mongoose = require("mongoose"); // Import mongoose for the database
require("dotenv").config(); // To read .env file
module.exports = async () => {
  // Connection parameters
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  const connectWithRetry = async () => {
    try {
      // Connect to database
      console.log("Connecting to database...");
      console.log("Connection String: " + process.env.DB);
      mongoose.set("strictQuery", false);
      await mongoose.connect(process.env.DB, connectionParams);
      console.log("Connected to database successfully");

      // Test database operation
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();
      console.log("Collections in database:", collections);
      console.log("Database connected!");
    } catch (error) {
      console.log(error);
      console.log("Could not connect to database, retrying in 5 seconds...");
      setTimeout(connectWithRetry, 5000);
    }
  };

  await connectWithRetry();
};
