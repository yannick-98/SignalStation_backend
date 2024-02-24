const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Signal-Station");
    console.log("Connected");
  } catch (error) {
    console.log(error);
    throw new Error("Connection failed");
  }
};

module.exports = {
  connection,
};
