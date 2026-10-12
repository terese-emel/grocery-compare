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

    const limit = jest.fn().mockResolvedValue(products);
    const skip = jest.fn().mockReturnValue({ limit });
    const sort = jest.fn().mockReturnValue({ skip });

    Product.find.mockReturnValue({
      sort,
    });
    Product.countDocuments.mockResolvedValue(2);

    const result = await productService.getProducts({ name: "milk" });

    expect(Product.find).toHaveBeenCalledWith({
      name: { $regex: "milk", $options: "i" },
    });
    expect(sort).toHaveBeenCalledWith({ price: 1 });
    expect(result).toEqual({
      items: products,
      page: 1,
      limit: 10,
      total: 2,
      pages: 1,
    });
  });

  test("filters products by name and shop", async () => {
    const limit = jest.fn().mockResolvedValue([]);
    const skip = jest.fn().mockReturnValue({ limit });
    const sort = jest.fn().mockReturnValue({ skip });

    Product.find.mockReturnValue({ sort });
    Product.countDocuments.mockResolvedValue(0);

    await productService.getProducts({ name: "milk", shop: "ICA" });

    expect(Product.find).toHaveBeenCalledWith({
      name: { $regex: "milk", $options: "i" },
      shop: { $regex: "ICA", $options: "i" },
    });
    expect(sort).toHaveBeenCalledWith({ price: 1 });
  });

  test("paginates products when page and limit are provided", async () => {
    const products = [{ name: "Milk", shop: "ICA", price: 10 }];
    const limit = jest.fn().mockResolvedValue(products);
    const skip = jest.fn().mockReturnValue({ limit });
    const sort = jest.fn().mockReturnValue({ skip });

    Product.find.mockReturnValue({ sort });
    Product.countDocuments.mockResolvedValue(21);

    const result = await productService.getProducts({
      name: "milk",
      page: "2",
      limit: "10",
    });

    expect(skip).toHaveBeenCalledWith(10);
    expect(limit).toHaveBeenCalledWith(10);
    expect(Product.countDocuments).toHaveBeenCalledWith({
      name: { $regex: "milk", $options: "i" },
    });
    expect(result).toEqual({
      items: products,
      page: 2,
      limit: 10,
      total: 21,
      pages: 3,
    });
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
