import React, { useState, useEffect } from "react";
import { Empty } from "antd";
import visitStyles from "../../../../../../styles/visitdata.module.css";
import style from "./styles.module.css";
import TableStyle from "../../../../../../components/table/table.module.css";

const RafScore = ({ rafScoreList }) => {
  const [rafScoreData, setRafScoreData] = useState([]);

  function getRafDetails(dxCode, version) {
    var result = [];
    rafScoreList?.scoreOutputDTOList?.map((res) => {
      res?.dx_hccs.map((res2) => {
        if (res2.dx_name == dxCode && res?.hcc_model.version == version) {
          result = res2.hcc_list;
        }
      });
    });
    return result;
  }

  useEffect(() => {
    var rafScroeArray = [];
    rafScoreList?.scoreOutputDTOList?.map((res) => {
      res?.dx_hccs.map((res2) => {
        if (res?.hcc_model.version == "v24_2022" && res2?.dx_name) {
          rafScroeArray.push({
            version: res.hcc_model.version,
            dx_name: res2.dx_name,
            dx_desc: res2.dx_desc,
          });
        }
      });
    });
    setRafScoreData(rafScroeArray);
  }, [rafScoreList]);

  return (
    <>
      <div className="col-xl-12">
        <>
          <div className="table-responsive active-projects task-table">
            <div className="tbl-caption  align-items-center">
              <div className={style.stickeyRaf_head}>
                <table className={style.classTable}>
                  <thead className={style.classThead}>
                    <tr>
                      <th className={style.width_100}>DX Code</th>
                      <th className={style.width_300}>DX Description</th>
                      <th className={style.width_100}>HCC(V24)</th>
                      <th className={style.width_100}>HCC(V28)</th>
                      <th>RAF(V24)</th>
                      <th>RAF(V28)</th>
                      <th>Monthly Premium(V24)</th>
                      <th>Monthly Premium(V28)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rafScoreData?.length > 0 ? (
                      rafScoreData?.map((item) => (
                        <tr className={style.trDiv}>
                          <td className={style.firstTdBorder}>
                            {item.dx_name}
                          </td>
                          <td className={TableStyle.childBorder}>
                            {item.dx_desc}
                          </td>
                          <td className={TableStyle.childBorder}>
                            {getRafDetails(item.dx_name, "v24_2022")?.map(
                              (item) => (
                                <div>{item.hcc_name}</div>
                              )
                            )}
                          </td>
                          <td className={TableStyle.childBorder}>
                            {getRafDetails(item.dx_name, "v28_2023")?.map(
                              (item) => (
                                <div>{item.hcc_name}</div>
                              )
                            )}
                          </td>
                          <td className={TableStyle.childBorder}>
                            {getRafDetails(item.dx_name, "v24_2022")?.map(
                              (item) => (
                                <div>{item.hcc_raf}</div>
                              )
                            )}
                          </td>
                          <td className={TableStyle.childBorder}>
                            {getRafDetails(item.dx_name, "v28_2023")?.map(
                              (item) => (
                                <div>{item.hcc_raf}</div>
                              )
                            )}
                          </td>
                          <td className={TableStyle.childBorder}>
                            {getRafDetails(item.dx_name, "v24_2022")?.map(
                              (item) => (
                                <div>${item.premium}</div>
                              )
                            )}
                          </td>
                          <td className={style.lastBorder}>
                            {getRafDetails(item.dx_name, "v28_2023")?.map(
                              (item) => (
                                <div>${item.premium}</div>
                              )
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8}>
                          <Empty />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="my-post-content pt-3">
                  <div className={`${visitStyles.rafContainer}`}>
                    <div className={`row ${visitStyles.rafContainer2}`}>
                      {rafScoreList != null ? (
                        <>
                          <div className="col-xl-12">
                            <label
                              className={`${visitStyles.labelStyle} ${visitStyles.raflableheadOverall}`}
                            >
                              Overall score
                            </label>
                            <div
                              className={`row  ${visitStyles.overallScoreContainer}`}
                            >
                              <div className="raf-card ">
                                <div className="row raf-head">
                                  <div className="col-xl-2">
                                    <label
                                      className={`${visitStyles.labelStyle}`}
                                    >
                                      V24 score
                                    </label>
                                  </div>
                                  <div className="col-xl-2">
                                    <label
                                      className={`${visitStyles.labelStyle}`}
                                    >
                                      v24Score(70%)
                                    </label>
                                  </div>
                                  <div className="col-xl-2">
                                    <label
                                      className={`${visitStyles.labelStyle}`}
                                    >
                                      V28 score
                                    </label>
                                  </div>
                                  <div className="col-xl-2">
                                    <label
                                      className={`${visitStyles.labelStyle}`}
                                    >
                                      v28Score(30%)
                                    </label>
                                  </div>
                                  <div className="col-xl-4">
                                    <label
                                      className={`${visitStyles.labelStyle}`}
                                    >
                                      Overall score
                                    </label>
                                  </div>
                                </div>

                                <div className="row  raf-details">
                                  <div className="col-xl-2">
                                    <span>{rafScoreList.v24Score}</span>
                                  </div>
                                  <div className="col-xl-2">
                                    {rafScoreList.v24Score70Percent != null ? (
                                      <span>
                                        {rafScoreList.v24Score70Percent.toFixed(
                                          3
                                        )}
                                      </span>
                                    ) : null}
                                  </div>
                                  <div className="col-xl-2">
                                    <span>{rafScoreList.v28Score}</span>
                                  </div>
                                  <div className="col-xl-2">
                                    {rafScoreList.v28Score30Percent != null ? (
                                      <span>
                                        {rafScoreList.v28Score30Percent.toFixed(
                                          3
                                        )}
                                      </span>
                                    ) : null}
                                  </div>
                                  <div className="col-xl-4">
                                    {rafScoreList.score != null ? (
                                      <span>
                                        {rafScoreList.score.toFixed(3)}
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default RafScore;
