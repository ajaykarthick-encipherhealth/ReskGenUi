import React, { useEffect } from "react";
import upArrow from "../../../../../images/tenantAdmin/upArrow.svg";
import downArrow from "../../../../../images/tenantAdmin/downArrow.svg";
import Image from "next/image";
import { Empty } from "antd";

const index = ({ items, key }) => {
  return (
    <table className="tenatTable" key={key} id={key}>
      <thead>
        <tr>
          <td>Code</td>
          <td className="midRow">Description</td>
          <td>Count</td>
        </tr>
      </thead>
      <tbody>
        {items?.length > 0 ? (
          items?.map((item) => (
            <tr>
              <td>{item.diagnosisCode}</td>
              <td className="midRow">{item?.description}</td>
              <td>
                <span style={{ fontWeight: "700", marginRight: "5px" }}>
                  {item?.count}
                </span>
                <span
                  style={{
                    color: Math.sign(item?.count) === 1 ? "#00BC13" : "#BC0000",
                  }}
                >
                  <Image
                    src={Math.sign(item?.count) === 1 ? upArrow : downArrow}
                    alt="npimg"
                  />
                  <span style={{ fontSize: "10px" }}>{item?.average}</span>
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr style={{ borderBottom: "none" }}>
            <td>
              <Empty />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default index;
