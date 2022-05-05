const mongoose = require("mongoose");
const dot_env = require("dotenv");

dot_env.config();

const connection = mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connected successfully!!!! :)");
  })
  .catch((error) => {
    console.log("connection_error: ", error);
  });

module.exports = connection;
