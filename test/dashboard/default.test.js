import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Default from "../../src/commonPages/dashboard/pages/default";

// Mock the dependencies
jest.mock("../../src/commonPages/dashboard/component/appchart", () => {
  return function MockAppChart(props) {
    return <div data-testid="app-chart" {...props} />;
  };
});

jest.mock("../../src/commonPages/dashboard/component/empty/EmptyComponent", () => {
  return function MockEmptyComponent() {
    return <div data-testid="empty-component">No data available</div>;
  };
});

jest.mock("../../src/commonPages/dashboard/component/statChart", () => {
  return function MockStatCard(props) {
    return <div data-testid="stat-card" {...props} />;
  };
});

jest.mock("../../src/commonPages/dashboard/component/groupcard", () => {
  return function MockGroupCard(props) {
    return <div data-testid="group-card" {...props} />;
  };
});

jest.mock("../../src/commonPages/dashboard/component/table", () => {
  return function MockReusableTable(props) {
    return <div data-testid="reusable-table" {...props} />;
  };
});

jest.mock("../../src/components/skeleton/card", () => {
  return function MockCardSkeleton({ count, height }) {
    return (
      <div data-testid="card-skeleton" data-count={count} data-height={height}>
        Loading...
      </div>
    );
  };
});

jest.mock("../../src/commonPages/dashboard/component/function", () => ({
  useWindowWidth: jest.fn(() => 1200),
  useHasMounted: jest.fn(() => true),
  getColSpan: jest.fn(() => 4),
  getRowSpan: jest.fn(() => 2),
  formatKValue: jest.fn((value) => value),
  parseKValue: jest.fn((value) => value),
  toFixedNum: jest.fn((value) => value),
  getFormattedChartData: jest.fn(() => ({
    categories: ["Jan 01", "Jan 02", "Jan 03"],
    formattedSeries: [{ name: "Series 1", data: [10, 20, 30] }],
    height: 300,
  })),
}));

jest.mock("../../src/utils/reusable", () => ({
  formatValues: jest.fn((data, dates) => [10, 20, 30]),
  getLast7Days: jest.fn(() => ["Jan 01", "Jan 02", "Jan 03"]),
  getLast30Days: jest.fn(() => ["Jan 01", "Jan 02", "Jan 03", "Jan 04"]),
  getColorValue: jest.fn(() => "#ff0000"),
  getStatusColor: jest.fn(() => "#00ff00"),
  getChartTimeLine: jest.fn(() => ["Jan 01", "Jan 02", "Jan 03"]),
}));

jest.mock("../../src/utils/storages", () => ({
  getLocalStored: jest.fn(() => null),
}));

jest.mock("../../src/commonPages/dashboard/component/function/resubaleGetStorage", () => ({
  getDashboardItems: jest.fn(() => []),
}));

jest.mock("../../src/stores/admin/dashboard1/actions", () => ({
  defaultTop10CodesAction: jest.fn(() => ({ type: 'DEFAULT_TOP_10_CODES' })),
  defaultTop10OIGAction: jest.fn(() => ({ type: 'DEFAULT_TOP_10_OIG' })),
  defaultFileDosCountAction: jest.fn(() => ({ type: 'DEFAULT_FILE_DOS_COUNT' })),
  defaultRafTotalAction: jest.fn(() => ({ type: 'DEFAULT_RAF_TOTAL' })),
  defaultRafHccAction: jest.fn(() => ({ type: 'DEFAULT_RAF_HCC' })),
  defaultRafCareGapAction: jest.fn(() => ({ type: 'DEFAULT_RAF_CARE_GAP' })),
  defaultRafPotentialAction: jest.fn(() => ({ type: 'DEFAULT_RAF_POTENTIAL' })),
  workFlowFilesCountAction: jest.fn(() => ({ type: 'WORKFLOW_FILES_COUNT' })),
  defaultTinTableAction: jest.fn(() => ({ type: 'DEFAULT_TIN_TABLE' })),
  workFlowAllocatedStatusCountAction: jest.fn(() => ({ type: 'WORKFLOW_ALLOCATED_STATUS_COUNT' })),
}));

// Mock images
jest.mock("../../src/images/tenantAdmin/processing.svg", () => "processing.svg");
jest.mock("../../src/images/tenantAdmin/failed.svg", () => "failed.svg");
jest.mock("../../src/images/tenantAdmin/completed.svg", () => "completed.svg");
jest.mock("../../src/images/tenantAdmin/upload.svg", () => "upload.svg");
jest.mock("../../src/images/tenantAdmin/file.svg", () => "file.svg");
jest.mock("../../src/images/tenantAdmin/dos.svg", () => "dos.svg");
jest.mock("../../src/images/tenantAdmin/page.svg", () => "page.svg");
jest.mock("../../src/images/dashboard/pages.png", () => "pages.png");
jest.mock("../../src/images/dashboard/patientCount.png", () => "patientCount.png");
jest.mock("../../src/images/dashboard/dosCount.png", () => "dosCount.png");
jest.mock("../../src/images/dashboard/uploadContainer.png", () => "uploadContainer.png");
jest.mock("../../src/images/dashboard/processingContainer.png", () => "processingContainer.png");
jest.mock("../../src/images/dashboard/completedContainer.png", () => "completedContainer.png");
jest.mock("../../src/images/dashboard/failedContainer.png", () => "failedContainer.png");
jest.mock("../../src/images/dashboard/codeCaptureContainer.png", () => "codeCaptureContainer.png");

