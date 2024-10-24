import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InputField from "../../src/components/input";

describe("InputField component - Search functionality", () => {
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates inputValue when input value changes", async() => {
    render(<InputField {...defaultProps} />);
    const input = screen.getByPlaceholderText("Search...");

    fireEvent.change(input, { target: { value: "test" } });
    await waitFor(() => expect(defaultProps.setInputValue).toHaveBeenCalledWith("test"));
  });

  it("calls setSearchVal when activeTab is provided and isSearch is true", () => {
    const setSearchVal = jest.fn();
    render(<InputField {...defaultProps} activeTab="activeTab" setSearchVal={setSearchVal} />);
    const input = screen.getByPlaceholderText("Search...");

    fireEvent.change(input, { target: { value: "test" } });

    expect(setSearchVal).toHaveBeenCalledWith("test");
  });

  it("calls setTrackInput when isTracking is true", () => {
    render(<InputField {...defaultProps} isTracking={true} />);
    const input = screen.getByPlaceholderText("Search...");

    fireEvent.change(input, { target: { value: "tracking value" } });

    expect(defaultProps.setTrackInput).toHaveBeenCalledWith("tracking value");
  });
});