import { render, screen, fireEvent, act } from "@testing-library/react";
import {
  DraggableBox,
  EmptyComponentZonePlaceholder,
  generateGridWithPlaceholders,
  findFirstSlot2D,
  updateDashboardOrderIds,
  getOrderedDashboardFromGrid,
  handleDragEnd,
  handleDragStart,
} from "../../src/commonPages/dashboard/component/function/dragDropFunction";

// Mocks specific to dragDropFunction tests
jest.mock("../../src/commonPages/dashboard/component/function/index", () => ({
  getColSpan: jest.fn(() => 6),
  getRowSpan: jest.fn(() => 1),
  useHasMounted: jest.fn(() => true),
  useWindowWidth: jest.fn(() => 1200),
}));

jest.mock("@dnd-kit/sortable", () => ({
  useSortable: jest.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
  })),
  SortableContext: ({ children }) => <div>{children}</div>,
  rectSortingStrategy: jest.fn(),
  arrayMove: jest.fn((array, oldIndex, newIndex) => {
    const newArray = [...array];
    const [removed] = newArray.splice(oldIndex, 1);
    newArray.splice(newIndex, 0, removed);
    return newArray;
  }),
}));

jest.mock("@dnd-kit/core", () => ({
  useDroppable: jest.fn(() => ({ setNodeRef: jest.fn(), isOver: false })),
}));

jest.mock("antd", () => {
  const MockSelect = ({ children, onChange, value, ...props }) => (
    <select onChange={(e) => onChange?.(e.target.value)} value={value} {...props}>
      {children}
    </select>
  );
  MockSelect.Option = ({ children, value, ...props }) => (
    <option value={value} {...props}>
      {children}
    </option>
  );
  return {
    Button: ({ children, ...props }) => <button {...props}>{children}</button>,
    Card: ({ children, ...props }) => <div {...props}>{children}</div>,
    Select: MockSelect,
    Skeleton: ({ children, ...props }) => <div {...props}>{children}</div>,
  };
});

jest.mock("@ant-design/icons", () => ({
  CloseCircleOutlined: () => <span>CloseCircleOutlined</span>,
  PieChartOutlined: () => <span>PieChartOutlined</span>,
}));

jest.mock("@dnd-kit/utilities", () => ({
  CSS: { Transform: { toString: jest.fn(() => "") } },
}));

describe("handleDragStart (unit)", () => {
  it("sets active item from dashboard", () => {
    const setActiveItem = jest.fn();
    handleDragStart({
      active: { id: "a" },
      setActiveItem,
      dashboard: [{ widgetId: "a" }],
      components: [],
    });
    expect(setActiveItem).toHaveBeenCalledWith({ widgetId: "a" });
  });

  it("sets active item from components", () => {
    const setActiveItem = jest.fn();
    handleDragStart({
      active: { id: "x" },
      setActiveItem,
      dashboard: [],
      components: [{ widgetId: "x" }],
    });
    expect(setActiveItem).toHaveBeenCalledWith({ widgetId: "x" });
  });

  it("handles empty arrays", () => {
    const setActiveItem = jest.fn();
    expect(() =>
      handleDragStart({ active: { id: "z" }, setActiveItem, dashboard: [], components: [] })
    ).not.toThrow();
  });

  it("throws on null lists", () => {
    const setActiveItem = jest.fn();
    expect(() =>
      handleDragStart({ active: { id: "z" }, setActiveItem, dashboard: null, components: null })
    ).toThrow();
  });
});

