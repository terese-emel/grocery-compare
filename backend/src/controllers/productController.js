const mongoose = require("mongoose");
const productService = require("../services/productService");

const getProducts = async (ctx) => {
  const name = ctx.query.name;

  if (!name) {
    ctx.status = 400;
    ctx.body = { message: "Product name is required" };
    return;
  }

  const products = await productService.getProducts(name);
  ctx.status = 200;
  ctx.body = products;
};
  

const getProductById = async (ctx) => {
  const productId = ctx.params.id;

  if (!mongoose.isValidObjectId(productId)) {
    ctx.status = 400;
    ctx.body = { message: "Invalid product ID" };
    return;
  }

  const product = await productService.getProductById(productId);

  if (!product) {
    ctx.status = 404;
    ctx.body = { message: "Product not found" };
    return;
  }

  ctx.status = 200;
  ctx.body = product;
};

const createProduct = async (ctx) => {
  const { name, shop, price } = ctx.request.body;

  if (!name || !shop || price === undefined) {
    ctx.status = 400;
    ctx.body = { message: "Missing required fields" };
    return;
  }

  const newProduct = {
    name,
    shop,
    price,
  };
  const product = await productService.createProduct(newProduct);

  ctx.status = 201;
  ctx.body = { message: "Product created successfully", product };
};

const updateProduct = async (ctx) => {
  const productId = ctx.params.id;
  const { price } = ctx.request.body;

  if (!mongoose.isValidObjectId(productId)) {
    ctx.status = 400;
    ctx.body = { message: "Invalid product ID" };
    return;
  }

  if (price === undefined) {
    ctx.status = 400;
    ctx.body = { message: "Price is required" };
    return;
  }

  const updatedProduct = await productService.updateProduct(productId, {
    price,
  });

  if (!updatedProduct) {
    ctx.status = 404;
    ctx.body = { message: "Product not found" };
    return;
  }

  ctx.status = 200;
  ctx.body = {
    message: "Product updated successfully",
    product: updatedProduct,
  };
};

const deleteProduct = async (ctx) => {
  const productId = ctx.params.id;

  if (!mongoose.isValidObjectId(productId)) {
    ctx.status = 400;
    ctx.body = { message: "Invalid product ID" };
    return;
  }

  const product = await productService.deleteProduct(productId);

  if (!product) {
    ctx.status = 404;
    ctx.body = { message: "Product not found" };
    return;
  }

  ctx.status = 200;
  ctx.body = { message: "Product deleted successfully" };
};

const patchProductPrice = async (ctx) => {
  const productId = ctx.params.id;
  const { price } = ctx.request.body;

  if (!mongoose.isValidObjectId(productId)) {
    ctx.status = 400;
    ctx.body = { message: "Invalid product ID" };
    return;
  }

  if (price === undefined) {
    ctx.status = 400;
    ctx.body = { message: "Price is required" };
    return;
  }

  const product = await productService.patchProductPrice(productId, price);

  if (!product) {
    ctx.status = 404;
    ctx.body = { message: "Product not found" };
    return;
  }

  ctx.status = 200;
  ctx.body = {
    message: "Product price updated successfully",
    product,
  };
};

const cheapestProduct = async (ctx) => {
  const name = ctx.query.name;
  if (!name) {
    ctx.status = 400;
    ctx.body = { message: "Product name is required" };
    return;
  }
  const product = await productService.getCheapestProduct(name);

  if (!product) {
    ctx.status = 404;
    ctx.body = { message: "No products found" };
    return;
  }

  ctx.status = 200;
  ctx.body = product;
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  patchProductPrice,
  cheapestProduct,
};
