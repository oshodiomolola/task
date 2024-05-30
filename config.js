const mongoose = require("mongoose");
require("dotenv").config();

function connectToAtlas() {
  mongoose.connect(process.env.MONGODB_CONNECTION);
  mongoose.connection.on("connected", () => {
    console.log("Successfully connected to the database");
  });
  mongoose.connection.on("error", (err) => {
    console.log(err);
    console.log("Error occured while connecting to database");
  });
}

module.exports = { connectToAtlas };
