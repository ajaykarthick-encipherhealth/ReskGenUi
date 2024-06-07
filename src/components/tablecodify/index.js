import React, { useState } from "react";
import style from "./style.module.css";
import { Empty, Spin } from "antd";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const Tables = (props) => {
  const { codeData, setCodeData, loading, setLoading } = props;
  const [childIndex, setChildIndex] = useState(-1);

  const handleViewTable = (tableData, index) => {
    setLoading(true);
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
    setLoading(false);
    setChildIndex(index);
  };

  const handleBack = () => {
    if (childIndex > 0) {
      const newIndex = childIndex -1;
      console.log(newIndex,"newIndex")
      handleViewTable(codeData?.children[newIndex], newIndex);
    }

  };

  return (
    <>
      <div className={style.arrowleft}> <ArrowLeftOutlined onClick={handleBack}/>Back</div>
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
              {codeData?.name}-{codeData?.desc}
            </div>
            <div className={style.inclusionTerm}>{codeData?.inclusionTerm}</div>

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
                      padding: "10px",
                      overflow: "scroll",
                    }}
                  >
                    {codeData?.includes ? codeData?.includes : <Empty />}
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-body border border-secondary p-0">
                  <h5
                    class="card-title  bg- text-white d-flex justify-content-center"
                    style={{ background: "blue" }}
                  >
                    Exclude1
                  </h5>
                  <p
                    className="card-text"
                    style={{
                      height: "160px",
                      padding: "10px",
                      overflow: "scroll",
                    }}
                  >
                    {codeData?.excludes1 ? codeData?.excludes1 : <Empty />}
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-body border border-secondary p-0 ">
                  <h5 class="card-title bg-danger text-white d-flex justify-content-center">
                    Exclude2
                  </h5>
                  <p
                    className="card-text "
                    style={{
                      height: "160px",
                      padding: "10px",
                      overflow: "scroll",
                      scrollbarwidth: "none",
                    }}
                  >
                    {codeData?.excludes2 ? codeData?.excludes2 : <Empty />}{" "}
                  </p>
                </div>
              </div>
            </div>
            {codeData?.useAdditionalCode && (
              <div>
                <span className={style.head}>Additional Codes:</span>
                {codeData?.useAdditionalCode}
              </div>
            )}
          </div>
        )}

        <div className={style.list}>
          {codeData?.children?.map((s, i) => (
            <div key={i} onClick={() => handleViewTable(s, i)}>
              <p class={`${style.card2} mt-3`}>
                <span className={style.term}>{codeData?.requiredCharacter}</span>
                <ArrowRightOutlined />
                <span className={style.codes}>{s.name} </span>
                <span>- {s.desc}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Tables;
