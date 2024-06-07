"use client";
import { useState, useEffect } from "react";
import { actions as dashbaordActions } from "../../stores/codify/dashboard";
import { connect } from "react-redux";
import { Button, Empty } from "antd";
import {
  FilterOutlined,
  SearchOutlined,
  ArrowRightOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import style from "./style.module.css";
import Tables from "../../components/tablecodify";
import Codes from "../codes";
import Riskadjustment from "../../components/riskadjustment";

const Codify = ({ codifyData, codesData, recentsearch }) => {
  const [showButtons, setShowButtons] = useState(false);
  const [showAlphabets, setShowAlphabets] = useState(false);
  const [currentButton, setCurrentButton] = useState("Codes");
  const [activeButton, setActiveButton] = useState("ICD-10");
  const [activeAlphabet, setActiveAlphabet] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [codeData, setCodeData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [searches, setSearches] = useState([]);

  const handleRiskAdjustment = () => {
    setActiveButton("Risk Adjustment");
    setShowAlphabets(false);
    setShowButtons(false);
  };
  const handleButtonClick = () => {
    setActiveButton("ICD-10");
    setSearchInput(null);
  };
  const handleAlphabetClick = (alphabet) => {
    setActiveAlphabet(alphabet);
  };
  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };
  const convertToAntdTreeData = (node) => {
    const { name, desc, children, requiredCharacter } = node;
    const treeNode = {
      title: (
        <div className="d-flex gap-1">
          <span className={style.name}>{name}</span>
          <span className={style.desc}>-{desc}</span>
        </div>
      ),
      key: name,
      icon: requiredCharacter,
      children: children ? children.map(convertToAntdTreeData) : [],
    };
    return treeNode;
  };

  const convertICDStructureToTreeData = (icdStructure) => {
    return icdStructure?.map(convertToAntdTreeData);
  };
  const fetch = async () => {
    setLoading(true);
    let treeData = await codifyData({ diseases: searchInput });
    if (treeData?.status == "SUCCESS") {
      let temp = convertICDStructureToTreeData(treeData?.response);
      if (!treeData?.response?.length) {
        setNoData(true);
      } else {
        setNoData(false);
      }
      setData(temp);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    fetch();
  };

  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      fetch();
      fetchcode();
    }
  }
  const searchfetch = async () => {
    let searchData = await recentsearch({});
    if (searchData?.status === "SUCCESS") {
      const filteredSearches = searchData?.response
        .filter((item) => item.searchFrom === "TREE_VIEW")
        .map((item) => item.searchedCode);
      setSearches(filteredSearches);
    }
  };

  useEffect(() => {
    searchfetch();
  }, []);

  // const alphabets = [
  //   "A",
  //   "B",
  //   "C",
  //   "D",
  //   "E",
  //   "F",
  //   "G",
  //   "H",
  //   "I",
  //   "J",
  //   "K",
  //   "L",
  //   "M",
  //   "N",
  //   "O",
  //   "P",
  //   "Q",
  //   "R",
  //   "S",
  //   "T",
  //   "U",
  //   "V",
  //   "W",
  //   "X",
  //   "Y",
  //   "Z",
  // ];

  const onChange = (key) => {}; // Future use case for onChange

  const fetchcode = async () => {
    setLoading(true);
    const tableData = await codesData({ code: searchInput });
    if (tableData?.status == "SUCCESS") {
      setCodeData({
        ...codeData,
        name: tableData?.response?.name,
        desc: tableData?.response?.desc,
        excludes1: tableData?.response?.excludes1,
        children: tableData?.response?.children,
        inclusionTerm: tableData?.response?.inclusionTerm,
      });
    }
    setLoading(false);
  };
  useEffect(() => {
    if (!searchInput?.length) {
      setData(null);
      setCodeData(null);
      setNoData(false);
    } else if (data && data.length === 0) {
      setNoData(true);
      // setSearchInput(null)
    } else {
      setNoData(false);
    }
  }, [searchInput, data]);

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
        {/* <div className="col-1">
          <div className="d-flex justify-content-center">
            <FilterOutlined
              style={{ fontSize: "20px" }}
              onClick={() => setShowAlphabets(!showAlphabets)}
            />
          </div>
        </div> */}
      </div>
      {/* {showAlphabets && (
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
      )} */}
      <div className="row">
        {activeButton === "ICD-10" && (
          <>
            <div className="p-3 d-flex gap-3">
              <input
                className={style.input}
                type="text"
                placeholder="Keywords, codes or code range between codes"
                value={searchInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
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
              <Button
                className={currentButton === "Codes" ? style.both : style.code}
                onClick={() => setCurrentButton("Codes")}
              >
                Tree View
              </Button>
              <Button
                className={
                  currentButton === "Description" ? style.both : style.code
                }
                onClick={() => setCurrentButton("Description")}
              >
                Codes
              </Button>
            </div>

            <div className="p-3 d-flex gap-3 ">
              <div className={style.p}>Recent searches</div>
              <CaretDownOutlined
                style={{ fontSize: "20px" }}
                onClick={() => setShowButtons(!showButtons)}
              />
            </div>

            {showButtons && currentButton === "Codes" && (
              <div className="d-flex gap-3  flex-wrap mx-2">
                {searches.map((search, index) => (
                  <Button className={style.btnborder} key={index}>
                    {search}
                  </Button>
                ))}
              </div>
            )}
            {currentButton == "Codes" && data?.length ? (
              <Codes
                searchInput={searchInput}
                data={data}
                loading={loading}
                setCurrentButton={setCurrentButton}
              />
            ) : (
              <></>
            )}
            {noData && (
              <p className="d-flex justify-content-center">
                "Uh oh! It seems there might be a typo. Please review your
                spelling or try a different keyword."
              </p>
            )}
            {currentButton == "Description" && (
              <Tables
                setCodeData={setCodeData}
                loading={loading}
                codeData={codeData}
                setLoading={setLoading}
              />
            )}
          </>
        )}
      </div>

      {activeButton === "Risk Adjustment" && (
        <Riskadjustment
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          setSearchInput={setSearchInput}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};

const enhancer = connect((state) => ({ state }), {
  codifyData: dashbaordActions.codifyAction,
  codesData: dashbaordActions.codesAction,
  recentsearch: dashbaordActions.searchesAction,
});
export default enhancer(Codify);
