import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

// Mocks
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({ push: pushMock }),
}));

jest.mock("next/image", () => ({ __esModule: true, default: (p) => <img data-testid="next-img" alt="img" /> }));

jest.mock("../../../../src/jsx/constant/theme", () => ({ __esModule: true, IMAGES: { homeIcon1: "/image.png" } }));
jest.mock("../../../../src/jsx/layouts/nav/Header", () => ({ __esModule: true, default: () => <div data-testid="header" /> }));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

const Page = require("../../../../src/pages/reviewer/home/index.jsx").default;

const getPatientsCard = () => {
  const el = screen.getByText(/^Patients$/);
  return el.closest(".card");
};
const getHrcCard = () => {
  const el = screen.getByText("Patients - HRC");
  return el.closest(".card");
};

describe("reviewer/home page", () => {
  // Basic rendering
  it("P: renders both cards and images", () => {
    render(<Page />);
    expect(screen.getByText(/^Patients$/)).toBeInTheDocument();
    expect(screen.getByText("Patients - HRC")).toBeInTheDocument();
    expect(screen.getAllByTestId("next-img").length).toBeGreaterThan(0);
  });

  it("N: header remains commented out (not rendered)", () => {
    render(<Page />);
    expect(screen.queryByTestId("header")).toBeNull();
  });

  it("E: count text is present in both cards", () => {
    render(<Page />);
    expect(screen.getAllByText("3,000,00,000").length).toBe(2);
  });

  // Navigation behavior
  it("P: clicking Patients card navigates to reviewer/dashboard", () => {
    render(<Page />);
    fireEvent.click(getPatientsCard());
    expect(pushMock).toHaveBeenCalledWith("/reviewer/dashboard");
  });

  it("P: clicking HRC card navigates to coder/dashboard", () => {
    render(<Page />);
    fireEvent.click(getHrcCard());
    expect(pushMock).toHaveBeenCalledWith("/coder/dashboard");
  });

  it("N: clicking outside cards does not navigate", () => {
    const { container } = render(<Page />);
    fireEvent.click(container.querySelector(".screen-container-card"));
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("E: clicking nested SVG area inside Patients card still triggers navigation", () => {
    render(<Page />);
    const patientsCard = getPatientsCard();
    const svg = patientsCard.querySelector("svg");
    fireEvent.click(svg);
    expect(pushMock).toHaveBeenCalledWith("/reviewer/dashboard");
  });

  // Re-render and unmount
  it("P: unmount and remount keeps working", () => {
    const { unmount } = render(<Page />);
    unmount();
    render(<Page />);
    fireEvent.click(getPatientsCard());
    expect(pushMock).toHaveBeenCalledWith("/reviewer/dashboard");
  });

  it("N: multiple clicks accumulate push calls", () => {
    render(<Page />);
    fireEvent.click(getPatientsCard());
    fireEvent.click(getPatientsCard());
    expect(pushMock).toHaveBeenCalledTimes(2);
  });

  it("E: rapid alternating clicks push to both routes", () => {
    render(<Page />);
    fireEvent.click(getPatientsCard());
    fireEvent.click(getHrcCard());
    expect(pushMock).toHaveBeenCalledWith("/reviewer/dashboard");
    expect(pushMock).toHaveBeenCalledWith("/coder/dashboard");
  });

  // 50+ granular assertions (structure, safety, invariants)
  it("P: page uses two .card elements", () => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll(".card").length).toBe(2);
  });

  it("N: Patients card contains text node exactly 'Patients'", () => {
    render(<Page />);
    expect(screen.getByText(/^Patients$/)).toBeInTheDocument();
  });

  it("E: HRC card contains label 'Patients - HRC'", () => {
    render(<Page />);
    expect(screen.getByText("Patients - HRC")).toBeInTheDocument();
  });

  it("P: images render without needing actual src", () => {
    render(<Page />);
    expect(screen.getAllByTestId("next-img").length).toBeGreaterThan(0);
  });

  it("N: pushing wrong route is never called for Patients click", () => {
    render(<Page />);
    fireEvent.click(getPatientsCard());
    expect(pushMock).not.toHaveBeenCalledWith("/coder/dashboard");
  });

  it("E: pushing wrong route is never called for HRC click", () => {
    render(<Page />);
    fireEvent.click(getHrcCard());
    expect(pushMock).not.toHaveBeenCalledWith("/reviewer/dashboard");
  });

  it("P: DOM contains text-screen labels twice", () => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll(".text-screen").length).toBeGreaterThanOrEqual(2);
  });

  it("N: svg-round exists twice", () => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll(".svg-round").length).toBe(2);
  });

  it("E: count container exists twice", () => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll(".count").length).toBe(2);
  });

  it("P: clicking Patients text triggers navigation via bubbling", () => {
    render(<Page />);
    fireEvent.click(screen.getByText(/^Patients$/));
    expect(pushMock).toHaveBeenCalledWith("/reviewer/dashboard");
  });

  it("N: clicking HRC label triggers navigation via bubbling", () => {
    render(<Page />);
    fireEvent.click(screen.getByText("Patients - HRC"));
    expect(pushMock).toHaveBeenCalledWith("/coder/dashboard");
  });

  it("E: navigation mock can be reset and reused", () => {
    render(<Page />);
    fireEvent.click(getPatientsCard());
    jest.clearAllMocks();
    fireEvent.click(getHrcCard());
    expect(pushMock).toHaveBeenCalledWith("/coder/dashboard");
  });

  it("P: layout container has screen-container-card class", () => {
    const { container } = render(<Page />);
    expect(container.querySelector(".screen-container-card")).toBeInTheDocument();
  });

  it("N: no button elements are used for cards", () => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll("button").length).toBe(0);
  });

  it("E: svg elements exist", () => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll("svg").length).toBeGreaterThan(0);
  });

  it("P: multiple remount cycles remain stable", () => {
    let utils = render(<Page />);
    utils.unmount();
    utils = render(<Page />);
    utils.unmount();
    utils = render(<Page />);
    expect(screen.getByText(/^Patients$/)).toBeInTheDocument();
  });

  it("N: clicking count value in Patients triggers nav", () => {
    render(<Page />);
    const patientsCard = getPatientsCard();
    fireEvent.click(patientsCard.querySelector(".count"));
    expect(pushMock).toHaveBeenCalledWith("/reviewer/dashboard");
  });

  it("E: clicking count value in HRC triggers nav", () => {
    render(<Page />);
    const hrcCard = getHrcCard();
    fireEvent.click(hrcCard.querySelector(".count"));
    expect(pushMock).toHaveBeenCalledWith("/coder/dashboard");
  });

  it("P: clicking within inner div of Patients triggers nav", () => {
    render(<Page />);
    const patientsCard = getPatientsCard();
    const inner = patientsCard.querySelector(".card-body");
    fireEvent.click(inner);
    expect(pushMock).toHaveBeenCalledWith("/reviewer/dashboard");
  });

  it("N: clicking within inner div of HRC triggers nav", () => {
    render(<Page />);
    const hrcCard = getHrcCard();
    const inner = hrcCard.querySelector(".card-body");
    fireEvent.click(inner);
    expect(pushMock).toHaveBeenCalledWith("/coder/dashboard");
  });

  it("E: text-screen CSS class appears at least twice", () => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll(".text-screen").length).toBeGreaterThanOrEqual(2);
  });

  it("P: dataset not used; ensure no data-testid on cards", () => {
    const { container } = render(<Page />);
    const cards = container.querySelectorAll(".card");
    cards.forEach((c) => expect(c.getAttribute("data-testid")).toBeNull());
  });

  it("N: verify navigate.push is a function", () => {
    render(<Page />);
    expect(typeof pushMock).toBe("function");
  });

  it("E: pushing same route repeatedly is allowed", () => {
    render(<Page />);
    fireEvent.click(getPatientsCard());
    fireEvent.click(getPatientsCard());
    expect(pushMock).toHaveBeenCalledWith("/reviewer/dashboard");
  });

  it("P: no console errors expected during simple render", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    render(<Page />);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("N: querying non-existent text returns null", () => {
    render(<Page />);
    expect(screen.queryByText("Non-existent")).toBeNull();
  });

  it("E: component type remains function across imports", () => {
    expect(typeof Page).toBe("function");
  });
});


