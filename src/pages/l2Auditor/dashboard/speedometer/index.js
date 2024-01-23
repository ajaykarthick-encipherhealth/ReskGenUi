// import Highcharts from 'highcharts';
// import highchartsMore from 'highcharts/highcharts-more';
// import solidGauge from 'highcharts/modules/solid-gauge';
// import HighchartsReact from 'highcharts-react-official';
// import { useEffect } from 'react';

// if (typeof window !== 'undefined') {
//     highchartsMore(Highcharts);
//     solidGauge(Highcharts);
//   }


// const SpeedometerChart = () => {
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const chart = Highcharts.charts && Highcharts.charts[0];
//       if (chart && !chart.renderer.forExport) {
//         const point = chart.series[0]?.points[0];
//         const inc = Math.round((Math.random() - 0.5) * 20);

//         let newVal = point.y + inc;
//         if (newVal < 0 || newVal > 100) {
//           newVal = point.y - inc;
//         }

//         point.update(newVal);
//       }
//     }, 3000);

//     // Cleanup interval on component unmount
//     return () => clearInterval(intervalId);
//   }, []);


//   const options = {
//     chart: {
//       type: 'gauge',
//       plotBackgroundColor: null,
//       plotBackgroundImage: null,
//       plotBorderWidth: 0,
//       plotShadow: false,
//       height: '50%',
//     },
//     title: {
//       text: '',
//     },
//     pane: {
//       startAngle: -90,
//       endAngle: 89.9,
//       background: null,
//       center: ['50%', '75%'],
//       size: '120%',
//       borderRadius: '50%',
//     },
//     yAxis: {
//       min: 0,
//       max: 100,
//       tickPixelInterval: 72,
//       tickPosition: 'inside',
//       tickLength: 20,
//       tickWidth: 0,
//       minorTickInterval: null,
//       labels: {
//         distance: 20,
//         style: {
//           display: 'none',
//         },
//       },
//       lineWidth: 0,
//       plotBands: [
//         {
//           from: 0,
//           to: 100,
//           color: {
//             linearGradient: {
//               x1: 0,
//               x2: 0,
//               y1: 0,
//               y2: 1,
//             },
//             stops: [
//               [0, '#EC4899 '], 
//               [0.5, '#A855F7'], 
//               [1, '#3B82F6'], 
//             ],
//           },
//           thickness: 45,
//         },
//       ],
//     },
//     series: [
//       {
//         name: 'Speed',
//         data: [80],
//         tooltip: {
//           valueSuffix: '%',
//         },
//         dataLabels: {
//           format: '{y} %',
//           borderWidth: 0,
//           style: {
//             fontSize: '16px',
//           },
//         },
//         dial: {
//             radius: '50%',
//             color: 'white',
//             baseWidth: 50,
//             baseLength: '0%',
//             rearLength: '0%',
//             borderColor: '#EC4899',
//             borderWidth: 2,
//             backgroundColor:"white"
//           },
//           pivot: {
//             color: 'white',
//             radius: 20,
//             borderColor: '#EC4899',
//             borderWidth: 2,
//             backgroundColor:"white"
//           },
//           pivotInner: {
//             color: 'white',
//             radius: 10,
//             borderColor: '#EC4899',
//             borderWidth: 2,
//             backgroundColor:"white"
//           },
//       },
//     ],
//     credits: {
//         enabled: false, 
//       },
//   };

//   return <HighchartsReact highcharts={Highcharts} options={options} />;

// };

// export default SpeedometerChart;
