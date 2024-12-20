import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import InputField from "../../src/components/input";

describe("InputField component", () => {
  const defaultProps = {
    isSearch: true,
    placeholder: "Search...",
    setInputValue: jest.fn(),
    type: "text",
    isDisabled: false,
    isInputFiled: false,
    isTracking: false,
    trackInput: "",
    setTrackInput: jest.fn(),
    ReportName: "",
    setSentSearch: jest.fn(),
    setReceivedSearch: jest.fn(),
    setCoderSearch: jest.fn(),
    activeTab: "",
    setSearchVal: jest.fn(),
    searchVal: "",
    isReport: false,
    setPageNo: jest.fn(),
    id: "input-field",
    name: "input-field",
  };

  // Positive cases
  it("renders correctly", () => {
    const { getByPlaceholderText } = render(<InputField {...defaultProps} />);
    expect(getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("calls setInputValue when input value changes", async () => {
    const { getByPlaceholderText } = render(<InputField {...defaultProps} />);
    const input = getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "test" } });
    await waitFor(() =>
      expect(defaultProps.setInputValue).toHaveBeenCalledWith("test")
    );
  });

  it("calls setTrackInput when isTracking is true", async () => {
    const { getByPlaceholderText } = render(
      <InputField {...defaultProps} isTracking={true} />
    );
    const input = getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "tracking value" } });
    await waitFor(() =>
      expect(defaultProps.setTrackInput).toHaveBeenCalledWith("tracking value")
    );
  });

  it("calls setSearchVal when activeTab is provided and isSearch is true", async () => {
    const { getByPlaceholderText } = render(
      <InputField {...defaultProps} activeTab="activeTab" />
    );
    const input = getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "test" } });
    await waitFor(() =>
      expect(defaultProps.setSearchVal).toHaveBeenCalledWith("test")
    );
  });

  it("prevents input of disallowed characters", () => {
    const { getByPlaceholderText } = render(<InputField {...defaultProps} />);
    const input = getByPlaceholderText("Search...");
    fireEvent.keyDown(input, { key: "\\" });
    expect(input.value).toBe("");
  });

  it("renders correctly when isReport is true", () => {
    const { getByPlaceholderText } = render(
      <InputField {...defaultProps} isReport={true} ReportName="Report Name" />
    );
    expect(getByPlaceholderText("Search...")).toHaveValue("Report Name");
  });

  it("does not render ReportName when isReport is false", () => {
    const { queryByPlaceholderText } = render(
      <InputField {...defaultProps} isReport={false} />
    );
    expect(queryByPlaceholderText("Report Name")).not.toBeInTheDocument();
  });
});
