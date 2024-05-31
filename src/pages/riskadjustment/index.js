import React, { useState } from "react";
import style from "./style.module.css";
import { actions as dashbaordActions } from "../../stores/codify/dashboard";
import { connect } from "react-redux";
import { Button, DatePicker, Empty, Input, Space, Spin } from "antd";
import TableRisk from "../../components/tableRisk";
import YearPicker from "../../components/yearpicker";
import { CloseCircleOutlined,CheckCircleOutlined } from "@ant-design/icons";


const RiskAdjustment = ({ RiskAdjustmentData, loading, setLoading }) => {
  const [code, setCode] = useState("");
 
  const [data, setData] = useState([]);
  const [year, setYear] = useState();
  const [selectedYear, setSelectedYear] = useState(currentDate);
  const currentDate = new Date();

  const subheader = [
    { label: "Year", value: "year" },
    { label: "ESRD/v21 ", value: "cmsHccEsrdModelCategoryV21Payment" },
    { label: "ESRD/v24 ", value: "cmsHccEsrdModelCategoryV24Payment" },
    { label: "V22 ", value: "cmsHccModelCategoryV22Payment" },
    { label: "V24 ", value: "cmsHccModelCategoryV24Payment" },
    { label: "V08 ", value: "rxHccModelCategoryV08Payment" },
    { label: "V05 ", value: "rxHccModelCategoryV05Payment" },
    {label:"V08",value:"rxHccModelCategoryV08Payment"}
  ];
  const handleCode = (e) => {
    setCode(e.target.value);
  };

  const onChange = (date, dateString) => {
    setSelectedYear(date);
  };
 
  const handleSearchClick = () => {
    setLoading(true)
    fetch();
  };

  const fetch = async () => {
    const riskData = await RiskAdjustmentData({
      year: selectedYear,
      code: code,
    });

    if (riskData?.status == "SUCCESS")
      setLoading(false)
    setData({
      ...data,
      year: riskData?.response?.year,
      diagnosisCode: riskData?.response?.diagnosisCode,
      description: riskData?.response?.description,
      cmsHccEsrdModelCategoryV24Payment:
        riskData?.response?.cmsHccEsrdModelCategoryV24Payment === "Yes" ? (
          <CheckCircleOutlined style={{color:"green", fontSize:"20px"}} />
        ) : (
          <CloseCircleOutlined style={{color:"red", fontSize:"20px"} }/>
        ),
      cmsHccModelCategoryV22Payment:
        riskData?.response?.cmsHccModelCategoryV22Payment === "Yes" ? (
          <CheckCircleOutlined style={{color:"green", fontSize:"20px"}}/>
        ) : (
          <CloseCircleOutlined style={{color:"red", fontSize:"20px"} } />
        ),
      cmsHccModelCategoryV24Payment:
        riskData?.response?.cmsHccModelCategoryV24Payment === "Yes" ? (
          <CheckCircleOutlined  style={{color:"green", fontSize:"20px"}}/>
        ) : (
          <CloseCircleOutlined style={{color:"red", fontSize:"20px"} } />
        ),
      cmsHccEsrdModelCategoryV21Payment:
        riskData?.response?.cmsHccEsrdModelCategoryV21Payment === "Yes" ? (
          <CheckCircleOutlined style={{color:"green", fontSize:"20px"}} />
        ) : (
          <CloseCircleOutlined style={{color:"red", fontSize:"20px"} } />
        ),
      rxHccModelCategoryV08Payment:
        riskData?.response?.rxHccModelCategoryV08Payment === "Yes" ? (
          <CheckCircleOutlined style={{color:"green", fontSize:"20px"}} />
        ) : (
          <CloseCircleOutlined style={{color:"red", fontSize:"20px"} } />
        ),
      rxHccModelCategoryV05Payment:
        riskData?.response?.rxHccModelCategoryV05Payment === "Yes" ? (
          <CheckCircleOutlined style={{color:"green", fontSize:"20px"}} />
        ) : (
          <CloseCircleOutlined style={{color:"red", fontSize:"20px"} }/>
        ),
        rxHccModelCategoryV08Payment:
        riskData?.response?.rxHccModelCategoryV08Payment === "Yes" ? (
          <CheckCircleOutlined style={{color:"green", fontSize:"20px"}} />
        ) : (
          <CloseCircleOutlined style={{color:"red", fontSize:"20px"} }/>
        ),
    });
  };

  const handleYearChange = (date, dateString) => {
    setYear(date);
    setSelectedYear(dateString);
  };

  return (
    <div className="container-fluid">
      <div className="row mt-3 ">
        <div className="col-6">
          <div className={style.text}>Year</div>
          <div className="mt-1">
            <YearPicker
              className={style.year}
              onChangeYear={handleYearChange}
              val1={year}
              hideMonth={true}
            />
          </div>
        </div>
        <div className="col-6 ">
          <div className={style.text1}>Diagnosis Code</div>
          <div className="mt-1 d-flex justify-content-end">
            <Input
              className={style.input}
              placeholder="Basic usage"
              value={code}
              onChange={handleCode}
            />
          </div>
        </div>
      </div>
      <div className="col-12 mt-4">
        <div className={style.text}> Description</div>
        <textarea
          className={`${style.textarea} `}
         
          placeholder="Description"
          rows="3"
        ></textarea>
      </div>
      <div className="d-flex align-items-center justify-content-center mt-4 ">
        <Button className={style.btn} onClick={handleSearchClick}>
          <div className={style.search}>Search</div>
        </Button>
      </div>
      <div className="d-flex justify-content-center">
        {loading && <Spin size="large" />}
      </div>
      {data?.year ?<TableRisk data={data} subheader={subheader} /> :selectedYear && <Empty/>}
    </div>
  );
};

const enhancer = connect((state) => ({ state }), {
  RiskAdjustmentData: dashbaordActions.riskadjustmentAction,
});
export default enhancer(RiskAdjustment);
