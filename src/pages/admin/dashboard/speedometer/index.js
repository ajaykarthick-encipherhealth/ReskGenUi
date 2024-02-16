import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import styles from "./style.module.css";
import HeadTitle from "../../../../components/headtitle";
import ReactECharts from "echarts-for-react";
import Card from "../../../../components/card";
import { useSelector } from "react-redux";
import {
  getManagers,
  getSppedoMeterDatas,
} from "../../../../services/adminServices/DashboardService";
import { useDispatch } from "react-redux";
import { Select, Spin } from "antd";
import spinSTYles from "../../../../styles/auth.module.css";
import completStyle from '../completedStatus/styles.module.css'

const { Option } = Select;
const SpeedoMeter = () => {
  const dispatch = useDispatch();
  const managerOptions = useSelector(
    (state) => state.AdminDashboardReducers.managers
  );
  const meterDatas = useSelector(
    (state) => state.AdminDashboardReducers.speedometer
  );
  const [selectOption, setSelectedOption] = useState();
  const selectorOptions = managerOptions?.data?.response?.map((item) => ({
    label: `${item?.firstName}${item?.lastName}`,
    value: item?.userName,
  }));
  const option = {
    series: [
      {
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 12,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: "#EC4899" },
            { offset: 1, color: "#A855F7" },
          ]),
          shadowColor: "rgba(0,138,255,0.45)",
          shadowBlur: 10,
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
        progress: {
          show: true,
          roundCap: true,
          width: 28,
        },
        pointer: {
          icon: "path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z",
          length: "70%",
          width: 16,
          offsetCenter: [0, "5%"],
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 28,
          },
        },
        axisTick: {
          splitNumber: 2,
          lineStyle: {
            width: 2,
            color: "#999",
          },
        },
        splitLine: {
          length: 12,
          lineStyle: {
            width: 3,
            color: "#999",
          },
        },
        axisLabel: {
          show: false,
          distance: 30,
          color: "#999",
          fontSize: 20,
        },
        title: {
          show: false,
        },
        detail: {
          show: false,
          backgroundColor: "#fff",
          borderColor: "#999",
          borderWidth: 2,
          width: "100%",
          lineHeight: 40,
          height: 40,
          borderRadius: 8,
          offsetCenter: [0, "35%"],
          valueAnimation: true,
          formatter: function (value) {
            return value.toFixed(0);
          },
          rich: {
            value: {
              fontSize: 50,
              fontWeight: "bolder",
              color: "#777",
            },
            unit: {
              fontSize: 20,
              color: "#999",
              padding: [0, 0, -20, 10],
            },
          },
        },
        data: [
          {
            value: meterDatas?.data?.response
              ? meterDatas.data.response.accuracy
              : 0,
          },
        ],
      },
    ],
  };
  useEffect(() => {
    dispatch(getManagers());
    if (selectOption) {
      dispatch(getSppedoMeterDatas(selectOption));
    }
  }, [selectOption]);
  const handleClearSelection = () => {
    setSelectedOption(null);
  };

  return (
    <>
      <HeadTitle header="Accuracy" />
      <div className={styles.card3}>
        <Card borderRadius="28px">
          <div className={styles.header}>
            <div style={{ width: "85%", overflow: "hidden" }}>
              <div>
                <Select
                  showSearch
                  style={{ width: 150 }}
                  placeholder= "Select manager"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  value={selectOption ==='clear' ?<span style={{color:"#d9d9d9"}}>{"Select manager"}</span>:selectOption}
                  onChange={(value) => {
                    setSelectedOption(value);
                  }}
                  className={`custom_select_user ${completStyle.custom_select_user}`}
                >
                  <Option key={"clear"} onClick={handleClearSelection} 
                  disabled={selectOption?.length>0?false:true}>
                    Clear
               
                  </Option>
                  {selectorOptions?.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </div>
              {meterDatas?.loading || managerOptions?.loading ? (
                <div
                  className={spinSTYles.spinStyle}
                  style={{
                    height: "100%",
                    paddingTop: "150px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Spin
                    loading={meterDatas?.loading || managerOptions?.loading}
                  />
                </div>
              ) : (
                <>
                  <ReactECharts
                    option={option}
                    className={styles.chartOption}
                  />
                  <div className={styles.compus}>
                    <div>0%</div>
                    <div>{`${
                      meterDatas?.data?.response
                        ? meterDatas.data.response.accuracy
                        : 0
                    }%`}</div>
                    <div>100%</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default SpeedoMeter;
