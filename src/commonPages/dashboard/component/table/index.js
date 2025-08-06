import React, { useEffect } from "react";
import { Empty, Progress } from "antd";
import { getColorValue } from "../../../../utils/reusable";
import { CheckCircleFilled, CheckCircleOutlined } from "@ant-design/icons";

const index = ({ items, key, title, columns = [] }) => {
  return (
    <div>
      {title && <h5>{title}</h5>}
      <table className="tenatTable" key={key} id={key}>
        <thead>
          <tr>
            {columns.map((col, id) => (
              <td key={id} className={col.className || ""}>
                {col.title}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {items?.length > 0 ? (
            items?.map((item) => (
              <tr>
                {columns.map((col, colIdx) => {
                  const value = item[col.dataIndex];
                  return (
                    <td key={colIdx} className={col.className || ""}>
                      {col.isProgress ? (
                        <div className="d-flex justify-content-center w-100">
                          <div style={{ width: "300px" }}>
                            <Progress
                              percent={parseFloat(value) || 0}
                              size="small"
                              showInfo={true}
                              strokeColor={getColorValue("2")}
                              status="normal"
                              format={(percent) =>
                                percent === 100 ? (
                                  <span>
                                    <CheckCircleFilled
                                      style={{
                                        color: getColorValue("2"),
                                        marginRight: 4,
                                      }}
                                    />
                                    {percent}%
                                  </span>
                                ) : (
                                  `${percent}%`
                                )
                              }
                            />
                          </div>
                        </div>
                      ) : (
                        <span
                          style={{
                            fontWeight: col.dataIndex === "count" ? "700" : "",
                          }}
                        >
                          {value ?? "---"}
                        </span>
                      )}
                    </td>
                  );
                })}
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
    </div>
  );
};

export default index;
