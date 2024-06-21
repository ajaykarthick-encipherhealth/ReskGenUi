import React from "react";
import style from "./style.module.css";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const TableRisk = ({ data, setActiveButton, setSearchInput }) => {
  const handleHeaderClick = () => {
    setActiveButton("ICD-10");
    setSearchInput(data?.[0]?.diagnosisCode);
  };

  return (
    <div className={style.card}>
      <div className={`${style.desc} p-3`} onClick={() => handleHeaderClick()}>
        <span className={style.code}>{data?.[0]?.diagnosisCode}-</span>
        {data?.[0]?.description}
      </div>
      <div className="d-flex justify-content-center">
        <table style={{ width: "95%" }}>
          <thead style={{ height: "20px" }}>
            <tr>
              <th scope="col" style={{ paddingX: "5px" }}>
                <div className={style.year}>Year</div>
              </th>
              <th
                scope="col"
                style={{ paddingX: "5px" }}
                colspan={data?.[0]?.esrd?.length}
              >
                <div className={style.theader}>ESRD/PACE</div>
              </th>
              <th
                colspan={data?.[0]?.cmsHcc?.length}
                scope="col"
                style={{ paddingX: "5px" }}
              >
                <div className={style.theader}>CMS HCC</div>
              </th>
              <th
                scope="col"
                style={{ paddingX: "5px" }}
                colspan={data?.[0]?.rxHcc?.length}
              >
                <div className={style.theader}>RX HCC</div>
              </th>
            </tr>
          </thead>

          <tbody style={{ marginTop: "5px" }}>
            {data?.map?.((res, i) => {
              if (i == 0) {
                return (
                  <tr
                    style={{
                      paddingX: "5px",
                      background: "#BAD5FD",
                      borderRadius: "6px",
                    }}
                  >
                    <th
                      scope="col"
                      style={{
                        paddingX: "5px",

                        borderTopLeftRadius: "10px",
                      }}
                    >
                      <div
                        className="d-flex justify-content-around gap-2 "
                        style={{
                          background: "#BAD5FD",
                          padding: "3px",
                          marginTop: "6px",
                          borderRadius: "5px",
                        }}
                      >
                        Year
                      </div>
                    </th>
                    {i == 0 &&
                      res?.esrd?.map((item, index) => (
                        <th
                          scope="col"
                          style={{
                            paddingX: "5px",
                            borderTopLeftRadius: "10px",
                          }}
                        >
                          <div
                            className="d-flex justify-content-around gap-2 "
                            style={{
                              background: "#BAD5FD",
                              borderTopLeftRadius: index == 0 && "6px",
                              borderBottomLeftRadius: index == 0 && "6px",
                              borderTopRightRadius:
                                res?.esrd?.length == index + 1 && "6px",
                              borderBottomRightRadius:
                                res?.esrd?.length == index + 1 && "6px",
                              padding: "5px",
                              marginTop: "6px",

                              marginLeft: index == 0 && "10px",
                            }}
                          >
                            {item.version}
                          </div>
                        </th>
                      ))}

                    {i == 0 &&
                      res?.cmsHcc?.map((item, index) => (
                        <th scope="col" style={{ paddingX: "5px" }}>
                          <div
                            className="d-flex justify-content-around gap-2 "
                            style={{
                              background: "#BAD5FD",
                              borderTopLeftRadius: index == 0 && "6px",
                              borderBottomLeftRadius: index == 0 && "6px",
                              borderTopRightRadius:
                                res?.cmsHcc?.length == index + 1 && "6px",
                              borderBottomRightRadius:
                                res?.cmsHcc?.length == index + 1 && "6px",
                              padding: "5px",
                              marginTop: "6px",

                              marginLeft: index == 0 && "10px",
                            }}
                          >
                            {item.version}
                          </div>
                        </th>
                      ))}
                    {i == 0 &&
                      res?.rxHcc?.map((item, index) => (
                        <th scope="col" style={{ paddingX: "5px" }}>
                          <div
                            style={{
                              background: "#BAD5FD",
                              borderTopLeftRadius: index == 0 && "6px",
                              borderBottomLeftRadius: index == 0 && "6px",
                              borderTopRightRadius:
                                res?.rxHcc?.length == index + 1 && "6px",
                              borderBottomRightRadius:
                                res?.rxHcc?.length == index + 1 && "6px",
                              padding: "5px",
                              marginTop: "6px",
                              marginLeft: index == 0 && "6px",
                            }}
                          >
                            {item.version}
                          </div>
                        </th>
                      ))}
                  </tr>
                );
              }
            })}
            {data?.map?.((res, i) => {
              return (
                <>
                  <tr style={{ height: "100px" }}>
                    <td
                      style={{
                        paddingX: "5px",
                        borderBottom:
                          i === data?.length - 1 && "1px solid #04306F",
                        borderLeft: "1px solid #04306F",
                        borderRight: "1px solid #04306F",
                      }}
                    >
                      {res.year}
                    </td>
                    {res?.esrd?.map((item, index) => (
                      <td
                        style={{
                          paddingX: "5px",
                          borderBottom:
                            i === data?.length - 1 && "1px solid #04306F",
                          borderLeft: "1px solid #04306F",
                          borderRight: "1px solid #04306F",
                          borderTopLeftRadius: "10px",
                        }}
                      >
                        <div className="d-flex justify-content-center gap-3">
                          {item.value}
                          {item.payment ? (
                            <span>
                              <CheckCircleOutlined className="text-success" />
                            </span>
                          ) : (
                            <CloseCircleOutlined className="text-red" />
                          )}
                        </div>
                      </td>
                    ))}

                    {res?.cmsHcc?.map((item) => (
                      <td
                        style={{
                          paddingX: "5px",
                          borderBottom:
                            i === data?.length - 1 && "1px solid #04306F",
                          borderLeft: "1px solid #04306F",
                          borderRight: "1px solid #04306F",

                          borderTopLeftRadius: "10px",
                        }}
                      >
                        <div className="d-flex justify-content-center gap-3">
                          {item.value}
                          {item.payment ? (
                            <span>
                              <CheckCircleOutlined className="text-success" />
                            </span>
                          ) : (
                            <CloseCircleOutlined className="text-red" />
                          )}
                        </div>
                      </td>
                    ))}
                    {res?.rxHcc?.map((item) => (
                      <td
                        style={{
                          paddingX: "5px",
                          borderBottom:
                            i === data?.length - 1 && "1px solid #04306F",
                          borderLeft: "1px solid #04306F",
                          borderRight: "1px solid #04306F",
                          borderTopLeftRadius: "10px",
                        }}
                      >
                        <div className="d-flex justify-content-center gap-3">
                          {item.value}
                          {item.payment ? (
                            <span>
                              <CheckCircleOutlined className="text-success" />
                            </span>
                          ) : (
                            <CloseCircleOutlined className="text-red" />
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableRisk;
