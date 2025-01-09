import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { connect } from "react-redux";
import {
  HccCodes,
  RafCounts,
  getAllRafScore,
} from "../../../../../stores/tenantAdmin/dashboard/default/action.js";
import {
  getLast30Days,
  getLast7Days,
  formatValues,
} from "../../../../../utils/reusable.js";
import moment from "moment";
const RafGraph = ({
  rafColor,
  rafColor2,
  rafColor3,
  isCargaps,
  isHcc,
  getAllRafScoreData,
  getAllRafScoreAPI,
  selectedValue,
  selectedOrganization,
  customDate,
}) => {
  const [dateRange, setDateRange] = useState({
    startDate:
      moment().subtract(29, "days").format("YYYY-MM-DD") + "T00:00:00.000Z",
    endDate: moment().format("YYYY-MM-DD") + "T23:59:59.000Z",
  });

  useEffect(() => {
    getAllRafScoreAPI(
      dateRange.startDate,
      dateRange.endDate,
      selectedOrganization
    );
  }, [dateRange, selectedOrganization]);

  const dates =
    selectedValue === "custom"
      ? customDate
      : selectedValue === "last_1_week"
      ? getLast7Days()
      : getLast30Days();
  const rafScoreByDateForHcc = getAllRafScoreData?.rafScoreByDateForHcc;
  const resultArrayHCC = formatValues(rafScoreByDateForHcc, dates);
  const rafScoreByDateForSuggested =
    getAllRafScoreData?.rafScoreByDateForSuggested;
  const resultArrayCaregaps = formatValues(rafScoreByDateForSuggested, dates);
  const totalCodes = resultArrayHCC.map((num, index) => num + resultArrayCaregaps[index]);


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
          selectedValue === "custom"
            ? customDate
            : selectedValue === "last_1_week"
            ? getLast7Days()
            : getLast30Days(),
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: isCargaps
          ? "Care Gap Codes"
          : isHcc
          ? "HCC Codes"
          : "Total Codes",
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
        data: isHcc ? resultArrayHCC : isCargaps ? resultArrayCaregaps : totalCodes,
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
        data: rafColor2 && resultArrayHCC,
      },
      {
        name: "Care Gaps Codes",
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
        data: rafColor3 && resultArrayCaregaps,
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
    getAllRafScoreAPI: getAllRafScore,
  }
);
export default enhancer(RafGraph);
