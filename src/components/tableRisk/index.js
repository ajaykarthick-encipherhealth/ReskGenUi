import React from "react";
import style from "./style.module.css";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const TableRisk = ({
  data,
  setActiveButton,
  setSearchInput,
  fromPatientDetails,
}) => {
  const handleHeaderClick = () => {
    setActiveButton("ICD-10");
    setSearchInput(data?.[0]?.diagnosisCode);
  };

  return (
    <div className={style.card}>
      {!fromPatientDetails && (
        <div
          className={`${style.desc} p-3`}
          onClick={() => handleHeaderClick()}
        >
          <span className={style.code}>{data?.[0]?.diagnosisCode}-</span>
          {data?.[0]?.description}
        </div>
      )}
      <div className="d-flex justify-content-center">
        <table style={{ width: "90%" }} class="table table-bordered">
          <thead>
            <tr>
              <th
                style={{ background: "rgb(73 128 207 ", color: "white" }}
                rowspan={2}
                scope="col"
              >
                Year
              </th>
              <th
                style={{ background: "rgb(73 128 207 ", color: "white" }}
                scope="col"
                colspan={data?.[0]?.esrd?.length}
              >
                ESRD/PACE
              </th>
              <th
                style={{ background: "rgb(73 128 207 ", color: "white" }}
                colspan={data?.[0]?.cmsHcc?.length}
                scope="col"
              >
                CMS HCC
              </th>
              <th
                style={{ background: "rgb(73 128 207 ", color: "white" }}
                scope="col"
                colspan={data?.[0]?.rxHcc?.length}
              >
                RX HCC
              </th>
            </tr>
            {data?.map?.((head, i) => (
              <tr>
                {i == 0 && head?.esrd?.length > 0 ? (
                  head?.esrd?.map((item) => (
                    <th
                      style={{ background: "rgb(73 128 207", color: "white" }}
                      scope="col"
                    >
                      {item?.version}
                    </th>
                  ))
                ) : (
                  <th
                    style={{
                      background: "rgb(73 128 207 ",
                      color: "white",
                    }}
                    scope="col"
                  >
                    V00
                  </th>
                )}
                {i == 0 && head?.cmsHcc?.length > 0 ? (
                  head?.cmsHcc?.map((item) => (
                    <th
                      style={{
                        background: "rgb(73 128 207 ",
                        color: "white",
                      }}
                      scope="col"
                    >
                      {item?.version}
                    </th>
                  ))
                ) : (
                  <th
                    style={{
                      background: "rgb(73 128 207 ",
                      color: "white",
                    }}
                    scope="col"
                  >
                    V00
                  </th>
                )}
                {i == 0 && head?.rxHcc?.length > 0 ? (
                  head?.rxHcc?.map((item) => (
                    <th
                      style={{
                        background: "rgb(73 128 207 ",
                        color: "white",
                      }}
                      scope="col"
                    >
                      {item?.version}
                    </th>
                  ))
                ) : (
                  <th
                    style={{
                      background: "rgb(73 128 207 ",
                      color: "white",
                    }}
                    scope="col"
                  >
                    V00
                  </th>
                )}
              </tr>
            ))}
          </thead>

          <tbody>
            {data?.map?.((list, i) => {
              return (
                <>
                  <tr>
                    <td style={{ background: "#f0f6fe " }}>{list.year}</td>
                    {list?.esrd?.length > 0 ? (
                      list?.esrd.map((res) => (
                        <td style={{ background: "#f0f6fe " }}>
                          <div className="d-flex justify-content-center gap-2">
                            {res.value}
                            {res.payment ? (
                              <span>
                                <CheckCircleOutlined className="text-success" />
                              </span>
                            ) : (
                              <CloseCircleOutlined className="text-danger" />
                            )}
                          </div>
                        </td>
                      ))
                    ) : (
                      <td style={{ background: "#f0f6fe " }}>
                        <div className="d-flex justify-content-center gap-2">
                          0
                          <CloseCircleOutlined className="text-danger" />
                        </div>
                      </td>
                    )}

                    {list?.cmsHcc?.length > 0 ? (
                      list?.cmsHcc?.map((res) => (
                        <td style={{ background: "#f0f6fe" }}>
                          <div className="d-flex justify-content-center gap-2">
                            {res.value}
                            {res.payment ? (
                              <span>
                                <CheckCircleOutlined className="text-success" />
                              </span>
                            ) : (
                              <CloseCircleOutlined className="text-danger" />
                            )}
                          </div>
                        </td>
                      ))
                    ) : (
                      <td style={{ background: "#f0f6fe " }}>
                        <div className="d-flex justify-content-center gap-2">
                          0
                          <CloseCircleOutlined className="text-danger" />
                        </div>
                      </td>
                    )}
                    {list?.rxHcc?.length > 0 ? (
                      list?.rxHcc?.map((res) => (
                        <td style={{ background: "#f0f6fe " }}>
                          <div className="d-flex justify-content-center gap-2">
                            {res.value}
                            {res.payment ? (
                              <span>
                                <CheckCircleOutlined className="text-success" />
                              </span>
                            ) : (
                              <CloseCircleOutlined className="text-danger" />
                            )}
                          </div>
                        </td>
                      ))
                    ) : (
                      <td style={{ background: "#f0f6fe " }}>
                        <div className="d-flex justify-content-center gap-2">
                          0
                          <CloseCircleOutlined className="text-danger" />
                        </div>
                      </td>
                    )}
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
