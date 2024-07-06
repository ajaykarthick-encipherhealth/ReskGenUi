import React from "react";
import ReactECharts from "echarts-for-react";

const RevenueGraph = ({isMultiple,hccColor,cargapColor}) => {
  const option = {
    // title: {
    //   text: "Step Line",
    // },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      show:false
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    // toolbox: {
    //   feature: {
    //     saveAsImage: {},
    //   },
    // },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name:cargapColor?"Car gap Codes":hccColor?"HCC Codes": "Total Codes",
        type: "line",
        step: "start",
        data: [120, 132, 101, 134, 90, 230, 210],
        itemStyle:{
            color:hccColor?hccColor:cargapColor?cargapColor:'#E88D67'
        }
      },
      {
        name: "HCC Codes",
        type: "line",
        step: "middle",
        data: isMultiple &&[220, 282, 201, 234, 290, 430, 410],
        itemStyle:{
            color:'#04B700'
        }
      },
      {
        name: "Car gap Codes",
        type: "line",
        step: "end",
        data:isMultiple && [450, 432, 401, 454, 590, 530, 510],
        itemStyle:{
            color:'#FF9209'
        }
      },
    ],
  };
  return <ReactECharts option={option} />;
};

export default RevenueGraph;
