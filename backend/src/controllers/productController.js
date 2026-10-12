const mongoose = require("mongoose");
const productService = require("../services/productService");
const { sendError } = require("../utils/apiError");
const getProducts = async (ctx) => {
  const products = await productService.getProducts(ctx.state.validated.query);

  ctx.status = 200;
  ctx.body = products;
};

const getProductById = async (ctx) => {
  const productId = ctx.params.id;

  if (!mongoose.isValidObjectId(productId)) {
    sendError(ctx, 400, "INVALID_PRODUCT_ID", "Invalid product ID");
    return;
  }

  const product = await productService.getProductById(productId);

  if (!product) {
    sendError(ctx, 404, "PRODUCT_NOT_FOUND", "Product not found");
    return;
  }

  ctx.status = 200;
  ctx.body = product;
};

const createProduct = async (ctx) => {
  const productData = ctx.state.validated.body;

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
    sendError(ctx, 400, "INVALID_PRODUCT_ID", "Invalid product ID");
    return;
  }


  const updatedProduct = await productService.updateProduct(
    productId,
    { price: ctx.state.validated.body.price },
    ctx.state.user.userId,
  );

  if (!updatedProduct) {
    sendError(
      ctx,
      404,
      "PRODUCT_NOT_FOUND_OR_UNAUTHORIZED",
      "Product not found or you do not have permission to modify it",
    );
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
    sendError(ctx, 400, "INVALID_PRODUCT_ID", "Invalid product ID");
    return;
  }

  const product = await productService.deleteProduct(
    productId,
    ctx.state.user.userId,
  );

  if (!product) {
    sendError(
      ctx,
      404,
      "PRODUCT_NOT_FOUND_OR_UNAUTHORIZED",
      "Product not found or you do not have permission to modify it",
    );
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
    sendError(ctx, 400, "INVALID_PRODUCT_ID", "Invalid product ID");
    return;
  }

  const product = await productService.patchProductPrice(
    productId,
    ctx.state.validated.body.price,
    ctx.state.user.userId,
  );

  if (!product) {
    sendError(
      ctx,
      404,
      "PRODUCT_NOT_FOUND_OR_UNAUTHORIZED",
      "Product not found or you do not have permission to modify it",
    );
    return;
  }

  ctx.status = 200;
  ctx.body = {
    message: "Product price updated successfully",
    product,
  };
};

const cheapestProduct = async (ctx) => {
  const products = await productService.getCheapestProduct(
    ctx.state.validated.query.name,
  );

  if (!products) {
    sendError(ctx, 404, "PRODUCTS_NOT_FOUND", "No products found");
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
