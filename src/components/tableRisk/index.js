import React from "react";
import style from "./style.module.css";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const TableRisk = ({
  data,
  subheader,
  activeButton,
  setActiveButton,
  setSearchInput,
}) => {
  const handleHeaderClick = () => {
    setActiveButton("ICD-10");
    setSearchInput(data?.[0]?.diagnosisCode);
  };

  // const keysArray = data?.map((s) => ({
  //   year: s.year,
  //   key1: Object.keys(s).filter((key) => key.includes("Esrd")),
  //   key2: Object.keys(s).filter((key) => key.includes("cmsHccModel")),
  //   key3: Object.keys(s).filter((key) => key.includes("rxHccModel")),
  // }));

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
                <th>
                  {" "}
                  style=
                  {{
                    fontWeight: "600",
                  }}
                  year
                </th>
                {/* <th style={{fontWeight:"600"}}colSpan={keysArray?.[0]?.key1?.length}>ESRD/PACE</th>
                <th style={{fontWeight:"600"}} colSpan={keysArray?.[0]?.key2?.length}>CMS HCC</th>
                <th  style={{fontWeight:"600"}}  colSpan={keysArray?.[0]?.key3?.length}>RX HCC</th> */}

                {keyArray?.[0]?.allKeys?.map((a) => {
                  return (
                    <th
                      style={{
                        fontWeight: "600",
                      }}
                    >
                      {a}
                    </th>
                  );
                })}
                {/* {keysArray?.[0]?.key2?.map((a) => {
                  return <th>{a}</th>;
                })}
                {keysArray?.[0]?.key3?.map((a) => {
                  return <th>{a}</th>;
                })} */}
              </tr>
            </thead>
            <tbody>
              {data?.map?.((x) => {
                return (
                  <tr style={{ height: "150px" }}>
                    <td>{x.year}</td>
                    {keyArray?.[0]?.allKeys?.map((key) => {
                      return (
                        <td>
                          {x[key] ? x[key] : "--"}{" "}
                          {/* {x[key + "Payment"] === "Yes" ? (
                            <CheckCircleOutlined className="text-success lead" />
                          ) : (
                            <CloseCircleOutlined className="text-danger lead" />
                          )} */}
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