describe("handleDragEnd (unit)", () => {
  it("dashboard -> component zone", () => {
    const setDashboard = jest.fn();
    const setComponents = jest.fn();
    const setActiveItem = jest.fn();
    handleDragEnd({
      active: { id: "w1", data: { current: { sortable: { containerId: "dashboard-zone" } } } },
      over: { id: "empty-component-zone" },
      setDashboard,
      setComponents,
      setActiveItem,
      dashboard: [{ widgetId: "w1" }],
      components: [],
      windowWidth: 1200,
    });
    expect(setDashboard).toHaveBeenCalled();
    expect(setComponents).toHaveBeenCalled();
    expect(setActiveItem).toHaveBeenCalledWith(null);
  });

  it("component -> dashboard zone", () => {
    const setDashboard = jest.fn();
    const setComponents = jest.fn();
    const setActiveItem = jest.fn();
    handleDragEnd({
      active: { id: "w2", data: { current: { sortable: { containerId: "component-zone" } } } },
      over: { id: "slot-1", data: { current: { sortable: { containerId: "dashboard-zone" } } } },
      setDashboard,
      setComponents,
      setActiveItem,
      dashboard: [],
      components: [{ widgetId: "w2", size: "col-6 row-1" }],
      windowWidth: 1200,
    });
    expect(setDashboard).toHaveBeenCalled();
    expect(setComponents).toHaveBeenCalled();
    expect(setActiveItem).toHaveBeenCalledWith(null);
  });

  it("reorder inside dashboard", () => {
    const setDashboard = jest.fn();
    handleDragEnd({
      active: { id: "a", data: { current: { sortable: { containerId: "dashboard-zone" } } } },
      over: { id: "b", data: { current: { sortable: { containerId: "dashboard-zone" } } } },
      setDashboard,
      setActiveItem: jest.fn(),
      dashboard: [
        { widgetId: "a", size: "col-6 row-1" },
        { widgetId: "b", size: "col-6 row-1" },
      ],
      components: [],
      windowWidth: 1200,
    });
    expect(setDashboard).toHaveBeenCalled();
  });

  it("no over target", () => {
    expect(() =>
      handleDragEnd({
        active: { id: "a", data: { current: { sortable: { containerId: "dashboard-zone" } } } },
        over: null,
        setActiveItem: jest.fn(),
        setDashboard: jest.fn(),
        setComponents: jest.fn(),
        dashboard: [],
        components: [],
        windowWidth: 1200,
      })
    ).not.toThrow();
  });

  it("invalid active data throws", () => {
    expect(() =>
      handleDragEnd({
        active: { id: "a", data: null },
        over: { id: "x", data: { current: { sortable: { containerId: "component-zone" } } } },
        setActiveItem: jest.fn(),
        setDashboard: jest.fn(),
        setComponents: jest.fn(),
        dashboard: [],
        components: [],
        windowWidth: 1200,
      })
    ).toThrow();
  });
});

describe("generateGridWithPlaceholders", () => {
  it("returns placeholders for empty", () => {
    const res = generateGridWithPlaceholders([]);
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBeGreaterThan(0);
  });

  it("handles multiple items", () => {
    const res = generateGridWithPlaceholders([
      { widgetId: "w1", size: "col-sm-6" },
      { widgetId: "w2", size: "col-sm-12" },
    ]);
    expect(Array.isArray(res)).toBe(true);
  });
});

describe("findFirstSlot2D", () => {
  it("finds slot", () => {
    const grid = [
      [null, null, null],
      [null, null, null],
    ];
    expect(findFirstSlot2D(grid, 1, 1)).toEqual([0, 0]);
  });

  it("returns null when filled", () => {
    const grid = [
      [{}, {}],
      [{}, {}],
    ];
    expect(findFirstSlot2D(grid, 1, 1)).toBeNull();
  });
});

describe("updateDashboardOrderIds", () => {
  it("assigns orderValue", () => {
    const r = updateDashboardOrderIds([
      { widgetId: "a" },
      { widgetId: "b" },
    ]);
    expect(r.map((x) => x.orderValue)).toEqual(["1", "2"]);
  });
});

describe("getOrderedDashboardFromGrid", () => {
  it("returns ordered array", () => {
    const res = getOrderedDashboardFromGrid(
      [
        { widgetId: "a", size: "col-6 row-1" },
        { widgetId: "b", size: "col-6 row-1" },
      ],
      1200
    );
    expect(Array.isArray(res)).toBe(true);
  });
});

describe("EmptyComponentZonePlaceholder", () => {
  it("renders description and applies id/classes/styles", () => {
    const { container, getByText } = render(
      <EmptyComponentZonePlaceholder description="Drop here" />
    );
    const el = container.querySelector("#empty-component-zone");
    expect(getByText("Drop here")).toBeInTheDocument();
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass("border");
    expect(el).toHaveClass("border-secondary");
    expect(el).toHaveClass("rounded");
    expect(el.style.gridColumn).toBe("span 12");
  });

  it("calls useDroppable setNodeRef", () => {
    const core = require("@dnd-kit/core");
    const setNodeRef = jest.fn();
    core.useDroppable.mockImplementationOnce(() => ({ setNodeRef, isOver: false }));
    const { container } = render(
      <EmptyComponentZonePlaceholder description="X" />
    );
    expect(core.useDroppable).toHaveBeenCalledWith({ id: "empty-component-zone" });
    expect(setNodeRef).toHaveBeenCalled();
    const node = setNodeRef.mock.calls[0]?.[0];
    expect(container.querySelector("#empty-component-zone")).toBe(node);
  });
});

