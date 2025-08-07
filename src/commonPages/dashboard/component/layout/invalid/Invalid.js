import React, { useEffect, useState } from "react";
import { Card } from "antd";
import {
  filterWidgetsByRole,
  InvalidWidget,
  useHasMounted,
  useWindowWidth,
} from "../../function";
import { getColSpan } from "../../function";
import { getRowSpan } from "../../function";
import DndFunction from "../../function/resubaleDndContext";
import { connect } from "react-redux";
import {
  DOSCount,
  InvalidCredentails,
  InvalidDocument,
  MRNIDMismatch,
  MultiplePatientFound,
  NoHccFound,
  OutOfScope,
  PatientDeceased,
  PatientDOBMismatch,
  PatientInActive,
  PatientNameMismatch,
  ProviderMissed,
  ProviderSignMissed,
  ProviderUnauthorized,
  ScopeYearMis,
  ScopeYearMismatch,
  Televisit,
} from "./mockData";
import CardSkeleton from "../../../../../components/skeleton/card";
function Invalid({
  isDragable,
  handleSelect,
  selectedItems,
  dashboard,
  setDashboard,
  getSelectedWidgets,
  selectedRole,
}) {
  const getCharts = ({ type, chartType, chartChange }) => {
    switch (type) {
      case "DOSCount":
        return <DOSCount chartType={chartType} chartChange={chartChange} />;
      case "InvalidDocument":
        return (
          <InvalidDocument chartType={chartType} chartChange={chartChange} />
        );
      case "Televisit":
        return <Televisit chartType={chartType} chartChange={chartChange} />;
      case "ProviderMissed":
        return (
          <ProviderMissed chartType={chartType} chartChange={chartChange} />
        );
      case "ProviderSignMissed":
        return (
          <ProviderSignMissed chartType={chartType} chartChange={chartChange} />
        );
      case "ProviderUnauthorized":
        return (
          <ProviderUnauthorized
            chartType={chartType}
            chartChange={chartChange}
          />
        );
      case "PatientDOBMismatch":
        return (
          <PatientDOBMismatch chartType={chartType} chartChange={chartChange} />
        );
      case "PatientNameMismatch":
        return (
          <PatientNameMismatch
            chartType={chartType}
            chartChange={chartChange}
          />
        );
      case "MultiplePatientFound":
        return (
          <MultiplePatientFound
            chartType={chartType}
            chartChange={chartChange}
          />
        );
      case "OutOfScope":
        return <OutOfScope chartType={chartType} chartChange={chartChange} />;
      case "NoHccFound":
        return <NoHccFound chartType={chartType} chartChange={chartChange} />;
      case "InvalidCredentails":
        return (
          <InvalidCredentails chartType={chartType} chartChange={chartChange} />
        );
      case "ScopeYearMis-match":
        return (
          <ScopeYearMismatch chartType={chartType} chartChange={chartChange} />
        );
      case "PatientDeceased":
        return (
          <PatientDeceased chartType={chartType} chartChange={chartChange} />
        );
      case "MRNIDMismatch":
        return (
          <MRNIDMismatch chartType={chartType} chartChange={chartChange} />
        );
      case "PatientIn-active":
        return (
          <PatientInActive chartType={chartType} chartChange={chartChange} />
        );
      default:
        break;
    }
  };
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
          {filterWidgetsByRole(InvalidWidget, selectedRole)
            ?.sort((a, b) => a.orderValue - b.orderValue)
            ?.map((item, id) => {
              const style = {
                gridColumn: `span ${getColSpan(item.size, windowWidth)}`,
                gridRow: `span ${getRowSpan(item.size)}`,
                height: "100%",
              };

              return (
                <div key={id} style={style}>
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
                    {getCharts({
                      type: item.widgetName,
                      chartType: item.selectedChart,
                    })}
                  </Card>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
}
const enhancer = connect(
  (state) => ({
    getSelectedWidgets: state.admin.dashboard1.getWidgets?.data?.response,
  }),
  {}
);
export default enhancer(Invalid);
