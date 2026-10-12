const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shop: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Supports filtered product searches that are sorted by price.
productSchema.index({ name: 1, shop: 1, price: 1 });
productSchema.index({ shop: 1, price: 1 });

// Supports ownership checks used by update, patch, and delete operations.
productSchema.index({ owner: 1 });

module.exports = mongoose.model("Product", productSchema);