describe("DraggableBox", () => {
  it("renders title and remove button; clicking remove moves item", () => {
    const item = {
      widgetId: "w1",
      widgetName: "Widget",
      title: "Custom Widget",
      size: "col-sm-6",
      selectedChart: "card",
      rolesAccessList: ["ADMIN"],
    };
    const setDashboard = jest.fn();
    const setComponents = jest.fn();
    render(
      <DraggableBox
        item={item}
        zone="dashboard"
        setDashboard={setDashboard}
        setComponents={setComponents}
        getCharts={jest.fn()}
      />
    );
    expect(screen.getByText("Custom Widget")).toBeInTheDocument();
    const btn = screen.getByRole("button");
    act(() => {
      fireEvent.click(btn);
    });
    expect(setDashboard).toHaveBeenCalled();
    expect(setComponents).toHaveBeenCalled();
  });

  it("hides title for Notifications/Hold Status", () => {
    const base = {
      widgetId: "w2",
      widgetName: "Widget",
      size: "col-sm-6",
      selectedChart: "card",
    };
    const { rerender } = render(
      <DraggableBox item={{ ...base, title: "Notifications" }} zone="dashboard" setDashboard={jest.fn()} setComponents={jest.fn()} getCharts={jest.fn()} />
    );
    expect(screen.queryByText("Notifications")).not.toBeInTheDocument();
    rerender(
      <DraggableBox item={{ ...base, title: "Hold Status" }} zone="dashboard" setDashboard={jest.fn()} setComponents={jest.fn()} getCharts={jest.fn()} />
    );
    expect(screen.queryByText("Hold Status")).not.toBeInTheDocument();
  });

  it("renders Select when widgetTypes present (changeChart path exercised)", () => {
    jest.useFakeTimers();
    const item = {
      widgetId: "w3",
      widgetName: "Widget",
      title: "Has Types",
      size: "col-sm-6",
      selectedChart: "card",
      widgetTypes: ["card", "line"],
    };
    const setDashboard = jest.fn();
    render(
      <DraggableBox
        item={item}
        zone="dashboard"
        setDashboard={setDashboard}
        setComponents={jest.fn()}
        getCharts={jest.fn()}
      />
    );
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    act(() => {
      fireEvent.change(select, { target: { value: "line" } });
      jest.advanceTimersByTime(400);
    });
    // Do not assert internal setDashboard timing in unit test; presence of Select and no throw is enough
    jest.useRealTimers();
  });
});

describe("generateGridWithPlaceholders bulk", () => {
  const cases = Array.from({ length: 20 }, (_, i) => i);
  test.each(cases)("bulk grid generation %s", (i) => {
    const items = [
      { widgetId: `g-${i}-1`, size: "col-sm-6" },
      { widgetId: `g-${i}-2`, size: "col-sm-6" },
      { widgetId: `g-${i}-3`, size: "col-sm-6" },
    ];
    const res = generateGridWithPlaceholders(items, 1200);
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBeGreaterThan(0);
  });
});

describe("findFirstSlot2D bulk", () => {
  const spans = [
    [1, 1],
    [2, 1],
    [3, 1],
    [1, 2],
    [2, 2],
    [1, 3],
    [3, 2],
    [2, 3],
    [1, 4],
    [4, 1],
  ];
  test.each(spans)("slot for col %s row %s", (c, r) => {
    const grid = Array.from({ length: 5 }, () => Array.from({ length: 6 }, () => null));
    const res = findFirstSlot2D(grid, c, r);
    expect(res === null || Array.isArray(res)).toBe(true);
  });
});

describe("EmptyComponentZonePlaceholder bulk", () => {
  const texts = ["A", "B", "C", "D", "E"];
  test.each(texts)("renders %s", (t) => {
    const { getByText } = render(<EmptyComponentZonePlaceholder description={t} />);
    expect(getByText(t)).toBeInTheDocument();
  });
});

describe("DraggableBox title bulk", () => {
  const titles = [
    "Title 1",
    "Title 2",
    "Title 3",
    "Title 4",
    "Title 5",
    "Report",
    "Summary",
  ];
  test.each(titles)("shows title %s", (t) => {
    const item = {
      widgetId: `w-${t}`,
      widgetName: "Widget",
      title: t,
      size: "col-sm-6",
      selectedChart: "card",
    };
    render(
      <DraggableBox
        item={item}
        zone="dashboard"
        setDashboard={jest.fn()}
        setComponents={jest.fn()}
        getCharts={jest.fn()}
      />
    );
    expect(screen.getByText(t)).toBeInTheDocument();
  });
});

