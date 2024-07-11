import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { connect } from "react-redux";
import {
  HccCodes,
  RafCounts,
  getAllRafScore,
} from "../../../../../stores/tenantAdmin/dashboard/default/action.js";
import { getLast30Days, getLast7Days } from "../../../../../utils/reusable.js";
import moment from "moment";
const RafGraph = ({
  rafColor,
  rafColor2,
  rafColor3,
  isCargaps,
  isHcc,
  getAllRafScoreData,
  getAllRafScore,
  selectedValue,
  selectedOrganization,
}) => {
  const [dateRange, setDateRange] = useState({
    startDate:
      moment().subtract(29, "days").format("YYYY-MM-DD") + "T00:00:00.000Z",
    endDate: moment().format("YYYY-MM-DD") + "T23:59:59.000Z",
  });

  useEffect(() => {
    getAllRafScore(
      dateRange.startDate,
      dateRange.endDate,
      selectedOrganization,
    );
  }, [dateRange, selectedOrganization]);


  const rafScoreByDateForSuggested =
    getAllRafScoreData?.rafScoreByDateForSuggested
      ? Object.values(getAllRafScoreData.rafScoreByDateForSuggested)
      : [];

  const rafScoreByDateForHcc = getAllRafScoreData?.rafScoreByDateForHcc
    ? Object.values(getAllRafScoreData.rafScoreByDateForHcc)
    : [];

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    legend: {
      show: false,
    },
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
          selectedValue === "last_1_week" ? getLast7Days() : getLast30Days(),
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
        data: isHcc
          ? rafScoreByDateForSuggested
          : isCargaps
          ? rafScoreByDateForHcc
          : "",
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
        data: rafColor2 && rafScoreByDateForHcc,
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
        data: rafColor3 && rafScoreByDateForSuggested,
      },
    ],
  };
  return (
    <div className="carecapRAF">
    
      <ReactECharts option={option} />
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    getAllHccCodes:
      state?.tenantAdmin?.dashboard?.default?.allHccCodes?.data?.response,
    getAllRaf:
      state?.tenantAdmin?.dashboard?.default?.allRafCounts?.data?.response,
    getAllRafScoreData:
      state?.tenantAdmin?.dashboard?.default?.allRafScoreData?.data?.response,
  }),
  {
    getAllHccCodesData: HccCodes,
    getAllRafData: RafCounts,
    getAllRafScore: getAllRafScore,
  }
);
export default enhancer(RafGraph);
