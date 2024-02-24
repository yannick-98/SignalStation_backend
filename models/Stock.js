const { Schema, model } = require("mongoose");

const StockSchema = Schema({
  symbol: {
    type: String,
    required: true,
  },
  tf: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
});

module.exports = model("Stock", StockSchema, "stock");
