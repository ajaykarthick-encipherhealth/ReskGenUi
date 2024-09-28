"use client";
import { useState, useEffect, use } from "react";
import { actions as dashbaordActions } from "../../stores/codify/dashboard";
import { connect, useSelector } from "react-redux";
import { Button, Empty } from "antd";
import { SearchOutlined, CaretDownOutlined } from "@ant-design/icons";
import style from "./style.module.css";
import Tables from "../../components/tablecodify";
import Codes from "../../jsx/components/codes";
import Riskadjustment from "../../components/riskadjustment";
import { AutoComplete, Input } from "antd";
import { Tree } from "antd";
import { Spin } from "antd";

const mockVal = (str, repeat = 1) => ({
  value: str.repeat(repeat),
});

const Codify = ({
  codifyData,
  codesData,
  recentsearch,
  completeData,
  indexesData,
  codifyDataLoading,
  drawerWidth,
}) => {
  const [showButtons, setShowButtons] = useState(false);
  const [currentButton, setCurrentButton] = useState("Codes");
  const [activeButton, setActiveButton] = useState("ICD-10");
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [codeData, setCodeData] = useState([]);
  const [noData, setNoData] = useState({
    codeData: false,
    indexData: false,
    data: false,
  });
  const [searches, setSearches] = useState([]);
  const [options, setOptions] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [parentCode, setParentCode] = useState([]);
  const [hideButton, setHideButton] = useState(false);
  const [indexData, setIndexData] = useState([]);

  const { loading: indexesDataLoading } = useSelector(
    (state) => state.codify.codify.indexes
  );
  const getPanelValue = (searchText) =>
    !searchText ? [] : [mockVal(searchText)];

  const handleRiskAdjustment = () => {
    setActiveButton("Risk Adjustment");
    setShowButtons(false);
    setHideButton(false);
  };
  const handleButtonClick = () => {
    setActiveButton("ICD-10");
    setSearchInput(null);
    setParentCode(null);
  };
  const handleInputChange = (e) => {
    setNoData({ codeData: false, indexData: false, data: false });
    setSearchInput(e.target.value);
    setParentCode(null);
  };
  const onSelect = (value) => {
    setSearchInput(value);
    fetchTreeData(value);
    fetchCodeData(value);
  };
  const handleTreeViewClick = (value) => {
    setSearchInput(value?.[0]);
    setCurrentButton("Description");
    fetchCodeData(value);
    setIndexData(null);
  };

  const handleSearchClick = (value) => {
    setSearchInput(value);
    fetchTreeData(value);
    fetchCodeData(value);
    setHideButton(false);
  };

  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      if (currentButton !== "Indexes") {
        fetchTreeData();
        fetchCodeData();
        fetchIndexData();
      }
      if (currentButton == "Indexes") {
        fetchIndexData();
      }
    }
  }
  const handleSearchButton = () => {
    fetchTreeData();
    fetchCodeData();
    fetchIndexData();
  };
  const handleIndexClick = (clickedWord) => {
    const IndexWord = clickedWord.split(", ")[0];
    setSearchInput(IndexWord);
    fetchIndexData(IndexWord);
    setData(null);
    setCodeData(null);
  };
  const handleIndexCodeClick = (value) => {
    const code = value.split("-")[0];
    setSearchInput(code);
    setCurrentButton("Description");
    fetchCodeData(code);
    fetchTreeData(code);
    setData(null);
    setCodeData(null);
    setParentCode(null);
  };

  useEffect(() => {
    if (currentButton !== "Indexes") {
      completeFetch();
    }
  }, [searchInput]);

  useEffect(() => {
    if (
      !data?.length &&
      !indexData?.length &&
      !codeData?.name &&
      !searchInput?.length > 2
    ) {
      setNoData({ codeData: true, indexData: true, data: true });
    } else if (
      !data?.length &&
      !indexData?.length &&
      !searchInput?.length > 2
    ) {
      setNoData({ codeData: false, indexData: true, data: true });
    } else if (!data?.length && !codeData?.name && !searchInput?.length > 2) {
      setNoData({ codeData: true, indexData: false, data: true });
    } else if (
      !codeData?.name &&
      !indexData?.length &&
      !searchInput?.length > 2
    ) {
      setNoData({ codeData: true, indexData: true, data: false });
    } else {
      setNoData({ codeData: false, indexData: false, data: false });
    }
  }, [data, codeData, indexData, searchInput]);

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

  const fetchTreeData = async (value) => {
    setLoading(true);
    let treeData = await codifyData({ diseases: value ? value : searchInput });
    if (treeData?.status == "SUCCESS") {
      let temp = convertICDStructureToTreeData(treeData?.response);
      setData(temp);
    }
    setLoading(false);
  };

  const convertToAntdIndexData = (node) => {
    const { title, seeAlso, term, code, see, seeCat, subCat, manif } = node;

    const modstr = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
    const IndexNode = {
      title: (
        <div className="d-flex gap-1">
          <span className={style.indextitle}>
            <span className={style.capital}>{modstr(title.charAt(0))}</span>
            {title.slice(1)}
          </span>
          {seeAlso && (
            <span
              onClick={() => handleIndexClick(seeAlso)}
              className={style.indexcode}
            >
              <span className={style.head}> See Also-</span>
              {seeAlso}
            </span>
          )}

          {see && (
            <span
              onClick={() => handleIndexClick(see)}
              className={style.indexcode}
            >
              <span className={style.head}>See-</span>
              {see}
            </span>
          )}

          {seeCat && (
            <span
              onClick={() => handleIndexClick(seeCat)}
              className={style.indexcode}
            >
              {seeCat}
            </span>
          )}

          {subCat && (
            <span
              onClick={() => handleIndexClick(subCat)}
              className={style.indexcode}
            >
              [{subCat}]
            </span>
          )}

          {code && (
            <span
              onClick={() => handleIndexCodeClick(code)}
              className={style.indexcode}
            >
              - {code}
            </span>
          )}

          {manif && (
            <span
              onClick={() => handleIndexClick(manif)}
              className={style.indexcode}
            >
              [{manif}]
            </span>
          )}
        </div>
      ),
      children: term ? term.map(convertToAntdIndexData) : [],
    };

    return IndexNode;
  };

  const convertIndexStructureToTreeData = (indexStructure) => {
    return indexStructure?.map(convertToAntdIndexData);
  };

  const fetchIndexData = async (value) => {
    setLoading(true);
    let indexTreeData = await indexesData({
      desc: value ? value : searchInput,
    });
    if (indexTreeData?.status == "SUCCESS") {
      let temp = convertIndexStructureToTreeData(indexTreeData?.response);

      setIndexData(temp);
    }
    setLoading(false);
  };

  const recentSearchTreeView = async () => {
    let searchData = await recentsearch();
    if (searchData?.status === "SUCCESS") {
      const filteredSearches = searchData?.response
        .filter((item) => item.searchFrom === "TREE_VIEW")
        .map((item) => item.searchedCode);
      setSearches(filteredSearches);
    }
  };

  const recentSearchTreeCode = async () => {
    let searchData = await recentsearch({});
    if (searchData?.status === "SUCCESS") {
      const codesearch = searchData?.response
        .filter((item) => item.searchFrom === "CODES")
        .map((item) => item.searchedCode);
      setSearches(codesearch);
    }
  };

  const completeFetch = async () => {
    let completedData = await completeData({ code: searchInput });
    if (completedData?.status === "SUCCESS") {
      const displayCodeOptions = completedData?.response?.displayStrings?.map(
        (x) => ({
          value: x[0],
          // label: x[0],
          label: (
            <div className="d-flex gap-1">
              <span className={style.name}>{x[0]}</span>
              <span className={style.desc}>-{x[1]}</span>
            </div>
          ),
        })
      );
      setOptions(displayCodeOptions);
    }
    setLoading(false);
  };

  const fetchCodeData = async (value) => {
    setLoading(true);
    const tableData = await codesData({ code: value ? value : searchInput });
    if (tableData?.status == "SUCCESS") {
      setCodeData({
        ...codeData,
        name: tableData?.response?.childData?.name,
        desc: tableData?.response?.childData?.desc,
        includes: tableData?.response?.childData?.includes,
        excludes1: tableData?.response?.childData?.excludes1,
        excludes2: tableData?.response?.childData?.excludes2,
        children: tableData?.response?.childData?.children,
        inclusionTerm: tableData?.response?.childData?.inclusionTerm,
        useAdditionalCode: tableData?.response?.childData?.useAdditionalCode,
        requiredCharacter: tableData?.response?.childData?.requiredCharacter,
        codeFirst: tableData?.response?.childData?.codeFirst,
        codeAlso: tableData?.response?.childData?.codeAlso,
      });
      setParentCode(tableData?.response?.parentData);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!searchInput?.length) {
      setData(null);
      setIndexData(null);
      setCodeData(null);
    }
  }, [searchInput, data, indexData, codeData]);

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
      </div>
      <div className="row">
        {activeButton === "ICD-10" && (
          <div>
            <div className="p-3 px-1 d-flex gap-3">
              <AutoComplete
                style={{ width: "100%" }}
                popupMatchSelectWidth={drawerWidth == "44%" ? 640 : ""}
                options={options}
                onSelect={onSelect}
                onSearch={(text) => setOptions(getPanelValue(text))}
                size="large"
                value={searchInput}
              >
                <Input
                  style={{ width: "100%" }}
                  className="antdselect"
                  placeholder="Keywords, codes or code range between codes"
                  value={searchInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
              </AutoComplete>
              <div className="antdbutton">
                <Button
                  className={`${style.search} `}
                  icon={<SearchOutlined className={style.btncolor} />}
                  onClick={handleSearchButton}
                />
              </div>
            </div>
            <div className="d-flex gap-2 px-1 ">
              <Button
                className={currentButton === "Codes" ? style.both : style.code}
                onClick={() => {
                  setCurrentButton("Codes");
                  setHideButton(false);
                }}
              >
                Tree View
              </Button>
              <Button
                className={
                  currentButton === "Description" ? style.both : style.code
                }
                onClick={() => {
                  setCurrentButton("Description"), setHideButton(false);
                }}
              >
                Codes
              </Button>
              <Button
                className={
                  currentButton === "Indexes" ? style.both : style.code
                }
                onClick={() => {
                  setCurrentButton("Indexes"), setHideButton(false);
                }}
              >
                Indexes
              </Button>
            </div>

            <div className="p-3 d-flex gap-3 ">
              <div className={style.p}>Recent searches</div>
              <CaretDownOutlined
                style={{ fontSize: "20px" }}
                onClick={() => {
                  setShowButtons(!showButtons);
                  recentSearchTreeView();
                  recentSearchTreeCode();
                }}
              />
            </div>

            {showButtons && currentButton === "Codes" && (
              <div className="d-flex gap-3  flex-wrap mx-2">
                {searches.map((search, index) => (
                  <Button
                    className={style.btnborder}
                    key={index}
                    value={searchInput}
                    onClick={() => handleSearchClick(search)}
                  >
                    {search}
                  </Button>
                ))}
              </div>
            )}
            {showButtons && currentButton === "Description" && (
              <div className="d-flex gap-3  flex-wrap mx-2">
                {searches.map((search, index) => (
                  <Button
                    className={style.btnborder}
                    key={index}
                    onClick={() => handleSearchClick(search)}
                    value={searchInput}
                  >
                    {search}
                  </Button>
                ))}
              </div>
            )}
            {currentButton == "Codes" && data?.length ? (
              <Codes
                searchInput={searchInput}
                data={data}
                loading={codifyDataLoading}
                setCurrentButton={setCurrentButton}
                onSelect={handleTreeViewClick}
                onExpand={onExpand}
                autoExpandParent={autoExpandParent}
                expandedKeys={expandedKeys}
                setLoading={setLoading}
              />
            ) : (
              <div></div>
            )}
            <div className="d-flex justify-content-center">
              {indexesDataLoading && <Spin size="large" />}
            </div>

            {currentButton === "Indexes" && indexData?.length ? (
              <div className=" mt-1 antdstyle">
                {codifyDataLoading ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <Spin size="large" />
                  </div>
                ) : (
                  <Tree
                    showLine={true}
                    treeData={indexData}
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                  />
                )}
              </div>
            ) : (
              <div></div>
            )}
            {currentButton === "Codes" && noData?.data && (
              <p className="d-flex justify-content-center">
                "Uh oh! It seems there might be a typo. Please review your
                spelling or try a different keyword."
              </p>
            )}
            {currentButton === "Indexes" && noData?.indexData && (
              <p className="d-flex justify-content-center">
                "Uh oh! It seems there might be a typo. Please review your
                spelling or try a different keyword."
              </p>
            )}
            {currentButton === "Description" && noData?.codeData && (
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
                parentCode={parentCode}
                setLoading={setLoading}
                setSearchInput={setSearchInput}
                searchInput={searchInput}
                setParentCode={setParentCode}
                hideButton={hideButton}
                setHideButton={setHideButton}
                setIndexData={setIndexData}
              />
            )}
          </div>
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

const enhancer = connect(
  (state) => ({
    codifyDataLoading: state.codify.codify.codifyLoader,
  }),
  {
    codifyData: dashbaordActions.codifyAction,
    codesData: dashbaordActions.codesAction,
    recentsearch: dashbaordActions.searchesAction,
    completeData: dashbaordActions.autoCompleteAction,
    indexesData: dashbaordActions.indexesAction,
  }
);
export default enhancer(Codify);
