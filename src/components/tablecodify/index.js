import React, { useState, useEffect } from "react";
import { actions as dashbaordActions } from "../../stores/codify/dashboard";
import { connect } from "react-redux";
import style from "./style.module.css";
import { Button, Empty, Spin } from "antd";
import {
  ArrowRightOutlined,
  CopyOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Tables = (props) => {
  const {
    codeData,
    setCodeData,
    loading,
    setLoading,
    setParentCode,
    parentCode,
    codesData,
    searchInput,
    setSearchInput,
    setHideButton,
    hideButton,
  } = props;

  const [isCopied, setCopied] = useState(false);
  const [previousCode, setPreviousCode] = useState();


  useEffect(() => {
    const timeout = setTimeout(() => {
      setCopied(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [isCopied]);

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
      });
      setParentCode(tableData?.response?.parentData);
    }
    setLoading(false);
  };

  const handleViewTable = (tableData, index) => {
    setLoading(true);
    setPreviousCode({
      ...previousCode,
      name: codeData?.name,
      desc: codeData?.desc,
      includes: codeData?.includes,
      excludes1: codeData?.excludes1,
      excludes2: codeData?.excludes2,
      children: codeData?.children,
      inclusionTerm: codeData?.inclusionTerm,
      useAdditionalCode: codeData?.useAdditionalCode,
      requiredCharacter: codeData?.requiredCharacter,
    });
    setCodeData({
      ...codeData,
      name: tableData?.name,
      desc: tableData?.desc,
      includes: tableData?.includes,
      excludes1: tableData?.excludes1,
      excludes2: tableData?.excludes2,
      children: tableData?.children,
      inclusionTerm: tableData?.inclusionTerm,
      useAdditionalCode: tableData?.useAdditionalCode,
      requiredCharacter: tableData?.requiredCharacter,
    });

    setHideButton(true);
    setLoading(false);
    fetchCodeData(tableData?.name);
    setSearchInput(tableData?.name);
  };

  const handleBack = () => {
    setCodeData(previousCode);
    setHideButton(false);

  };


  return (
    <div>
      {hideButton && (
        <div className="m-2" onClick={handleBack}>
          <Button className={style.btn}>Back</Button>
        </div>
      )}
      <div className={style.code}>
        <div className="d-flex justify-content-center">
          {loading && <Spin size="large" />}
        </div>
        {codeData?.requiredCharacter && (
          <div className={style.symbols}>
            <div>
              Related Symbols
              <div className={style.digit}>
                <span className={style.term}>
                  {codeData?.requiredCharacter}
                </span>
                : Additional {codeData?.requiredCharacter}Digit Required
              </div>
            </div>
          </div>
        )}
        {(codeData?.excludes1 ||
          codeData?.includes ||
          codeData?.name ||
          codeData?.excludes2) && (
          <div className={`${style.card} mt-2`}>
            <div className={style.head}>
              {codeData?.name} - {codeData?.desc}
              <CopyToClipboard
                text={`${codeData?.name} - ${codeData?.desc}`}
                onCopy={() => setCopied(true)}
              >
                {isCopied ? <CheckOutlined /> : <CopyOutlined />}
              </CopyToClipboard>
            </div>
            <div className="card-group">
              <div className="card">
                <div className="card-body border border-secondary p-0">
                  <h5 className="card-title bg-success text-white d-flex justify-content-center">
                    Include
                  </h5>
                  <p
                    className="card-text "
                    style={{
                      height: "160px",
                      padding: "4px",
                      overflow: "scroll",
                    }}
                  >
                    {codeData?.includes ? (
                      codeData.includes.split("\n").map((data, index) => (
                        <p className={style.para} key={index}>
                          {data}
                        </p>
                      ))
                    ) : (
                      <Empty />
                    )}
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-body border border-secondary p-0">
                  <h5
                    class="card-title  bg- text-white d-flex justify-content-center"
                    style={{ background: "blue" }}
                  >
                    Excludes1
                  </h5>
                  <p
                    className="card-text"
                    style={{
                      height: "160px",
                      padding: "4px",
                      overflow: "scroll",
                    }}
                  >
                    {codeData?.excludes1 ? (
                      codeData.excludes1.split("\n").map((data, index) => (
                        <p className={style.para} key={index}>
                          {data}
                        </p>
                      ))
                    ) : (
                      <Empty />
                    )}
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-body border border-secondary p-0 ">
                  <h5 class="card-title bg-danger text-white d-flex justify-content-center">
                    Excludes2
                  </h5>
                  <p
                    className="card-text "
                    style={{
                      height: "160px",
                      padding: "4px",
                      overflow: "scroll",
                      scrollbarwidth: "none",
                    }}
                  >
                    {codeData?.excludes2 ? (
                      codeData.excludes2.split("\n").map((data, index) => (
                        <p className={style.para} key={index}>
                          {data}
                        </p>
                      ))
                    ) : (
                      <Empty />
                    )}
                  </p>
                </div>
              </div>
            </div>
            {codeData?.useAdditionalCode && (
              <div className="mt-2">
                <span className={style.add}>Use additional</span>
                {codeData?.useAdditionalCode &&
                  codeData.useAdditionalCode.split("\n").map((data, index) => (
                    <p className={style.para} key={index}>
                      {data}
                    </p>
                  ))}
              </div>
            )}
            {codeData?.inclusionTerm && (
              <div className="mt-2">
                <span className={style.Inclusion}>Inclusion Term </span>
                {codeData?.inclusionTerm &&
                  codeData.inclusionTerm.split("\n").map((data, index) => (
                    <p className={style.para} key={index}>
                      {data}
                    </p>
                  ))}
              </div>
            )}
          </div>
        )}
        {parentCode?.[0]?.includes ||
        parentCode?.[0]?.excludes1 ||

        parentCode?.[0]?.excludes2 ? (
          <div className={style.parent}>
            {parentCode?.length &&
              parentCode?.map((data) => {
                return (
                  <div>
                    {(data?.includes || data?.excludes1 || data?.excludes2) && (
                      <div className={style.head}>
                        {data.name} - {data.desc}
                      </div>
                    )}
                    {data?.includes && (
                      <div>
                        <span className={style.includes}>Includes</span>
                        {data?.includes &&
                          data.includes?.split("\n").map((line, index) => (
                            <p className={style.para} key={index}>
                              {line}
                            </p>
                          ))}
                      </div>
                    )}
                    {data?.excludes1 && (
                      <div className=" mt-2 ">
                        <span className={style.excludes}>Excludes1</span>
                        {data?.excludes1 &&
                          data.excludes1?.split("\n").map((line, index) => (
                            <p className={style.para} key={index}>
                              {line}
                            </p>
                          ))}
                      </div>
                    )}

                    {data?.excludes2 && (
                      <div className=" mt-2 ">
                        <span className={style.excludes2}>Excludes2</span>
                        {data?.excludes2 &&
                          data.excludes2?.split("\n").map((line, index) => (
                            <p className={style.para} key={index}>
                              {line}
                            </p>
                          ))}
                      </div>
                    )}
                    {data?.useAdditionalCode && (
                      <div className="mt-2">
                        <span className={style.add}>Use additional</span>
                        {data?.useAdditionalCode &&
                          data.useAdditionalCode
                            ?.split("\n")
                            .map((line, index) => (
                              <p className={style.para} key={index}>
                                {line}
                              </p>
                            ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        ) : (
          <div></div>
        )}
        <div className={style.list}>
          {codeData?.children?.map((s, i) => (
            <div key={i} onClick={() => handleViewTable(s, i)}>
              <p class={`${style.card2} mt-3`}>
                {s?.requiredCharacter && (
                  <span className={style.term}>{s.requiredCharacter}</span>
                )}
                <ArrowRightOutlined />
                <span className={style.codes}>{s.name} </span>
                <span>- {s.desc}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const enhancer = connect((state) => ({ state }), {
  codesData: dashbaordActions.codesAction,
});
export default enhancer(Tables);
