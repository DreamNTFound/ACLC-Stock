const mongoose = require("mongoose");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected. Waiting for reconnection...");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not configured.");
    return;
  }

  while (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });

      return;
    } catch (error) {
      console.error("Unable to connect to MongoDB: ", error.message);
      console.log("Retrying MongoDB connection in 5 seconds...");
      await wait(5000);
    }
  }
};

module.exports = connectDB;

// const mongos = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongos.connect(process.env.MONGO_URI);
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
