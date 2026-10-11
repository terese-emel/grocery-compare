const validateProductData = ({ name, shop, price, unit }) => {
  const numericPrice = Number(price);

  if (
    typeof name !== "string" ||
    name.trim() === "" ||
    typeof shop !== "string" ||
    shop.trim() === "" ||
    typeof unit !== "string" ||
    unit.trim() === "" ||
    !Number.isFinite(numericPrice) ||
    numericPrice < 0
  ) {
    return null;
  }

  return {
    name: name.trim(),
    shop: shop.trim(),
    price: numericPrice,
    unit: unit.trim(),
  };
};

const validatePrice = (price) => {
  const numericPrice = Number(price);
  return Number.isFinite(numericPrice) && numericPrice >= 0
    ? numericPrice
    : null;
};

module.exports = { validateProductData, validatePrice };
