import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProductList from "./ProductList";

const products = [
  {
    _id: "product-1",
    name: "Milk",
    shop: "ICA",
    price: 10.9,
    unit: "1L",
    owner: "user-1",
  },
  {
    _id: "product-2",
    name: "Milk",
    shop: "Coop",
    price: 12.5,
    unit: "1L",
    owner: "user-2",
  },
];

describe("ProductList ownership controls", () => {
  it("shows actions only for products owned by the logged-in user", () => {
    render(
      <ProductList
        products={products}
        loggedInUser={{ id: "user-1" }}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
      />,
    );

    expect(screen.getAllByRole("button", { name: "Edit" })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "Delete" })).toHaveLength(1);
  });

  it("hides actions when the logged-in user owns no products", () => {
    render(
      <ProductList
        products={products}
        loggedInUser={{ id: "user-3" }}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
  });
});
