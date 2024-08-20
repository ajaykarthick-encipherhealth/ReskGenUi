import React, { useState, useEffect } from "react";
import { Popover } from "antd";
import { connect } from "react-redux";
import visitStyles from "../../../../../styles/visitdata.module.css";
import style from "./styles.module.css";

const RafScore = ({ patientDetailsResult }) => {
  const rafScoreList = patientDetailsResult?.data?.response?.rafScore;
  const [rafScoreData, setRafScoreData] = useState([]);
  const [rafScoreDetails, setRafScoreDetails] = useState([]);

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

  // const preprocessData = (data) => {
  //   const v24Entries = [];
  //   const v28Entries = [];
  //   const output = [];

  //   // Separate V24 and V28 entries
  //   data?.forEach((item) => {
  //     item.dx_hccs.forEach((dx) => {
  //       const newEntry = {
  //         dx_code: dx.dx_name,
  //         dx_desc: dx.dx_desc,
  //         hcc: dx.hcc_list[0]?.hcc_name || null,
  //         raf: dx.hcc_list[0]?.hcc_raf || null,
  //         monthly_premium: dx.hcc_list[0]?.premium || null,
  //       };

  //       if (item.hcc_model.version === "V24") {
  //         v24Entries.push(newEntry);
  //       } else if (item.hcc_model.version === "V28") {
  //         v28Entries.push(newEntry);
  //       }
  //     });
  //   });

  //   // Ensure the entries are paired in sequence
  //   let v24Index = 0;
  //   let v28Index = 0;

  //   while (v24Index < v24Entries.length || v28Index < v28Entries.length) {
  //     const v24Entry = v24Entries[v24Index] || {
  //       dx_code: null,
  //       dx_desc: null,
  //       hcc: null,
  //       raf: null,
  //       monthly_premium: null,
  //     };
  //     const v28Entry = v28Entries[v28Index] || {
  //       dx_code: null,
  //       dx_desc: null,
  //       hcc: null,
  //       raf: null,
  //       monthly_premium: null,
  //     };

  //     output.push({
  //       dx_code: v24Entry.dx_code,
  //       dx_desc: v24Entry.dx_desc,
  //       v24_hcc: v24Entry.hcc,
  //       v24_raf: v24Entry.raf,
  //       v24_monthly_premium: v24Entry.monthly_premium,
  //       v28_hcc: v28Entry.hcc,
  //       v28_raf: v28Entry.raf,
  //       v28_monthly_premium: v28Entry.monthly_premium,
  //     });

  //     // Move to the next entry
  //     v24Index++;
  //     v28Index++;
  //   }
  //   return output;
  // };

  const preprocessData = (data) => {
    const v24Entries = [];
    const v28Entries = new Map();
    const output = [];
    const intractionEntries = [];

  
    // Separate V24 and V28 entries
    data?.forEach(item => {
      item?.dx_hccs.forEach(dx => {
        const entry = {
          dx_code: dx.dx_name || "Intraction Code",
          dx_desc: dx.dx_desc || dx.hcc_list[0]?.hcc_desc || null,
          hcc: dx.hcc_list[0]?.hcc_name || null,
          raf: dx.hcc_list[0]?.hcc_raf || null,
          monthly_premium: dx.hcc_list[0]?.premium || null,
        };
  
        if (item.hcc_model.version === 'V24') {
          v24Entries.push(entry);
        } else if (item.hcc_model.version === 'V28') {
          if (!v28Entries.has(dx.dx_name)) {
            v28Entries.set(dx.dx_name, []);
          }
          v28Entries.get(dx.dx_name).push(entry);
        }
      });
    });
  
    // Track visited entries
    const visitedV28Entries = new Map();
    const visitedV24Entries = new Map();
  
    // Process V24 entries and match with V28 entries
    v24Entries.forEach(v24Entry => {
      const v28List = v28Entries.get(v24Entry.dx_code) || [];
  
      if (v28List.length > 0) {
        // Create pairs of V24 and V28 entries
        let v28Entry = v28List.shift(); // Get the first unvisited V28 entry
  
        output.push({
          dx_code: v24Entry.dx_code,
          dx_desc: v24Entry.dx_desc || v28Entry.dx_desc,
          v24_hcc: v24Entry.hcc,
          v24_raf: v24Entry.raf,
          v24_monthly_premium: v24Entry.monthly_premium,
          v28_hcc: v28Entry.hcc,
          v28_raf: v28Entry.raf,
          v28_monthly_premium: v28Entry.monthly_premium
        });
  
        // Mark this V28 entry as visited
        if (!visitedV28Entries.has(v24Entry.dx_code)) {
          visitedV28Entries.set(v24Entry.dx_code, []);
        }
        visitedV28Entries.get(v24Entry.dx_code).push(v28Entry);
  
        // Add remaining V28 entries
        v28List.forEach(entry => {
          output.push({
            dx_code: entry.dx_code,
            dx_desc: entry.dx_desc,
            v24_hcc: null,
            v24_raf: null,
            v24_monthly_premium: null,
            v28_hcc: entry.hcc,
            v28_raf: entry.raf,
            v28_monthly_premium: entry.monthly_premium
          });
  
          // Mark this V28 entry as visited
          if (!visitedV28Entries.has(entry.dx_code)) {
            visitedV28Entries.set(entry.dx_code, []);
          }
          visitedV28Entries.get(entry.dx_code).push(entry);
        });
      } else {
        // Add V24 entry without a corresponding V28 entry
        output.push({
          dx_code: v24Entry.dx_code,
          dx_desc: v24Entry.dx_desc,
          v24_hcc: v24Entry.hcc,
          v24_raf: v24Entry.raf,
          v24_monthly_premium: v24Entry.monthly_premium,
          v28_hcc: null,
          v28_raf: null,
          v28_monthly_premium: null
        });
      }
    });
  
    // Add remaining V28 entries that haven't been visited
    v28Entries.forEach((v28List, dx_code) => {
      v28List.forEach(entry => {
        if (!visitedV28Entries.has(dx_code) || !visitedV28Entries.get(dx_code).includes(entry)) {
          output.push({
            dx_code: entry.dx_code,
            dx_desc: entry.dx_desc,
            v24_hcc: null,
            v24_raf: null,
            v24_monthly_premium: null,
            v28_hcc: entry.hcc,
            v28_raf: entry.raf,
            v28_monthly_premium: entry.monthly_premium
          });
        }
      });
    });
    const finalOutput = output?.filter(entry => {
      if (entry?.dx_code === "Intraction Code") {
        intractionEntries.push(entry);
        return false;
      }
      return true;
    });
    
    return finalOutput.concat(intractionEntries);
  };
  
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

  useEffect(() => {
    if (patientDetailsResult?.data?.response?.rafScore) {
      setRafScoreDetails(
        preprocessData(
          patientDetailsResult?.data?.response?.rafScore?.scoreOutputDTOList
        )
      );
    }
  }, [patientDetailsResult?.data?.response?.rafScore]);

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
                        <div className="col-xl-4">DX Code</div>
                        <div className="col-xl-7">DX Description</div>
                      </div>
                    </div>
                    <div className={style.stickyHeader}>
                      {rafScoreDetails?.map((item, i) => (
                        <div className={style.detailsHead}>
                          <div
                            className={
                              rafScoreDetails?.length != i + 1
                                ? `row ${style.rafchildBorder}`
                                : `row`
                            }
                          >
                            <div className="col-xl-4"> {item.dx_code}</div>
                            <div className={`col-xl-7 ${style.rafDescription}`}>
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
                        <div className="col-xl-4">HCC</div>
                        <div className="col-xl-2">RAF</div>
                        <div className="col-xl-4">Monthly Premium</div>
                        <div
                          className="col-xl-1 rounded d-flex align-items-center justify-content-center"
                          style={{ background: "#ffffff", color: "#8262ce" }}
                        >
                          <span
                            className="d-flex align-items-center justify-content-center"
                            style={{ marginLeft: "-5px" }}
                          >
                            V24
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={style.stickyHeader}>
                      {rafScoreDetails?.map((item, i) => (
                        <div className={style.detailsHead}>
                          <div
                            className={
                              rafScoreDetails?.length != i + 1
                                ? `row ${style.rafchildBorder}`
                                : `row`
                            }
                          >
                            {/* {rafScoreDetails.map((item) => ( */}
                            <>
                              <div className="col-xl-4">
                                <div>{item.v24_hcc ? item.v24_hcc : ""}</div>
                              </div>

                              <div className="col-xl-2">
                                <div>{item.v24_raf ? item.v24_raf : ""}</div>
                              </div>

                              <div className="col-xl-4  text-center">
                                <div>
                                  {item.v24_monthly_premium
                                    ? "$" + item.v24_monthly_premium
                                    : ""}
                                </div>
                              </div>
                            </>
                            {/* ))} */}
                            {/* <div className="col-xl-3">
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
                            </div> */}
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
                        <div className="col-xl-4">HCC</div>
                        <div className="col-xl-2">RAF</div>
                        <div className="col-xl-4">Monthly Premium</div>
                        <div
                          className="col-xl-1 rounded d-flex align-items-center justify-content-center"
                          style={{ background: "#ffffff", color: "#e47e7e" }}
                        >
                          <span
                            className="d-flex align-items-center justify-content-center"
                            style={{ marginLeft: "-5px" }}
                          >
                            V28
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={style.stickyHeader}>
                      {rafScoreDetails?.map((item, i) => (
                        <div className={style.detailsHead}>
                          <div
                            className={
                              rafScoreDetails?.length != i + 1
                                ? `row ${style.rafchildBorder}`
                                : `row`
                            }
                          >
                            <>
                              <div className="col-xl-4">
                                <div>{item.v28_hcc ? item.v28_hcc : ""}</div>
                              </div>

                              <div className="col-xl-2">
                                <div>{item.v28_raf ? item.v28_raf : ""}</div>
                              </div>

                              <div className="col-xl-4  text-center">
                                <div>
                                  {item.v28_monthly_premium
                                    ? "$" + item.v28_monthly_premium
                                    : ""}
                                </div>
                              </div>
                            </>
                            {/* <div className="col-xl-3">
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
                            </div> */}
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
                  <div
                    className={style.titleHead}
                    style={{ background: "#73b2f2", color: "#ffffff" }}
                  >
                    <div className="row">
                      <div className="col-xl-6 text-center">Overall score</div>
                      <div className="col-xl-6 text-center">
                        Overall premium
                      </div>
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
                        {rafScoreList?.rafVersionDTO?.overAllPremium
                          ? "$" + rafScoreList?.rafVersionDTO?.overAllPremium
                          : "---"}
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
