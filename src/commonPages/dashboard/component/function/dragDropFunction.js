import { CloseCircleOutlined, PieChartOutlined } from "@ant-design/icons";
import { Button, Card, Select, Skeleton } from "antd";
import { CSS } from "@dnd-kit/utilities";
import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useSortable, arrayMove } from "@dnd-kit/sortable";
import { getColSpan, useHasMounted } from "./index";
import { getRowSpan } from "./index";
import { useWindowWidth } from "./index";

const GRID_COLS = 12;
const MIN_GRID_ROWS = 9;

// export const getColSpan = (cls = '') => {
//     const m = cls.match(/col-(\d+)/);
//     return m ? +m[1] : 1;
// };

// export const getRowSpan = (cls = '') => {
//     const m = cls.match(/row-(\d+)/);
//     return m ? +m[1] : 1;
// };
export const generateGridWithPlaceholders = (items, windowWidth) => {
  let gridRows = MIN_GRID_ROWS;
  let slotId = 0;
  let grid;
  while (true) {
    grid = Array.from({ length: gridRows }, (_, row) =>
      Array.from({ length: GRID_COLS }, (_, col) => null)
    );
    let placed = new Set();
    for (const itm of items) {
      const colSpan = getColSpan(itm?.size, windowWidth);
      const rowSpan = getRowSpan(itm?.size);
      const pos = findFirstSlot2D(grid, colSpan, rowSpan);
      if (pos) {
        const [row, col] = pos;
        placed.add(itm?.widgetId);
        for (let r = row; r < row + rowSpan; r++) {
          for (let c = col; c < col + colSpan; c++) {
            if (r === row && c === col) {
              grid[r][c] = {
                id: itm?.widgetId,
                empty: false,
                className: itm?.size,
                item: itm,
              };
            } else {
              grid[r][c] = { covered: true };
            }
          }
        }
      }
    }
    let emptyCount = 0;
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (!grid[row][col]) {
          grid[row][col] = {
            id: `empty-${slotId++}`,
            empty: true,
            className: "col-1 row-1",
          };
          emptyCount++;
        }
      }
    }
    if (placed?.size === items.length) break;
    gridRows++;
  }
  let emptyRowsAtBottom = 0;
  while (true) {
    emptyRowsAtBottom = 0;
    for (let row = grid.length - 1; row >= 0; row--) {
      let isEmptyRow = true;
      for (let col = 0; col < GRID_COLS; col++) {
        if (!grid[row][col].empty) {
          isEmptyRow = false;
          break;
        }
      }
      if (isEmptyRow) {
        emptyRowsAtBottom++;
      } else {
        break;
      }
    }
    if (emptyRowsAtBottom >= 10) break;
    grid.push(
      Array.from({ length: GRID_COLS }, () => ({
        id: `empty-${slotId++}`,
        empty: true,
        className: "col-1 row-1",
      }))
    );
  }
  return grid.flat();
};

export function findFirstSlot2D(grid, colSpan, rowSpan) {
  const numRows = grid.length;
  const numCols = grid[0].length;
  for (let row = 0; row <= numRows - rowSpan; row++) {
    for (let col = 0; col <= numCols - colSpan; col++) {
      let fits = true;
      for (let r = row; r < row + rowSpan; r++) {
        for (let c = col; c < col + colSpan; c++) {
          if (grid[r][c]) {
            fits = false;
            break;
          }
        }
        if (!fits) break;
      }
      if (fits) return [row, col];
    }
  }
  return null;
}

export function updateDashboardOrderIds(items) {
  return items.map((item, index) => ({
    ...item,
    orderValue: String(index + 1),
  }));
}

export function EmptyComponentZonePlaceholder({ description }) {
  const { setNodeRef } = useDroppable({ id: "empty-component-zone" });

  return (
    <div
      ref={setNodeRef}
      id="empty-component-zone"
      className="border border-secondary rounded text-muted d-flex align-items-center justify-content-center"
      style={{
        gridColumn: "span 12",
        minHeight: "100px",
        background: "#f9f9f9",
        fontStyle: "italic",
      }}
    >
      {description}
    </div>
  );
}

