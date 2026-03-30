const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  items: Array,
  status: {
    type: String,
    default: "Pending"
  }
});

module.exports = mongoose.model("Order", orderSchema);