import { render, screen } from "@testing-library/react";
import Selector from "../../src/components/selectors";

const defaultProps = {
  selectlabel: "Test Label",
  setSelectedOption: jest.fn(),
  selectOptions: [],
};

test("renders select label", () => {
  render(<Selector {...defaultProps} />);
  const labelElement = screen.getByText("Test Label");
  expect(labelElement).toBeInTheDocument();
  const selectElement = screen.getByRole("combobox");
  expect(selectElement).toBeInTheDocument();
});
