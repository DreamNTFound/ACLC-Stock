const mongoose = require("mongoose");

const restockSchedule = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  restockDate: {
    type: Date,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Scheduled", "Delayed", "Completed", "Cancelled"],
    default: "Scheduled",
  },
  note: {
    type: String,
    trim: true,
  }
});

module.exports = mongoose.model("RestockSchedule", restockSchedule);