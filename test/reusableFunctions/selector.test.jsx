import { render, screen, fireEvent } from "@testing-library/react";
import Selector from "../../src/components/selector";

describe("test Selector component", () => {
  const defaultProps = {
    selectlabel: "testLabel",
    setSelectedOption: jest.fn(),
    selectOptions: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ],
    selectDefaultValue: null,
    setDefaultValue: null,
    setPageNo: jest.fn(),
    onChanges: jest.fn(),
    defaultSelectValue1: "placeholder",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test("renders select label", () => {
    render(<Selector {...defaultProps} />);
    
    // Use getByLabelText to find the label linked to the select component
    const labelElement = screen.getByLabelText("testLabel");
    expect(labelElement).toBeInTheDocument();
    
    // Check that the select element exists
    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeInTheDocument();
  });
});
