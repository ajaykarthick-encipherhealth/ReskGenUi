import React, { useState } from "react";
import style from "./style.module.css";
import { Empty, Spin, Table } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const Tables = (props) => {
  const { codeData, setCodeData, loading, setLoading } = props;

  const handleViewTable = (tableData) => {
    setLoading(true);
    setCodeData({
      ...codeData,
      name: tableData?.name,
      desc: tableData?.desc,
      excludes1: tableData?.excludes1,
      children: tableData?.children,
      inclusionTerm: tableData?.inclusionTerm,
    });
    setLoading(false);
  };

  return (
    <div className={style.code}>
      <div className="d-flex justify-content-center">
        {loading && <Spin size="large" />}
      </div>
      {(codeData?.excludes1 || codeData?.inclusionTerm || codeData?.name ) && (  
        <div className={`${style.card} mt-2`}>
          <div className={style.head}>
            {codeData?.name}-{codeData?.desc}
          </div>

            <div class="card-group" >
              <div class="card">
                <div class="card-body" style={{ padding: "0" ,border:"1px solid gray"}}>
                  <h5
                    style={{
                      background: "green",
                      display: "flex",
                      justifyContent: "center",
                      color: "white",
                    }}
                    class="card-title"
                  >
                   Include
                  </h5>
                  <p class="card-text"  style={{padding:"10px"}}>{codeData?.inclusionTerm?codeData?.inclusionTerm:<Empty/>}</p>
                </div>
              </div>
              <div class="card">
                <div class="card-body" style={{ padding: "0" ,border:"1px solid gray"}}>
                  <h5
                    style={{
                      background: "#0f6adb",
                      display: "flex",
                      justifyContent: "center",
                      color: "white",
                    }}
                    class="card-title"
                  >
                    Exclude1
                  </h5>
                  <p class="card-text"  style={{padding:"10px"}}>{codeData?.excludes1?codeData?.excludes1:<Empty/>}</p>
                </div>
              </div>
              <div class="card">
                <div class="card-body" style={{ padding: "0",border:"1px solid gray" }}>
                  <h5
                    style={{
                      background: "#993300",
                      display: "flex",
                      justifyContent: "center",
                      color: "white",
                    }}
                    class="card-title"
                  >
                    Exclude2
                  </h5>
                  <p class="card-text"  style={{padding:"10px"}}>{codeData?.excludes2?codeData?.excludes2:<Empty/> } </p>
                </div>
              </div>
            </div>
        </div>
      )}
      <div className={style.list}>
        {codeData?.children?.map((s, i) => (
          <div key={i} onClick={() => handleViewTable(s)}>
            <p className={`${style.card2} mt-3`}>
              <ArrowRightOutlined />
              <span className={style.codes}>{s.name} </span>
              <span>- {s.desc}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tables;
