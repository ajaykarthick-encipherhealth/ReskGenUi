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

  const columns = [
    {
      title: "Include",
      dataIndex: "inclusionTerm",
      key: "inclusionTerm",
    },
    {
      title: "Exclude 1",
      dataIndex: "excludes1",
      key: "excludes1",
    },
    {
      title: "Exclude 2",
      dataIndex: "excludes2",
      key: "excludes2",
    },
  ];
  console.log(codeData,"codeData")
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

          <div class="card-group" style={{ border: "1px solid gray" }}>
            <div
              class="card"
              style={{ border: "1px solid gray  ", margin: "0" }}
            >
              <div class="card-body" style={{ padding: "0" }}>
                <h5
                  style={{
                    background: "#6A8D20;",
                    display: "flex",
                    justifyContent: "center",
                    color: "white",
                  }}
                  class="card-title"
                >
                  Include
                </h5>
                <p class="card-text">{codeData?.inclusionTerm?codeData?.inclusionTerm:<Empty/>} </p>
              </div>
            </div>
            <div class="card">
              <div class="card-body" style={{ padding: "0" }}>
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
                <p class="card-text">{codeData?.excludes1?codeData?.excludes1:<Empty/>}</p>
              </div>
            </div>
            <div class="card">
              <div class="card-body" style={{ padding: "0" }}>
                <h5
                  style={{
                    background: "993300",
                    display: "flex",
                    justifyContent: "center",
                    color: "white",
                  }}
                  class="card-title"
                >
                  Exclude2
                </h5>
                <p class="card-text">{codeData?.excludes2?codeData?.excludes2 :<Empty/> } </p>
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
