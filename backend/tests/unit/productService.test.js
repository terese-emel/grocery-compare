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
    expect(sort).toHaveBeenCalledWith({ price: 1, _id: 1 });
    expect(result).toEqual({
      items: products,
      page: 1,
      limit: 10,
      total: 2,
      pages: 1,
    });
  });

  test("normalizes unsafe pagination values and caps the page size", async () => {
    const limit = jest.fn().mockResolvedValue([]);
    const skip = jest.fn().mockReturnValue({ limit });
    const sort = jest.fn().mockReturnValue({ skip });

    Product.find.mockReturnValue({ sort });
    Product.countDocuments.mockResolvedValue(0);

    const result = await productService.getProducts({ page: "-2", limit: "500" });

    expect(skip).toHaveBeenCalledWith(0);
    expect(limit).toHaveBeenCalledWith(100);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(100);
  });

  test("escapes regex characters in filters", async () => {
    const limit = jest.fn().mockResolvedValue([]);
    const skip = jest.fn().mockReturnValue({ limit });
    const sort = jest.fn().mockReturnValue({ skip });

    Product.find.mockReturnValue({ sort });
    Product.countDocuments.mockResolvedValue(0);

    await productService.getProducts({ name: "milk+", shop: "Coop." });

    expect(Product.find).toHaveBeenCalledWith({
      name: { $regex: "milk\\+", $options: "i" },
      shop: { $regex: "Coop\\.", $options: "i" },
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
    expect(sort).toHaveBeenCalledWith({ price: 1, _id: 1 });
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
    const cheapestProducts = [
      { name: "Milk", shop: "ICA", price: 10 },
      { name: "Milk", shop: "Coop", price: 10 },
    ];

    // First call: find cheapest single product
    const leanFirst = jest.fn().mockResolvedValue([{ name: "Milk", shop: "ICA", price: 10 }]);
    const limitFirst = jest.fn().mockReturnValue({ lean: leanFirst });
    const sortFirst = jest.fn().mockReturnValue({ limit: limitFirst });
    // Second call: find all at cheapest price
    const leanSecond = jest.fn().mockResolvedValue(cheapestProducts);

    Product.find
      .mockReturnValueOnce({ sort: sortFirst })
      .mockReturnValueOnce({ lean: leanSecond });

    const result = await productService.getCheapestProduct("milk");

    expect(result).toEqual(cheapestProducts);
  });

  test("returns null when no matching products exist", async () => {
    const lean = jest.fn().mockResolvedValue([]);
    const limit = jest.fn().mockReturnValue({ lean });
    const sort = jest.fn().mockReturnValue({ limit });

    Product.find.mockReturnValue({ sort });

    const result = await productService.getCheapestProduct("coffee");

    expect(result).toBeNull();
  });
});
