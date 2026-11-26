const mongoose = require("mongoose");

const localShop = new mongoose.Schema({
  shopName: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  contact: {
    type: String,
    required: true,
    trim: true,
  },
  avail_items: {
    type: [String],
    required: true,
    trim: true,
  },
  mapLink: {
    type: String,
    required: true,
    trim: true,
  },
  partner: {
    type: Boolean,
    required: true,
    trim: true,
  },
  active: {
    type: Boolean,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("LocalShop", localShop);
