import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const DosPieChart = ({ getFlagCounts }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    const option = {
      tooltip: {
        trigger: "item",
      },
      color: ["#78A1BB", "#008DD5"],
      series: [
        {
          name: "DOS",
          type: "pie",
          radius: "70%",
          data: [
            { value: getFlagCounts?.dosWithFlags || 0, name: "Flagged DOS" },
            {
              value: getFlagCounts?.dosWithoutFlags || 0,
              name: "Non Flagged DOS",
            },
          ],
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
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
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#e6f0ff",
        borderRadius: "6px",
        // padding: '20px',
        boxShadow: "0px 2px 6px 0px #0000002",
        width: "300px",
        height: "100px",
      }}
    >
      {/* Chart Container */}
      <div
        style={{
          width: "100px",
          height: "100px",
          // border: '2px solid #4f5d73',
          borderRadius: "8px",
          // marginRight: '24px',
        }}
      >
        {/* {getFlagCounts?.totalNumberOfDos &&
          getFlagCounts?.totalNumberOfDos > 0 && ( */}
            <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
          {/* )} */}
      </div>

      {/* Text & Legend */}
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
