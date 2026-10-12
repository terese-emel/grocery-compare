const mongoose = require("mongoose");
const productService = require("../services/productService");
const {
  cheapestQuerySchema,
  priceSchema,
  productQuerySchema,
  productSchema,
} = require("../validation/schemas");
const { parseSchema } = require("../validation/parse");

const getProducts = async (ctx) => {
  const result = parseSchema(productQuerySchema, ctx.query);

  if (result.error) {
    ctx.status = 400;
    ctx.body = { message: result.error };
    return;
  }

  const products = await productService.getProducts(result.data);

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
  const result = parseSchema(productSchema, ctx.request.body || {});

  if (result.error) {
    ctx.status = 400;
    ctx.body = {
      message: "Invalid product data",
    };
    return;
  }

  const product = await productService.createProduct({
    ...result.data,
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

  const result = parseSchema(priceSchema, ctx.request.body || {});

  if (result.error) {
    ctx.status = 400;
    ctx.body = { message: "Valid price is required" };
    return;
  }

  const updatedProduct = await productService.updateProduct(
    productId,
    result.data,
    ctx.state.user.userId,
  );

  if (!updatedProduct) {
    ctx.status = 404;
    ctx.body = {
      message: "Product not found or you do not have permission to modify it",
    };
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
    ctx.body = {
      message: "Product not found or you do not have permission to modify it",
    };
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

  const result = parseSchema(priceSchema, ctx.request.body || {});

  if (result.error) {
    ctx.status = 400;
    ctx.body = { message: "Valid price is required" };
    return;
  }

  const product = await productService.patchProductPrice(
    productId,
    result.data.price,
    ctx.state.user.userId,
  );

  if (!product) {
    ctx.status = 404;
    ctx.body = {
      message: "Product not found or you do not have permission to modify it",
    };
    return;
  }

  ctx.status = 200;
  ctx.body = {
    message: "Product price updated successfully",
    product,
  };
};

const cheapestProduct = async (ctx) => {
  const result = parseSchema(cheapestQuerySchema, ctx.query);

  if (result.error) {
    ctx.status = 400;
    ctx.body = {
      message: "Product name is required",
    };
    return;
  }

  const products = await productService.getCheapestProduct(result.data.name);

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
