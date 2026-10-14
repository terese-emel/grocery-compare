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

// Text index for case-insensitive name/shop searches (avoids full collection scans).
productSchema.index({ name: "text", shop: "text" });
// Supports shop-filtered searches sorted by price.
productSchema.index({ shop: 1, price: 1 });

// Supports ownership checks used by update, patch, and delete operations.
productSchema.index({ owner: 1 });

module.exports = mongoose.model("Product", productSchema);
