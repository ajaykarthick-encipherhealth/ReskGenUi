import React from "react";
import ReactECharts from "echarts-for-react";
import ChartHeader from "../chartheader";
import { Button, Modal } from "antd";
import styles from "./style.module.css";
import {
  formatValues,
  getChartTimeLine,
  statusFormate,
} from "../../../../utils/reusable";
import { useWindowWidth } from "../function";
import { toFixedNum } from "../function";

const AppChart = ({
  type = "line",
  title,
  categories = [],
  series = [],
  stacked = false,
  height = 250,
  showLegend = true,
  showLegendBarLine = false,
  legendData,
  radius,
  showLabel = false,
  xAxisRotated = false,
  toolTipColor,
  chartBackground = "#fff",
  customHeader,
  isOrgModalOpen,
  showModal,
  handleOk,
  handleCancel,
  xAxisInterval = 0,
  plotConfig,
  isDailyChart = false,
}) => {
  series = series.map((item) => {
    if (item.name) {
      return { ...item, name: statusFormate(item.name) };
    } else {
      return item;
    }
  });
  categories = categories?.map((item) => item && statusFormate(item));
  const getTextStyleWidth = (type, isDailyChart, windowWidth, seriesLength) => {
    if (type === "name") {
      if (isDailyChart) {
        if (windowWidth > 1500) return 50;
        if (windowWidth > 1290) return 50;
        return 40;
      } else {
        return windowWidth < 1290 ? 5 : 80;
      }
    }

    if (type === "value") {
      if (isDailyChart) {
        if (windowWidth > 1500) return 40;
        if (windowWidth > 1290) return 30;
        return 40;
      } else {
        return windowWidth < 1290 ? 120 : 45;
      }
    }

    return 0;
  };

  const getRadius = (isDailyChart, windowWidth) => {
    if (isDailyChart && windowWidth < 1290) {
      return ["30%", "40%"];
    } else if (isDailyChart && windowWidth < 1540) {
      return ["32%", "42%"];
    } else if (windowWidth < 1290 || isDailyChart) {
      return ["33%", "43%"];
    }
    return ["60%", "70%"];
  };

  const getCenter = (isDailyChart, windowWidth, seriesLength) => {
    if (isDailyChart && windowWidth < 1540) {
      return ["25%", "50%"];
    }

    if (windowWidth < 1290) {
      return ["17%", "50%"];
    }

    if (seriesLength > 6) {
      return windowWidth > 1290 ? ["25%", "50%"] : ["35%", "50%"];
    }

    return windowWidth > 1290 ? ["25%", "50%"] : ["40%", "50%"];
  };
  const windowWidth = useWindowWidth();
  const getChartOptions = () => {
    let chartType = type;
    let extraOptions = {};
    let tooltip = {};
    const windowWidths = useWindowWidth();
    switch (type) {
      case "bar":
        chartType = type;
        extraOptions = {
          series: series.map((item) => {
            return {
              ...item,
              data: item?.plotConfig
                ? formatValues(
                    getChartTimeLine(item?.data, item?.plotConfig),
                    item?.plotConfig.dates
                  )
                : item.data,
              type: chartType,
              stack: stacked ? "total" : undefined,
              itemStyle: { ...item.itemStyle, borderRadius: [20, 20, 0, 0] },
              label: {
                show: false,
              },
              emphasis: {
                label: {
                  show: false,
                },
              },
            };
          }),
          tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: toolTipColor || "gray",
              },
            },
          },
          legend: {
            show: showLegendBarLine,
            selectedMode: false,
          },
          xAxis: {
            type: "category",
            data: categories || series.map((s) => s.name),
            axisLabel: {
              interval: "auto", // Auto spacing
              rotate: xAxisRotated ? 25 : 0, // Rotate if flag enabled
              hideOverlap: true, // Hide overlapping labels (ECharts 5+)
              formatter: function (value) {
                if (typeof value === "string" && value.includes("-")) {
                  const parts = value.split("-");
                  return parts.length === 3 ? `${parts[1]}-${parts[2]}` : value;
                }
                const truncateSize = windowWidths < 1290 ? 10 : 12;
                const truncatedName =
                  value.length > truncateSize
                    ? value.slice(0, truncateSize) + "..."
                    : value;
                return truncatedName;
              },
              margin: 12, // Padding from axis
            },
          },
          yAxis: {
            type: "value",
            axisLabel: {
              rotate: 0,
            },
          },
        };
        break;

      case "stepline":
        chartType = "line";
        extraOptions = {
          series: series.map((item) => ({
            name: item.name,
            type: chartType,
            data: item?.plotConfig
              ? formatValues(
                  getChartTimeLine(item?.data, item?.plotConfig),
                  item?.plotConfig.dates
                )
              : item.data,
            step: "middle",
            stack: stacked ? "total" : undefined,
            lineStyle: { color: item.color },
            itemStyle: { color: item.color },
          })),
          tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: toolTipColor || "gray",
              },
            },
          },
          legend: {
            show: showLegendBarLine,
            selectedMode: false,
          },
          xAxis: {
            type: "category",
            data: categories || series.map((s) => s.name),
            axisLabel: {
              interval: "auto", // Auto spacing
              rotate: xAxisRotated ? 25 : 0, // Rotate if flag enabled
              hideOverlap: true, // Hide overlapping labels (ECharts 5+)
              formatter: function (value) {
                if (typeof value === "string" && value.includes("-")) {
                  const parts = value.split("-");
                  return parts.length === 3 ? `${parts[1]}-${parts[2]}` : value;
                }
                return value;
              },
              margin: 12, // Padding from axis
            },
          },
          yAxis: {
            type: "value",
            axisLabel: {
              rotate: 0,
            },
          },
        };
        break;

      case "area":
        chartType = "line";
        extraOptions = {
          series: series.map((item) => ({
            name: item.name,
            type: chartType,
            data: item?.plotConfig
              ? formatValues(
                  getChartTimeLine(item?.data, item?.plotConfig),
                  item?.plotConfig.dates
                )
              : item.data,
            smooth: true,
            areaStyle: {},
            lineStyle: { color: item.color },
            itemStyle: { color: item.color },
          })),
          tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: toolTipColor || "gray",
              },
            },
          },
          legend: {
            show: showLegendBarLine,
            selectedMode: false,
          },
          xAxis: {
            type: "category",
            data: categories || series.map((s) => s.name),
            axisLabel: {
              interval: "auto", // Auto spacing
              rotate: xAxisRotated ? 25 : 0, // Rotate if flag enabled
              hideOverlap: true, // Hide overlapping labels (ECharts 5+)
              formatter: function (value) {
                if (typeof value === "string" && value.includes("-")) {
                  const parts = value.split("-");
                  return parts.length === 3 ? `${parts[1]}-${parts[2]}` : value;
                }
                return value;
              },
              margin: 12, // Padding from axis
            },
          },
          yAxis: {
            type: "value",
            axisLabel: {
              rotate: 0,
            },
          },
        };
        break;
      case "line":
        chartType = "line";
        extraOptions = {
          series: series.map((item) => ({
            name: item.name,
            type: chartType,
            data: item?.plotConfig
              ? formatValues(
                  getChartTimeLine(item?.data, item?.plotConfig),
                  item?.plotConfig.dates
                )
              : item.data,
            smooth: true,
            lineStyle: { color: item.color },
            itemStyle: { color: item.color },
          })),
          tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: toolTipColor || "gray",
              },
            },
          },
          legend: {
            show: showLegendBarLine,
            selectedMode: false,
          },
          xAxis: {
            type: "category",
            data: categories || series.map((s) => s.name),
            axisLabel: {
              interval: "auto", // Auto spacing
              rotate: xAxisRotated ? 25 : 0, // Rotate if flag enabled
              hideOverlap: true, // Hide overlapping labels (ECharts 5+)
              formatter: function (value) {
                if (typeof value === "string" && value.includes("-")) {
                  const parts = value.split("-");
                  return parts.length === 3 ? `${parts[1]}-${parts[2]}` : value;
                }
                const truncateSize = windowWidths < 1290 ? 10 : 12;
                const truncatedName =
                  value.length > truncateSize
                    ? value.slice(0, truncateSize) + "..."
                    : value;
                return truncatedName;
              },
              margin: 12, // Padding from axis
            },
          },
          yAxis: {
            type: "value",
            axisLabel: {
              rotate: 0,
            },
          },
        };
        break;

      case "donut":
        // const windowWidth = useWindowWidth();
        chartType = "pie";
        extraOptions = {
          tooltip: {
            trigger: "item",
            formatter: "{b}: {c}",
          },
          legend: {
            selectedMode: true,
            orient: "vertical",
            right: 10,
            top: "middle",
            itemWidth: 6,
            itemHeight: 6,
            icon: "circle",
            formatter: function (name) {
              const item = series.find((s) => s.name === name);
              if (!item) return name;
              const truncateSize = windowWidth < 1290 ? 10 : 12;
              const truncatedName =
                item.name.length > truncateSize
                  ? item.name.slice(0, truncateSize) + "..."
                  : item.name;
              if (isDailyChart) {
                return `{name|${truncatedName}} {value|${item.value}}`;
              }

              return `{name|${name}} {value|${item.value}}`;
            },
            tooltip: {
              trigger: "item",
              show: true,
              formatter: function (params) {
                return `${params.name}`;
              },
            },
            textStyle: {
              rich: {
                name: {
                  width: getTextStyleWidth(
                    "name",
                    isDailyChart,
                    windowWidth,
                    series.length
                  ),
                  align: "left",
                  fontSize: 11,
                  fontWeight: 400,
                  padding: [0, 5, 0, 0],
                },
                value: {
                  width: getTextStyleWidth(
                    "value",
                    isDailyChart,
                    windowWidth,
                    series.length
                  ),
                  align: "right",
                  fontSize: 10,
                  fontWeight: 800,
                },
              },
            },
          },
          series: [
            {
              name: title,
              type: chartType,
              radius: getRadius(isDailyChart, windowWidth),
              center: getCenter(isDailyChart, windowWidth, series.length),
              avoidLabelOverlap: false,
              label: {
                show: true,
                position: "center",
                formatter: () => {
                  const total = series.reduce(
                    (sum, item) => sum + (item.value || 0),
                    0
                  );
                  return `{value|${total}}\n{label|Total}`;
                },
                rich: {
                  value: {
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#333",
                  },
                  label: {
                    fontSize: 12,
                    color: "#666",
                  },
                },
              },
              labelLine: { show: false },
              data: series.map((item) => ({
                value: toFixedNum(item.value, 2),
                name: `${item.name}`,
                itemStyle: { color: item.color },
              })),
            },
          ],
        };
        break;

      case "gauge":
        extraOptions = {
          title: {
            text: title || "",
            left: "center",
            top: "5%",
            textStyle: {
              fontSize: 45,
              fontWeight: "bold",
            },
          },
          tooltip: {
            formatter: "{a}: {c}",
          },
          series: series.map((item, index) => ({
            name: item.title || `Metric ${index + 1}`,
            type: "gauge",
            min: 0,
            max: 100,
            progress: {
              show: item.value > 0,
              roundCap: true,
              width: item.width || 10,
              itemStyle: {
                color: item.color || "pink",
                shadowBlur: 5,
                shadowColor: item.shadowColor || "red",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
              },
            },
            detail: {
              show: true,
              formatter: (value) => value.toFixed(2),
              fontSize: item.fontSize || 32,
              offsetCenter: [0, 0],
            },
            pointer: {
              show: false,
            },
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: item.width || 10,
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              distance: -40,
              fontSize: 12,
              formatter: function (value) {
                return value === 0 || value === 100 ? value.toString() : "";
              },
            },

            data: [
              {
                value: item.value > 0 ? toFixedNum(item.value, 2) : 0,
                name: ""
              },
            ],
          })),
        };
        break;

      default:
        chartType = "line";
        extraOptions = {
          series: series.map((item) => ({
            name: item.name,
            type: chartType,
            data: item.data,
            itemStyle: { color: item.color },
          })),
          tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: toolTipColor || "gray",
              },
            },
          },
        };
    }

    return {
      title:
        title && type !== "gauge"
          ? {
              text: title,
              left: "start",
              textStyle: { fontSize: 16 },
            }
          : undefined,
      tooltip: { trigger: type === "donut" ? "item" : "axis" },
      legend:
        showLegend && type !== "donut" && type !== "gauge" ? {} : undefined,
      grid:
        type !== "donut" && type !== "gauge"
          ? {
              left: "3%",
              right: "3%",
              bottom: "10%",
              containLabel: true,
            }
          : undefined,
      xAxis:
        type !== "donut" && type !== "gauge"
          ? {
              type: "category",
              data: categories,
              boundaryGap: chartType === "bar" || chartType === "column",
            }
          : undefined,
      yAxis:
        type !== "donut" && type !== "gauge" ? { type: "value" } : undefined,
      ...extraOptions,
    };
  };

  const option = getChartOptions();

  return (
    <>
      <div
        className="rounded pt-2"
        style={{ background: chartBackground || "#fff" }}
      >
        {customHeader && <ChartHeader customHeader={customHeader} />}
        <ReactECharts option={option} style={{ height }} />
      </div>
      {showLabel && (
        <div className="d-flex mx-4">
          <div className="d-flex justify-content-between w-100">
            <div className={styles.bulletsDiv} style={{ height: "160px" }}>
              {(legendData?.length ? legendData : series)?.map((item) => (
                <div key={item.name} className={styles.container}>
                  <div style={{ display: "flex", width: "100%" }}>
                    <div
                      className={styles.bgColor}
                      style={{ backgroundColor: item?.itemStyle?.color }}
                    ></div>
                    <span className={styles.userNameTitle}>{item.name}</span>
                  </div>
                </div>
              ))}
            </div>
            {legendData?.length > 5 || (!legendData && series?.length > 5) ? (
              <div style={{ display: "flex", justifyContent: "end" }}>
                <Button
                  id="click-viewAll"
                  name="click-viewAll"
                  type="link"
                  onClick={() => {
                    showModal();
                  }}
                >
                  view all
                </Button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
      <Modal
        title="Organizations"
        open={isOrgModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div style={{ height: "500px", overflow: "auto" }}>
          {(legendData?.length ? legendData : series)?.map((item) => {
            return (
              <div
                className={styles.container}
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                <div style={{ display: "flex", width: "100%" }}>
                  <div
                    className={styles.bgColor}
                    style={{
                      backgroundColor: item?.itemStyle?.color,
                    }}
                  ></div>
                  <span className={styles.userNameTitle}>{item.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
};

export default AppChart;
