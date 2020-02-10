const mongoose = require("mongoose");
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
};
//create a new pokedex DB if it does not exit
const dbName = "mongoose-pokedex";
const dbUrl = global.__MONGO_URI__ || "mongodb://localhost:27017/" + dbName;
mongoose.connect(dbUrl, mongoOptions);
const db = mongoose.connection;

// event emitters
// console.error() implementation expects its this value to be set to window.console
// read https://www.tjvantoll.com/2015/12/29/console-error-bind/
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("connected to mongodb");
});
