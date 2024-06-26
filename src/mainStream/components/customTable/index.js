import React from "react";
import { Empty } from "antd";
import { colors } from "../chartUtils";

const CustomTable = ({ data, styles, head2, head1, color }) => {
  const nameColors = {};
  const getRandomColor = (letter) => colors[letter.toUpperCase()] || "#B35CE1";
  data?.forEach((item) => {
    const firstLetter = item?.name[0];

    if (!nameColors[item?.name]) {
      nameColors[item?.name] = getRandomColor(firstLetter);
    }
  });
  return (
    <div style={{ maxHeight: "250px", overflowY: "auto" }}>
      <table className="table" style={{ border: "2px solid #e6e6e6" }}>
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: "#04306F",
                color: "white",
                textAlign: "center",
                position: "sticky",
                top: "0",
              }}
            >
              {head1}
            </th>
            <th
              style={{
                backgroundColor: "#04306F",
                color: "white",
                textAlign: "center",
                position: "sticky",
                top: "0",
              }}
            >
              {head2}
            </th>
          </tr>
        </thead>

        <tbody>
          {!data || data.length === 0 ? (
            <tr style={{}}>
              <td colSpan="2" style={{ textAlign: "center" }}>
                <div>
                  <Empty style={{ height: "112px" }} />{" "}
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr className="borderless" key={index}>
                <td
                  style={{
                    textAlign: "center",

                    width: "155px",
                    padding: "5px 10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "left",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: color
                          ? item.color
                          : nameColors[item?.name],
                        height: "6px",
                        width: "6px",
                        borderRadius: "50%",
                        padding: "2px",
                        marginRight: "10px",
                      }}
                    ></div>
                    <div>{item?.name}</div>
                  </div>
                </td>
                <td style={{}}>{item.value}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
