import { Card } from "antd";
import React, { useEffect, useState } from "react";
import AppChart from "../../appchart";
import {
  filterWidgetsByRole,
  getFormattedChartData,
  useHasMounted,
  useWindowWidth,
  WorkflowWidget,
} from "../../function";
import DndFunction from "../../function/resubaleDndContext";
import { getColSpan } from "../../function";
import { getRowSpan } from "../../function";
import { connect } from "react-redux";
import {
  Accuracy,
  AllocatedStatus,
  Coder1,
  Coder2,
  Notificatin,
  OrgPieChartInfo,
  Owner,
  ProjectLead,
  QA,
  QALead,
  Users,
  WorkFlowFiles,
} from "./mockData";
import CardSkeleton from "../../../../../components/skeleton/card";

const getCharts = ({ type, chartType, chartChange }) => {
  switch (type) {
    case "OrgPieChartInfo":
      return (
        <OrgPieChartInfo chartType={chartType} chartChange={chartChange} />
      );
    case "WorkFlowFiles":
      return <WorkFlowFiles chartType={chartType} chartChange={chartChange} />;

    case "AllocatedStatus":
      return (
        <AllocatedStatus chartType={chartType} chartChange={chartChange} />
      );

    case "Coder 1":
      return <Coder1 chartType={chartType} chartChange={chartChange} />;

    case "Coder 2":
      return <Coder2 chartType={chartType} chartChange={chartChange} />;
    case "QA":
      return <QA chartType={chartType} chartChange={chartChange} />;
    case "Project Lead":
      return <ProjectLead chartType={chartType} chartChange={chartChange} />;

    case "QA Lead":
      return <QALead chartType={chartType} chartChange={chartChange} />;
    case "Owner":
      return <Owner chartType={chartType} chartChange={chartChange} />;
    case "Users":
      return <Users chartType={chartType} chartChange={chartChange} />;
    case "Accuracy":
      return <Accuracy chartType={chartType} chartChange={chartChange} />;
    case "Notificatin":
      return <Notificatin />;
    default:
      break;
  }
};
const Workflow = ({
  isDragable,
  handleSelect,
  selectedItems,
  dashboard,
  setDashboard,
  getSelectedWidgets,
  selectedRole,
}) => {
  const windowWidth = useWindowWidth();
  const hasMounted = useHasMounted();
  const [components, setComponents] = useState([]);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    if (getSelectedWidgets) {
      setComponents(getSelectedWidgets?.filter((d) => !d.active));
    }
  }, [getSelectedWidgets]);

  if (!hasMounted)
    return (
      <div className="row g-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div className="row g-4 p-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="col-md-6">
                <CardSkeleton count={1} height={200} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  if (!hasMounted)
    return (
      <div className="row g-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div className="row g-4 p-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="col-md-6">
                <CardSkeleton count={1} height={200} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  return (
    <>
      {isDragable ? (
        <DndFunction
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          dashboard={dashboard}
          setDashboard={setDashboard}
          components={components}
          setComponents={setComponents}
          getCharts={getCharts}
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 16,
            height: "100%",
          }}
        >
          {filterWidgetsByRole(WorkflowWidget, selectedRole)?.sort((a,b) => (a.orderValue - b.orderValue))?.map(
            (item, id) => {
              const style = {
                gridColumn: `span ${getColSpan(item.size, windowWidth)}`,
                gridRow: `span ${getRowSpan(item.size)}`,
                height: "100%",
              };

              return (
                <div key={id} style={style} className="dynamicChart">
                  <Card>
                    <div className="text-end m-2">
                      <input
                        className="form-check-input cr-pointer"
                        type="checkbox"
                        id="selectAll"
                        checked={selectedItems?.some(
                          (element) => element.widgetId == item.widgetId
                        )}
                        onClick={() => handleSelect(item)}
                      />
                    </div>
                    {item.title === "Notifications" ? null : (
                      <div className="fw-bold mb-2 fs-5">
                        {item.title === "Notifications" ? null : item.title}
                      </div>
                    )}
                    {getCharts({
                      type: item.widgetName,
                      chartType: item.selectedChart,
                    })}
                  </Card>
                </div>
              );
            }
          )}
        </div>
      )}
    </>
  );
};
const enhancer = connect(
  (state) => ({
    getSelectedWidgets: state.admin.dashboard1.getWidgets?.data?.response,
  }),
  {}
);
export default enhancer(Workflow);
