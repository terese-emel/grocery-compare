const Product = require("../../src/models/Product");
const productService = require("../../src/services/productService");

jest.mock("../../src/models/Product");

describe("productService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns products sorted by price", async () => {
    const products = [
      { name: "Milk", shop: "ICA", price: 10 },
      { name: "Milk", shop: "Coop", price: 12 },
    ];

    const sort = jest.fn().mockResolvedValue(products);

    Product.find.mockReturnValue({
      sort,
    });

    const result = await productService.getProducts("milk");

    expect(Product.find).toHaveBeenCalledWith({
      name: { $regex: "milk", $options: "i" },
    });
    expect(sort).toHaveBeenCalledWith({ price: 1 });
    expect(result).toEqual(products);
  });

  test("returns all products tied for cheapest price", async () => {
    const products = [
      { name: "Milk", shop: "ICA", price: 10 },
      { name: "Milk", shop: "Coop", price: 10 },
      { name: "Milk", shop: "Willys", price: 12 },
    ];

    Product.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(products),
    });

    const result = await productService.getCheapestProduct("milk");

    expect(result).toEqual([
      { name: "Milk", shop: "ICA", price: 10 },
      { name: "Milk", shop: "Coop", price: 10 },
    ]);
  });

  test("returns null when no matching products exist", async () => {
    Product.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([]),
    });

    const result = await productService.getCheapestProduct("coffee");

    expect(result).toBeNull();
  });
});
