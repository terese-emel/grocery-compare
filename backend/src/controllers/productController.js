const mongoose = require("mongoose");
const productService = require("../services/productService");
const {
  validateProductData,
  validatePrice,
} = require("../validation/productValidation");

const getProducts = async (ctx) => {
  const products = await productService.getProducts(ctx.query.name);

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
  const productData = validateProductData(ctx.request.body);

  if (!productData) {
    ctx.status = 400;
    ctx.body = {
      message: "Invalid product data",
    };
    return;
  }

  const product = await productService.createProduct({
    ...productData,
    owner: ctx.state.user.userId,
  });

  ctx.status = 201;
  ctx.body = {
    message: "Product created successfully",
    product,
  };
};

const updateProduct = async (ctx) => {
  const productId = ctx.params.id;

  if (!mongoose.isValidObjectId(productId)) {
    ctx.status = 400;
    ctx.body = { message: "Invalid product ID" };
    return;
  }

  const numericPrice = validatePrice(ctx.request.body?.price);

  if (numericPrice === null) {
    ctx.status = 400;
    ctx.body = { message: "Valid price is required" };
    return;
  }

  const updatedProduct = await productService.updateProduct(
    productId,
    { price: numericPrice },
    ctx.state.user.userId,
  );

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

  const product = await productService.deleteProduct(
    productId,
    ctx.state.user.userId,
  );

  if (!product) {
    ctx.status = 404;
    ctx.body = { message: "Product not found" };
    return;
  }

  ctx.status = 200;
  ctx.body = {
    message: "Product deleted successfully",
  };
};

const patchProductPrice = async (ctx) => {
  const productId = ctx.params.id;

  if (!mongoose.isValidObjectId(productId)) {
    ctx.status = 400;
    ctx.body = { message: "Invalid product ID" };
    return;
  }

  const numericPrice = validatePrice(ctx.request.body?.price);

  if (numericPrice === null) {
    ctx.status = 400;
    ctx.body = { message: "Valid price is required" };
    return;
  }

  const product = await productService.patchProductPrice(
    productId,
    numericPrice,
    ctx.state.user.userId,
  );

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
  const { name } = ctx.query;

  if (!name || !name.trim()) {
    ctx.status = 400;
    ctx.body = {
      message: "Product name is required",
    };
    return;
  }

  const products = await productService.getCheapestProduct(name);

  if (!products) {
    ctx.status = 404;
    ctx.body = {
      message: "No products found",
    };
    return;
  }

  ctx.status = 200;
  ctx.body = products;
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
