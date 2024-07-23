import React, { useState, useEffect } from "react";
import { Popover } from "antd";
import { connect } from "react-redux";
import visitStyles from "../../../../../styles/visitdata.module.css";
import style from "./styles.module.css";

const RafScore = ({ patientDetailsResult }) => {
  const rafScoreList = patientDetailsResult?.data?.response?.rafScore;
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
        if (res?.hcc_model.version == "V24" && res2?.dx_name) {
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
      <div className={style.rafScoreMainContainer}>
        <div className="col-xl-12">
          <div className="table-responsive active-projects task-table">
            <div className="tbl-caption  align-items-center">
              <div className="d-flex">
                <div className={style.rafMainCard1}>
                  <div className={style.rafCard1}>
                    <div
                      className={style.titleHead}
                      style={{ background: "#73b2f2", color: "#ffffff" }}
                    >
                      <div className="row">
                        <div className="col-xl-3">DX Code</div>
                        <div className="col-xl-9">DX Description</div>
                      </div>
                    </div>
                    <div className={style.stickyHeader}>
                      {rafScoreData?.map((item, i) => (
                        <div className={style.detailsHead}>
                          <div
                            className={
                              rafScoreData?.length != i + 1
                                ? `row ${style.rafchildBorder}`
                                : `row`
                            }
                          >
                            <div className="col-xl-3"> {item.dx_name}</div>
                            <div className={`col-xl-9 ${style.rafDescription}`}>
                              <Popover title={item.dx_desc}>
                                {item.dx_desc}{" "}
                              </Popover>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={style.rafMainCard2}>
                  <div
                    className={style.rafCard2}
                    style={{ background: "#f3eeff" }}
                  >
                    <div
                      className={style.titleHead}
                      style={{ background: "#8262ce", color: "#ffffff" }}
                    >
                      <div className="row">
                        <div className="col-xl-3">HCC</div>
                        <div className="col-xl-3">RAF</div>
                        <div className="col-xl-4">Monthly Premium</div>
                        <div
                          className="col-xl-1 rounded d-flex align-items-center justify-content-center"
                          style={{ background: "#ffffff", color: "#8262ce" }}
                        >
                          <span className="d-flex align-items-center justify-content-center" style={{ marginLeft: "-5px" }}>V24</span>
                        </div>
                      </div>
                    </div>
                    <div className={style.stickyHeader}>
                      {rafScoreData?.map((item, i) => (
                        <div className={style.detailsHead}>
                          <div
                            className={
                              rafScoreData?.length != i + 1
                                ? `row ${style.rafchildBorder}`
                                : `row`
                            }
                          >
                            <div className="col-xl-3">
                              {getRafDetails(item.dx_name, "V24")?.map(
                                (item) => (
                                  <div>{item.hcc_name}</div>
                                )
                              )}
                            </div>
                            <div className="col-xl-3">
                              {getRafDetails(item.dx_name, "V24")?.map(
                                (item) => (
                                  <div>{item.hcc_raf}</div>
                                )
                              )}
                            </div>
                            <div className="col-xl-4  text-center">
                              {getRafDetails(item.dx_name, "V24")?.map(
                                (item) => (
                                  <div>${item.premium}</div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={style.rafMainCard2}>
                  <div
                    className={style.rafCard2}
                    style={{ background: "#ffe7e7" }}
                  >
                    <div
                      className={style.titleHead}
                      style={{ background: "#e47e7e", color: "#ffffff" }}
                    >
                      <div className="row">
                        <div className="col-xl-3">HCC</div>
                        <div className="col-xl-3">RAF</div>
                        <div className="col-xl-4">Monthly Premium</div>
                        <div
                          className="col-xl-1 rounded d-flex align-items-center justify-content-center"
                          style={{ background: "#ffffff", color: "#e47e7e" }}
                        >
                          <span className="d-flex align-items-center justify-content-center" style={{ marginLeft: "-5px" }}>V28</span>
                        </div>
                      </div>
                    </div>
                    <div className={style.stickyHeader}>
                      {rafScoreData?.map((item, i) => (
                        <div className={style.detailsHead}>
                          <div
                            className={
                              rafScoreData?.length != i + 1
                                ? `row ${style.rafchildBorder}`
                                : `row`
                            }
                          >
                            <div className="col-xl-3">
                              {getRafDetails(item.dx_name, "V28")?.length >
                              0 ? (
                                getRafDetails(item.dx_name, "V28")?.map(
                                  (item) => <div>{item.hcc_name}</div>
                                )
                              ) : (
                                <div>&nbsp;</div>
                              )}
                            </div>
                            <div className="col-xl-3">
                              {getRafDetails(item.dx_name, "V28")?.length >
                              0 ? (
                                getRafDetails(item.dx_name, "V28")?.map(
                                  (item) => <div>{item.hcc_raf}</div>
                                )
                              ) : (
                                <div>&nbsp;</div>
                              )}
                            </div>
                            <div className="col-xl-4  text-center">
                              {getRafDetails(item.dx_name, "V28")?.length >
                              0 ? (
                                getRafDetails(item.dx_name, "V28")?.map(
                                  (item) => <div>${item.premium}</div>
                                )
                              ) : (
                                <div>&nbsp;</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <label
                className={`${visitStyles.labelStyle} ${style.raflableheadOverall}`}
              >
                Overall score
              </label>
              <div className={style.totalScoreContainer}>
                <div className={style.rafScoreCard2}>
                  <div className={style.titleHead}  style={{ background: "#73b2f2", color: "#ffffff" }}>
                    <div className="row">
                      <div className="col-xl-6 text-center">Overall score</div>
                      <div className="col-xl-6 text-center">Overall premium</div>
                    </div>
                  </div>
                  <div className={style.detailsHead}>
                    <div className="row">
                      <div className="col-xl-6 text-center">
                        {" "}
                        {rafScoreList?.rafVersionDTO?.overAllScore}
                      </div>
                      <div className="col-xl-6 text-center">
                        {" "}
                        {rafScoreList?.rafVersionDTO?.overAllPremium ? "$"+rafScoreList?.rafVersionDTO?.overAllPremium : "---"}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={style.rafScoreCard1}
                  style={{ background: "#f3eeff" }}
                >
                  <div
                    className={style.titleHead}
                    style={{ background: "#8262ce", color: "#ffffff" }}
                  >
                    <div className="row">
                      <div className="col-xl-6">V24 score</div>
                      <div className="col-xl-6">
                        V24Score({rafScoreList?.rafVersionDTO?.v24Percentage}%)
                      </div>
                    </div>
                  </div>
                  <div className={style.detailsHead}>
                    <div className="row">
                      <div className="col-xl-6">
                        {rafScoreList?.rafVersionDTO?.v24Score}
                      </div>
                      <div className="col-xl-6">
                        {" "}
                        {rafScoreList?.rafVersionDTO?.v24PercentageScore}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={style.rafScoreCard1}
                  style={{ background: "#ffe7e7" }}
                >
                  <div
                    className={style.titleHead}
                    style={{ background: "#e47e7e", color: "#ffffff" }}
                  >
                    <div className="row">
                      <div className="col-xl-6">V28 score</div>
                      <div className="col-xl-6">
                        V28Score({rafScoreList?.rafVersionDTO?.v28Percentage}%)
                      </div>
                    </div>
                  </div>
                  <div className={style.detailsHead}>
                    <div className="row">
                      <div className="col-xl-6">
                        {rafScoreList?.rafVersionDTO?.v28Score}
                      </div>
                      <div className="col-xl-6">
                        {rafScoreList?.rafVersionDTO?.v28PercentageScore}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const enhancer = connect((state) => ({
  patientDetailsResult: state?.patientDetails?.details?.patientResult,
}));
export default enhancer(RafScore);
