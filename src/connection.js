const { MongoClient } = require("mongodb");
const dot_env = require("dotenv");

dot_env.config();

const mongodb_url = process.env.MONGODB_CONNECTION_STRING;

const connection = new MongoClient(mongodb_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .connect()
  .then(() => {
    console.log("database connected successfully!!!! :)");
  })
  .catch((error) => {
    console.log("connection_error: ", error);
  });

module.exports = connection;