export const DraggableBox = React.memo(
  ({
    item,
    zone,
    getProps,
    setDashboard,
    setComponents,
    activeBtn,
    getCharts,
  }) => {
    const { setNodeRef, listeners, attributes, transform, transition } =
      useSortable({
        id: item.widgetId || item.id,
        data: {
          sortable: {
            containerId:
              zone === "dashboard" ? "dashboard-zone" : "component-zone",
          },
        },
      });
    const [chartChange, setChartChange] = useState(false);
    const windowWidth = useWindowWidth();
    const hasMounted = useHasMounted();

    const style = {
      // transform: CSS.Transform.toString(transform),
      transition: transition,
      gridColumn: `span ${getColSpan(item.size, windowWidth)}`,
      gridRow: `span ${getRowSpan(item.size)}`,
      minHeight: 110,
      cursor: "grab",
      position: "relative",
      userSelect: "none",
      willChange: "transform",
      zIndex: item.empty ? 0 : 1,
    };

    const removeDashboardComponent = () => {
      setDashboard((prev) => prev.filter((c) => c.widgetId !== item.widgetId));
      setComponents((prev) => [...prev, item]);
    };

    const changeChart = (type) => {
      setChartChange(true);
      setTimeout(() => {
        setDashboard((prev) =>
          prev.map((c) =>
            c.widgetId === item.widgetId ? { ...c, selectedChart: type } : c
          )
        );
        setChartChange(false);
      }, 300);
    };
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`rounded bg-white border ${item.empty ? "empty-slot" : ""}`}
      >
        {!item.empty && zone === "dashboard" && (
          <div
            className={`d-flex ${
              item.widgetTypes
                ? "justify-content-between"
                : "justify-content-end"
            } align-items-center px-3 py-2`}
          >
            {item.widgetTypes ? (
              <Select
                style={{
                  width: 150,
                  marginBottom: 16,
                  textTransform: "capitalize",
                }}
                placeholder={<PieChartOutlined />}
                onChange={(selectedType) => {
                  changeChart(selectedType);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                value={item.selectedChart}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                {item?.widgetTypes?.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type === "card" ? type : `${type} Chart`}
                  </Select.Option>
                ))}
              </Select>
            ) : null}
            <Button
              size="small"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={removeDashboardComponent}
            >
              <CloseCircleOutlined />
            </Button>
          </div>
        )}

        {!item.empty && (
          <div className="bg-white p-2">
            {item.title === "Notifications" ||
            item.title === "Hold Status" ? null : (
              <div className="fw-bold mb-2 fs-5">
                {item.title === "Notifications" || item.title === "Hold Status"
                  ? null
                  : item.title}
              </div>
            )}
            {/* {activeBtn === "Invalid" ? getProps["InvalidChart"]?.(item?.widgetName) : getProps[item?.widgetName]?.(item?.selectedChart) } */}
            {!hasMounted && (
              <div className="row g-3">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div className="row g-4 p-3">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="col-md-6">
                        <Skeleton.Node
                          active={true}
                          style={{ width: 800, height: 200 }}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {hasMounted
              ? getCharts({
                  type: item.widgetName,
                  chartType: item?.selectedChart,
                  chartChange,
                  accesslist: item?.rolesAccessList
                })
              : null}
          </div>
        )}
      </div>
    );
  }
);

export function getOrderedDashboardFromGrid(dashboard, windowWidth) {
  const grid = generateGridWithPlaceholders(dashboard, windowWidth);
  const seen = new Set();
  const ordered = [];
  for (const cell of grid) {
    if (
      !cell.covered &&
      !cell.empty &&
      cell.item &&
      !seen.has(cell.item.widgetId)
    ) {
      ordered.push(cell.item);
      seen.add(cell.item.id);
    }
  }
  return ordered;
}
export const handleDragEnd = (props) => {
  const {
    active,
    over,
    setComponents,
    setDashboard,
    setActiveItem,
    dashboard,
    components,
    windowWidth,
  } = props;
  const activeId = active.id;
  const fromZone = active.data.current.sortable.containerId;
  const overId = over?.id;
  const overZone = over?.data?.current?.sortable?.containerId ?? null;

  if (
    fromZone === "dashboard-zone" &&
    (overZone === "component-zone" || over?.id === "empty-component-zone")
  ) {
    const moved = dashboard.find((i) => i.widgetId === activeId);
    setDashboard((d) => d.filter((i) => i.widgetId !== activeId));
    setComponents((c) => [...c, moved]);
    setActiveItem(null);
    return;
  }

  if (fromZone === "component-zone" && overZone === "dashboard-zone") {
    const moved = components.find((i) => i.widgetId === activeId);
    setComponents((c) => c.filter((i) => i.widgetId !== activeId));
    setDashboard((d) =>
      updateDashboardOrderIds(
        getOrderedDashboardFromGrid([...d, moved], windowWidth)
      )
    );
    setActiveItem(null);
    return;
  }

  if (
    fromZone === "dashboard-zone" &&
    overZone === "dashboard-zone" &&
    overId
  ) {
    if (activeId !== overId) {
      const oldIdx = dashboard.findIndex((i) => i.widgetId === activeId);
      const newIdx = dashboard.findIndex((i) => i.widgetId === overId);
      setDashboard((d) =>
        updateDashboardOrderIds(
          getOrderedDashboardFromGrid(arrayMove(d, oldIdx, newIdx)),
          windowWidth
        )
      );
    }
  }

  setActiveItem(null);
};
export const handleDragStart = (props) => {
  const { active, setActiveItem, dashboard, components } = props;
  const it =
    dashboard.find((d) => d.widgetId === active.id) ||
    components.find((c) => c.widgetId === active.id);
  setActiveItem(it);
};
