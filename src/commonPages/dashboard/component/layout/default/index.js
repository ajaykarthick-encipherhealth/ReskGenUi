import { Card, Skeleton } from "antd";
import React, { useState, useEffect } from "react";
import AppChart from "../../appchart";
import ReusableTable from "../../table";
import StatCard from "../../statChart";
import GroupCard from "../../groupcard";
import {
  DefaultWidget,
  filterWidgetsByRole,
  getFormattedChartData,
  parseKValue,
  useHasMounted,
  useWindowWidth,
} from "../../function";
import DndFunction from "../../function/resubaleDndContext";
import { getColSpan } from "../../function";
import { getRowSpan } from "../../function";
import { connect } from "react-redux";
import {
  fileCountData,
  statCardsData,
  statCardData,
  rafAndRevenue,
  totalCodes,
  potientialCodes,
  careGapCodes,
  top10DiseasesMock,
  topOIGCodesMock,
  fileChartSeries,
  hccCodes,
  tinTableMock,
} from "./mockData";
import { getColorValue } from "../../../../../utils/reusable";
import CardSkeleton from "../../../../../components/skeleton/card";
import { AllocatedStatus } from "../workflow/mockData";
const getCharts = ({ type, chartType, chartChange }) => {
  switch (type) {
    case "filecount":
      if (chartType === "card") {
        return (
          <div
            style={{
              display: "flex",
              width: "100%",
              gap: "10px",
              justifyContent: "flex-start",
              gap: "20px",
            }}
            className="mx-auto"
          >
            {fileCountData.map((card, index) => (
              <StatCard
                key={index}
                icon={card.icon}
                title={card.title}
                value={card.value}
                bgColor={card.bgColor}
                borderRadius="28px"
                padding="16px"
                // minWidth="150px"
                fontWeight="bold"
                flexDirection="column"
                alignItems="center"
                // justifyContent="center"
                display="flex"
                textAlign="center"
                paddingTop="20px"
                height="225px"
                textColor={"white"}
                border="4px solid #B3B3B3"
                style={{
                  flex: "1 1 clamp(150px, 30%, 206px)",
                  minWidth: "150px",
                  maxWidth: "100%",
                }}
              />
            ))}
          </div>
        );
      }
      const formattedChartData = fileCountData.map((item) => ({
        name: item.title,
        value: parseKValue(item.value),
        color: item.color,
      }));
      const {
        categories: fileChartCategories,
        formattedSeries: fileChartFormatted,
        height: fileChartHeight,
      } = getFormattedChartData(formattedChartData, chartType);

      return chartChange ? (
        <CardSkeleton count={1} height={200} />
      ) : (
        <AppChart
          type={chartType}
          categories={fileChartCategories}
          series={fileChartFormatted}
          height={chartType !== "card" ? 250 : fileChartHeight}
          showLegend={true}
          showLegendBarLine={false}
          title={"Total Count"}
        />
      );

    case "RafAndRevenue":
      return chartChange ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard charts={rafAndRevenue({ chartType })} />
      );
    case "TotalCodes":
      return chartChange ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard charts={totalCodes({ chartType })} />
      );
    case "HccCodes":
      return chartChange ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard charts={hccCodes({ chartType })} />
      );
    case "CareGapCodes":
      return chartChange ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard charts={careGapCodes({ chartType })} />
      );
    case "PotientialCodes":
      return chartChange ? (
        <CardSkeleton count={1} height={300} />
      ) : (
        <GroupCard charts={potientialCodes({ chartType })} />
      );
    case "labAndRadialogy":
      return (
        <div>
          <div className="d-flex gap-3">
            {statCardsData.map((card) => (
              <StatCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                value={card.value}
                bgColor={card.bgColor}
                padding="16px"
                minWidth="140px"
                gap="12px"
                display="flex"
                alignItems="center"
                borderRadius="12px"
                height="60px"
                fontWeight={
                  card.title === "Processing" || card.title === "Failed"
                    ? "900"
                    : undefined
                }
                justifyContent="center"
                textColor={"white"}
                border="3px solid #B3B3B3"
              />
            ))}
          </div>
          {chartChange ? (
            <CardSkeleton count={1} height={300} />
          ) : (
            <AppChart
              type={chartType}
              categories={[
                "Feb 26",
                "Mar 1",
                "Mar 4",
                "Mar 7",
                "Mar 9",
                "Mar 13",
                "Mar 16",
              ]}
              series={[
                {
                  name: "Lab",
                  data: [0, 0, 12.34, 0, 3, 0],
                  color: getColorValue("5"),
                  area: chartType === "area" ? true : false,
                },
                {
                  name: "Radiology",
                  data: [20, 56, 34, 67, 12],
                  color: getColorValue("6"),
                  area: chartType === "area" ? true : false,
                },
              ]}
            />
          )}
        </div>
      );
    case "fileChart":
      return (
        <div className="row">
          <div className="d-flex justify-content-between w-100 flex-wrap gap-3">
            {statCardData.map((card) => (
              <StatCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                value={card.value}
                bgColor={card.bgColor}
                padding="10px"
                minWidth="165px"
                gap="12px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="16px"
                height="65px"
                textColor={"white"}
                fontSize="16px"
                fontWeight={700}
                textAlign={"center"}
                border="3px solid #B3B3B3"
              />
            ))}
          </div>

          {chartChange ? (
            <CardSkeleton count={1} height={300} />
          ) : (
            <AppChart
              type={chartType}
              categories={fileChartCategories}
              series={fileChartSeries}
            />
          )}
        </div>
      );
    case "Top10Diseases":
      return (
        <ReusableTable
          title="Top 10 Diseases"
          items={top10DiseasesMock}
          columns={[
            { title: "Code", dataIndex: "diagnosisCode" },
            {
              title: "Description",
              dataIndex: "description",
              className: "midRow",
            },
            { title: "Count", dataIndex: "count" },
          ]}
        />
      );
    case "TopOIGCodes":
      return (
        <ReusableTable
          title="Top 10 OIG Codes"
          items={topOIGCodesMock}
          columns={[
            { title: "Code", dataIndex: "diagnosisCode" },
            {
              title: "Description",
              dataIndex: "description",
              className: "midRow",
            },
            { title: "Count", dataIndex: "count" },
          ]}
        />
      );
    case "TinTable":
      return (
        <ReusableTable
          title="TIN Status Table"
          items={tinTableMock}
          columns={[
            { title: "TIN Number", dataIndex: "tinNumber" },
            { title: "TIN Name", dataIndex: "tinName", className: "midRow" },
            {
              title: "Status",
              dataIndex: "progressPercentage",
              isProgress: true,
            },
          ]}
        />
      );
    case "AllocatedStatus":
      return (
        <AllocatedStatus chartType={chartType} chartChange={chartChange} />
      );

    default:
      break;
  }
};

function Default({
  isDragable,
  handleSelect,
  selectedItems,
  dashboard,
  setDashboard,
  getSelectedWidgets,
  selectedRole,
}) {
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
                <CardSkeleton count={1} height={300} />
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
          {filterWidgetsByRole(DefaultWidget, selectedRole)?.sort((a,b) => (a.orderValue - b.orderValue))?.map((item, id) => {
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
export default enhancer(Default);
