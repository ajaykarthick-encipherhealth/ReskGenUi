import React from 'react';
import ReactECharts from 'echarts-for-react';

const PieChart = ({data}) => {

  const total = data?.reduce((acc, curr) => acc + curr?.value, 0);

  // Calculate percentages
  const percentageData = data?.map(item => ({
    ...item,
    value: ((item?.value / total) * 100).toFixed(2),
    label: {
      show: true,
      position: 'outside',
      formatter: '{b}: {d}%'
    }
  }));

  // ECharts options
  const option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '5%',
      left: 'center',
      show: false,
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}: {d}%',
        },
        labelLine: {
          show: true,
        },
        data: percentageData?.length>0?percentageData:[],
      },
    ],
  };

  return (
    <div style={{ width: '100%' }}>
      <ReactECharts option={option} />
    </div>
  );
};

export default PieChart;
