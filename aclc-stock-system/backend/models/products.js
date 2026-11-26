const mongoose = require("mongoose");

const products = new mongoose.Schema(
  {
    item_name: {
      type: String,
      required: true,
      trim: true,
    },
    item_description: {
      type: String,
      required: true,
      trim: true,
    },
    item_category: {
      type: String,
      required: true,
      trim: true,
    },
    item_price: {
      type: Number,
      required: true,
      trim: true,
    },
    item_images: {
      type: [String],
      required: true,
      trim: true,
    },
    item_sizes: {
      type: [
        {
          item_sizes: {
            type: String,
            required: true,
            trim: true,
          },
          item_stock: {
            type: Number,
            required: true,
            trim: true,
          },
        },
      ],
      required: true,
      trim: true,
    },
    item_stock: {
      type: Number,
      required: true,
      trim: true,
    },
    item_visible: {
      type: Boolean,
      required: true,
      trim: true,
    },

    // New archive field
    isArchived: {
      type: Boolean,
      default: false,
    },

    archivedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Products", products);
