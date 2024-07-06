import React from "react";
import mockData from "./mockData.json";
import upArrow from "../../../../../images/tenantAdmin/upArrow.svg";
import downArrow from "../../../../../images/tenantAdmin/downArrow.svg";
import Image from "next/image";

const index = () => {
  return (
    <table className="tenatTable">
      <thead>
        <tr>
          <td >Code</td>
          <td className="midRow">Description</td>
          <td >Count</td>
        </tr>
      </thead>
      <tbody>
        {mockData?.response?.map((item) => (
          <tr>
            <td >{item.code}</td>
            <td className="midRow">{item?.description}</td>
            <td >
              <span style={{ fontWeight: "700", marginRight: "5px" }}>
                {item?.count}
              </span>
              <span
                style={{
                  color: Math.sign(item?.average) === 1 ? "#00BC13" : "#BC0000",
                }}
              >
                <Image
                  src={Math.sign(item?.average) === 1 ? upArrow : downArrow}
                  alt="npimg"
                />
                <span style={{ fontSize: "10px" }}>{item?.average}</span>
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default index;
