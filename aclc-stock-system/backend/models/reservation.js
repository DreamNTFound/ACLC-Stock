const mongoose = require("mongoose");

const reservation = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  size: {
    type: String,
    required: false,
  },
  quantity: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Ready for Pickup", "Claimed", "Cancelled"],
    default: "Pending",
  },
  statusChangedAt: {
    type: Date,
    default: null,
  },
  //Archived metadata.
  isArchived: {
    type: Boolean,
    default: false,
  },
  archivedAt: {
    type: Date,
    default: null,
  },
  paymentMethod: {
    type: String,
    enum: ["GCash", "Cash"],
    default: "GCash",
  },
  paymentStatus: {
    type: String,
    enum: ["Unpaid", "For Verification", "Paid"],
    default: "Unpaid",
  },
  gcashRef: {
    type: String,
  },
  note: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Reservation", reservation);
