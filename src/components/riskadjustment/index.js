import React, { useState, useEffect } from "react";
import style from "./style.module.css";
import { actions as dashbaordActions } from "../../stores/codify/dashboard";
import { connect } from "react-redux";
import { Button, DatePicker, Empty, Input, Space, Spin } from "antd";
import TableRisk from "../tableRisk";
import YearPicker from "../yearpicker";
import CardSkeleton from "../skeleton/card";

const RiskAdjustment = ({
  RiskAdjustmentData,
  loading,
  setLoading,
  activeButton,
  setActiveButton,
  setSearchInput,
  riskAdjustmentLoader,
}) => {
  const [code, setCode] = useState("");
  const [data, setData] = useState([]);
  const [year, setYear] = useState();
  const [selectedYear, setSelectedYear] = useState(currentDate);
  const [noData, setNoData] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const currentDate = new Date();

  const disabledDate = (date) => {
    const year = date.year();
    return year < 2016 || year > currentDate.getFullYear();
  };

  const handleCode = (e) => {
    const inputValue = e.target.value;
    const regex = /^[a-zA-Z0-9.]*$/;
    if (regex.test(inputValue)) {
      setCode(inputValue);
      setErrorMessage(null);
      setNoData(null);
    } else {
      setErrorMessage("Only characters and dots are allowed");
    }
  };

  const handleSearchClick = () => {
    if (!errorMessage) {
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
    if (event.keyCode === 13 && !errorMessage) {
      fetch();
    }
  }

  const handleYearChange = (date, dateString) => {
    setYear(date);
    setSelectedYear(dateString);
  };

  useEffect(() => {
    if (!code?.length) {
      setData(null);
      setNoData(false);
    } else if (data && data.length === 0) {
      setNoData(true);
    } else {
      setNoData(false);
    }
  }, [code, data]);

  return (
    <div className="container-fluid">
      <div className="row mt-3 ">
        <div className="col-6">
          <div className={style.text}>Year</div>
          <div className="mt-1">
            <div className="customPicker">
              <YearPicker
                className={style.year}
                onChangeYear={handleYearChange}
                val1={year}
                hideMonth={true}
                disabledDate={disabledDate}
              />
            </div>
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
              maxLength={10}
            />
          </div>
          {errorMessage && (
            <div className="text-danger ml-2">{errorMessage}</div>
          )}
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-center mt-4 ">
        <Button
          className="btn btn-sm ms-2 flr width-max-content custom-btn-style"
          onClick={handleSearchClick}
          disabled={!year || !code}
        >
          <div className={style.search}>Search</div>
        </Button>
      </div>
      {riskAdjustmentLoader ? (
        <div className="mt-3">
          <CardSkeleton height={250} />
        </div>
      ) : data?.[0]?.year && data?.length ? (
        <div className="mt-3">
          <TableRisk
            activeButton={activeButton}
            setActiveButton={setActiveButton}
            setSearchInput={setSearchInput}
            data={data}
          />
        </div>
      ) : null}
      {noData && <Empty />}
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    riskAdjustmentLoader: state.codify.codify?.riskAdjustmentLoader,
  }),
  {
    RiskAdjustmentData: dashbaordActions.riskadjustmentAction,
  }
);
export default enhancer(RiskAdjustment);