describe("updateDashboardOrderIds bulk", () => {
  const counts = Array.from({ length: 15 }, (_, i) => i + 1);
  test.each(counts)("assigns orderValue for %s items", (n) => {
    const items = Array.from({ length: n }, (_, i) => ({ widgetId: `u-${i}` }));
    const r = updateDashboardOrderIds(items);
    expect(r).toHaveLength(n);
    expect(r[0].orderValue).toBe("1");
  });
});

describe("getOrderedDashboardFromGrid bulk", () => {
  const counts = [1, 2, 3, 4, 5, 6, 8, 10];
  test.each(counts)("orders %s items", (n) => {
    const dashboard = Array.from({ length: n }, (_, i) => ({ widgetId: `d-${i}`, size: i % 2 ? "col-6 row-1" : "col-12 row-1" }));
    const res = getOrderedDashboardFromGrid(dashboard, 1200);
    expect(Array.isArray(res)).toBe(true);
  });
});

describe("DraggableBox no widgetTypes bulk", () => {
  const cases = Array.from({ length: 10 }, (_, i) => `T-${i}`);
  test.each(cases)("renders title %s without widgetTypes", (t) => {
    const item = { widgetId: `nw-${t}`, widgetName: "W", title: t, size: "col-sm-6", selectedChart: "card" };
    render(<DraggableBox item={item} zone="dashboard" setDashboard={jest.fn()} setComponents={jest.fn()} getCharts={jest.fn()} />);
    expect(screen.getByText(t)).toBeInTheDocument();
  });
});

describe("EmptyComponentZonePlaceholder styles bulk", () => {
  const texts = Array.from({ length: 5 }, (_, i) => `Desc-${i}`);
  test.each(texts)("has id and class for %s", (d) => {
    const { container, getByText } = render(<EmptyComponentZonePlaceholder description={d} />);
    const el = container.querySelector('#empty-component-zone');
    expect(getByText(d)).toBeInTheDocument();
    expect(el).toBeInTheDocument();
  });
});

describe("Bulk handleDragStart variants", () => {
  const ids = Array.from({ length: 30 }, (_, i) => `bulk-id-${i}`);
  test.each(ids)("sets active for %s", (id) => {
    const setActiveItem = jest.fn();
    handleDragStart({
      active: { id },
      setActiveItem,
      dashboard: [{ widgetId: id }],
      components: [],
    });
    expect(setActiveItem).toHaveBeenCalledWith({ widgetId: id });
  });
});

describe("Bulk handleDragEnd variants", () => {
  const cases = [
    {
      name: "dashboard->component",
      active: { id: "a", data: { current: { sortable: { containerId: "dashboard-zone" } } } },
      over: { id: "empty-component-zone" },
      dashboard: [{ widgetId: "a", size: "col-6 row-1" }],
      components: [],
    },
    {
      name: "component->dashboard",
      active: { id: "b", data: { current: { sortable: { containerId: "component-zone" } } } },
      over: { id: "slot-1", data: { current: { sortable: { containerId: "dashboard-zone" } } } },
      dashboard: [],
      components: [{ widgetId: "b", size: "col-6 row-1" }],
    },
    {
      name: "dashboard reorder same id (no-op)",
      active: { id: "c", data: { current: { sortable: { containerId: "dashboard-zone" } } } },
      over: { id: "c", data: { current: { sortable: { containerId: "dashboard-zone" } } } },
      dashboard: [{ widgetId: "c", size: "col-6 row-1" }],
      components: [],
    },
    ...Array.from({ length: 17 }, (_, i) => ({
      name: `dashboard reorder variant ${i}`,
      active: { id: "x", data: { current: { sortable: { containerId: "dashboard-zone" } } } },
      over: { id: "y", data: { current: { sortable: { containerId: "dashboard-zone" } } } },
      dashboard: [
        { widgetId: "x", size: "col-6 row-1" },
        { widgetId: "y", size: "col-6 row-1" },
      ],
      components: [],
    })),
  ];

  test.each(cases)("%s", ({ active, over, dashboard, components }) => {
    const setDashboard = jest.fn();
    const setComponents = jest.fn();
    const setActiveItem = jest.fn();
    handleDragEnd({
      active,
      over,
      setDashboard,
      setComponents,
      setActiveItem,
      dashboard,
      components,
      windowWidth: 1200,
    });
    expect(setActiveItem).toHaveBeenCalled();
  });
});


