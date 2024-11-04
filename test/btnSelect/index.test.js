import { fireEvent, render } from "@testing-library/react";
import SelectButton from "../../src/components/btnSelect/index";
import Style from "../../src/components/btnSelect/style.module.css";

describe("btnSelect", () => {
  const list = ["M", "E", "A", "T"];
  const props = {
    select: null,
    setSelect: jest.fn(),
    completed: [],
  };
  it("should render the correct  number of buttons", () => {
    const { queryAllByText } = render(<SelectButton {...props} />);
    const buttons = queryAllByText(/^[MEAT]$/);
    expect(buttons).toHaveLength(list.length);
  });
  it("should call the setSelect state when the button is clicked", () => {
    const { queryAllByText } = render(<SelectButton {...props} />);
    const buttons = queryAllByText(/^[MEAT]$/);
    fireEvent.click(buttons[0]);
    expect(props.setSelect).toHaveBeenCalledWith(list[0]);
  });
  it("highLight the selected button with the active class", () => {
    const inbuiltProps = {
      select: ["M"],
      setSelect: jest.fn(),
      completed: [],
    };
    const { queryAllByText } = render(<SelectButton {...inbuiltProps} />);
    const buttons = queryAllByText(/^[MEAT]$/);
    expect(buttons[0]).toHaveClass(Style.btnColor);
  });
  it("highLight the completed state button with the active class of green", () => {
    const inbuiltProps = {
      select: ["M"],
      setSelect: jest.fn(),
      completed: ["M", "E", "A"],
    };
    const { queryAllByText } = render(<SelectButton {...inbuiltProps} />);
    const buttons = queryAllByText(/^[MEAT]$/);
    expect(buttons[0]).toHaveClass(Style.successActive);
  });
});
