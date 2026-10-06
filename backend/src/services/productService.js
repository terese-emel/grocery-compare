const Product = require("../models/Product");

const getProducts = async () => {
  return await Product.find();
};

const getProductById = async (productId) => {
  return await Product.findById(productId);
};

const createProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

const updateProduct = async (productId, productData) => {
  return await Product.findByIdAndUpdate(productId, productData, {
    new: true,
    runValidators: true,
  });
};

const deleteProduct = async (productId) => {
  return await Product.findByIdAndDelete(productId);
};

const patchProductPrice = async (productId, price) => {
  const product = await Product.findById(productId);

  if (!product) {
    return null;
  }
  product.price = price;
  return await product.save();
};

const getCheapestProduct = async (name) => {
  const products = await Product.find({
    name: name,
  });

  console.log(products);
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  patchProductPrice,
  getCheapestProduct,
};
