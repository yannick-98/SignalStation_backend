const { Schema, model } = require("mongoose");

const SignalSchema = Schema({
  symbol: {
    type: String,
    required: true,
  },
  tf: {
    type: String,
    required: true,
  },
  ind: {
    type: String,
    required: true,
  },
  data: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Signal", SignalSchema, "signals");
