import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ErrorMessage from "./ErrorMessage";

describe("ErrorMessage", () => {
  it("shows a plain error message", () => {
    render(<ErrorMessage message="Something went wrong" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
  });

  it("shows the request reference for an API error", () => {
    render(
      <ErrorMessage
        message={{
          message: "Product not found",
          code: "PRODUCT_NOT_FOUND",
          requestId: "request-123",
        }}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Product not found");
    expect(screen.getByText("Reference: request-123")).toBeInTheDocument();
  });
});
