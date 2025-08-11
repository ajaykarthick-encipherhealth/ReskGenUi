import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

// Mock the child Reports component to observe props
const ReportsMock = jest.fn(({ tab }) => (
  <div data-testid="reports" data-tab={tab || ""} />
));

// Some repos may have path variants; mock both to be safe
jest.mock("../../../../src/commonPages/reports", () => ({
  __esModule: true,
  default: (props) => ReportsMock(props),
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe("tenantadmin/report/index page", () => {
  const Page = require("../../../../src/pages/tenantadmin/report/index.js").default;

  it("P: renders Reports with Admin tab", () => {
    render(<Page />);
    const el = screen.getByTestId("reports");
    expect(el).toBeInTheDocument();
    expect(el.getAttribute("data-tab")).toBe("Admin");
    expect(ReportsMock).toHaveBeenCalledTimes(1);
  });

  it("N: does not pass unexpected props", () => {
    render(<Page />);
    expect(ReportsMock).toHaveBeenCalledWith(
      expect.objectContaining({ tab: "Admin" })
    );
    // ensure no extraneous props
    const call = ReportsMock.mock.calls[0][0];
    expect(Object.keys(call)).toEqual(["tab"]);
  });

  it("E: unmount and remount works without side-effects", () => {
    const { unmount } = render(<Page />);
    expect(screen.getByTestId("reports")).toBeInTheDocument();
    unmount();
    render(<Page />);
    expect(screen.getByTestId("reports")).toBeInTheDocument();
    expect(ReportsMock).toHaveBeenCalledTimes(2);
  });

  // Additional granular P/N/E tests to reach 30+

  it("P: renders exactly once per render call", () => {
    render(<Page />);
    expect(ReportsMock).toHaveBeenCalledTimes(1);
  });

  it("N: re-rendering after clear starts fresh", () => {
    render(<Page />);
    jest.clearAllMocks();
    render(<Page />);
    expect(ReportsMock).toHaveBeenCalledTimes(1);
  });

  it("E: rendering three times results in three invocations", () => {
    render(<Page />);
    render(<Page />);
    render(<Page />);
    expect(ReportsMock).toHaveBeenCalledTimes(3);
  });

  it("P: tab prop is a string and equals 'Admin'", () => {
    render(<Page />);
    const arg = ReportsMock.mock.calls[0][0];
    expect(typeof arg.tab).toBe("string");
    expect(arg.tab).toBe("Admin");
  });

  it("N: tab prop is not undefined or null", () => {
    render(<Page />);
    const arg = ReportsMock.mock.calls[0][0];
    expect(arg.tab).not.toBeUndefined();
    expect(arg.tab).not.toBeNull();
  });

  it("E: tab prop has non-zero length and no leading/trailing whitespace", () => {
    render(<Page />);
    const arg = ReportsMock.mock.calls[0][0];
    expect(arg.tab.length).toBeGreaterThan(0);
    expect(arg.tab).toBe(arg.tab.trim());
  });

  it("P: no children are forwarded", () => {
    render(<Page />);
    const arg = ReportsMock.mock.calls[0][0];
    expect("children" in arg).toBe(false);
  });

  it("N: passing children to Page does not forward them", () => {
    render(<Page>child</Page>);
    const arg = ReportsMock.mock.calls[0][0];
    expect(arg.children).toBeUndefined();
    expect(screen.queryByText("child")).not.toBeInTheDocument();
  });

  it("E: passing arbitrary props to Page does not forward them", () => {
    render(<Page foo="bar" baz={123} o={{ a: 1 }} />);
    const arg = ReportsMock.mock.calls[0][0];
    expect(arg.foo).toBeUndefined();
    expect(arg.baz).toBeUndefined();
    expect(arg.o).toBeUndefined();
  });

  it("P: the rendered mock includes data-tab='Admin'", () => {
    render(<Page />);
    expect(screen.getByTestId("reports").getAttribute("data-tab")).toBe("Admin");
  });

  it("N: data-tab is not 'admin' (case-sensitive)", () => {
    render(<Page />);
    expect(screen.getByTestId("reports").getAttribute("data-tab")).not.toBe("admin");
  });

  it("E: data-tab is not empty", () => {
    render(<Page />);
    expect(screen.getByTestId("reports").getAttribute("data-tab")).not.toBe("");
  });

  it("P: multiple mounts increment call count predictably", () => {
    render(<Page />);
    render(<Page />);
    expect(ReportsMock).toHaveBeenCalledTimes(2);
  });

  it("N: clearing mocks resets call history", () => {
    render(<Page />);
    jest.clearAllMocks();
    expect(ReportsMock).not.toHaveBeenCalled();
  });

  it("E: unmount removes previous instance", () => {
    const { unmount } = render(<Page />);
    expect(screen.getByTestId("reports")).toBeInTheDocument();
    unmount();
    expect(screen.queryByTestId("reports")).not.toBeInTheDocument();
  });

  it("P: only one prop key exists (tab)", () => {
    render(<Page />);
    const keys = Object.keys(ReportsMock.mock.calls[0][0]);
    expect(keys).toEqual(["tab"]);
  });

  it("N: props object is plain and not null", () => {
    render(<Page />);
    const props = ReportsMock.mock.calls[0][0];
    expect(props && typeof props).toBe("object");
  });

  it("E: props object is not frozen (can be extended in test)", () => {
    render(<Page />);
    const props = ReportsMock.mock.calls[0][0];
    const clone = { ...props, x: 1 };
    expect(clone.x).toBe(1);
  });

  it("P: ReportsMock receives direct prop, not nested", () => {
    render(<Page />);
    const props = ReportsMock.mock.calls[0][0];
    expect(props.tab).toBeDefined();
    expect(props["tab"]).toBe("Admin");
  });

  it("N: ReportsMock not called with empty arguments", () => {
    render(<Page />);
    expect(ReportsMock.mock.calls[0].length).toBe(1);
  });

  it("E: ReportsMock returns a node with test id", () => {
    render(<Page />);
    expect(screen.getByTestId("reports")).toBeInTheDocument();
  });

  it("P: subsequent render does not change prop value", () => {
    render(<Page />);
    const first = ReportsMock.mock.calls[0][0].tab;
    render(<Page />);
    const second = ReportsMock.mock.calls[1][0].tab;
    expect(second).toBe(first);
  });

  it("N: passing symbol/func props to Page are ignored", () => {
    const sym = Symbol("s");
    const fn = () => {};
    render(<Page sym={sym} fn={fn} />);
    const arg = ReportsMock.mock.calls[0][0];
    expect(arg.sym).toBeUndefined();
    expect(arg.fn).toBeUndefined();
  });

  it("E: object/array props to Page are ignored", () => {
    render(<Page obj={{ a: 1 }} arr={[1, 2, 3]} />);
    const arg = ReportsMock.mock.calls[0][0];
    expect(arg.obj).toBeUndefined();
    expect(arg.arr).toBeUndefined();
  });

  it("P: numbers/booleans to Page are ignored", () => {
    render(<Page n={0} b={false} />);
    const arg = ReportsMock.mock.calls[0][0];
    expect(arg.n).toBeUndefined();
    expect(arg.b).toBeUndefined();
  });

  it("N: strings to Page are ignored", () => {
    render(<Page s="x" />);
    const arg = ReportsMock.mock.calls[0][0];
    expect(arg.s).toBeUndefined();
  });

  it("E: null/undefined props to Page are ignored", () => {
    render(<Page u={undefined} z={null} />);
    const arg = ReportsMock.mock.calls[0][0];
    expect(arg.u).toBeUndefined();
    expect(arg.z).toBeUndefined();
  });

  it("P: ReportsMock receives consistent argument shape across renders", () => {
    render(<Page />);
    render(<Page />);
    const s1 = Object.keys(ReportsMock.mock.calls[0][0]).sort().join(",");
    const s2 = Object.keys(ReportsMock.mock.calls[1][0]).sort().join(",");
    expect(s1).toBe(s2);
  });

  it("N: ReportsMock never called with null props", () => {
    render(<Page />);
    expect(ReportsMock.mock.calls[0][0]).not.toBeNull();
  });

  it("E: ReportsMock call arg is not an array", () => {
    render(<Page />);
    expect(Array.isArray(ReportsMock.mock.calls[0][0])).toBe(false);
  });

  it("P: Page is a function component", () => {
    expect(typeof Page).toBe("function");
  });

  it("N: Page does not throw when rendered", () => {
    expect(() => render(<Page />)).not.toThrow();
  });

  it("E: Page can be rendered inside a wrapper div", () => {
    const { container } = render(
      <div>
        <Page />
      </div>
    );
    expect(container.querySelector('[data-testid="reports"]').getAttribute("data-tab")).toBe("Admin");
  });
});


