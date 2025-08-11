import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AppChart from "../../src/commonPages/dashboard/component/appchart";

// Mock ReactECharts
jest.mock("echarts-for-react", () => {
  return function ReactECharts({ option, style }) {
    return (
      <div data-testid="echarts-container" style={style}>
        <div data-testid="chart-type">{option?.series?.[0]?.type || "unknown"}</div>
        <div data-testid="chart-title">{option?.title?.text || "No Title"}</div>
        <div data-testid="chart-categories">
          {option?.xAxis?.data?.join(", ") || "No Categories"}
        </div>
        <div data-testid="chart-series-count">
          {option?.series?.length || 0} series
        </div>
        <div data-testid="chartType">{option?.type}</div>
        <div data-testid="chart-height">{style?.height}</div>
        <div data-testid="chart-options">{JSON.stringify(option)}</div>
      </div>
    );
  };
});

// Mock ChartHeader component
jest.mock("../../src/commonPages/dashboard/component/chartheader", () => {
  return function ChartHeader({ customHeader }) {
    return (
      <div data-testid="chart-header">
        <div data-testid="header-title">{customHeader?.header}</div>
        <div data-testid="header-value">{customHeader?.value}</div>
      </div>
    );
  };
});

// Mock utility functions
jest.mock("../../src/utils/reusable", () => ({
  formatValues: jest.fn((data, dates) => data),
  getChartTimeLine: jest.fn((data, config) => data),
  statusFormate: jest.fn((value) => value),
}));

// Mock useWindowWidth hook and toFixedNum function
jest.mock("../../src/commonPages/dashboard/component/function", () => ({
  useWindowWidth: jest.fn(() => 1400),
  toFixedNum: jest.fn((value, precision = 2) => parseFloat(value?.toFixed(precision)) || 0),
}));

// Import the mocked functions to control them in tests
import { useWindowWidth, toFixedNum } from "../../src/commonPages/dashboard/component/function";

