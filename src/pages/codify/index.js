"use client";
import { useState, useEffect } from "react";
import { Button } from "antd";
import {
  FilterOutlined,
  SearchOutlined,
  CaretDownOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import style from "./style.module.css";
import { Collapse } from "antd";
import Tables from "../../components/tablecodify";
import Riskadjustment from "../riskadjustment";
import CodifyButton from "../../components/codifyButton";
import Codes from "../codes";
import { actions as dashbaordActions } from "../../stores/codify/dashboard";
import { connect } from "react-redux";
import Code from "../indexes";

const Codify = ({ codifyData }) => {
  const [showButtons, setShowButtons] = useState(false);
  const [showAlphabets, setShowAlphabets] = useState(false);
  const [hideContent, setHideContent] = useState(false);
  const [currentButton, setCurrentButton] = useState("Both");
  const [activeButton, setActiveButton] = useState("ICD-10");
  const [activeAlphabet, setActiveAlphabet] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRiskAdjustment = () => {
    setShowButtons(false);
    setHideContent(true);
    setActiveButton("Risk Adjustment");
    setShowAlphabets(false);
  };
  const handleButtonClick = () => {
    setHideContent(false);
    setActiveButton("ICD-10");
  };
  const handleAlphabetClick = (alphabet) => {
    setActiveAlphabet(alphabet);
   
  };
  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
   
  };

  const fetch = async () => {

    setLoading(true);
    const treeData = await codifyData({ diseases: searchInput });
    if (treeData?.status == "SUCCESS") {
      setData(treeData?.response);
    }
    setLoading(false); 
    console.log(treeData, "treeData");
  
  };

  const handleSearch = () => {
    fetch();
    console.log("Search clicked with input:", searchInput);
  };

  const buttons = [
    "I10",
    "D48.113",
    "D48.114",
    "D48.115",
    "D48.116",
    "D48.117",
    "D48.118",
    "I10",
    "D48.113",
    "D48.114",
    "D48.115",
  ];
  const alphabets = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  const onChange = (key) => {
    console.log(key);
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
    },
    {
      title: "Description",
      dataIndex: "Description",
    },
  ];
  const datas = [
    {
      key: "1",
      code: "A41.154",
      Description: "Sepsis due to  Acinetobcater baumannii",
    },
    {
      key: "2",
      code: "A41.154",
      Description: "Sepsis due to  Acinetobcater baumannii",
    },
    {
      key: "3",
      code: "A41.154",
      Description: "Sepsis due to  Acinetobcater baumannii",
    },
    {
      key: "4",
      code: "A41.154",
      Description: "Sepsis due to  Acinetobcater baumannii",
    },
    {
      key: "5",
      code: "A41.154",
      Description: "Sepsis due to  Acinetobcater baumannii",
    },
  ];

  const items = [
    {
      key: "1",
      label:
        " Updates to the ICD-10-CM coding system have been implemented-2024",
      children: (
        <div>
          <Tables data={datas} columns={columns} />
        </div>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row  mt-3 px-1">
        <div className="col-11">
          <div className="d-flex gap-2">
            <Button
              className={activeButton === "ICD-10" ? style.btn : style.button}
              onClick={handleButtonClick}
            >
              ICD-10
            </Button>
            <Button
              className={
                activeButton === "Risk Adjustment" ? style.btn : style.button
              }
              onClick={handleRiskAdjustment}
            >
              Risk Adjustment
            </Button>
          </div>
        </div>
        <div className="col-1">
          <div className="d-flex justify-content-center">
            <FilterOutlined
              style={{ fontSize: "20px" }}
              onClick={() => setShowAlphabets(!showAlphabets)}
            />
          </div>
        </div>
      </div>
      {showAlphabets && (
        <div className="d-flex gap-1 p-2 flex-wrap">
          {alphabets.map((name, index) => (
            <div onClick={() => handleAlphabetClick(name)}>
              <Button
                className={
                  activeAlphabet === name ? style.btn : style.alphabets
                }
                key={index}
              >
                {name}
              </Button>
            </div>
          ))}

          <Button
            className={style.arrow}
            icon={<ArrowRightOutlined className={style.arrowcolor} />}
          />
        </div>
      )}
      {!hideContent ? (
        <div className="row">
          <div className="p-3 d-flex gap-3">
            <input
              className={style.input}
              type="text"
              placeholder="Keywords, codes or code range between codes"
              value={searchInput}
              onChange={handleInputChange}
            />
            <div className="">
              <Button
                className={style.search}
                icon={<SearchOutlined className={style.btncolor} />}
                onClick={handleSearch}
              />
            </div>
          </div>

          <div className="d-flex gap-2 px-3 ">
            <CodifyButton
              label={"Both"}
              className={currentButton === "Both" ? style.both : style.code}
              onClick={() => setCurrentButton("Both")}
            />
            <CodifyButton
              label={"Codes"}
              className={currentButton === "Codes" ? style.both : style.code}
              onClick={() => setCurrentButton("Codes")}
            />
            <CodifyButton
              label={"Indexes"}
              className={currentButton === "Indexes" ? style.both : style.code}
              onClick={() => setCurrentButton("Indexes")}
            />
          </div>
          {currentButton == "Both" && (
            <div>
              <div className="p-3 d-flex gap-3 ">
                <div className={style.p}>Recent searches</div>
                <CaretDownOutlined
                  style={{ fontSize: "20px" }}
                  onClick={() => setShowButtons(!showButtons)}
                />
              </div>
              {showButtons && (
                <div className="d-flex gap-2 p-2 flex-wrap ">
                  {buttons.map((name, index) => (
                    <Button className={style.btnborder} key={index}>
                      {name}
                    </Button>
                  ))}
                </div>
              )}
              <div className="p-2 mt-3 collapsestyle">
                <Collapse
                  onChange={onChange}
                  expandIconPosition={"end"}
                  className={style.collapse}
                  pagination={false}
                  items={items}
                />
              </div>
              <div className="p-2 mt-2">
                <Collapse
                  onChange={onChange}
                  expandIconPosition={"end"}
                  className={style.collapse}
                  pagination={false}
                  items={items}
                />
              </div>
            </div>
          )}
          {currentButton == "Codes" && (
            <Codes searchInput={searchInput} data={data} loading={loading} setCurrentButton={setCurrentButton} />
          )}
          {currentButton == "Indexes" && <Code/>}
        </div>
      ) : (
        <Riskadjustment />
      )}
    </div>
  );
};

const enhancer = connect((state) => ({ state }), {
  codifyData: dashbaordActions.codifyAction,
});
export default enhancer(Codify);
