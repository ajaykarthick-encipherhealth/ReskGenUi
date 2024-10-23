import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InputField from "../../src/components/input";

jest.mock("../../src/components/input", () => {
  const originalModule = jest.requireActual("../../src/components/input");
  return {
    __esModule: true,
    ...originalModule,
    debounce: jest.fn((fn) => fn), // Mock debounce to avoid waiting
  };
});

describe("InputField Component", () => {
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

  it("renders without crashing", () => {
    render(<InputField {...defaultProps} />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("renders search icon when isSearch is true", () => {
    render(<InputField {...defaultProps} />);
    expect(screen.getByTestId("searchPrefix")).toBeInTheDocument();
  });
  it("calls debounce function and updates input value", async () => {
    render(<InputField {...defaultProps} />);
    const input = screen.getByPlaceholderText("Search...");
    
    fireEvent.change(input, { target: { value: "test" } });
    
    await waitFor(() => {
      expect(defaultProps.setInputValue).toHaveBeenCalledWith("test");
    });
  });

  it("updates trackInput value when isTracking is true", () => {
    render(<InputField {...defaultProps} isTracking={true} />);
    const input = screen.getByPlaceholderText("Search...");

    fireEvent.change(input, { target: { value: "tracking value" } });

    expect(defaultProps.setTrackInput).toHaveBeenCalledWith("tracking value");
  });
});
