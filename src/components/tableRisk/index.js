import React from "react";
import style from "./style.module.css";

const TableRisk = ({ data, subheader }) => {
  return (
    <div className="d-flex mt-3">
      <div
        className={`${style.header} w-100`}
      >
        <table className="table table-bordered">
          <td colSpan="4" className={style.head}>
            <span className={style.code}>A26.7</span>
            -Erysipelothrix sepsis
          </td>

          <tr>
            <th colSpan="3"> CMS HCC</th>
            <th colSpan="2">RX HCC</th>
          </tr>

          <tbody>
            <tr>
              {subheader?.map((item, index) => (
                <td key={index} scope="row">
                  {item.label}
                </td>
              ))}
            </tr>
            
            {data?.map((item, index) => (
              <tr key={index}>
                <td scope="row">{item?.year}</td>
                <td>{item?.pace_esrd_v21}</td>
                <td>{item?.v22}</td>
                <td>{item?.v24}</td>
                <td>{item?.v05}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableRisk;
