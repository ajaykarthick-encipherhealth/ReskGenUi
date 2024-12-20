import React from "react";
import { render } from "@testing-library/react";
import Legends from "../../src/components/legends";

jest.mock("./styles.module.css", () => ({
  container: "container",
  header: "header",
  bulletsData: "bulletsData",
  bgColor: "bgColor",
}));

describe("Legends component", () => {

  it("renders without crashing", () => {
    const { container } = render(<Legends bullets={[]} />);
    expect(container).toBeInTheDocument();
  });

  it("renders the title for each bullet item", () => {
    const bullets = [{ title: "Header 1", option: [] }];
    const { getByText } = render(<Legends bullets={bullets} />);
    expect(getByText("Header 1")).toBeInTheDocument();
  });

  it("renders bullet items with options correctly", () => {
    const bullets = [
      {
        option: [
          { name: "Option 1", color: "#000000" },
          { name: "Option 2", color: "#FFFFFF" },
        ],
      },
    ];
    const { getByText } = render(<Legends bullets={bullets} />);
    expect(getByText("Option 1")).toBeInTheDocument();
    expect(getByText("Option 2")).toBeInTheDocument();
  });

  it("renders a single bullet item without options", () => {
    const bullets = [{ name: "Single Bullet", color: "#FF0000" }];
    const { getByText } = render(<Legends bullets={bullets} />);
    expect(getByText("Single Bullet")).toBeInTheDocument();
  });

  it("applies the provided padding style", () => {
    const bullets = [{ name: "Padded Bullet", color: "#00FF00" }];
    const { container } = render(<Legends bullets={bullets} padding="10px" />);
    const bulletElement = container.querySelector(".bulletsData");
    expect(bulletElement).toHaveStyle("padding: 10px");
  });

  it("applies the provided display style", () => {
    const { container } = render(<Legends bullets={[]} display="flex" />);
    const containerElement = container.querySelector(".container");
    expect(containerElement).toHaveStyle("display: flex");
  });
 

  it("does not apply invalid padding values", () => {
    const bullets = [{ name: "Invalid Padding", color: "#0000FF" }];
    const { container } = render(<Legends bullets={bullets} padding={123} />);
    const bulletElement = container.querySelector(".bulletsData");
    expect(bulletElement).not.toHaveStyle("padding: 123");
  });

  it("does not apply invalid display values", () => {
    const { container } = render(<Legends bullets={[]} display={12345} />);
    const containerElement = container.querySelector(".container");
    expect(containerElement).not.toHaveStyle("display: 12345");
  });

  it("handles empty bullets array gracefully", () => {
    const { container } = render(<Legends bullets={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
