const Product = require("../models/Product");

const getProducts = async ({ name, shop, page, limit }) => {
  const filter = {};
  const pageNumber = Number(page) || 1;
  const pageSize = Number(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;

  if (name?.trim()) {
    filter.name = {
      $regex: name.trim(),
      $options: "i",
    };
  }
  if (shop?.trim()) {
    filter.shop = {
      $regex: shop.trim(),
      $options: "i",
    };
  }
  const total = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .sort({ price: 1 })
    .skip(skip)
    .limit(pageSize);

  return {
    items: products,
    page: pageNumber,
    limit: pageSize,
    total,
    pages: Math.ceil(total / pageSize),
  };
};

const getProductById = async (productId) => {
  return Product.findById(productId);
};

const createProduct = async (productData) => {
  return Product.create(productData);
};

const updateProduct = async (productId, productData, ownerId) => {
  return Product.findOneAndUpdate(
    {
      _id: productId,
      owner: ownerId,
    },
    productData,
    {
      new: true,
      runValidators: true,
    },
  );
};

const deleteProduct = async (productId, ownerId) => {
  return Product.findOneAndDelete({
    _id: productId,
    owner: ownerId,
  });
};

const patchProductPrice = async (productId, price, ownerId) => {
  return Product.findOneAndUpdate(
    {
      _id: productId,
      owner: ownerId,
    },
    {
      price,
    },
    {
      new: true,
      runValidators: true,
    },
  );
};

const getCheapestProduct = async (name) => {
  const products = await Product.find({
    name: {
      $regex: name.trim(),
      $options: "i",
    },
  }).sort({ price: 1 });

  if (products.length === 0) {
    return null;
  }

  const cheapestPrice = products[0].price;

  return products.filter((product) => product.price === cheapestPrice);
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
