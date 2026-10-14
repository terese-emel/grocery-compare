import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AddProductForm from "./AddProductForm";
import { createProduct } from "./productApi";

vi.mock("./productApi", () => ({
  createProduct: vi.fn(),
}));

describe("AddProductForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  async function fillForm() {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Product name"), "Milk");
    await user.type(screen.getByLabelText("Shop Name"), "ICA");
    await user.type(screen.getByLabelText("Price"), "10.9");
    await user.type(screen.getByLabelText("Unit"), "1L");
    return user;
  }

  it("validates required fields", async () => {
    const user = userEvent.setup();
    render(<AddProductForm />);

    await user.click(screen.getByRole("button", { name: "Add Product" }));

    expect(screen.getByText("Please fill in all fields.")).toBeInTheDocument();
    expect(createProduct).not.toHaveBeenCalled();
  });

  it("creates a product and resets the form", async () => {
    const product = {
      _id: "product-1",
      name: "Milk",
      shop: "ICA",
      price: 10.9,
      unit: "1L",
    };
    createProduct.mockResolvedValue({ product });
    const onCreated = vi.fn();
    render(<AddProductForm onCreated={onCreated} />);

    const user = await fillForm();
    await user.click(screen.getByRole("button", { name: "Add Product" }));

    expect(createProduct).toHaveBeenCalledWith({
      name: "Milk",
      shop: "ICA",
      price: 10.9,
      unit: "1L",
    });
    expect(onCreated).toHaveBeenCalledWith(product);
    expect(await screen.findByText("Product added successfully!")).toBeInTheDocument();
    expect(screen.getByLabelText("Product name")).toHaveValue("");
  });

  it("shows an API error", async () => {
    createProduct.mockRejectedValue(new Error("Product creation failed"));
    render(<AddProductForm />);

    const user = await fillForm();
    await user.click(screen.getByRole("button", { name: "Add Product" }));

    expect(await screen.findByText("Product creation failed")).toBeInTheDocument();
  });

  it("resets entered values", async () => {
    render(<AddProductForm />);
    const user = await fillForm();

    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByLabelText("Product name")).toHaveValue("");
    expect(screen.getByLabelText("Shop Name")).toHaveValue("");
    expect(screen.getByLabelText("Price")).toHaveValue(null);
    expect(screen.getByLabelText("Unit")).toHaveValue("");
  });
});
