import React from "react";
import style from "./style.module.css";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

const TableRisk = ({
  data, 
  setActiveButton,
  setSearchInput,
}) => {
  const handleHeaderClick = () => {
    setActiveButton("ICD-10");
    setSearchInput(data?.[0]?.diagnosisCode);
  };
  const keyArray = data?.map((s) => ({
    allKeys: Object.keys(s).filter(
      (key) =>
        key.includes("cms") || key.includes("rx") || key.includes("Payment")
    ),
  }));

  return (
    <div>
      <div className={style.card}>
        <div
          className={`${style.desc} p-3`}
          onClick={() => handleHeaderClick()}
        >
          <span className={style.code}>{data?.[0]?.diagnosisCode}-</span>
          {data?.[0]?.description}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="table table-bordered ">
            <thead style={{ height: "70px" }}>
              <tr>
                <th
                  style={{
                    fontWeight: "600",
                  }}
                >
                  year
                </th>

                {keyArray?.[0]?.allKeys?.map((data) => {
                  return (
                    <th
                      style={{
                        fontWeight: "600",
                      }}
                    >
                      {data}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {data?.map?.((item) => {
                return (
                  <tr style={{ height: "150px" }}>
                    <td>{item.year}</td>
                    {keyArray?.[0]?.allKeys?.map((key) => {
                      return (
                        <td>
                          {item[key] ? item[key] : "--"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableRisk;
