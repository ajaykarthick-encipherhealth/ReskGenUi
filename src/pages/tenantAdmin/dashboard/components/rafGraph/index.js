import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { connect } from "react-redux";
import {
  HccCodes,
  RafCounts,
  RafCountScore,
} from "../../../../../stores/tenantAdmin/dashboard/default/action.js";
const RafGraph = ({
  rafColor,
  rafColor2,
  rafColor3,
  isCargaps,
  isHcc,
  getAllRafData,
  getAllHccCodes,
  getAllHccCodesData,
  getAllRaf,
  getAllRafScoreData,
  getAllRafScore,
  chartRafData,
}) => {
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    const fetchData=async()=>{
    await getAllHccCodesData(dateRange.startDate, dateRange.endDate);
    await getAllRafData();
    await getAllRafScore(dateRange.startDate, dateRange.endDate);
    }
    fetchData()
    
  }, [dateRange]);

  const [rafState, setRafState]=useState();
  useEffect(()=>{
    const fetchData=async()=>{
      const data=await getAllRafScore(dateRange.startDate, dateRange.endDate)
      setRafState(data.response)
    }
    fetchData()
  },[])

  const rafScoreByDateForSuggested =rafState?.rafScoreByDateForSuggested?Object.values(rafState.rafScoreByDateForSuggested):[]

  const rafScoreByDateForHcc = rafState?.rafScoreByDateForHcc?Object.values(rafState.rafScoreByDateForHcc):[]


  const premiumByDateForHcc = getAllRaf?.premiumByDateForHcc
    ? Object.values(getAllRaf.premiumByDateForHcc)
    : [];

  const premiumByDateForSuggested = getAllRaf?.premiumByDateForSuggested
    ? Object.values(getAllRaf.premiumByDateForSuggested)
    : [];

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        // label: {
        //   backgroundColor: rafColor,
        // },
      },
    },
    legend: {
      show: false,
    },
    // toolbox: {
    //   feature: {
    //     saveAsImage: {}
    //   }
    // },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data:
          isHcc || isCargaps 
            ? [...chartRafData?.keys()]
            : [
                "jan",
                "feb",
                "mar",
                "apr",
                "may",
                "jun",
                "jul",
                "aug",
                "sep",
                "oct",
                "nov",
                "dec",
              ],
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: isCargaps ? "Car gap Codes" : isHcc ? "HCC Codes" : "Total Codes",
        type: "line",
        itemStyle: {
          color: rafColor,
        },
        areaStyle: {
          color: rafColor,
        },
        emphasis: {
          focus: "series",
        },
        // data: rafColor ,

        data: isHcc
          ? [...chartRafData.keys()].length != 12
            ? [...chartRafData.values()]
            : rafScoreByDateForSuggested
          : isCargaps
          ? [...chartRafData.keys()].length != 12
            ? [...chartRafData.values()]
            : rafScoreByDateForHcc
          : [10,20,30,44,21],
      },

      {
        name: "HCC Codes",
        type: "line",
        itemStyle: {
          color: rafColor2,
        },
        areaStyle: {
          color: rafColor2,
        },
        emphasis: {
          focus: "series",
        },
        data: rafColor2 && premiumByDateForHcc,
      },
      {
        name: "Car gaps Codes",
        type: "line",
        itemStyle: {
          color: rafColor3,
        },
        areaStyle: {
          color: rafColor3,
        },
        emphasis: {
          focus: "series",
        },
        data: rafColor3 && rafScoreByDateForSuggested && rafScoreByDateForHcc,
      },
    ],
  };
  return <ReactECharts option={option} />;

};


const enhancer = connect(
  (state) => ({
    getAllHccCodes:
      state?.tenantAdmin?.dashboard?.default?.allHccCodes?.data?.response,
    getAllRaf:
      state?.tenantAdmin?.dashboard?.default?.allRafCounts?.data?.response,
    getAllRafScoreData:
      state?.tenantAdmin?.dashboard?.default?.allRafScore?.data?.response,
  }),
  {
    getAllHccCodesData: HccCodes,
    getAllRafData: RafCounts,
    getAllRafScore: RafCountScore,
  }
);
export default enhancer(RafGraph);
