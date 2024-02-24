const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "USER_ROLE",
  },
  plan: {
    type: String,
    default: "FREE_PLAN",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  my_symbols: {
    type: Array,
    default: [],
  },
  my_signals: {
    type: Array,
    default: [],
  },
  my_strategies: {
    type: Array,
    default: [],
  },
});

module.exports = model("User", UserSchema, "users");
