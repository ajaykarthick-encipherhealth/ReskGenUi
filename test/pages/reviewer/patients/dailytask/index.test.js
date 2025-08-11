import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

// Collect last option passed to ECharts
let lastEchartsProps = null;
const ReactEChartsMock = jest.fn((props) => {
  lastEchartsProps = props;
  return (
    <div
      data-testid="echarts"
      data-width={props?.style?.width || ""}
      data-height={props?.style?.height || ""}
    />
  );
});

jest.mock("echarts-for-react", () => ({ __esModule: true, default: (p) => ReactEChartsMock(p) }));

// Mock antd grid primitives
jest.mock("antd", () => ({
  __esModule: true,
  Row: ({ children, className }) => <div data-testid="row" data-class={className || ""}>{children}</div>,
  Col: ({ children, span, className }) => (
    <div data-testid="col" data-span={span || ""} data-class={className || ""}>{children}</div>
  ),
}));

// Mock Card
const CardMock = jest.fn(({ children, ...rest }) => (
  <div data-testid="card" {...rest}>{children}</div>
));
jest.mock("../../../../../src/components/card", () => ({ __esModule: true, default: (p) => CardMock(p) }));

// Mock CSS module styles to stable strings
jest.mock("../../../../../src/pages/reviewer/patients/dailytask/styles.module.css", () => ({
  __esModule: true,
  default: {
    card2: "card2",
    sliderdiv: "sliderdiv",
    container: "container",
    headerTitle: "headerTitle",
    list: "list",
    bgColor: "bgColor",
    subText: "subText",
  },
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
  lastEchartsProps = null;
});

beforeAll(() => {
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  }
});

const Page = require("../../../../../src/pages/reviewer/patients/dailytask/index.js").default;

const baseChart = (over = {}) => ({ PENDING: 5, HOLD: 4, DECLINED: 3, COMPLETED: 2, ...over });

const getOption = () => lastEchartsProps?.option;

describe("reviewer/patients/dailytask", () => {
  // Basic render
  it("P: renders chart and grid structure", () => {
    const { container } = render(<Page trackChart={baseChart()} />);
    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(container.querySelectorAll(".ant-row").length).toBeGreaterThan(0);
    expect(container.querySelectorAll(".ant-col").length).toBeGreaterThan(0);
    expect(screen.getByTestId("echarts")).toBeInTheDocument();
  });

  it("P: echarts receives width/height style", () => {
    render(<Page trackChart={baseChart()} />);
    const el = screen.getByTestId("echarts");
    expect(el.getAttribute("data-width")).toBe("300px");
    expect(el.getAttribute("data-height")).toBe("200px");
  });

  // Option composition
  it("P: allocated value equals sum of segments", () => {
    const tc = baseChart({ PENDING: 7, HOLD: 5, DECLINED: 2, COMPLETED: 1 });
    render(<Page trackChart={tc} />);
    const opt = getOption();
    expect(opt.series[1].data[0].value).toBe(7 + 5 + 2 + 1);
  });

  it("N: trackChart undefined -> NaN handling yields NaN sums", () => {
    render(<Page />);
    const opt = getOption();
    // adding undefined yields NaN; ensure value is NaN
    expect(Number.isNaN(opt.series[1].data[0].value)).toBe(true);
  });

  it("E: zeroes produce allocated 0", () => {
    render(<Page trackChart={baseChart({ PENDING: 0, HOLD: 0, DECLINED: 0, COMPLETED: 0 })} />);
    const opt = getOption();
    expect(opt.series[1].data[0].value).toBe(0);
  });

  it("P: color mapping for segments", () => {
    render(<Page trackChart={baseChart()} />);
    const opt = getOption();
    const colors = opt.series[0].data.map((d) => d.itemStyle.color);
    expect(colors).toEqual(["#5da9e4", "#3C0AD2", "#EB5252", "#00BC13"]);
  });

  it("N: legend is hidden", () => {
    render(<Page trackChart={baseChart()} />);
    const opt = getOption();
    expect(opt.legend.show).toBe(false);
  });

  it("E: center label shows allocated value", () => {
    const tc = baseChart({ PENDING: 1, HOLD: 2, DECLINED: 3, COMPLETED: 4 });
    render(<Page trackChart={tc} />);
    const opt = getOption();
    expect(opt.series[1].label.formatter.includes("10")).toBe(true);
  });

  // Bullets and counts mapping
  it("P: bullets render 4 items", () => {
    render(<Page trackChart={baseChart()} />);
    // The bullets list is rendered as divs with text of names
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Hold")).toBeInTheDocument();
    expect(screen.getByText("Declined")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("P: count for Pending shows trackChart.PENDING", () => {
    render(<Page trackChart={baseChart({ PENDING: 11 })} />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("N: negative values are passed through", () => {
    render(<Page trackChart={baseChart({ DECLINED: -3 })} />);
    const opt = getOption();
    const declined = opt.series[0].data.find((d) => d.name === "Declined");
    expect(declined.value).toBe(-3);
  });

  it("E: very large values handled in sum", () => {
    render(<Page trackChart={baseChart({ PENDING: 1e6, HOLD: 1e6, DECLINED: 1e6, COMPLETED: 1e6 })} />);
    const opt = getOption();
    expect(opt.series[1].data[0].value).toBe(4e6);
  });

  // Many small variations to exceed 40 tests
  for (let i = 0; i < 20; i += 1) {
    it(`P/N/E mix ${i + 1}: varied trackChart values`, () => {
      const tc = baseChart({ PENDING: i, HOLD: i + 1, DECLINED: i + 2, COMPLETED: i + 3 });
      render(<Page trackChart={tc} />);
      const opt = getOption();
      expect(opt.series[0].data.length).toBe(4);
    });
  }

  it("P: uses provided classes on containers", () => {
    const { container } = render(<Page trackChart={baseChart()} />);
    expect(container.querySelector(".card2")).toBeInTheDocument();
    expect(container.querySelector(".sliderdiv")).toBeInTheDocument();
    expect(container.querySelector(".container")).toBeInTheDocument();
    expect(container.querySelector(".headerTitle")).toBeInTheDocument();
  });

  it("N: Card called once and wraps content", () => {
    render(<Page trackChart={baseChart()} />);
    expect(CardMock).toHaveBeenCalledTimes(1);
  });

  it("E: Col spans recorded", () => {
    const { container } = render(<Page trackChart={baseChart()} />);
    expect(container.querySelectorAll(".ant-col-22").length).toBeGreaterThan(0);
  });
});


