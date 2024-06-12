import React, { useState, useEffect } from "react";
import style from "./style.module.css";
import { actions as dashbaordActions } from "../../stores/codify/dashboard";
import { connect } from "react-redux";
import { Button, DatePicker, Empty, Input, Space, Spin } from "antd";
import TableRisk from "../tableRisk";
import YearPicker from "../yearpicker";
import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";

const RiskAdjustment = ({
  RiskAdjustmentData,
  loading,
  setLoading,
  activeButton,
  setActiveButton,
  setSearchInput,
}) => {
  const [code, setCode] = useState("");
  const [data, setData] = useState([]);
  const [year, setYear] = useState();
  const [selectedYear, setSelectedYear] = useState(currentDate);
  const [errorMessage, setErrorMessage] = useState("");
  const [codeErrorMessage, setCodeErrorMessage] = useState("");
  const [yearErrorMessage, setYearErrorMessage] = useState("");
  const [noData, setNoData] = useState("");
  const currentDate = new Date();

  const disabledDate = (date) => {
    const year = date.year();
    return year < 2016 || year > 2024;
  };

  const handleCode = (e) => {
    const inputValue = e.target.value;
    const regex = /^[a-zA-Z0-9.]*$/;
    if (regex.test(inputValue)) {
      setCode(inputValue);
      setErrorMessage(null);
      setNoData(null);
      setCodeErrorMessage(null);
    } else {
      setErrorMessage("Only characters and dots are allowed");
    }
  };

  const handleSearchClick = () => {
    if (!code && !selectedYear) {
      setCodeErrorMessage("Please enter a Diagnosis Code");
      setYearErrorMessage("Please select a Year");
    } else {
      setCodeErrorMessage("");
      setYearErrorMessage("");
      setLoading(true);
      fetch();
    }
  };

  const fetch = async () => {
    const riskData = await RiskAdjustmentData({
      year: selectedYear,
      code: code,
    });
    if (riskData?.status == "SUCCESS") setLoading(false);
    if (!riskData?.response?.length) {
      setNoData(true);
    } else {
      setNoData(false);
    }
    setLoading(false);

    setData(riskData?.response);
  };
  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      fetch();
    }
  }

  const handleYearChange = (date, dateString) => {
    setYear(date);
    setSelectedYear(dateString);
    setYearErrorMessage(null);
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
              disabledDate={disabledDate}
            />
            {yearErrorMessage && (
              <div className="text-danger ml-2">{yearErrorMessage}</div>
            )}
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
              onKeyDown={handleKeyDown}
            />
          </div>
          {codeErrorMessage && (
            <div className="text-danger ml-2">{codeErrorMessage}</div>
          )}
          {errorMessage && (
            <div className="text-danger ml-2">{errorMessage}</div>
          )}
        </div>
      </div>
      <div className="col-12 mt-4">
        <div className={style.text}> Description</div>
        <textarea
          className={`${style.textarea} `}
          placeholder="Description"
          rows="2"
        ></textarea>
      </div>
      <div className="d-flex align-items-center justify-content-center mt-4 ">
        <Button className={style.btn} onClick={handleSearchClick}>
          <div className={style.search}>Search</div>
        </Button>
      </div>
      <div className="d-flex justify-content-center mt-4">
        {loading && <Spin size="large" />}
      </div>

      {data?.[0]?.year ? (
        <TableRisk
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          setSearchInput={setSearchInput}
          data={data}
        />
      ) : (
        ""
      )}
      {noData && <Empty />}
    </div>
  );
};

const enhancer = connect((state) => ({ state }), {
  RiskAdjustmentData: dashbaordActions.riskadjustmentAction,
});
export default enhancer(RiskAdjustment);
