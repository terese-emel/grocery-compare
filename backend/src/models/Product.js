const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  shop: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: false,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
