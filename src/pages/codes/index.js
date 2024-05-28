import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { CarryOutOutlined } from "@ant-design/icons";
import { Tree } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const Codes = ({ data, loading, setCurrentButton }) => {
  const onSelect = (selectedKeys, info) => {};
  const handleArrowClick = () => {
    setCurrentButton("Both");
  };

  const tableData = [
    {
      include:
        "high blood pressure hypertension (arterial),(bengin),(essential),(malignant),(primary),(systamatic)",
      exclude1:
        "hypertensive disease,complicating pregnancy, and child birth(010-011,013-016)",
      exclude2:
        "essential primary hypertension involving vessels of brain(160-169),essential (primary) hypertension involving vessels of eye",
    },
  ];
  return (
    <>
      <div className="d-flex gap-1 mt-3">
        <ArrowLeftOutlined
          style={{ fontSize: "18px" }}
          onClick={handleArrowClick}
        />
        <div className={style.head}>Result from CogentAI for I10</div>
      </div>
      <div className="d-flex justify-content-center">
        {loading && (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} />
        )}
      </div>
      <div className="mt-3 antdstyle">
        <Tree
          showLine={true}
          defaultExpandedKeys={["0-0-0"]}
          onSelect={onSelect}
          treeData={data}
        />
      </div>
      <div className="d-flex align-items-center justify-content-center mt-3">
        <div className={style.box}>
          <div className={style.head}>110-Essential(primary) hypertension</div>
          <div className={`${style.table} tablestyle`}>
            <table class="table table-bordered">
              <tr>
                <th
                  className="tablehead"
                  style={{
                    background: "#6A8D20",
                    color: "white",
                  }}
                >
                  Include
                </th>
                <th style={{ background: "#004CB8" }}>Exclude1</th>
                <th
                  style={{
                    background: "#993300",
                  }}
                >
                  Exclude2
                </th>
              </tr>
              <tbody>
                {tableData.map((rowData, index) => (
                  <tr key={index}>
                    <td style={{ textWrap: "wrap" }}>{rowData.include}</td>
                    <td style={{ textWrap: "wrap" }}>{rowData.exclude1}</td>
                    <td style={{ textWrap: "wrap" }}>{rowData.exclude2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Codes;
