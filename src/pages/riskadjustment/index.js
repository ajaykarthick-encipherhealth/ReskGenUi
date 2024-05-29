import React, { useState } from "react";
import style from "./style.module.css";
import { Button, DatePicker, Input, Space } from "antd";
import TableRisk from "../../components/tableRisk";
import data  from './data.json'

const Riskadjustment = () => {
  const [code, setCode] = useState("");
  const [selectedYear, setSelectedYear] = useState(null);

  const subheader = [
    { label: "Year", value: "year" },
    { label: "PACE/ESRD v21 (Yes/No)", value: "pace" },
    { label: "V22 (Yes/No)", value: "v22" },
    { label: "V24 (Yes/No)", value: "v24" },
    { label: "V05 (Yes/No)", value: "v05" },
  ];
  const handleCode = (e) => {
    setCode(e.target.value);
  };

  const onChange = (date, dateString) => {
    setSelectedYear(date);
  }; 
  const handleSearchClick = () => {

  };// Future use case 

  return (
    <div className="container-fluid">
      <div className="row mt-3 ">
        <div className="col-6">
          <div className={style.text}>Year</div>
          <div className="mt-1">
            <DatePicker
              className={style.year}
              onChange={onChange}
              picker="year"
              placeholder="Year"
              value={selectedYear}
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
          className= {`${style.textarea } form-control` }
          id="exampleFormControlTextarea1"
          placeholder="Description"
          rows="3"></textarea>
      </div>
      <div className="d-flex align-items-center justify-content-center mt-4 ">
        <Button className={style.btn} onClick={handleSearchClick}>
          <div className={style.search}>Search</div>
        </Button>
      </div>
      <TableRisk data={data?.response?.tabledata} subheader={subheader} />
    </div>
  );
};

export default Riskadjustment;
