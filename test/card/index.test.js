import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import Card from "../../src/components/card";

describe("Card component", () => {
  it("renders children", () => {
    const children = <p>Hello World!</p>;
    const { getByText } = render(<Card>{children}</Card>);
    expect(getByText("Hello World!")).toBeInTheDocument();
  });

  it("applies default styles", () => {
    const { getByTestId } = render(<Card data-testid="card" />);
    const card = getByTestId("card");
    expect(card).toHaveStyle({
      background: "#fff",
      padding: "5px",
      borderRadius: "16px",
    });
  });

  it("applies custom styles", () => {
    const { getByTestId } = render(
      <Card
        data-testid="card"
        Bgcolor="#f00"
        padding="10px"
        borderRadius="20px"
        width="200px"
        height="100px"
        display="flex"
        placeItems="center"
      />
    );
    const card = getByTestId("card");
    expect(card).toHaveStyle({
      background: "#f00",
      padding: "10px",
      borderRadius: "20px",
      width: "200px",
      height: "100px",
      display: "flex",
      placeItems: "center",
    });
  });

  it("renders with custom background image", () => {
    const { getByTestId } = render(
      <Card data-testid="card" bg="url('https://example.com/image.jpg')" />
    );
    const card = getByTestId("card");
    expect(card).toHaveStyle({
      background: 'url("https://example.com/image.jpg")',
    });
  });
  it("renders an empty div when no children are provided", () => {
    const { getByTestId } = render(<Card data-testid="card" />);
    const card = getByTestId("card");
    expect(card).toHaveStyle({
      background: "#fff",
      padding: "5px",
      borderRadius: "16px",
    });
    expect(card).not.toHaveTextContent();
  });
  it("renders an empty div when no children are provided", () => {
    const { container } = render(<Card />);
    expect(container).toContainHTML(
      '<div class="card" style="background: rgb(255, 255, 255); padding: 5px; border-radius: 16px;"></div>'
    );
  });
  it("renders an empty div when no children are provided", () => {
    const { getByTestId } = render(<Card data-testid="card" />);
    const card = getByTestId("card");
    expect(card).not.toHaveTextContent();
  });
 
});
