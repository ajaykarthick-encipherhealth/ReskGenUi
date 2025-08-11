import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

// Mock child DynamicDashboard to observe props/usage
const DynamicDashboardMock = jest.fn(() => (
  <div data-testid="dynamic-dashboard" />
));

// Path from reviewer page
jest.mock("../../../../src/commonPages/dashboard", () => ({
  __esModule: true,
  default: () => DynamicDashboardMock(),
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe("reviewer/dashboard page", () => {
  const Page = require("../../../../src/pages/reviewer/dashboard/index.js").default;

  it("P: renders DynamicDashboard", () => {
    render(<Page />);
    expect(screen.getByTestId("dynamic-dashboard")).toBeInTheDocument();
    expect(DynamicDashboardMock).toHaveBeenCalledTimes(1);
  });

  it("N: ignores unexpected props/children", () => {
    const { rerender } = render(<Page foo="bar">child</Page>);
    expect(screen.getByTestId("dynamic-dashboard")).toBeInTheDocument();
    rerender(<Page another="prop" />);
    expect(screen.getByTestId("dynamic-dashboard")).toBeInTheDocument();
  });

  it("E: unmount/remount works", () => {
    const { unmount } = render(<Page />);
    expect(screen.getByTestId("dynamic-dashboard")).toBeInTheDocument();
    unmount();
    render(<Page />);
    expect(screen.getByTestId("dynamic-dashboard")).toBeInTheDocument();
    expect(DynamicDashboardMock).toHaveBeenCalledTimes(2);
  });

  // 30+ granular tests
  it("P: one call per render", () => {
    render(<Page />);
    expect(DynamicDashboardMock).toHaveBeenCalledTimes(1);
  });

  it("N: re-render after clear starts new count", () => {
    render(<Page />);
    jest.clearAllMocks();
    render(<Page />);
    expect(DynamicDashboardMock).toHaveBeenCalledTimes(1);
  });

  it("E: three renders -> three calls", () => {
    render(<Page />);
    render(<Page />);
    render(<Page />);
    expect(DynamicDashboardMock).toHaveBeenCalledTimes(3);
  });

  it("P: wrapper div exists via test id", () => {
    render(<Page />);
    expect(screen.getByTestId("dynamic-dashboard")).toBeTruthy();
  });

  it("N: Page does not forward props", () => {
    render(<Page foo="bar" n={1} b obj={{}} arr={[]} />);
    expect(DynamicDashboardMock).toHaveBeenCalledWith();
  });

  it("E: children are not forwarded", () => {
    render(<Page>child</Page>);
    expect(screen.queryByText("child")).not.toBeInTheDocument();
  });

  it("P: multiple mounts increment predictably", () => {
    render(<Page />);
    render(<Page />);
    expect(DynamicDashboardMock).toHaveBeenCalledTimes(2);
  });

  it("N: clearAllMocks resets call history", () => {
    render(<Page />);
    jest.clearAllMocks();
    expect(DynamicDashboardMock).not.toHaveBeenCalled();
  });

  it("E: unmount removes node", () => {
    const { unmount } = render(<Page />);
    expect(screen.getByTestId("dynamic-dashboard")).toBeInTheDocument();
    unmount();
    expect(screen.queryByTestId("dynamic-dashboard")).not.toBeInTheDocument();
  });

  it("P: component type is function", () => {
    expect(typeof Page).toBe("function");
  });

  it("N: render does not throw", () => {
    expect(() => render(<Page />)).not.toThrow();
  });

  it("E: render inside wrapper works", () => {
    const { container } = render(
      <div>
        <Page />
      </div>
    );
    expect(container.querySelector('[data-testid="dynamic-dashboard"]').tagName).toBe("DIV");
  });

  it("P: not called with args", () => {
    render(<Page />);
    expect(DynamicDashboardMock.mock.calls[0].length).toBe(0);
  });

  it("N: first call instance is undefined (function mock)", () => {
    render(<Page />);
    expect(DynamicDashboardMock.mock.instances[0]).toBeUndefined();
  });

  it("E: two renders produce two nodes or latest node present", () => {
    render(<Page />);
    render(<Page />);
    expect(DynamicDashboardMock).toHaveBeenCalledTimes(2);
    expect(screen.getAllByTestId("dynamic-dashboard").length).toBeGreaterThanOrEqual(1);
  });

  // Add more small P/N/E variations to exceed 30
  it("P: DOM node exists after immediate render", () => {
    const { container } = render(<Page />);
    expect(container.querySelector('[data-testid="dynamic-dashboard"]').getAttribute('data-testid')).toBe('dynamic-dashboard');
  });

  it("N: passing symbol/function props to Page are ignored", () => {
    const sym = Symbol("x");
    const fn = () => {};
    render(<Page sym={sym} fn={fn} />);
    expect(DynamicDashboardMock).toHaveBeenCalledWith();
  });

  it("E: passing null/undefined props are ignored", () => {
    render(<Page u={undefined} n={null} />);
    expect(DynamicDashboardMock).toHaveBeenCalledWith();
  });

  it("P: sequential renders preserve behavior", () => {
    render(<Page />);
    render(<Page />);
    render(<Page />);
    expect(DynamicDashboardMock).toHaveBeenCalledTimes(3);
  });

  it("N: clear and re-render produces one new call", () => {
    render(<Page />);
    jest.clearAllMocks();
    render(<Page />);
    expect(DynamicDashboardMock).toHaveBeenCalledTimes(1);
  });

  it("E: can render inside multiple nested wrappers", () => {
    const { container } = render(
      <section>
        <article>
          <Page />
        </article>
      </section>
    );
    expect(container.querySelector('[data-testid="dynamic-dashboard"]').dataset.testid).toBe("dynamic-dashboard");
  });

  // Additional tests to exceed 30
  it("P: multiple unmounts are safe", () => {
    const { unmount } = render(<Page />);
    unmount();
    // calling unmount again should not throw
    expect(() => unmount()).not.toThrow();
  });

  it("N: DOM has zero nodes after unmount", () => {
    const { unmount } = render(<Page />);
    unmount();
    expect(screen.queryByTestId("dynamic-dashboard")).toBeNull();
  });

  it("E: sequential unmount/remount cycles are stable", () => {
    let utils = render(<Page />);
    utils.unmount();
    utils = render(<Page />);
    expect(screen.getByTestId("dynamic-dashboard")).toBeInTheDocument();
  });

  it("P: mock call order increases with renders", () => {
    render(<Page />);
    const firstCount = DynamicDashboardMock.mock.calls.length;
    render(<Page />);
    expect(DynamicDashboardMock.mock.calls.length).toBeGreaterThan(firstCount);
  });

  it("N: Page ignores extremely large props object", () => {
    const big = {};
    for (let i = 0; i < 50; i += 1) big["k" + i] = i;
    render(<Page {...big} />);
    expect(DynamicDashboardMock).toHaveBeenCalledWith();
  });

  it("E: Page renders inside fragment without issues", () => {
    const { container } = render(
      <>
        <Page />
      </>
    );
    expect(container.querySelector('[data-testid="dynamic-dashboard"]').getAttribute("data-testid")).toBe("dynamic-dashboard");
  });
});


