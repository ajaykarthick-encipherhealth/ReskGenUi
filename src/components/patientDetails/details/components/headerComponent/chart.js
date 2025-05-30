import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const DosPieChart = ({ getFlagCounts }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !getFlagCounts) return;

    const chart = echarts.init(chartRef.current);

    const hasData = getFlagCounts?.totalNumberOfDos > 0;

    const option = {
      tooltip: hasData ? { trigger: "item" } : { show: false }, 
      color: hasData ? ["#78A1BB", "#008DD5"] : ["#C0C0C0"],
      series: [
        {
          name: "DOS",
          type: "pie",
          radius: "70%",
          data: hasData
            ? [
                {
                  value: getFlagCounts?.dosWithFlags || 0,
                  name: "Flagged DOS",
                },
                {
                  value: getFlagCounts?.dosWithoutFlags || 0,
                  name: "Non Flagged DOS",
                },
              ]
            : [{ value: 1, name: "No Data" }],
          label: {
            show: false,
            formatter: hasData ? undefined : "No Data",
            position: "center",
            fontSize: 12,
            fontWeight: "bold",
            color: "#888",
          },
          emphasis: {
            label: {
              show: false,
              fontSize: 14,
              fontWeight: "bold",
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.3)",
            },
          },
        },
      ],
    };

    chart.setOption(option);

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(chartRef.current);

    return () => {
      chart.dispose();
      resizeObserver.disconnect();
    };
  }, [getFlagCounts]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#e6f0ff",
        borderRadius: "6px",
        boxShadow: "0px 2px 6px 0px #0000002",
        width: "250px",
        height: "100px",
      }}
    >
    
      <div
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "8px",
        }}
      >
        <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
      </div>


      <div>
        <div style={{ fontSize: "14px", fontWeight: "bold" }}>
          Total DOS - {getFlagCounts?.totalNumberOfDos || 0}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#78A1BB",
              marginRight: "8px",
              borderRadius: "4px",
              opacity: (getFlagCounts?.dosWithFlags || 0) > 0 ? 1 : 0.4,
            }}
          />
          <span style={{ fontSize: "12px" }}>
            Flagged DOS - {getFlagCounts?.dosWithFlags || 0}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "#008DD5",
              marginRight: "8px",
              borderRadius: "4px",
              opacity: (getFlagCounts?.dosWithoutFlags || 0) > 0 ? 1 : 0.4,
            }}
          />
          <span style={{ fontSize: "12px" }}>
            Non Flagged DOS - {getFlagCounts?.dosWithoutFlags || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DosPieChart;
