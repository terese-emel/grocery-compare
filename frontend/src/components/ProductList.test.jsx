import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("shows the product name on every result card", () => {
    const { container } = render(
      <ProductList
        products={[
          { ...products[0], name: "Milk" },
          { ...products[1], name: "Oat Milk" },
        ]}
        loggedInUser={{ id: "user-3" }}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
      />,
    );

    expect(container.querySelectorAll(".product-name")).toHaveLength(2);
    expect(screen.getByText("Oat Milk")).toBeInTheDocument();
  });

  it("saves an edited price and exits edit mode", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn().mockResolvedValue(undefined);

    render(
      <ProductList
        products={products}
        loggedInUser={{ id: "user-1" }}
        onDelete={vi.fn()}
        onUpdate={onUpdate}
      />,
    );

    await user.click(screen.getAllByRole("button", { name: "Edit" })[0]);
    const priceInput = screen.getByRole("spinbutton");
    await user.clear(priceInput);
    await user.type(priceInput, "11.5");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onUpdate).toHaveBeenCalledWith("product-1", 11.5);
    expect(screen.queryByRole("button", { name: "Save" })).not.toBeInTheDocument();
  });

  it("cancels editing without updating", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();

    render(
      <ProductList
        products={products}
        loggedInUser={{ id: "user-1" }}
        onDelete={vi.fn()}
        onUpdate={onUpdate}
      />,
    );

    await user.click(screen.getAllByRole("button", { name: "Edit" })[0]);
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onUpdate).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  it("deletes an owned product", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <ProductList
        products={products}
        loggedInUser={{ id: "user-1" }}
        onDelete={onDelete}
        onUpdate={vi.fn()}
      />,
    );

    await user.click(screen.getAllByRole("button", { name: "Delete" })[0]);

    expect(onDelete).toHaveBeenCalledWith("product-1");
  });
});