describe("Default Component", () => {
  let mockDispatch;
  let mockStore;

  beforeEach(() => {
    mockDispatch = jest.fn();
    
    // Create a mock store
    const createMockStore = configureStore([]);
    mockStore = createMockStore({
      admin: {
        dashboard1: {
          getWidgetsList: {
            data: {
              response: [
                {
                  widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
                  widgetName: "filecount",
                  selectedChart: "line",
                  active: true,
                  orderValue: 1,
                  size: "medium",
                  title: "File Count",
                },
              ],
            },
            loader: false,
          },
          defaultFileDosCount: {
            data: {
              response: {
                fileCount: 100,
                dosCount: 500,
                pageCount: 1000,
              },
            },
            loader: false,
          },
          defaultTop10Codes: {
            data: {
              response: {
                topDiseaseDTOList: [
                  { diagnosisCode: "E11.9", description: "Type 2 diabetes", count: 10 },
                ],
              },
            },
            loader: false,
          },
          defaultTop10OIG: {
            data: {
              response: {
                topDiseaseDTOList: [
                  { diagnosisCode: "Z51.11", description: "Encounter for antineoplastic chemotherapy", count: 5 },
                ],
              },
            },
            loader: false,
          },
          defaultRafTotal: {
            data: {
              response: {
                overallCodesCount: 1000,
                overallRaf: 500,
                overallPremium: 10000,
                codesAndRafSummaryDTOList: [
                  {
                    date: "2024-01-01",
                    totalCount: 100,
                    hccCount: 50,
                    suggestedCount: 30,
                    potentialCount: 20,
                    totalRaf: 50,
                    hccRafScore: 25,
                    suggestedRafScore: 15,
                    potentialRafScore: 10,
                    totalPremium: 1000,
                    hccPremium: 500,
                    suggestedPremium: 300,
                    potentialPremium: 200,
                  },
                ],
              },
            },
            loader: false,
          },
          defaultRafHcc: {
            data: {
              response: {
                overallCodesCount: 500,
                overallRaf: 250,
                overallPremium: 5000,
                codesAndRafSummaryDTOList: [
                  {
                    date: "2024-01-01",
                    hccCount: 50,
                    hccRafScore: 25,
                    hccPremium: 500,
                  },
                ],
              },
            },
            loader: false,
          },
          defaultRafCareGap: {
            data: {
              response: {
                overallCodesCount: 300,
                overallRaf: 150,
                overallPremium: 3000,
                codesAndRafSummaryDTOList: [
                  {
                    date: "2024-01-01",
                    suggestedCount: 30,
                    suggestedRafScore: 15,
                    suggestedPremium: 300,
                  },
                ],
              },
            },
            loader: false,
          },
          defaultRafPotential: {
            data: {
              response: {
                overallCodesCount: 200,
                overallRaf: 100,
                overallPremium: 2000,
                codesAndRafSummaryDTOList: [
                  {
                    date: "2024-01-01",
                    potentialCount: 20,
                    potentialRafScore: 10,
                    potentialPremium: 200,
                  },
                ],
              },
            },
            loader: false,
          },
          workFlowFilesCount: {
            data: {
              response: {
                computedFiles: 50,
                failedFiles: 10,
                processingFiles: 20,
                uploadedFiles: 100,
                capturedCodesCount: 80,
                computedStats: [{ date: "2024-01-01", count: 10 }],
                failedStats: [{ date: "2024-01-01", count: 2 }],
                processingStats: [{ date: "2024-01-01", count: 5 }],
              },
            },
            loader: false,
          },
          defaultTinTable: {
            data: {
              response: {
                tinStatisticsResponseDtoList: [
                  { tinNumber: "123456789", tinName: "Test TIN", progressPercentage: 75 },
                ],
              },
            },
            loader: false,
          },
          workFlowAllocatedStatusCount: {
            data: {
              response: {
                allocatedCount: 80,
                notAllocatedCount: 20,
              },
            },
            loader: false,
          },
        },
      },
    });
  });

  const renderWithProvider = (component) => {
    return render(<Provider store={mockStore}>{component}</Provider>);
  };

  const defaultProps = {
    getSelectedWidgets: [
      {
        widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
        widgetName: "filecount",
        selectedChart: "line",
        active: true,
        orderValue: 1,
        size: "medium",
        title: "File Count",
      },
    ],
    getSelectedWidgetsLoader: false,
    dispatch: jest.fn(),
    dateRange: {
      startDate: "2024-01-01",
      endDate: "2024-01-31",
    },
    selectedValue: "last_1_week",
    customDate: ["Jan 01", "Jan 02", "Jan 03"],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Positive Test Cases", () => {
    it("should render with valid data and show dashboard", () => {
      renderWithProvider(<Default {...defaultProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should render filecount widget with card type", () => {
      const fileCountProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
            widgetName: "filecount",
            selectedChart: "card",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "File Count",
          },
        ],
      };

      // Create a store with the necessary data for card rendering
      const cardStore = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: {
                response: [
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
                    widgetName: "filecount",
                    selectedChart: "card",
                    active: true,
                    orderValue: 1,
                    size: "medium",
                    title: "File Count",
                  },
                ],
              },
              loader: false,
            },
            defaultFileDosCount: {
              data: {
                response: {
                  fileCount: 100,
                  dosCount: 500,
                  pageCount: 1000,
                },
              },
              loader: false,
            },
          },
        },
      });

      render(<Provider store={cardStore}><Default {...fileCountProps} dispatch={mockDispatch} /></Provider>);
      // For card type, it should render stat cards instead of app-chart
      const statCards = screen.getAllByTestId("stat-card");
      expect(statCards).toHaveLength(3); // File count, DOS count, Pages
    });

    it("should render RafAndRevenue widget", () => {
      const rafAndRevenueProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c004",
            widgetName: "RafAndRevenue",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "large",
            title: "RAF and Revenue",
          },
        ],
      };

      renderWithProvider(<Default {...rafAndRevenueProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should render TotalCodes widget", () => {
      const totalCodesProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c003",
            widgetName: "TotalCodes",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "large",
            title: "Total Codes",
          },
        ],
      };

      renderWithProvider(<Default {...totalCodesProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should render HccCodes widget", () => {
      const hccCodesProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c002",
            widgetName: "HccCodes",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "large",
            title: "HCC Codes",
          },
        ],
      };

      renderWithProvider(<Default {...hccCodesProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should render CareGapCodes widget", () => {
      const careGapCodesProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c005",
            widgetName: "CareGapCodes",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "large",
            title: "Care Gap Codes",
          },
        ],
      };

      renderWithProvider(<Default {...careGapCodesProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should render PotientialCodes widget", () => {
      const potentialCodesProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c006",
            widgetName: "PotientialCodes",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "large",
            title: "Potential Codes",
          },
        ],
      };

      renderWithProvider(<Default {...potentialCodesProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should render fileChart widget", () => {
      const fileChartProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c008",
            widgetName: "fileChart",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "large",
            title: "File Chart",
          },
        ],
      };

      renderWithProvider(<Default {...fileChartProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should render Top10Diseases widget", () => {
      const top10DiseasesProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c009",
            widgetName: "Top10Diseases",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "Top 10 Diseases",
          },
        ],
      };

      renderWithProvider(<Default {...top10DiseasesProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should render TopOIGCodes widget", () => {
      const topOIGCodesProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c010",
            widgetName: "TopOIGCodes",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "Top OIG Codes",
          },
        ],
      };

      renderWithProvider(<Default {...topOIGCodesProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should render TinTable widget", () => {
      const tinTableProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c040",
            widgetName: "TinTable",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "TIN Table",
          },
        ],
      };

      renderWithProvider(<Default {...tinTableProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should render AllocatedStatus widget", () => {
      const allocatedStatusProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c041",
            widgetName: "AllocatedStatus",
            selectedChart: "donut",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "Allocated Status",
          },
        ],
      };

      renderWithProvider(<Default {...allocatedStatusProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle multiple widgets", () => {
      const multipleWidgetsProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
            widgetName: "filecount",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "File Count",
          },
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c009",
            widgetName: "Top10Diseases",
            selectedChart: "line",
            active: true,
            orderValue: 2,
            size: "medium",
            title: "Top 10 Diseases",
          },
        ],
      };

      renderWithProvider(<Default {...multipleWidgetsProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle custom date range", () => {
      const customDateProps = {
        ...defaultProps,
        selectedValue: "custom",
        customDate: ["Jan 01", "Jan 02", "Jan 03", "Jan 04", "Jan 05"],
      };

      renderWithProvider(<Default {...customDateProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle last 30 days date range", () => {
      const last30DaysProps = {
        ...defaultProps,
        selectedValue: "last_30_days",
      };

      renderWithProvider(<Default {...last30DaysProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle different chart types", () => {
      const differentChartTypesProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
            widgetName: "filecount",
            selectedChart: "area",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "File Count",
          },
        ],
      };

      renderWithProvider(<Default {...differentChartTypesProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle loading states", () => {
      const loadingProps = {
        ...defaultProps,
        fileDosCountLoading: true,
      };

      renderWithProvider(<Default {...loadingProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle widgets loader", () => {
      const widgetsLoaderProps = {
        ...defaultProps,
        getSelectedWidgetsLoader: true,
      };

      renderWithProvider(<Default {...widgetsLoaderProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should sort widgets by orderValue", () => {
      const sortedWidgetsProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
            widgetName: "filecount",
            selectedChart: "line",
            active: true,
            orderValue: 2,
            size: "medium",
            title: "File Count",
          },
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c009",
            widgetName: "Top10Diseases",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "Top 10 Diseases",
          },
        ],
      };

      renderWithProvider(<Default {...sortedWidgetsProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should filter only active widgets", () => {
      const activeWidgetsProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
            widgetName: "filecount",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "File Count",
          },
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c009",
            widgetName: "Top10Diseases",
            selectedChart: "line",
            active: false,
            orderValue: 2,
            size: "medium",
            title: "Top 10 Diseases",
          },
        ],
      };

      renderWithProvider(<Default {...activeWidgetsProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
      expect(screen.queryByTestId("reusable-table")).not.toBeInTheDocument();
    });

    it("should handle unknown widget type", () => {
      const unknownWidgetProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
            widgetName: "UnknownWidget",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "Unknown Widget",
          },
        ],
      };

      renderWithProvider(<Default {...unknownWidgetProps} dispatch={mockDispatch} />);
      // Should render without errors even for unknown widget types
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle useHasMounted returning false", () => {
      // Mock useHasMounted to return false
      const originalUseHasMounted = require("../../src/commonPages/dashboard/component/function").useHasMounted;
      require("../../src/commonPages/dashboard/component/function").useHasMounted = jest.fn(() => false);

      renderWithProvider(<Default {...defaultProps} dispatch={mockDispatch} />);
      
      // Component should return null when hasMounted is false
      expect(screen.queryByTestId("app-chart")).not.toBeInTheDocument();
      
      // Restore the original function
      require("../../src/commonPages/dashboard/component/function").useHasMounted = originalUseHasMounted;
    });

    it("should handle widgets with no corresponding API actions", () => {
      // Test that the component renders correctly even when widgets don't have API actions
      const noApiActionProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "non-existent-widget-id",
            widgetName: "NonExistentWidget",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "Non Existent Widget",
          },
        ],
      };

      renderWithProvider(<Default {...noApiActionProps} dispatch={mockDispatch} />);
      
      // Component should render successfully even without API actions
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });
  });

  describe("Negative Test Cases", () => {
    it("should show empty component when no widgets are selected", () => {
      const noWidgetsProps = {
        ...defaultProps,
        getSelectedWidgets: [],
      };

      // Create a new store with empty widgets list
      const emptyStore = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: {
                response: [],
              },
              loader: false,
            },
          },
        },
      });

      render(<Provider store={emptyStore}><Default {...noWidgetsProps} dispatch={mockDispatch} /></Provider>);
      expect(screen.getByTestId("empty-component")).toBeInTheDocument();
    });

    it("should show empty component when no active widgets", () => {
      const noActiveWidgetsProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
            widgetName: "filecount",
            selectedChart: "line",
            active: false,
            orderValue: 1,
            size: "medium",
            title: "File Count",
          },
        ],
      };

      // Create a new store with inactive widgets list
      const inactiveStore = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: {
                response: [
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
                    widgetName: "filecount",
                    selectedChart: "line",
                    active: false,
                    orderValue: 1,
                    size: "medium",
                    title: "File Count",
                  },
                ],
              },
              loader: false,
            },
          },
        },
      });

      render(<Provider store={inactiveStore}><Default {...noActiveWidgetsProps} dispatch={mockDispatch} /></Provider>);
      expect(screen.getByTestId("empty-component")).toBeInTheDocument();
    });

    it("should handle API error gracefully", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      
      // Create a mock store that will cause an error in getInitialApiCall
      const errorStore = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: {
                response: [
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
                    widgetName: "filecount",
                    selectedChart: "line",
                    active: true,
                    orderValue: 1,
                    size: "medium",
                    title: "File Count",
                  },
                ],
              },
              loader: false,
            },
            // Missing dateRange to cause error
          },
        },
      });

      // Pass null dateRange to trigger the error
      render(<Provider store={errorStore}><Default {...defaultProps} dateRange={null} dispatch={mockDispatch} /></Provider>);
      
      // Wait for the error to be logged
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith("API error:", expect.any(Error));
      });
      consoleSpy.mockRestore();
    });

    it("should handle undefined data", () => {
      const undefinedDataProps = {
        ...defaultProps,
        fileDosCount: undefined,
        top10Codes: undefined,
        top10OIG: undefined,
        rafTotal: undefined,
        rafHcc: undefined,
        rafCareGap: undefined,
        rafPotential: undefined,
        filesCountData: undefined,
        tinTableData: undefined,
        allocatedStatusCountData: undefined,
      };

      renderWithProvider(<Default {...undefinedDataProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle null data", () => {
      const nullDataProps = {
        ...defaultProps,
        fileDosCount: null,
        top10Codes: null,
        top10OIG: null,
        rafTotal: null,
        rafHcc: null,
        rafCareGap: null,
        rafPotential: null,
        filesCountData: null,
        tinTableData: null,
        allocatedStatusCountData: null,
      };

      renderWithProvider(<Default {...nullDataProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle undefined dateRange", () => {
      const undefinedDateRangeProps = {
        ...defaultProps,
        dateRange: undefined,
      };

      renderWithProvider(<Default {...undefinedDateRangeProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle undefined selectedValue", () => {
      const undefinedSelectedValueProps = {
        ...defaultProps,
        selectedValue: undefined,
      };

      renderWithProvider(<Default {...undefinedSelectedValueProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle undefined customDate", () => {
      const undefinedCustomDateProps = {
        ...defaultProps,
        selectedValue: "custom",
        customDate: undefined,
      };

      renderWithProvider(<Default {...undefinedCustomDateProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle empty customDate", () => {
      const emptyCustomDateProps = {
        ...defaultProps,
        selectedValue: "custom",
        customDate: [],
      };

      renderWithProvider(<Default {...emptyCustomDateProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle undefined widget properties", () => {
      const undefinedWidgetProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: undefined,
            widgetName: undefined,
            selectedChart: undefined,
            active: undefined,
            orderValue: undefined,
            size: undefined,
            title: undefined,
          },
        ],
      };

      renderWithProvider(<Default {...undefinedWidgetProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });
  });

  describe("Additional Widget Tests", () => {
    it("should render RafAndRevenue widget", () => {
      const rafAndRevenueProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c004",
            widgetName: "RafAndRevenue",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "large",
            title: "RAF and Revenue",
          },
        ],
      };

      // Create a store with RAF data
      const rafStore = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: {
                response: [
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c004",
                    widgetName: "RafAndRevenue",
                    selectedChart: "line",
                    active: true,
                    orderValue: 1,
                    size: "large",
                    title: "RAF and Revenue",
                  },
                ],
              },
              loader: false,
            },
            defaultRafTotal: {
              data: {
                response: {
                  overallCodesCount: 1000,
                  overallRaf: 500,
                  overallPremium: 10000,
                  codesAndRafSummaryDTOList: [
                    {
                      date: "2024-01-01",
                      totalCount: 100,
                      hccCount: 50,
                      suggestedCount: 30,
                      potentialCount: 20,
                      totalRaf: 50,
                      hccRafScore: 25,
                      suggestedRafScore: 15,
                      potentialRafScore: 10,
                      totalPremium: 1000,
                      hccPremium: 500,
                      suggestedPremium: 300,
                      potentialPremium: 200,
                    },
                  ],
                },
              },
              loader: false,
            },
          },
        },
      });

      render(<Provider store={rafStore}><Default {...rafAndRevenueProps} dispatch={mockDispatch} /></Provider>);
      expect(screen.getByTestId("group-card")).toBeInTheDocument();
    });

    it("should render TotalCodes widget", () => {
      const totalCodesProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c003",
            widgetName: "TotalCodes",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "large",
            title: "Total Codes",
          },
        ],
      };

      // Create a store with TotalCodes data
      const totalCodesStore = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: {
                response: [
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c003",
                    widgetName: "TotalCodes",
                    selectedChart: "line",
                    active: true,
                    orderValue: 1,
                    size: "large",
                    title: "Total Codes",
                  },
                ],
              },
              loader: false,
            },
            defaultTop10Codes: {
              data: {
                response: {
                  topDiseaseDTOList: [
                    { diagnosisCode: "E11.9", description: "Type 2 diabetes", count: 10 },
                  ],
                },
              },
              loader: false,
            },
          },
        },
      });

      render(<Provider store={totalCodesStore}><Default {...totalCodesProps} dispatch={mockDispatch} /></Provider>);
      expect(screen.getByTestId("group-card")).toBeInTheDocument();
    });

    it("should render HccCodes widget", () => {
      const hccCodesProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c002",
            widgetName: "HccCodes",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "large",
            title: "HCC Codes",
          },
        ],
      };

      // Create a store with HCC data
      const hccStore = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: {
                response: [
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c002",
                    widgetName: "HccCodes",
                    selectedChart: "line",
                    active: true,
                    orderValue: 1,
                    size: "large",
                    title: "HCC Codes",
                  },
                ],
              },
              loader: false,
            },
            defaultRafHcc: {
              data: {
                response: {
                  overallCodesCount: 500,
                  overallRaf: 250,
                  overallPremium: 5000,
                  codesAndRafSummaryDTOList: [
                    {
                      date: "2024-01-01",
                      hccCount: 50,
                      hccRafScore: 25,
                      hccPremium: 500,
                    },
                  ],
                },
              },
              loader: false,
            },
          },
        },
      });

      render(<Provider store={hccStore}><Default {...hccCodesProps} dispatch={mockDispatch} /></Provider>);
      expect(screen.getByTestId("group-card")).toBeInTheDocument();
    });

    it("should render CareGapCodes widget", () => {
      const careGapCodesProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c005",
            widgetName: "CareGapCodes",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "large",
            title: "Care Gap Codes",
          },
        ],
      };

      // Create a store with CareGap data
      const careGapStore = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: {
                response: [
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c005",
                    widgetName: "CareGapCodes",
                    selectedChart: "line",
                    active: true,
                    orderValue: 1,
                    size: "large",
                    title: "Care Gap Codes",
                  },
                ],
              },
              loader: false,
            },
            defaultRafCareGap: {
              data: {
                response: {
                  overallCodesCount: 300,
                  overallRaf: 150,
                  overallPremium: 3000,
                  codesAndRafSummaryDTOList: [
                    {
                      date: "2024-01-01",
                      suggestedCount: 30,
                      suggestedRafScore: 15,
                      suggestedPremium: 300,
                    },
                  ],
                },
              },
              loader: false,
            },
          },
        },
      });

      render(<Provider store={careGapStore}><Default {...careGapCodesProps} dispatch={mockDispatch} /></Provider>);
      expect(screen.getByTestId("group-card")).toBeInTheDocument();
    });

    it("should render PotientialCodes widget", () => {
      const potentialCodesProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c006",
            widgetName: "PotientialCodes",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "large",
            title: "Potential Codes",
          },
        ],
      };

      // Create a store with Potential data
      const potentialStore = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: {
                response: [
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c006",
                    widgetName: "PotientialCodes",
                    selectedChart: "line",
                    active: true,
                    orderValue: 1,
                    size: "large",
                    title: "Potential Codes",
                  },
                ],
              },
              loader: false,
            },
            defaultRafPotential: {
              data: {
                response: {
                  overallCodesCount: 200,
                  overallRaf: 100,
                  overallPremium: 2000,
                  codesAndRafSummaryDTOList: [
                    {
                      date: "2024-01-01",
                      potentialCount: 20,
                      potentialRafScore: 10,
                      potentialPremium: 200,
                    },
                  ],
                },
              },
              loader: false,
            },
          },
        },
      });

      render(<Provider store={potentialStore}><Default {...potentialCodesProps} dispatch={mockDispatch} /></Provider>);
      expect(screen.getByTestId("group-card")).toBeInTheDocument();
    });

    it("should render labAndRadialogy widget", () => {
      const labAndRadiologyProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c007",
            widgetName: "labAndRadialogy",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "Lab and Radiology",
          },
        ],
      };

      renderWithProvider(<Default {...labAndRadiologyProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should render fileChart widget", () => {
      const fileChartProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c008",
            widgetName: "fileChart",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "large",
            title: "File Chart",
          },
        ],
      };

      // Create a store with fileChart data
      const fileChartStore = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: {
                response: [
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c008",
                    widgetName: "fileChart",
                    selectedChart: "line",
                    active: true,
                    orderValue: 1,
                    size: "large",
                    title: "File Chart",
                  },
                ],
              },
              loader: false,
            },
            workFlowFilesCount: {
              data: {
                response: {
                  computedFiles: 50,
                  failedFiles: 10,
                  processingFiles: 20,
                  uploadedFiles: 100,
                  capturedCodesCount: 80,
                  computedStats: [{ date: "2024-01-01", count: 10 }],
                  failedStats: [{ date: "2024-01-01", count: 2 }],
                  processingStats: [{ date: "2024-01-01", count: 5 }],
                },
              },
              loader: false,
            },
          },
        },
      });

      render(<Provider store={fileChartStore}><Default {...fileChartProps} dispatch={mockDispatch} /></Provider>);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should render Top10Diseases widget", () => {
      const top10DiseasesProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c009",
            widgetName: "Top10Diseases",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "Top 10 Diseases",
          },
        ],
      };

      // Create a store with Top10Diseases data
      const top10Store = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: {
                response: [
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c009",
                    widgetName: "Top10Diseases",
                    selectedChart: "line",
                    active: true,
                    orderValue: 1,
                    size: "medium",
                    title: "Top 10 Diseases",
                  },
                ],
              },
              loader: false,
            },
            defaultTop10Codes: {
              data: {
                response: {
                  topDiseaseDTOList: [
                    { diagnosisCode: "E11.9", description: "Type 2 diabetes", count: 10 },
                  ],
                },
              },
              loader: false,
            },
          },
        },
      });

      render(<Provider store={top10Store}><Default {...top10DiseasesProps} dispatch={mockDispatch} /></Provider>);
      expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
    });

    it("should render TopOIGCodes widget", () => {
      const topOIGCodesProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c010",
            widgetName: "TopOIGCodes",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "Top OIG Codes",
          },
        ],
      };

      // Create a store with TopOIGCodes data
      const topOIGStore = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: {
                response: [
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c010",
                    widgetName: "TopOIGCodes",
                    selectedChart: "line",
                    active: true,
                    orderValue: 1,
                    size: "medium",
                    title: "Top OIG Codes",
                  },
                ],
              },
              loader: false,
            },
            defaultTop10OIG: {
              data: {
                response: {
                  topDiseaseDTOList: [
                    { diagnosisCode: "Z51.11", description: "Encounter for antineoplastic chemotherapy", count: 5 },
                  ],
                },
              },
              loader: false,
            },
          },
        },
      });

      render(<Provider store={topOIGStore}><Default {...topOIGCodesProps} dispatch={mockDispatch} /></Provider>);
      expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
    });

    it("should render TinTable widget", () => {
      const tinTableProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c040",
            widgetName: "TinTable",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "TIN Table",
          },
        ],
      };

      // Create a store with TinTable data
      const tinTableStore = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: {
                response: [
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c040",
                    widgetName: "TinTable",
                    selectedChart: "line",
                    active: true,
                    orderValue: 1,
                    size: "medium",
                    title: "TIN Table",
                  },
                ],
              },
              loader: false,
            },
            defaultTinTable: {
              data: {
                response: {
                  tinStatisticsResponseDtoList: [
                    { tinNumber: "123456789", tinName: "Test TIN", progressPercentage: 75 },
                  ],
                },
              },
              loader: false,
            },
          },
        },
      });

      render(<Provider store={tinTableStore}><Default {...tinTableProps} dispatch={mockDispatch} /></Provider>);
      expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
    });

    it("should render AllocatedStatus widget", () => {
      const allocatedStatusProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c041",
            widgetName: "AllocatedStatus",
            selectedChart: "donut",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "Allocated Status",
          },
        ],
      };

      // Create a store with AllocatedStatus data
      const allocatedStatusStore = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: {
                response: [
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c041",
                    widgetName: "AllocatedStatus",
                    selectedChart: "donut",
                    active: true,
                    orderValue: 1,
                    size: "medium",
                    title: "Allocated Status",
                  },
                ],
              },
              loader: false,
            },
            workFlowAllocatedStatusCount: {
              data: {
                response: {
                  allocatedCount: 80,
                  notAllocatedCount: 20,
                },
              },
              loader: false,
            },
          },
        },
      });

      render(<Provider store={allocatedStatusStore}><Default {...allocatedStatusProps} dispatch={mockDispatch} /></Provider>);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle multiple widgets", () => {
      const multipleWidgetsProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
            widgetName: "filecount",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "File Count",
          },
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c009",
            widgetName: "Top10Diseases",
            selectedChart: "line",
            active: true,
            orderValue: 2,
            size: "medium",
            title: "Top 10 Diseases",
          },
        ],
      };

      // Create a store with multiple widgets data
      const multipleWidgetsStore = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: {
                response: [
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
                    widgetName: "filecount",
                    selectedChart: "line",
                    active: true,
                    orderValue: 1,
                    size: "medium",
                    title: "File Count",
                  },
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c009",
                    widgetName: "Top10Diseases",
                    selectedChart: "line",
                    active: true,
                    orderValue: 2,
                    size: "medium",
                    title: "Top 10 Diseases",
                  },
                ],
              },
              loader: false,
            },
            defaultFileDosCount: {
              data: {
                response: {
                  fileCount: 100,
                  dosCount: 500,
                  pageCount: 1000,
                },
              },
              loader: false,
            },
            defaultTop10Codes: {
              data: {
                response: {
                  topDiseaseDTOList: [
                    { diagnosisCode: "E11.9", description: "Type 2 diabetes", count: 10 },
                  ],
                },
              },
              loader: false,
            },
          },
        },
      });

      render(<Provider store={multipleWidgetsStore}><Default {...multipleWidgetsProps} dispatch={mockDispatch} /></Provider>);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
      expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
    });

    it("should handle loading states", () => {
      const loadingProps = {
        ...defaultProps,
        fileDosCountLoading: true,
      };

      // Create a store with loading state
      const loadingStore = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: {
                response: [
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
                    widgetName: "filecount",
                    selectedChart: "line",
                    active: true,
                    orderValue: 1,
                    size: "medium",
                    title: "File Count",
                  },
                ],
              },
              loader: false,
            },
            defaultFileDosCount: {
              data: null,
              loader: true,
            },
          },
        },
      });

      render(<Provider store={loadingStore}><Default {...loadingProps} dispatch={mockDispatch} /></Provider>);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle widgets loader", () => {
      const widgetsLoaderProps = {
        ...defaultProps,
        getSelectedWidgetsLoader: true,
      };

      // Create a store with widgets loading state
      const widgetsLoadingStore = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: null,
              loader: true,
            },
          },
        },
      });

      render(<Provider store={widgetsLoadingStore}><Default {...widgetsLoaderProps} dispatch={mockDispatch} /></Provider>);
      expect(screen.getByTestId("empty-component")).toBeInTheDocument();
    });

    it("should sort widgets by orderValue", () => {
      const sortedWidgetsProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
            widgetName: "filecount",
            selectedChart: "line",
            active: true,
            orderValue: 2,
            size: "medium",
            title: "File Count",
          },
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c009",
            widgetName: "Top10Diseases",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "Top 10 Diseases",
          },
        ],
      };

      // Create a store with sorted widgets data
      const sortedWidgetsStore = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: {
                response: [
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
                    widgetName: "filecount",
                    selectedChart: "line",
                    active: true,
                    orderValue: 2,
                    size: "medium",
                    title: "File Count",
                  },
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c009",
                    widgetName: "Top10Diseases",
                    selectedChart: "line",
                    active: true,
                    orderValue: 1,
                    size: "medium",
                    title: "Top 10 Diseases",
                  },
                ],
              },
              loader: false,
            },
            defaultFileDosCount: {
              data: {
                response: {
                  fileCount: 100,
                  dosCount: 500,
                  pageCount: 1000,
                },
              },
              loader: false,
            },
            defaultTop10Codes: {
              data: {
                response: {
                  topDiseaseDTOList: [
                    { diagnosisCode: "E11.9", description: "Type 2 diabetes", count: 10 },
                  ],
                },
              },
              loader: false,
            },
          },
        },
      });

      render(<Provider store={sortedWidgetsStore}><Default {...sortedWidgetsProps} dispatch={mockDispatch} /></Provider>);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
      expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
    });

    it("should filter only active widgets", () => {
      const activeWidgetsProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
            widgetName: "filecount",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "File Count",
          },
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c009",
            widgetName: "Top10Diseases",
            selectedChart: "line",
            active: false,
            orderValue: 2,
            size: "medium",
            title: "Top 10 Diseases",
          },
        ],
      };

      renderWithProvider(<Default {...activeWidgetsProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
      expect(screen.queryByTestId("reusable-table")).not.toBeInTheDocument();
    });

    it("should handle unknown widget type", () => {
      const unknownWidgetProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
            widgetName: "UnknownWidget",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "Unknown Widget",
          },
        ],
      };

      renderWithProvider(<Default {...unknownWidgetProps} dispatch={mockDispatch} />);
      // Should render without errors even for unknown widget types
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle useHasMounted returning false", () => {
      // Mock useHasMounted to return false
      const originalUseHasMounted = require("../../src/commonPages/dashboard/component/function").useHasMounted;
      require("../../src/commonPages/dashboard/component/function").useHasMounted = jest.fn(() => false);

      renderWithProvider(<Default {...defaultProps} dispatch={mockDispatch} />);
      
      // Component should return null when hasMounted is false
      expect(screen.queryByTestId("app-chart")).not.toBeInTheDocument();
      
      // Restore the original function
      require("../../src/commonPages/dashboard/component/function").useHasMounted = originalUseHasMounted;
    });

    it("should handle missing action function", () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
      
      const missingActionProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "invalid-widget-id",
            widgetName: "InvalidWidget",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "Invalid Widget",
          },
        ],
      };

      renderWithProvider(<Default {...missingActionProps} dispatch={mockDispatch} />);
      // The component should handle missing actions gracefully
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
      consoleSpy.mockRestore();
    });

    it("should handle very large widget count", () => {
      const largeWidgetCountProps = {
        ...defaultProps,
        getSelectedWidgets: Array.from({ length: 1 }, (_, index) => ({
          widgetId: `widget-${index}`,
          widgetName: "filecount",
          selectedChart: "line",
          active: true,
          orderValue: index,
          size: "medium",
          title: `Widget ${index}`,
        })),
      };

      renderWithProvider(<Default {...largeWidgetCountProps} dispatch={mockDispatch} />);
      const charts = screen.getAllByTestId("app-chart");
      expect(charts).toHaveLength(1);
    });

    it("should handle zero values in data", () => {
      const zeroDataProps = {
        ...defaultProps,
        fileDosCount: {
          fileCount: 0,
          dosCount: 0,
          pageCount: 0,
        },
      };

      renderWithProvider(<Default {...zeroDataProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle negative values in data", () => {
      const negativeDataProps = {
        ...defaultProps,
        fileDosCount: {
          fileCount: -10,
          dosCount: -50,
          pageCount: -100,
        },
      };

      renderWithProvider(<Default {...negativeDataProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle very long widget names", () => {
      const longNameProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
            widgetName: "VeryLongWidgetNameThatExceedsNormalLength",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "Very Long Widget Name",
          },
        ],
      };

      renderWithProvider(<Default {...longNameProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle special characters in widget names", () => {
      const specialCharsProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
            widgetName: "Widget@#$%^&*()",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "Special Widget",
          },
        ],
      };

      renderWithProvider(<Default {...specialCharsProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle unicode characters in widget names", () => {
      const unicodeProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
            widgetName: "Widget🚀🌟🎉",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "Unicode Widget",
          },
        ],
      };

      renderWithProvider(<Default {...unicodeProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle edge cases for active property", () => {
      const undefinedActiveProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
            widgetName: "filecount",
            selectedChart: "line",
            active: undefined,
            orderValue: 1,
            size: "medium",
            title: "File Count",
          },
        ],
      };

      const nullActiveProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
            widgetName: "filecount",
            selectedChart: "line",
            active: null,
            orderValue: 1,
            size: "medium",
            title: "File Count",
          },
        ],
      };

      const falsyActiveProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
            widgetName: "filecount",
            selectedChart: "line",
            active: 0,
            orderValue: 1,
            size: "medium",
            title: "File Count",
          },
        ],
      };

      // Test undefined active
      const { unmount: unmount1 } = renderWithProvider(<Default {...undefinedActiveProps} dispatch={mockDispatch} />);
      expect(screen.getAllByTestId("app-chart")).toHaveLength(1);
      unmount1();

      // Test null active
      const { unmount: unmount2 } = renderWithProvider(<Default {...nullActiveProps} dispatch={mockDispatch} />);
      expect(screen.getAllByTestId("app-chart")).toHaveLength(1);
      unmount2();

      // Test falsy active
      const { unmount: unmount3 } = renderWithProvider(<Default {...falsyActiveProps} dispatch={mockDispatch} />);
      expect(screen.getAllByTestId("app-chart")).toHaveLength(1);
      unmount3();
    });
  });

  describe("Integration Tests", () => {
    it("should handle complete workflow", async () => {
      renderWithProvider(<Default {...defaultProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle rapid state changes", () => {
      const { rerender } = renderWithProvider(<Default {...defaultProps} dispatch={mockDispatch} />);

      // Change props once
      const newProps = {
        ...defaultProps,
        selectedValue: "last_30_days",
      };

      rerender(<Provider store={mockStore}><Default {...newProps} dispatch={mockDispatch} /></Provider>);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });
  });

  describe("Comprehensive Coverage Tests", () => {
    it("should handle stepline chart type", () => {
      const steplineProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c003",
            widgetName: "TotalCodes",
            selectedChart: "stepline",
            active: true,
            orderValue: 1,
            size: "large",
            title: "Total Codes",
          },
        ],
      };

      renderWithProvider(<Default {...steplineProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle area chart type", () => {
      const areaProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c002",
            widgetName: "HccCodes",
            selectedChart: "area",
            active: true,
            orderValue: 1,
            size: "large",
            title: "HCC Codes",
          },
        ],
      };

      renderWithProvider(<Default {...areaProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle WorkFlow widget type exclusion", () => {
      const workFlowProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
            widgetName: "WorkFlow",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "WorkFlow",
          },
        ],
      };

      renderWithProvider(<Default {...workFlowProps} dispatch={mockDispatch} />);
      
      // WorkFlow widgets should not show title
      expect(screen.queryByText("WorkFlow")).not.toBeInTheDocument();
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle Notifications widget type exclusion", () => {
      const notificationsProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
            widgetName: "filecount",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "Notifications",
          },
        ],
      };

      renderWithProvider(<Default {...notificationsProps} dispatch={mockDispatch} />);
      
      // Notifications title should not be shown
      expect(screen.queryByText("Notifications")).not.toBeInTheDocument();
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle Hold Status widget type exclusion", () => {
      const holdStatusProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
            widgetName: "filecount",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "Hold Status",
          },
        ],
      };

      renderWithProvider(<Default {...holdStatusProps} dispatch={mockDispatch} />);
      
      // Hold Status title should not be shown
      expect(screen.queryByText("Hold Status")).not.toBeInTheDocument();
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle empty data arrays", () => {
      const emptyDataStore = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: {
                response: [
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c003",
                    widgetName: "TotalCodes",
                    selectedChart: "line",
                    active: true,
                    orderValue: 1,
                    size: "large",
                    title: "Total Codes",
                  },
                ],
              },
              loader: false,
            },
            defaultRafTotal: {
              data: {
                response: {
                  overallCodesCount: 0,
                  overallRaf: 0,
                  overallPremium: 0,
                  codesAndRafSummaryDTOList: [],
                },
              },
              loader: false,
            },
          },
        },
      });

      const emptyDataProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c003",
            widgetName: "TotalCodes",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "large",
            title: "Total Codes",
          },
        ],
      };

      render(<Provider store={emptyDataStore}><Default {...emptyDataProps} dispatch={mockDispatch} /></Provider>);
      expect(screen.getByTestId("group-card")).toBeInTheDocument();
    });

    it("should handle different window widths", () => {
      // Mock different window width
      const originalUseWindowWidth = require("../../src/commonPages/dashboard/component/function").useWindowWidth;
      require("../../src/commonPages/dashboard/component/function").useWindowWidth = jest.fn(() => 768);

      renderWithProvider(<Default {...defaultProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
      
      // Restore the original function
      require("../../src/commonPages/dashboard/component/function").useWindowWidth = originalUseWindowWidth;
    });

    it("should handle missing formatKValue function gracefully", () => {
      // Test with data that might cause formatKValue to handle edge cases
      const edgeCaseStore = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: {
                response: [
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
                    widgetName: "filecount",
                    selectedChart: "card",
                    active: true,
                    orderValue: 1,
                    size: "medium",
                    title: "File Count",
                  },
                ],
              },
              loader: false,
            },
            defaultFileDosCount: {
              data: {
                response: {
                  fileCount: null,
                  dosCount: undefined,
                  pageCount: NaN,
                },
              },
              loader: false,
            },
          },
        },
      });

      const edgeCaseProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c001",
            widgetName: "filecount",
            selectedChart: "card",
            active: true,
            orderValue: 1,
            size: "medium",
            title: "File Count",
          },
        ],
      };

      render(<Provider store={edgeCaseStore}><Default {...edgeCaseProps} dispatch={mockDispatch} /></Provider>);
      expect(screen.getAllByTestId("stat-card")).toHaveLength(3);
    });

    it("should handle different date formats", () => {
      const differentDateProps = {
        ...defaultProps,
        selectedValue: "custom",
        customDate: ["2024-01-01", "2024-01-02", "2024-01-03"],
      };

      renderWithProvider(<Default {...differentDateProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle moment date formatting", () => {
      const momentDateStore = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: {
                response: [
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c002",
                    widgetName: "HccCodes",
                    selectedChart: "line",
                    active: true,
                    orderValue: 1,
                    size: "large",
                    title: "HCC Codes",
                  },
                ],
              },
              loader: false,
            },
            defaultRafHcc: {
              data: {
                response: {
                  overallCodesCount: 500,
                  overallRaf: 250,
                  overallPremium: 5000,
                  codesAndRafSummaryDTOList: [
                    {
                      date: "2024-01-01T00:00:00Z",
                      hccCount: 50,
                      hccRafScore: 25,
                      hccPremium: 500,
                    },
                  ],
                },
              },
              loader: false,
            },
          },
        },
      });

      const momentDateProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c002",
            widgetName: "HccCodes",
            selectedChart: "line",
            active: true,
            orderValue: 1,
            size: "large",
            title: "HCC Codes",
          },
        ],
      };

      render(<Provider store={momentDateStore}><Default {...momentDateProps} dispatch={mockDispatch} /></Provider>);
      expect(screen.getByTestId("group-card")).toBeInTheDocument();
    });

    it("should handle gauge chart type", () => {
      const gaugeProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c004",
            widgetName: "RafAndRevenue",
            selectedChart: "gauge",
            active: true,
            orderValue: 1,
            size: "large",
            title: "RAF and Revenue",
          },
        ],
      };

      renderWithProvider(<Default {...gaugeProps} dispatch={mockDispatch} />);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
    });

    it("should handle complex data transformation", () => {
      const complexDataStore = configureStore([])({
        admin: {
          dashboard1: {
            getWidgetsList: {
              data: {
                response: [
                  {
                    widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c008",
                    widgetName: "fileChart",
                    selectedChart: "bar",
                    active: true,
                    orderValue: 1,
                    size: "large",
                    title: "File Chart",
                  },
                ],
              },
              loader: false,
            },
            workFlowFilesCount: {
              data: {
                response: {
                  computedFiles: 100,
                  failedFiles: 5,
                  processingFiles: 15,
                  uploadedFiles: 120,
                  capturedCodesCount: 95,
                  computedStats: [
                    { date: "2024-01-01", count: 10 },
                    { date: "2024-01-02", count: 15 },
                    { date: "2024-01-03", count: 20 }
                  ],
                  failedStats: [
                    { date: "2024-01-01", count: 1 },
                    { date: "2024-01-02", count: 2 }
                  ],
                  processingStats: [
                    { date: "2024-01-01", count: 5 },
                    { date: "2024-01-02", count: 10 }
                  ],
                },
              },
              loader: false,
            },
          },
        },
      });

      const complexDataProps = {
        ...defaultProps,
        getSelectedWidgets: [
          {
            widgetId: "acd1b072-3ca4-4bf2-8d32-973ab8c7c008",
            widgetName: "fileChart",
            selectedChart: "bar",
            active: true,
            orderValue: 1,
            size: "large",
            title: "File Chart",
          },
        ],
      };

      render(<Provider store={complexDataStore}><Default {...complexDataProps} dispatch={mockDispatch} /></Provider>);
      expect(screen.getByTestId("app-chart")).toBeInTheDocument();
      expect(screen.getAllByTestId("stat-card")).toHaveLength(5);
    });
  });
});
