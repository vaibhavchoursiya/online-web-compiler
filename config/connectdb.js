const mongoose = require("mongoose");

const connectDB = async (DATABASE_URL) => {
  try {
    const DB_OPTIONS = {
      dbName: "onlinewebcompiler",
    };

    await mongoose.connect(DATABASE_URL, DB_OPTIONS);
    console.log("DB is connected");
  } catch (e) {
    console.log(e);
  }
};

module.exports = connectDB;
