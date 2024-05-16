import React from "react";
import { Empty } from "antd";
import { colors } from "../../../resusablereport/reports/sentReport";

const CustomTable = ({ data, styles, head2, head1 }) => {
  const nameColors = {};
  const getRandomColor = (letter) => colors[letter.toUpperCase()] || "#B35CE1";
  data?.forEach((item) => {
    const firstLetter = item?.name[0];

    if (!nameColors[item?.name]) {
      nameColors[item?.name] = getRandomColor(firstLetter);
    }
  });
  return (
    <div>
      <table className="table">
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
              className={styles.HeadTd}
              style={{
                backgroundColor: "#04306F",
                color: "white",
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
                <Empty style={{ height: "90px" }} />{" "}
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
                        backgroundColor: nameColors[item?.name],
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
                <td
                  style={{
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "center",
                  }}
                >
                  {item.value}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
