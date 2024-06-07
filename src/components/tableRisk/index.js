import React from "react";
import style from "./style.module.css";
import { Divider } from "antd";

const TableRisk = ({
  data,
  subheader,
  activeButton,
  setActiveButton,
  setSearchInput,
}) => {
  const handleHeaderClick = () => {
    setActiveButton("ICD-10");
    setSearchInput(data?.diagnosisCode);
  };
  console.log(data, "data");
  const keysArray = data?.map((s) => ({
    year: s.year,
    key1: Object.keys(s).filter(
      (key) => key.includes("Esrd") && !key.includes("Payment")
    ),
    key2: Object.keys(s).filter(
      (key) => key.includes("cmsHccModel") && !key.includes("Payment")
    ),
    key3: Object.keys(s).filter(
      (key) => key.includes("rxHccModel") && !key.includes("Payment")
    ),
  }));
  console.log(keysArray, "keys");
  console.log(data?.[0]?.year,"year")

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
        <div className="row gap-2 mx-2">
          <div
            className="col-2 d-flex justify-content-center   "
            style={{
              border: "1px solid #04306F",
              padding: "3px",
              borderRadius: "10px",
            }}
          >
            <span style={{ fontSize: "16px", fontWeight: "600" }}> Year</span>
          </div>
          <div
            className="col-2 d-flex justify-content-center "
            style={{
              border: "1px solid  #04306F",
              padding: "3px",
              borderRadius: "10px",
            }}
          >
            <span style={{ fontSize: "16px", fontWeight: "600" }}>
              ESRD/PACE
            </span>
          </div>
          <div
            className="col-5 d-flex justify-content-center"
            style={{
              border: "1px solid  #04306F",
              padding: "3px",
              borderRadius: "10px",
            }}
          >
            <span style={{ fontSize: "16px", fontWeight: "600" }}>CMS HCC</span>
          </div>
          <div
            className="col-2 d-flex justify-content-center "
            style={{
              border: "1px solid  #04306F",
              padding: "3px",
              borderRadius: "10px",
            }}
          >
            <span style={{ fontSize: "16px", fontWeight: "600" }}> RX HCC</span>
          </div>
        </div>
        <div className="row  mx-2 gap-2">
          <div
            className="col-2 mt-2"
            style={{
              border: "1px solid #04306F",
              padding: "3px",
              borderRadius: "10px",
              height: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {data?.[0]?.year}
          </div>
          <div
            className="col-2 mt-2"
            style={{
              border: "1px solid #04306F",
              padding: "3px",
              borderRadius: "10px",
              height: "200px",
            }}
          >
            <div
              className="d-flex justify-content-around gap-2 "
              style={{
                background: "#BAD5FD",
                borderRadius: "10px",
                padding: "5px",
              }}
            >
              <div>V21 </div>
              <div> V22</div>
            </div>

            <div className="d-flex justify-content-center align-items-center ">
              <div>18</div>
              <Divider
                type="vertical"
                style={{ height: "150px", color: "black" }}
              />
              <div>18</div>
            </div>
          </div>
          <div
            className="col-5 mt-2"
            style={{
              border: "1px solid #04306F",
              padding: "3px",
              borderRadius: "10px",
              height: "200px",
            }}
          >
            <div
              className="d-flex justify-content-around gap-2 "
              style={{
                background: "#BAD5FD",
                borderRadius: "10px",
                padding: "5px",
              }}
            >
              <div>V21 </div>
              <div> V22</div>
              <div>V21 </div>
              <div> V22</div>
            </div>
            <div className="d-flex justify-content-evenly align-items-center">
              <div>18</div>
              <Divider
                type="vertical"
                style={{ height: "150px", color: "black" }}
              />
              <div>18</div>
              <Divider
                type="vertical"
                style={{ height: "150px", color: "black" }}
              />
              <div>18</div>
              <Divider
                type="vertical"
                style={{ height: "150px", color: "black" }}
              />
              <div>18</div>
            </div>
          </div>
          <div
            className="col-2 mt-2"
            style={{
              border: "1px solid #04306F",
              padding: "3px",
              borderRadius: "10px",
              height: "200px",
            }}
          >
            <div
              className="d-flex justify-content-around gap-2 "
              style={{
                background: "#BAD5FD",
                borderRadius: "10px",
                padding: "5px",
              }}
            >
              <div>V21 </div>
              <div> V22</div>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <div>18</div>
              <Divider
                type="vertical"
                style={{ height: "150px", color: "black" }}
              />
              <div>18</div>
            </div>
          </div>
        </div>
      </div>
      <>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th rowSpan={2}>year</th>
              <th colSpan={keysArray?.[0]?.key1?.length}>ESRD/PACE</th>
              <th colSpan={keysArray?.[0]?.key2?.length}>CMS HCC</th>
              <th colSpan={keysArray?.[0]?.key3?.length}>RX HCC</th>
            </tr>
            <tr>
              {keysArray?.[0]?.key1?.map((a) => {
                return <th key={"sd"}>{a.slice(-3)}</th>;
              })}
              {keysArray?.[0]?.key2?.map((a) => {
                return <th>{a.slice(-3)}</th>;
              })}
              {keysArray?.[0]?.key3?.map((a) => {
                return <th>{a.slice(-3)}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {data?.map?.((x) => {
              return (
                <tr>
                  <td>{x.year}</td>
                  {keysArray?.[0]?.key1?.map((key) => {
                    return <td>{x[key]? x[key] : "-"}</td>;
                  })}
                  {keysArray?.[0]?.key2?.map((key) => {
                    return <td>{x[key]? x[key] : "-"}</td>;
                  })}
                  {keysArray?.[0]?.key3?.map((key) => {
                    return <td>{x[key] ? x[key] : "-"}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    </div>
  );
};

export default TableRisk;
