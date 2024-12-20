import React from "react";
import { render } from "@testing-library/react";
import { ThreeDots } from "react-loader-spinner";
import SpinnerDots from "../../src/components/spinner";

jest.mock("react-loader-spinner", () => ({
  ThreeDots: jest.fn(() => <div data-testid="three-dots-spinner"></div>),
}));

describe("SpinnerDots component", () => {
  it("renders without crashing", () => {
    const { container } = render(<SpinnerDots />);
    expect(container).toBeInTheDocument();
  });

  it("renders the spinner with default props", () => {
    const { getByTestId } = render(<SpinnerDots />);
    expect(getByTestId("three-dots-spinner")).toBeInTheDocument();
  });


  it("applies the background color if the background prop is provided", () => {
    const { container } = render(<SpinnerDots background="#ffffff" />);
    const containerDiv = container.querySelector(".container-fluid");
    expect(containerDiv).toHaveStyle("background: #ffffff");
  });

  it("renders the ThreeDots spinner with the correct props", () => {
    render(<SpinnerDots />);
    expect(ThreeDots).toHaveBeenCalledWith(
      expect.objectContaining({
        height: 80,
        width: 80,
        radius: 9,
        color: "#04306f",
        ariaLabel: "loading",
        timeout: 5000,
      }),
      {}
    );
  });

   it("throws an error when required props are missing", () => {
     expect(() =>
       render(<SpinnerDots topHeight={null} background={null} />)
     ).not.toThrow();
   });
});
