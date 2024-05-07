import React from 'react';
import ReactECharts from 'echarts-for-react';

const BarChart = ({diagnosisCode, diagnosisCodeCount}) => {
  const option = {
    xAxis: {
      type: 'category',
      data: diagnosisCode,
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: diagnosisCodeCount,
        type: 'bar'
      }
    ]
  };

  return (
    <div style={{ width: '100%' }}>
      <ReactECharts option={option} />
    </div>
  );
};

export default BarChart;
