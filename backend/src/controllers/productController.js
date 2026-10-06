const products = require("../data/products");

const getProducts = (ctx) => {
  const name = ctx.query.name;
  const shop = ctx.query.shop;

  let filteredProducts = products;

  if (name) {
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  if (shop) {
    filteredProducts = filteredProducts.filter((product) =>
      product.shop.toLowerCase().includes(shop.toLowerCase()),
    );
  }

  ctx.status = 200;
  ctx.body = filteredProducts;
};

const getProductById = (ctx) => {
  const productId = Number(ctx.params.id);

  const product = products.find((product) => product.id === productId);

  if (!product) {
    ctx.status = 404;
    ctx.body = { message: "Product not found" };
    return;
  }

  ctx.status = 200;
  ctx.body = product;
};

const createProduct = (ctx) => {
  const { name, shop, price } = ctx.request.body;

  if (!name || !shop || !price) {
    ctx.status = 400;
    ctx.body = { message: "Missing required fields" };
    return;
  }

  const newId =
    products.length > 0
      ? Math.max(...products.map((product) => product.id)) + 1
      : 1;

  const newProduct = {
    id: newId,
    name,
    shop,
    price,
  };
  products.push(newProduct);

  ctx.status = 201;
  ctx.body = { message: "Product created successfully", product: newProduct };
};

const updateProduct = (ctx) => {
  const productId = Number(ctx.params.id);
  const { name, shop, price } = ctx.request.body;

  const productIndex = products.findIndex(
    (product) => product.id === productId,
  );

  if (productIndex === -1) {
    ctx.status = 404;
    ctx.body = { message: "Product not found" };
    return;
  }

  if (!name || !shop || !price) {
    ctx.status = 400;
    ctx.body = { message: "Missing required fields" };
    return;
  }

  products[productIndex] = { id: productId, name, shop, price };

  ctx.status = 200;
  ctx.body = {
    message: "Product updated successfully",
    product: products[productIndex],
  };
};

const deleteProduct = (ctx) => {
  const productId = Number(ctx.params.id);

  const productIndex = products.findIndex(
    (product) => product.id === productId,
  );

  if (productIndex === -1) {
    ctx.status = 404;
    ctx.body = { message: "Product not found" };
    return;
  }

  products.splice(productIndex, 1);

  ctx.status = 200;
  ctx.body = { message: "Product deleted successfully" };
};

const patchProductPrice = (ctx) => {
  const productId = Number(ctx.params.id);
  const { price } = ctx.request.body;

  const productIndex = products.findIndex(
    (product) => product.id === productId,
  );

  if (productIndex === -1) {
    ctx.status = 404;
    ctx.body = { message: "Product not found" };
    return;
  }

  if (!price) {
    ctx.status = 400;
    ctx.body = { message: "Missing required fields" };
    return;
  }

  products[productIndex].price = price;

  ctx.status = 200;
  ctx.body = {
    message: "Product price updated successfully",
    product: products[productIndex],
  };
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  patchProductPrice,
};
