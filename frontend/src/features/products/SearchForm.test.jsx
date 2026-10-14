import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SearchForm from "./SearchForm";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

describe("SearchForm", () => {
  it("calls setProductName when the input changes", () => {
    const setProductName = vi.fn();

    render(
      <SearchForm
        productName=""
        setProductName={setProductName}
        handleSubmit={vi.fn()}
        loading={false}
        clearSearch={vi.fn()}
      />,
    );

    const input = screen.getByLabelText("Product name");

    fireEvent.change(input, {
      target: {
        value: "milk",
      },
    });

    expect(setProductName).toHaveBeenCalledTimes(1);
    expect(setProductName).toHaveBeenCalledWith("milk");
  });
  it("shows Searching while loading", () => {
    render(
      <SearchForm
        productName=""
        setProductName={vi.fn()}
        handleSubmit={vi.fn()}
        loading={true}
        clearSearch={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Searching..." })).toBeDisabled();

    expect(screen.getByRole("button", { name: "Clear" })).toBeDisabled();
  });

  it("calls clearSearch when Clear is clicked", () => {
    const clearSearch = vi.fn();

    render(
      <SearchForm
        productName="milk"
        setProductName={vi.fn()}
        handleSubmit={vi.fn()}
        loading={false}
        clearSearch={clearSearch}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Clear" }));

    expect(clearSearch).toHaveBeenCalledTimes(1);
  });
});
