import { describe, expect, it, vi } from "vitest";
import { apiRequest } from "./apiClient";
import { searchProducts } from "./productApi";

vi.mock("./apiClient", () => ({
  apiRequest: vi.fn(),
}));

describe("productApi", () => {
  it("passes the abort signal to product searches", () => {
    const signal = new AbortController().signal;

    searchProducts({ name: "milk", signal });

    expect(apiRequest).toHaveBeenCalledWith(
      "/products?name=milk&shop=&page=1&limit=10",
      { signal },
    );
  });
});