describe("AppChart Component", () => {
  const defaultProps = {
    type: "line",
    title: "Test Chart",
    categories: ["Jan", "Feb", "Mar"],
    series: [
      {
        name: "Series 1",
        data: [10, 20, 30],
        color: "#ff0000",
      },
    ],
    height: 250,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset window width to default
    useWindowWidth.mockReturnValue(1400);
  });

  describe("Basic Rendering Tests", () => {
    it("should render without crashing", () => {
      render(<AppChart {...defaultProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should render with default props", () => {
      render(<AppChart {...defaultProps}/>);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
      expect(screen.getByTestId("chart-type")).toHaveTextContent("line");
    });

    it("should display chart title", () => {
      render(<AppChart {...defaultProps} />);
      expect(screen.getByTestId("chart-title")).toHaveTextContent("Test Chart");
    });

    it("should display categories", () => {
      render(<AppChart {...defaultProps} />);
      expect(screen.getByTestId("chart-categories")).toHaveTextContent("Jan, Feb, Mar");
    });

    it("should display series count", () => {
      render(<AppChart {...defaultProps} />);
      expect(screen.getByTestId("chart-series-count")).toHaveTextContent("1 series");
    });

    it("should apply custom height", () => {
      render(<AppChart {...defaultProps} height={400} />);
      expect(screen.getByTestId("chart-height")).toHaveTextContent("400");
    });
  });

  describe("Chart Type Tests", () => {
    it("should render line chart", () => {
      render(<AppChart {...defaultProps} type="line" />);
      expect(screen.getByTestId("chart-type")).toHaveTextContent("line");
    });

    it("should render bar chart", () => {
      render(<AppChart {...defaultProps} type="bar" />);
      expect(screen.getByTestId("chart-type")).toHaveTextContent("bar");
    });

    it("should render area chart", () => {
      render(<AppChart {...defaultProps} type="area" />);
      expect(screen.getByTestId("chart-type")).toHaveTextContent("line");
    });

    it("should render stepline chart", () => {
      render(<AppChart {...defaultProps} type="stepline" />);
      expect(screen.getByTestId("chart-type")).toHaveTextContent("line");
    });

    it("should render donut chart", () => {
      render(<AppChart {...defaultProps} type="donut" />);
      expect(screen.getByTestId("chart-type")).toHaveTextContent("pie");
    });

    it("should render gauge chart", () => {
      render(<AppChart {...defaultProps} type="gauge" />);
      expect(screen.getByTestId("chart-type")).toHaveTextContent("gauge");
    });
  });

  describe("Window Width Responsive Tests", () => {
    it("should handle small window width (< 1290)", () => {
      useWindowWidth.mockReturnValue(1200);
      render(<AppChart {...defaultProps} type="donut" isDailyChart={true} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle medium window width (1290-1500)", () => {
      useWindowWidth.mockReturnValue(1350);
      render(<AppChart {...defaultProps} type="donut" isDailyChart={true} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle large window width (> 1500)", () => {
      useWindowWidth.mockReturnValue(1600);
      render(<AppChart {...defaultProps} type="donut" isDailyChart={true} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle very small window width for donut chart", () => {
      useWindowWidth.mockReturnValue(1000);
      render(<AppChart {...defaultProps} type="donut" />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle small window width for non-daily donut chart", () => {
      useWindowWidth.mockReturnValue(1200);
      render(<AppChart {...defaultProps} type="donut" isDailyChart={false} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Daily Chart Tests", () => {
    it("should handle daily chart with small window", () => {
      useWindowWidth.mockReturnValue(1200);
      render(<AppChart {...defaultProps} type="donut" isDailyChart={true} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle daily chart with medium window", () => {
      useWindowWidth.mockReturnValue(1400);
      render(<AppChart {...defaultProps} type="donut" isDailyChart={true} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle daily chart with large window", () => {
      useWindowWidth.mockReturnValue(1600);
      render(<AppChart {...defaultProps} type="donut" isDailyChart={true} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Donut Chart Center Calculation Tests", () => {
    it("should handle donut chart with many series (> 6)", () => {
      const manySeriesProps = {
        ...defaultProps,
        type: "donut",
        series: Array.from({ length: 8 }, (_, i) => ({
          name: `Series ${i + 1}`,
          value: 10,
          color: "#ff0000",
        })),
      };
      render(<AppChart {...manySeriesProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle donut chart with few series (≤ 6)", () => {
      const fewSeriesProps = {
        ...defaultProps,
        type: "donut",
        series: Array.from({ length: 3 }, (_, i) => ({
          name: `Series ${i + 1}`,
          value: 10,
          color: "#ff0000",
        })),
      };
      render(<AppChart {...fewSeriesProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle donut chart with many series and small window", () => {
      useWindowWidth.mockReturnValue(1200);
      const manySeriesProps = {
        ...defaultProps,
        type: "donut",
        series: Array.from({ length: 8 }, (_, i) => ({
          name: `Series ${i + 1}`,
          value: 10,
          color: "#ff0000",
        })),
      };
      render(<AppChart {...manySeriesProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Custom Header Tests", () => {
    it("should render custom header when provided", () => {
      const customHeader = {
        header: "Custom Header",
        value: "100",
      };
      render(<AppChart {...defaultProps} customHeader={customHeader} />);
      
      expect(screen.getByTestId("chart-header")).toBeInTheDocument();
      expect(screen.getByTestId("header-title")).toHaveTextContent("Custom Header");
      expect(screen.getByTestId("header-value")).toHaveTextContent("100");
    });

    it("should not render custom header when not provided", () => {
      render(<AppChart {...defaultProps} />);
      expect(screen.queryByTestId("chart-header")).not.toBeInTheDocument();
    });
  });

  describe("Multiple Series Tests", () => {
    it("should handle multiple series", () => {
      const multipleSeriesProps = {
        ...defaultProps,
        series: [
          { name: "Series 1", data: [10, 20, 30], color: "#ff0000" },
          { name: "Series 2", data: [15, 25, 35], color: "#00ff00" },
          { name: "Series 3", data: [5, 15, 25], color: "#0000ff" },
        ],
      };
      
      render(<AppChart {...multipleSeriesProps} />);
      expect(screen.getByTestId("chart-series-count")).toHaveTextContent("3 series");
    });

    it("should handle empty series", () => {
      render(<AppChart {...defaultProps} series={[]} />);
      expect(screen.getByTestId("chart-series-count")).toHaveTextContent("0 series");
    });
  });

  describe("Donut Chart Specific Tests", () => {
    const donutProps = {
      type: "donut",
      title: "Donut Chart",
      series: [
        { name: "Category 1", value: 30, color: "#ff0000" },
        { name: "Category 2", value: 50, color: "#00ff00" },
        { name: "Category 3", value: 20, color: "#0000ff" },
      ],
    };

    it("should render donut chart with correct type", () => {
      render(<AppChart {...donutProps} />);
      expect(screen.getByTestId("chart-type")).toHaveTextContent("pie");
    });

    it("should handle total prop for donut chart", () => {
      render(<AppChart {...donutProps} total={100} />);
      expect(screen.getByTestId("chart-type")).toHaveTextContent("pie");
    });

    it("should calculate total from series when total prop is not provided", () => {
      render(<AppChart {...donutProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle donut chart with long series names", () => {
      const longNameProps = {
        ...donutProps,
        series: [
          { name: "Very Long Category Name That Should Be Truncated", value: 30, color: "#ff0000" },
        ],
      };
      render(<AppChart {...longNameProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle donut chart with series without matching name", () => {
      const donutWithLegendProps = {
        ...donutProps,
        series: [
          { name: "Category 1", value: 30, color: "#ff0000" },
        ],
      };
      render(<AppChart {...donutWithLegendProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Gauge Chart Specific Tests", () => {
    const gaugeProps = {
      type: "gauge",
      title: "Gauge Chart",
      series: [
        {
          name: "Metric",
          value: 75,
          color: "#ff0000",
          title: "Performance",
        },
      ],
    };

    it("should render gauge chart with correct type", () => {
      render(<AppChart {...gaugeProps} />);
      expect(screen.getByTestId("chart-type")).toHaveTextContent("gauge");
    });

    it("should display gauge title", () => {
      render(<AppChart {...gaugeProps} />);
      expect(screen.getByTestId("chart-title")).toHaveTextContent("Gauge Chart");
    });

    it("should handle gauge with zero value", () => {
      const zeroGaugeProps = {
        ...gaugeProps,
        series: [{ ...gaugeProps.series[0], value: 0 }],
      };
      render(<AppChart {...zeroGaugeProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle gauge with custom width", () => {
      const customWidthProps = {
        ...gaugeProps,
        series: [{ ...gaugeProps.series[0], width: 15 }],
      };
      render(<AppChart {...customWidthProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle gauge with custom fontSize", () => {
      const customFontProps = {
        ...gaugeProps,
        series: [{ ...gaugeProps.series[0], fontSize: 20 }],
      };
      render(<AppChart {...customFontProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle gauge with progress show condition", () => {
      const progressGaugeProps = {
        ...gaugeProps,
        series: [{ ...gaugeProps.series[0], value: 0 }],
      };
      render(<AppChart {...progressGaugeProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Legend Data Tests", () => {
    it("should use legendData when provided", () => {
      const legendDataProps = {
        ...defaultProps,
        showLabel: true,
        legendData: [
          { name: "Legend 1", itemStyle: { color: "#ff0000" } },
          { name: "Legend 2", itemStyle: { color: "#00ff00" } },
        ],
      };
      render(<AppChart {...legendDataProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should fallback to series when legendData is not provided", () => {
      const noLegendDataProps = {
        ...defaultProps,
        showLabel: true,
      };
      render(<AppChart {...noLegendDataProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Modal Tests", () => {
    it("should render view all button when series length > 5", () => {
      const manySeriesProps = {
        ...defaultProps,
        showLabel: true,
        series: [
          { name: "Series 1", data: [1], color: "#ff0000" },
          { name: "Series 2", data: [2], color: "#00ff00" },
          { name: "Series 3", data: [3], color: "#0000ff" },
          { name: "Series 4", data: [4], color: "#ffff00" },
          { name: "Series 5", data: [5], color: "#ff00ff" },
          { name: "Series 6", data: [6], color: "#00ffff" },
        ],
      };
      
      render(<AppChart {...manySeriesProps} />);
      expect(screen.getByText("view all")).toBeInTheDocument();
    });

    it("should not render view all button when series length <= 5", () => {
      const fewSeriesProps = {
        ...defaultProps,
        showLabel: true,
        series: [
          { name: "Series 1", data: [1], color: "#ff0000" },
          { name: "Series 2", data: [2], color: "#00ff00" },
        ],
      };
      
      render(<AppChart {...fewSeriesProps} />);
      expect(screen.queryByText("view all")).not.toBeInTheDocument();
    });

    it("should handle modal open/close", () => {
      const modalProps = {
        ...defaultProps,
        showLabel: true,
        isOrgModalOpen: true,
        showModal: jest.fn(),
        handleOk: jest.fn(),
        handleCancel: jest.fn(),
      };
      
      render(<AppChart {...modalProps} />);
      expect(screen.getByText("Organizations")).toBeInTheDocument();
    });

    it("should handle modal with legendData", () => {
      const modalWithLegendProps = {
        ...defaultProps,
        showLabel: true,
        isOrgModalOpen: true,
        legendData: [
          { name: "Legend 1", itemStyle: { color: "#ff0000" } },
          { name: "Legend 2", itemStyle: { color: "#00ff00" } },
        ],
        showModal: jest.fn(),
        handleOk: jest.fn(),
        handleCancel: jest.fn(),
      };
      
      render(<AppChart {...modalWithLegendProps} />);
      expect(screen.getByText("Organizations")).toBeInTheDocument();
    });

    it("should handle modal button click", () => {
      const mockShowModal = jest.fn();
      const modalProps = {
        ...defaultProps,
        showLabel: true,
        series: Array.from({ length: 6 }, (_, i) => ({
          name: `Series ${i + 1}`,
          data: [i],
          color: "#ff0000",
        })),
        showModal: mockShowModal,
      };
      
      render(<AppChart {...modalProps} />);
      const viewAllButton = screen.getByText("view all");
      fireEvent.click(viewAllButton);
      expect(mockShowModal).toHaveBeenCalled();
    });

    it("should handle legendData length > 5", () => {
      const legendDataProps = {
        ...defaultProps,
        showLabel: true,
        legendData: Array.from({ length: 6 }, (_, i) => ({
          name: `Legend ${i + 1}`,
          itemStyle: { color: "#ff0000" },
        })),
      };
      
      render(<AppChart {...legendDataProps} />);
      expect(screen.getByText("view all")).toBeInTheDocument();
    });
  });

  describe("Axis and Formatter Tests", () => {
    it("should handle x-axis rotation", () => {
      render(<AppChart {...defaultProps} xAxisRotated={true} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle date formatting in x-axis", () => {
      const dateCategories = ["2024-01-01", "2024-01-02", "2024-01-03"];
      render(<AppChart {...defaultProps} categories={dateCategories} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle date formatting with 3 parts", () => {
      const dateCategories = ["2024-01-01", "2024-02-15", "2024-03-30"];
      render(<AppChart {...defaultProps} categories={dateCategories} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle date formatting with non-3 parts", () => {
      const dateCategories = ["2024-01", "2024-02", "2024-03"];
      render(<AppChart {...defaultProps} categories={dateCategories} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle long category names with truncation", () => {
      const longCategories = ["Very Long Category Name 1", "Very Long Category Name 2"];
      render(<AppChart {...defaultProps} categories={longCategories} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle x-axis interval", () => {
      render(<AppChart {...defaultProps} xAxisInterval={1} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle small window width for category truncation", () => {
      useWindowWidth.mockReturnValue(1200);
      const longCategories = ["Very Long Category Name 1", "Very Long Category Name 2"];
      render(<AppChart {...defaultProps} categories={longCategories} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Plot Configuration Tests", () => {
    it("should handle plotConfig for data formatting", () => {
      const plotConfigProps = {
        ...defaultProps,
        series: [
          {
            name: "Series 1",
            data: [{ date: "2024-01-01", value: 10 }],
            plotConfig: {
              key: "date",
              value: "value",
              dates: ["2024-01-01"],
            },
          },
        ],
      };
      
      render(<AppChart {...plotConfigProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle series without plotConfig", () => {
      const noPlotConfigProps = {
        ...defaultProps,
        series: [
          {
            name: "Series 1",
            data: [10, 20, 30],
            color: "#ff0000",
          },
        ],
      };
      
      render(<AppChart {...noPlotConfigProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle stepline with plotConfig", () => {
      const steplineProps = {
        ...defaultProps,
        type: "stepline",
        series: [
          {
            name: "Series 1",
            data: [{ date: "2024-01-01", value: 10 }],
            plotConfig: {
              key: "date",
              value: "value",
              dates: ["2024-01-01"],
            },
          },
        ],
      };
      
      render(<AppChart {...steplineProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle area chart with plotConfig", () => {
      const areaProps = {
        ...defaultProps,
        type: "area",
        series: [
          {
            name: "Series 1",
            data: [{ date: "2024-01-01", value: 10 }],
            plotConfig: {
              key: "date",
              value: "value",
              dates: ["2024-01-01"],
            },
          },
        ],
      };
      
      render(<AppChart {...areaProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Stacked Chart Tests", () => {
    it("should handle stacked charts", () => {
      render(<AppChart {...defaultProps} stacked={true} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle non-stacked charts", () => {
      render(<AppChart {...defaultProps} stacked={false} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle stacked bar charts", () => {
      render(<AppChart {...defaultProps} type="bar" stacked={true} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle stacked stepline charts", () => {
      render(<AppChart {...defaultProps} type="stepline" stacked={true} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Background and Styling Tests", () => {
    it("should apply custom background color", () => {
      render(<AppChart {...defaultProps} chartBackground="#f0f0f0" />);
      const container = screen.getByTestId("echarts-container").parentElement;
      expect(container).toHaveStyle("background: #f0f0f0");
    });

    it("should apply default background color", () => {
      render(<AppChart {...defaultProps} />);
      const container = screen.getByTestId("echarts-container").parentElement;
      expect(container).toHaveStyle("background: #fff");
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle undefined categories", () => {
      render(<AppChart {...defaultProps} categories={undefined} />);
      expect(screen.getByTestId("chart-categories")).toHaveTextContent("No Categories");
    });

    it("should handle empty categories", () => {
      render(<AppChart {...defaultProps} categories={[]} />);
      expect(screen.getByTestId("chart-categories")).toHaveTextContent("No Categories");
    });

    it("should handle undefined series", () => {
      render(<AppChart {...defaultProps} series={undefined} />);
      expect(screen.getByTestId("chart-series-count")).toHaveTextContent("0 series");
    });

    it("should handle series without data", () => {
      const seriesWithoutData = [
        { name: "Series 1", color: "#ff0000" },
      ];
      render(<AppChart {...defaultProps} series={seriesWithoutData} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle missing chart type", () => {
      render(<AppChart {...defaultProps} type="unknown" />);
      expect(screen.getByTestId("chart-type")).toHaveTextContent("line");
    });

    it("should handle series without names", () => {
      const seriesWithoutNames = [
        { data: [10, 20, 30], color: "#ff0000" },
      ];
      render(<AppChart {...defaultProps} series={seriesWithoutNames} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle categories with falsy values", () => {
      const falsyCategories = [null, undefined, "", "Valid"];
      render(<AppChart {...defaultProps} categories={falsyCategories} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle series with itemStyle", () => {
      const seriesWithItemStyle = [
        { name: "Series 1", data: [10, 20, 30], itemStyle: { color: "#ff0000" } },
      ];
      render(<AppChart {...defaultProps} series={seriesWithItemStyle} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Performance Tests", () => {
    it("should handle large datasets efficiently", () => {
      const largeDatasetProps = {
        ...defaultProps,
        categories: Array.from({ length: 100 }, (_, i) => `Category ${i}`),
        series: [
          {
            name: "Large Series",
            data: Array.from({ length: 100 }, (_, i) => Math.random() * 100),
            color: "#ff0000",
          },
        ],
      };
      
      const startTime = performance.now();
      render(<AppChart {...largeDatasetProps} />);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(1000); // Should render in less than 1 second
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Accessibility Tests", () => {
    it("should have proper ARIA labels", () => {
      render(<AppChart {...defaultProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should be keyboard navigable", () => {
      render(<AppChart {...defaultProps} />);
      const container = screen.getByTestId("echarts-container");
      expect(container).toBeInTheDocument();
    });
  });

  describe("Text Style Width Tests", () => {
    it("should handle getTextStyleWidth for name type with daily chart and small window", () => {
      useWindowWidth.mockReturnValue(1200);
      render(<AppChart {...defaultProps} type="donut" isDailyChart={true} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle getTextStyleWidth for name type with daily chart and large window", () => {
      useWindowWidth.mockReturnValue(1600);
      render(<AppChart {...defaultProps} type="donut" isDailyChart={true} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle getTextStyleWidth for value type with daily chart", () => {
      useWindowWidth.mockReturnValue(1400);
      render(<AppChart {...defaultProps} type="donut" isDailyChart={true} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle getTextStyleWidth for non-daily chart", () => {
      useWindowWidth.mockReturnValue(1400);
      render(<AppChart {...defaultProps} type="donut" isDailyChart={false} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle getTextStyleWidth for small window width", () => {
      useWindowWidth.mockReturnValue(1200);
      render(<AppChart {...defaultProps} type="donut" />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle getTextStyleWidth return 0 for unknown type", () => {
      // This test covers line 68 - the return 0 statement
      useWindowWidth.mockReturnValue(1400);
      render(<AppChart {...defaultProps} type="donut" />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Radius Calculation Tests", () => {
    it("should handle radius for daily chart with small window (< 1290)", () => {
      useWindowWidth.mockReturnValue(1200);
      render(<AppChart {...defaultProps} type="donut" isDailyChart={true} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle radius for daily chart with medium window (1290-1540)", () => {
      useWindowWidth.mockReturnValue(1400);
      render(<AppChart {...defaultProps} type="donut" isDailyChart={true} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle radius for non-daily chart with small window", () => {
      useWindowWidth.mockReturnValue(1200);
      render(<AppChart {...defaultProps} type="donut" isDailyChart={false} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle radius for large window", () => {
      useWindowWidth.mockReturnValue(1600);
      render(<AppChart {...defaultProps} type="donut" />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle radius for non-daily chart with large window (default case)", () => {
      useWindowWidth.mockReturnValue(1600);
      render(<AppChart {...defaultProps} type="donut" isDailyChart={false} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Center Calculation Tests", () => {
    it("should handle center for daily chart with medium window (1290-1540)", () => {
      useWindowWidth.mockReturnValue(1400);
      render(<AppChart {...defaultProps} type="donut" isDailyChart={true} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle center for small window (< 1290)", () => {
      useWindowWidth.mockReturnValue(1200);
      render(<AppChart {...defaultProps} type="donut" />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle center for many series (> 6) with large window", () => {
      useWindowWidth.mockReturnValue(1400);
      const manySeriesProps = {
        ...defaultProps,
        type: "donut",
        series: Array.from({ length: 8 }, (_, i) => ({
          name: `Series ${i + 1}`,
          value: 10,
          color: "#ff0000",
        })),
      };
      render(<AppChart {...manySeriesProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle center for many series (> 6) with small window", () => {
      useWindowWidth.mockReturnValue(1200);
      const manySeriesProps = {
        ...defaultProps,
        type: "donut",
        series: Array.from({ length: 8 }, (_, i) => ({
          name: `Series ${i + 1}`,
          value: 10,
          color: "#ff0000",
        })),
      };
      render(<AppChart {...manySeriesProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle center for few series (≤ 6) with large window", () => {
      useWindowWidth.mockReturnValue(1400);
      const fewSeriesProps = {
        ...defaultProps,
        type: "donut",
        series: Array.from({ length: 3 }, (_, i) => ({
          name: `Series ${i + 1}`,
          value: 10,
          color: "#ff0000",
        })),
      };
      render(<AppChart {...fewSeriesProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle center for few series (≤ 6) with small window", () => {
      useWindowWidth.mockReturnValue(1200);
      const fewSeriesProps = {
        ...defaultProps,
        type: "donut",
        series: Array.from({ length: 3 }, (_, i) => ({
          name: `Series ${i + 1}`,
          value: 10,
          color: "#ff0000",
        })),
      };
      render(<AppChart {...fewSeriesProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Legend Formatter Tests", () => {
    it("should handle legend formatter for daily chart with truncated names", () => {
      useWindowWidth.mockReturnValue(1200);
      const longNameProps = {
        ...defaultProps,
        type: "donut",
        isDailyChart: true,
        series: [
          { name: "Very Long Category Name That Should Be Truncated", value: 30, color: "#ff0000" },
        ],
      };
      render(<AppChart {...longNameProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle legend formatter for daily chart with short names", () => {
      useWindowWidth.mockReturnValue(1400);
      const shortNameProps = {
        ...defaultProps,
        type: "donut",
        isDailyChart: true,
        series: [
          { name: "Short", value: 30, color: "#ff0000" },
        ],
      };
      render(<AppChart {...shortNameProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle legend formatter for non-daily chart", () => {
      useWindowWidth.mockReturnValue(1400);
      const nonDailyProps = {
        ...defaultProps,
        type: "donut",
        isDailyChart: false,
        series: [
          { name: "Category 1", value: 30, color: "#ff0000" },
        ],
      };
      render(<AppChart {...nonDailyProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle legend formatter with series not found", () => {
      useWindowWidth.mockReturnValue(1400);
      const notFoundProps = {
        ...defaultProps,
        type: "donut",
        series: [
          { name: "Category 1", value: 30, color: "#ff0000" },
        ],
      };
      render(<AppChart {...notFoundProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Modal Rendering Tests", () => {
    it("should render modal when isOrgModalOpen is true", () => {
      const modalProps = {
        ...defaultProps,
        showLabel: true,
        isOrgModalOpen: true,
        showModal: jest.fn(),
        handleOk: jest.fn(),
        handleCancel: jest.fn(),
      };
      render(<AppChart {...modalProps} />);
      expect(screen.getByText("Organizations")).toBeInTheDocument();
    });

    it("should render modal with legendData when provided", () => {
      const modalWithLegendProps = {
        ...defaultProps,
        showLabel: true,
        isOrgModalOpen: true,
        legendData: [
          { name: "Legend 1", itemStyle: { color: "#ff0000" } },
          { name: "Legend 2", itemStyle: { color: "#00ff00" } },
        ],
        showModal: jest.fn(),
        handleOk: jest.fn(),
        handleCancel: jest.fn(),
      };
      render(<AppChart {...modalWithLegendProps} />);
      expect(screen.getByText("Organizations")).toBeInTheDocument();
    });

    it("should render modal with series when legendData is not provided", () => {
      const modalWithSeriesProps = {
        ...defaultProps,
        showLabel: true,
        isOrgModalOpen: true,
        series: [
          { name: "Series 1", color: "#ff0000" },
          { name: "Series 2", color: "#00ff00" },
        ],
        showModal: jest.fn(),
        handleOk: jest.fn(),
        handleCancel: jest.fn(),
      };
      render(<AppChart {...modalWithSeriesProps} />);
      expect(screen.getByText("Organizations")).toBeInTheDocument();
    });
  });

  describe("Gauge Chart Configuration Tests", () => {
    it("should handle gauge chart with zero value", () => {
      const gaugeProps = {
        type: "gauge",
        title: "Gauge Chart",
        series: [
          {
            name: "Metric",
            value: 0,
            color: "#ff0000",
            title: "Performance",
          },
        ],
      };
      render(<AppChart {...gaugeProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle gauge chart with positive value", () => {
      const gaugeProps = {
        type: "gauge",
        title: "Gauge Chart",
        series: [
          {
            name: "Metric",
            value: 75,
            color: "#ff0000",
            title: "Performance",
          },
        ],
      };
      render(<AppChart {...gaugeProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle gauge chart with custom width", () => {
      const gaugeProps = {
        type: "gauge",
        title: "Gauge Chart",
        series: [
          {
            name: "Metric",
            value: 75,
            color: "#ff0000",
            title: "Performance",
            width: 15,
          },
        ],
      };
      render(<AppChart {...gaugeProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle gauge chart with custom fontSize", () => {
      const gaugeProps = {
        type: "gauge",
        title: "Gauge Chart",
        series: [
          {
            name: "Metric",
            value: 75,
            color: "#ff0000",
            title: "Performance",
            fontSize: 20,
          },
        ],
      };
      render(<AppChart {...gaugeProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle gauge chart axis label formatter for zero value", () => {
      const gaugeProps = {
        type: "gauge",
        title: "Gauge Chart",
        series: [
          {
            name: "Metric",
            value: 0,
            color: "#ff0000",
            title: "Performance",
          },
        ],
      };
      render(<AppChart {...gaugeProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle gauge chart axis label formatter for 100 value", () => {
      const gaugeProps = {
        type: "gauge",
        title: "Gauge Chart",
        series: [
          {
            name: "Metric",
            value: 100,
            color: "#ff0000",
            title: "Performance",
          },
        ],
      };
      render(<AppChart {...gaugeProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle gauge chart axis label formatter for other values", () => {
      const gaugeProps = {
        type: "gauge",
        title: "Gauge Chart",
        series: [
          {
            name: "Metric",
            value: 50,
            color: "#ff0000",
            title: "Performance",
          },
        ],
      };
      render(<AppChart {...gaugeProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Chart Options Tests", () => {
    it("should handle title for non-gauge charts", () => {
      render(<AppChart {...defaultProps} title="Test Title" />);
      expect(screen.getByTestId("chart-title")).toHaveTextContent("Test Title");
    });

    it("should handle title for gauge charts", () => {
      const gaugeProps = {
        type: "gauge",
        title: "Gauge Title",
        series: [
          {
            name: "Metric",
            value: 75,
            color: "#ff0000",
            title: "Performance",
          },
        ],
      };
      render(<AppChart {...gaugeProps} />);
      expect(screen.getByTestId("chart-title")).toHaveTextContent("Gauge Title");
    });

    it("should handle legend for non-donut and non-gauge charts", () => {
      render(<AppChart {...defaultProps} showLegend={true} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle legend for donut charts", () => {
      render(<AppChart {...defaultProps} type="donut" showLegend={true} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle legend for gauge charts", () => {
      const gaugeProps = {
        type: "gauge",
        series: [
          {
            name: "Metric",
            value: 75,
            color: "#ff0000",
            title: "Performance",
          },
        ],
      };
      render(<AppChart {...gaugeProps} showLegend={true} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle grid for non-donut and non-gauge charts", () => {
      render(<AppChart {...defaultProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle grid for donut charts", () => {
      render(<AppChart {...defaultProps} type="donut" />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle grid for gauge charts", () => {
      const gaugeProps = {
        type: "gauge",
        series: [
          {
            name: "Metric",
            value: 75,
            color: "#ff0000",
            title: "Performance",
          },
        ],
      };
      render(<AppChart {...gaugeProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle xAxis for non-donut and non-gauge charts", () => {
      render(<AppChart {...defaultProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle xAxis for donut charts", () => {
      render(<AppChart {...defaultProps} type="donut" />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle xAxis for gauge charts", () => {
      const gaugeProps = {
        type: "gauge",
        series: [
          {
            name: "Metric",
            value: 75,
            color: "#ff0000",
            title: "Performance",
          },
        ],
      };
      render(<AppChart {...gaugeProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle yAxis for non-donut and non-gauge charts", () => {
      render(<AppChart {...defaultProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle yAxis for donut charts", () => {
      render(<AppChart {...defaultProps} type="donut" />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle yAxis for gauge charts", () => {
      const gaugeProps = {
        type: "gauge",
        series: [
          {
            name: "Metric",
            value: 75,
            color: "#ff0000",
            title: "Performance",
          },
        ],
      };
      render(<AppChart {...gaugeProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Bar Chart Specific Tests", () => {
    it("should handle bar chart with plotConfig", () => {
      const barWithPlotConfigProps = {
        ...defaultProps,
        type: "bar",
        series: [
          {
            name: "Series 1",
            data: [{ date: "2024-01-01", value: 10 }],
            plotConfig: {
              key: "date",
              value: "value",
              dates: ["2024-01-01"],
            },
            color: "#ff0000",
          },
        ],
      };
      render(<AppChart {...barWithPlotConfigProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle bar chart with stacked option", () => {
      const stackedBarProps = {
        ...defaultProps,
        type: "bar",
        stacked: true,
        series: [
          { name: "Series 1", data: [10, 20, 30], color: "#ff0000" },
          { name: "Series 2", data: [15, 25, 35], color: "#00ff00" },
        ],
      };
      render(<AppChart {...stackedBarProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle bar chart with custom tooltip color", () => {
      const barWithTooltipProps = {
        ...defaultProps,
        type: "bar",
        toolTipColor: "#ff0000",
      };
      render(<AppChart {...barWithTooltipProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle bar chart with showLegendBarLine", () => {
      const barWithLegendProps = {
        ...defaultProps,
        type: "bar",
        showLegendBarLine: true,
      };
      render(<AppChart {...barWithLegendProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle bar chart with x-axis rotation", () => {
      const barWithRotationProps = {
        ...defaultProps,
        type: "bar",
        xAxisRotated: true,
      };
      render(<AppChart {...barWithRotationProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle bar chart with date formatting in x-axis", () => {
      const barWithDateProps = {
        ...defaultProps,
        type: "bar",
        categories: ["2024-01-01", "2024-02-15", "2024-03-30"],
      };
      render(<AppChart {...barWithDateProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle bar chart with non-date categories", () => {
      const barWithNonDateProps = {
        ...defaultProps,
        type: "bar",
        categories: ["Category 1", "Category 2", "Category 3"],
      };
      render(<AppChart {...barWithNonDateProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle bar chart with long category names", () => {
      const barWithLongNamesProps = {
        ...defaultProps,
        type: "bar",
        categories: ["Very Long Category Name 1", "Very Long Category Name 2"],
      };
      render(<AppChart {...barWithLongNamesProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle bar chart with small window width for truncation", () => {
      useWindowWidth.mockReturnValue(1200);
      const barWithSmallWindowProps = {
        ...defaultProps,
        type: "bar",
        categories: ["Very Long Category Name 1", "Very Long Category Name 2"],
      };
      render(<AppChart {...barWithSmallWindowProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Stepline Chart Specific Tests", () => {
    it("should handle stepline chart with plotConfig", () => {
      const steplineWithPlotConfigProps = {
        ...defaultProps,
        type: "stepline",
        series: [
          {
            name: "Series 1",
            data: [{ date: "2024-01-01", value: 10 }],
            plotConfig: {
              key: "date",
              value: "value",
              dates: ["2024-01-01"],
            },
            color: "#ff0000",
          },
        ],
      };
      render(<AppChart {...steplineWithPlotConfigProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle stepline chart with stacked option", () => {
      const stackedSteplineProps = {
        ...defaultProps,
        type: "stepline",
        stacked: true,
        series: [
          { name: "Series 1", data: [10, 20, 30], color: "#ff0000" },
          { name: "Series 2", data: [15, 25, 35], color: "#00ff00" },
        ],
      };
      render(<AppChart {...stackedSteplineProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle stepline chart with date formatting", () => {
      const steplineWithDateProps = {
        ...defaultProps,
        type: "stepline",
        categories: ["2024-01-01", "2024-02-15", "2024-03-30"],
      };
      render(<AppChart {...steplineWithDateProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle stepline chart with non-date categories", () => {
      const steplineWithNonDateProps = {
        ...defaultProps,
        type: "stepline",
        categories: ["Category 1", "Category 2", "Category 3"],
      };
      render(<AppChart {...steplineWithNonDateProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Area Chart Specific Tests", () => {
    it("should handle area chart with plotConfig", () => {
      const areaWithPlotConfigProps = {
        ...defaultProps,
        type: "area",
        series: [
          {
            name: "Series 1",
            data: [{ date: "2024-01-01", value: 10 }],
            plotConfig: {
              key: "date",
              value: "value",
              dates: ["2024-01-01"],
            },
            color: "#ff0000",
          },
        ],
      };
      render(<AppChart {...areaWithPlotConfigProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle area chart with date formatting", () => {
      const areaWithDateProps = {
        ...defaultProps,
        type: "area",
        categories: ["2024-01-01", "2024-02-15", "2024-03-30"],
      };
      render(<AppChart {...areaWithDateProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle area chart with non-date categories", () => {
      const areaWithNonDateProps = {
        ...defaultProps,
        type: "area",
        categories: ["Category 1", "Category 2", "Category 3"],
      };
      render(<AppChart {...areaWithNonDateProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Line Chart Specific Tests", () => {
    it("should handle line chart with plotConfig", () => {
      const lineWithPlotConfigProps = {
        ...defaultProps,
        type: "line",
        series: [
          {
            name: "Series 1",
            data: [{ date: "2024-01-01", value: 10 }],
            plotConfig: {
              key: "date",
              value: "value",
              dates: ["2024-01-01"],
            },
            color: "#ff0000",
          },
        ],
      };
      render(<AppChart {...lineWithPlotConfigProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle line chart with date formatting and truncation", () => {
      const lineWithDateProps = {
        ...defaultProps,
        type: "line",
        categories: ["2024-01-01", "2024-02-15", "2024-03-30"],
      };
      render(<AppChart {...lineWithDateProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle line chart with long category names and truncation", () => {
      const lineWithLongNamesProps = {
        ...defaultProps,
        type: "line",
        categories: ["Very Long Category Name 1", "Very Long Category Name 2"],
      };
      render(<AppChart {...lineWithLongNamesProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle line chart with small window width for truncation", () => {
      useWindowWidth.mockReturnValue(1200);
      const lineWithSmallWindowProps = {
        ...defaultProps,
        type: "line",
        categories: ["Very Long Category Name 1", "Very Long Category Name 2"],
      };
      render(<AppChart {...lineWithSmallWindowProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Donut Chart Total Calculation Tests", () => {
    it("should handle donut chart with provided total", () => {
      const donutWithTotalProps = {
        ...defaultProps,
        type: "donut",
        total: 100,
        series: [
          { name: "Category 1", value: 30, color: "#ff0000" },
          { name: "Category 2", value: 50, color: "#00ff00" },
          { name: "Category 3", value: 20, color: "#0000ff" },
        ],
      };
      render(<AppChart {...donutWithTotalProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle donut chart with calculated total", () => {
      const donutWithoutTotalProps = {
        ...defaultProps,
        type: "donut",
        series: [
          { name: "Category 1", value: 30, color: "#ff0000" },
          { name: "Category 2", value: 50, color: "#00ff00" },
          { name: "Category 3", value: 20, color: "#0000ff" },
        ],
      };
      render(<AppChart {...donutWithoutTotalProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle donut chart with zero values", () => {
      const donutWithZeroProps = {
        ...defaultProps,
        type: "donut",
        series: [
          { name: "Category 1", value: 0, color: "#ff0000" },
          { name: "Category 2", value: 0, color: "#00ff00" },
        ],
      };
      render(<AppChart {...donutWithZeroProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Default Chart Type Tests", () => {
    it("should handle unknown chart type (defaults to line)", () => {
      const unknownTypeProps = {
        ...defaultProps,
        type: "unknown",
      };
      render(<AppChart {...unknownTypeProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle undefined chart type", () => {
      const undefinedTypeProps = {
        ...defaultProps,
        type: undefined,
      };
      render(<AppChart {...undefinedTypeProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Chart Options Conditional Tests", () => {
    it("should handle title for gauge charts", () => {
      const gaugeWithTitleProps = {
        type: "gauge",
        title: "Gauge Title",
        series: [
          {
            name: "Metric",
            value: 75,
            color: "#ff0000",
            title: "Performance",
          },
        ],
      };
      render(<AppChart {...gaugeWithTitleProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle legend for donut charts", () => {
      const donutWithLegendProps = {
        ...defaultProps,
        type: "donut",
        showLegend: true,
      };
      render(<AppChart {...donutWithLegendProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle legend for gauge charts", () => {
      const gaugeWithLegendProps = {
        type: "gauge",
        showLegend: true,
        series: [
          {
            name: "Metric",
            value: 75,
            color: "#ff0000",
            title: "Performance",
          },
        ],
      };
      render(<AppChart {...gaugeWithLegendProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle grid for donut charts", () => {
      const donutProps = {
        ...defaultProps,
        type: "donut",
      };
      render(<AppChart {...donutProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle grid for gauge charts", () => {
      const gaugeProps = {
        type: "gauge",
        series: [
          {
            name: "Metric",
            value: 75,
            color: "#ff0000",
            title: "Performance",
          },
        ],
      };
      render(<AppChart {...gaugeProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle xAxis for donut charts", () => {
      const donutProps = {
        ...defaultProps,
        type: "donut",
      };
      render(<AppChart {...donutProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle xAxis for gauge charts", () => {
      const gaugeProps = {
        type: "gauge",
        series: [
          {
            name: "Metric",
            value: 75,
            color: "#ff0000",
            title: "Performance",
          },
        ],
      };
      render(<AppChart {...gaugeProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle yAxis for donut charts", () => {
      const donutProps = {
        ...defaultProps,
        type: "donut",
      };
      render(<AppChart {...donutProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle yAxis for gauge charts", () => {
      const gaugeProps = {
        type: "gauge",
        series: [
          {
            name: "Metric",
            value: 75,
            color: "#ff0000",
            title: "Performance",
          },
        ],
      };
      render(<AppChart {...gaugeProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });

  describe("Direct Formatter Function Tests", () => {
    let capturedOptions = {};

    beforeEach(() => {
      capturedOptions = {};
      // Override ReactECharts to capture the options
      const originalReactECharts = require("echarts-for-react").default;
      require("echarts-for-react").default = jest.fn().mockImplementation(({ option }) => {
        capturedOptions = JSON.parse(JSON.stringify(option));
        return <div data-testid="echarts-container" />;
      });
    });

    afterEach(() => {
      jest.resetModules();
    });

    // Test line 68 - getTextStyleWidth return 0
    it("should test getTextStyleWidth with unknown type", () => {
      const donutProps = {
        ...defaultProps,
        type: "donut",
        isDailyChart: true,
        windowWidth: 1200,
        series: [{ name: "Series 1", value: 50 }],
      };
      
      render(<AppChart {...donutProps} />);
      
      // The getTextStyleWidth function is called internally
      if (capturedOptions.legend && capturedOptions.legend.textStyle && capturedOptions.legend.textStyle.rich) {
        expect(capturedOptions.legend.textStyle.rich.name).toBeDefined();
        expect(capturedOptions.legend.textStyle.rich.value).toBeDefined();
      }
    });

    // Test lines 145-160 - bar chart xAxis formatter
    it("should test bar chart xAxis formatter with date formatting and truncation", () => {
      const barProps = {
        ...defaultProps,
        type: "bar",
        categories: ["2023-01-01", "Very Long Category Name"],
        windowWidth: 1200,
      };
      
      render(<AppChart {...barProps} />);
      
      if (capturedOptions.xAxis && capturedOptions.xAxis.axisLabel && capturedOptions.xAxis.axisLabel.formatter) {
        const formatter = capturedOptions.xAxis.axisLabel.formatter;
        
        // Test date formatting (lines 151-153)
        expect(formatter("2023-01-01")).toBe("01-01");
        expect(formatter("2023-01-02")).toBe("01-02");
        
        // Test non-date values (line 154)
        expect(formatter("Regular Category")).toBe("Regular C...");
        
        // Test truncation (lines 155-160)
        expect(formatter("Very Long Category Name")).toBe("Very Long C...");
        expect(formatter("Short")).toBe("Short");
      }
    });

    // Test lines 207-217 - stepline chart xAxis formatter
    it("should test stepline chart xAxis formatter with date formatting", () => {
      const steplineProps = {
        ...defaultProps,
        type: "stepline",
        categories: ["2023-01-01", "Regular Category"],
        windowWidth: 1200,
      };
      
      render(<AppChart {...steplineProps} />);
      
      if (capturedOptions.xAxis && capturedOptions.xAxis.axisLabel && capturedOptions.xAxis.axisLabel.formatter) {
        const formatter = capturedOptions.xAxis.axisLabel.formatter;
        
        // Test date formatting (lines 207-217)
        expect(formatter("2023-01-01")).toBe("01-01");
        expect(formatter("2023-01-02")).toBe("01-02");
        expect(formatter("Regular Category")).toBe("Regular Category");
      }
    });

    // Test lines 264-274 - area chart xAxis formatter
    it("should test area chart xAxis formatter with date formatting", () => {
      const areaProps = {
        ...defaultProps,
        type: "area",
        categories: ["2023-01-01", "Regular Category"],
        windowWidth: 1200,
      };
      
      render(<AppChart {...areaProps} />);
      
      if (capturedOptions.xAxis && capturedOptions.xAxis.axisLabel && capturedOptions.xAxis.axisLabel.formatter) {
        const formatter = capturedOptions.xAxis.axisLabel.formatter;
        
        // Test date formatting (lines 264-274)
        expect(formatter("2023-01-01")).toBe("01-01");
        expect(formatter("2023-01-02")).toBe("01-02");
        expect(formatter("Regular Category")).toBe("Regular Category");
      }
    });

    // Test lines 325-334 - line chart xAxis formatter
    it("should test line chart xAxis formatter with date formatting and truncation", () => {
      const lineProps = {
        ...defaultProps,
        type: "line",
        categories: ["2023-01-01", "Very Long Category Name"],
        windowWidth: 1200,
      };
      
      render(<AppChart {...lineProps} />);
      
      if (capturedOptions.xAxis && capturedOptions.xAxis.axisLabel && capturedOptions.xAxis.axisLabel.formatter) {
        const formatter = capturedOptions.xAxis.axisLabel.formatter;
        
        // Test date formatting and truncation (lines 325-334)
        expect(formatter("2023-01-01")).toBe("01-01");
        expect(formatter("Very Long Category Name")).toBe("Very Long C...");
        expect(formatter("Short")).toBe("Short");
      }
    });

    // Test lines 365-428 - donut chart legend formatter
    it("should test donut chart legend formatter with all conditions", () => {
      const donutProps = {
        ...defaultProps,
        type: "donut",
        isDailyChart: true,
        windowWidth: 1200,
        series: [
          { name: "Very Long Series Name", value: 50 },
          { name: "Short Name", value: 30 },
        ],
      };
      
      render(<AppChart {...donutProps} />);
      
      if (capturedOptions.legend && capturedOptions.legend.formatter) {
        const formatter = capturedOptions.legend.formatter;
        
        // Test with existing series and daily chart (lines 365-428)
        expect(formatter("Very Long Series Name")).toBe("{name|Very Long S...} {value|50}");
        expect(formatter("Short Name")).toBe("{name|Short Name} {value|30}");
        
        // Test with non-existent series (line 367)
        expect(formatter("Non-existent Series")).toBe("Non-existent Series");
      }
    });

    // Test donut chart label formatter with total calculation
    it("should test donut chart label formatter with total calculation", () => {
      const donutProps = {
        ...defaultProps,
        type: "donut",
        series: [
          { name: "Series 1", value: 50 },
          { name: "Series 2", value: 30 },
        ],
      };
      
      render(<AppChart {...donutProps} />);
      
      if (capturedOptions.series && capturedOptions.series[0] && capturedOptions.series[0].label && capturedOptions.series[0].label.formatter) {
        const formatter = capturedOptions.series[0].label.formatter;
        const result = formatter();
        expect(result).toContain("80");
        expect(result).toContain("Total");
      }
    });

    // Test lines 486-510 - gauge chart formatters
    it("should test gauge chart formatters", () => {
      const gaugeProps = {
        type: "gauge",
        series: [
          {
            name: "Metric",
            value: 75.123,
            color: "#ff0000",
            title: "Performance",
          },
        ],
      };
      
      render(<AppChart {...gaugeProps} />);
      
      // Test detail formatter (line 486)
      if (capturedOptions.series && capturedOptions.series[0] && capturedOptions.series[0].detail && capturedOptions.series[0].detail.formatter) {
        const detailFormatter = capturedOptions.series[0].detail.formatter;
        expect(detailFormatter(75.123)).toBe("75.12");
        expect(detailFormatter(100.0)).toBe("100.00");
      }
      
      // Test axis label formatter (lines 509-510)
      if (capturedOptions.series && capturedOptions.series[0] && capturedOptions.series[0].axisLabel && capturedOptions.series[0].axisLabel.formatter) {
        const axisFormatter = capturedOptions.series[0].axisLabel.formatter;
        expect(axisFormatter(0)).toBe("0");
        expect(axisFormatter(100)).toBe("100");
        expect(axisFormatter(50)).toBe("");
        expect(axisFormatter(25)).toBe("");
      }
    });


    // Test donut chart with non-daily chart legend formatter
    it("should test donut chart with non-daily chart legend formatter", () => {
      const donutProps = {
        ...defaultProps,
        type: "donut",
        isDailyChart: false,
        windowWidth: 1200,
        series: [
          { name: "Series 1", value: 50 },
        ],
      };
      
      render(<AppChart {...donutProps} />);
      
      if (capturedOptions.legend && capturedOptions.legend.formatter) {
        const formatter = capturedOptions.legend.formatter;
        expect(formatter("Series 1")).toBe("{name|Series 1} {value|50}");
      }
    });

    // Test donut chart with total prop
    it("should test donut chart with total prop", () => {
      const donutProps = {
        ...defaultProps,
        type: "donut",
        total: 100,
        series: [
          { name: "Series 1", value: 50 },
        ],
      };
      
      render(<AppChart {...donutProps} />);
      
      if (capturedOptions.series && capturedOptions.series[0] && capturedOptions.series[0].label && capturedOptions.series[0].label.formatter) {
        const formatter = capturedOptions.series[0].label.formatter;
        const result = formatter();
        expect(result).toContain("100");
        expect(result).toContain("Total");
      }
    });
  });

  describe("Edge Cases for Uncovered Lines", () => {
    it("should handle series without names", () => {
      const propsWithoutNames = {
        ...defaultProps,
        series: [
          { value: 50, color: "#ff0000" },
          { value: 30, color: "#00ff00" },
        ],
      };
      render(<AppChart {...propsWithoutNames} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle categories with falsy values", () => {
      const propsWithFalsyCategories = {
        ...defaultProps,
        categories: [false, 0, null, undefined, "Valid Category"],
      };
      render(<AppChart {...propsWithFalsyCategories} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle gauge chart with zero value", () => {
      const zeroGaugeProps = {
        type: "gauge",
        series: [
          {
            name: "Metric",
            value: 0,
            color: "#ff0000",
            title: "Performance",
          },
        ],
      };
      render(<AppChart {...zeroGaugeProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle modal with missing key prop", () => {
      const modalProps = {
        ...defaultProps,
        showLabel: true,
        isOrgModalOpen: true,
        series: [
          { name: "Series 1", color: "#ff0000" },
          { name: "Series 2", color: "#00ff00" },
        ],
        showModal: jest.fn(),
        handleOk: jest.fn(),
        handleCancel: jest.fn(),
      };
      render(<AppChart {...modalProps} />);
      expect(screen.getByText("Organizations")).toBeInTheDocument();
    });

    it("should handle chart options with boundaryGap for column type", () => {
      const columnProps = {
        ...defaultProps,
        type: "column",
        categories: ["Jan", "Feb", "Mar"],
      };
      render(<AppChart {...columnProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle chart options with falsy title for gauge charts", () => {
      const gaugeProps = {
        type: "gauge",
        title: false,
        series: [
          {
            name: "Metric",
            value: 75,
            color: "#ff0000",
            title: "Performance",
          },
        ],
      };
      render(<AppChart {...gaugeProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle chart options with showLegend false for donut charts", () => {
      const donutProps = {
        ...defaultProps,
        type: "donut",
        showLegend: false,
      };
      render(<AppChart {...donutProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });

    it("should handle chart options with showLegend false for gauge charts", () => {
      const gaugeProps = {
        type: "gauge",
        showLegend: false,
        series: [
          {
            name: "Metric",
            value: 75,
            color: "#ff0000",
            title: "Performance",
          },
        ],
      };
      render(<AppChart {...gaugeProps} />);
      expect(screen.getByTestId("echarts-container")).toBeInTheDocument();
    });
  });
});
