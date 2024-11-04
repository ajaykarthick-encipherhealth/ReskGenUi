import { fireEvent, render } from "@testing-library/react";
import RegularButton from "../../src/components/button";
import Style from "../../src/components/button/style.module.css";

describe("button", () => {
  it("should render the correct  number text", () => {
    const { getByText } = render(<RegularButton name="Submit" />);
    expect(getByText("Submit")).toBeInTheDocument();
  });
  it("should render the correct type is submit", () => {
    const { getByRole } = render(<RegularButton type="submit" />);
    expect(getByRole("button")).toHaveAttribute("type", "submit");
    expect(getByRole("button")).toHaveClass(Style.btnColor);
  });
  it("should render the correct class", () => {
    const { getByRole } = render(<RegularButton type="submit" />);
    expect(getByRole("button")).toHaveClass("btn mx-1");
  });
  it("should render the given width", () => {
    const { getByRole } = render(<RegularButton width="100px" />);
    expect(getByRole("button")).toHaveStyle("width: 100px");
  });
  it("should render the given passing loader", () => {
    const { getByText } = render(<RegularButton loading={true} />);
    expect(getByText("LOADING...")).toBeInTheDocument();
  });
  it("should render the given  disabled", () => {
    const { getByRole } = render(<RegularButton disabled={true} />);
    expect(getByRole("button")).toBeDisabled();
  });
  it("should trigger onClick when clicked", () => {
    const handleClick = jest.fn();
    const { getByRole } = render(<RegularButton onClick={handleClick} />);
    fireEvent.click(getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
