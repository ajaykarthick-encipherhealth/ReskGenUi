import React from 'react';
import ReactECharts from 'echarts-for-react';

const BarChartMeat = ({data}) => {

  const categories = ["M", "E", "A", "T"].reverse();

  const colors = ['#00b3b3', '#00b3b3', '#00b3b3', '#00b3b3'];

  const option = {
    xAxis: {
      max: 'dataMax'
    },
    yAxis: {
      type: 'category',
      data: categories, // Use all categories here
    },
    series: [
      {
        type: "bar",
        data: data?.map((value, index) => ({
          value: value,
          itemStyle: {
            color: colors[index]
          }
        })),
        label: {
            show: true,
            position: 'right',
            valueAnimation: true
          }
      }
    ],
    legend: {
      show: true
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <ReactECharts option={option} />
    </div>
  );
}

export default BarChartMeat;
