import React, { useState, useEffect } from "react";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./styles.module.css";
import visitStyles from "../../../styles/visitdata.module.css";
import Header from "../../../jsx/layouts/nav/Header";
import { SVGICON } from "../../../jsx/constant/theme";

const Query = () => {
  const [meatQueryList, setMeatQueryList] = useState([]);
  const [selectPreviousCode, setSelectPreviousCode] = useState(null);
  const [meatQueryListPrevious, setMeatQueryListPrevious] = useState([]);

  const meatQueriedComments = (value) => {};

  const addMeatQuery = (value, condition) => {};

  const getPreviousData = (code, action) => {
    const result = meatQueryList.filter(
      (res) => res.diagnosisCode == code && res.currentQuery != true
    );
    setSelectPreviousCode(code);
    var querySort = result;
    querySort.sort(function (a, b) {
      return b.queryVersion - a.queryVersion;
    });
    setMeatQueryListPrevious(querySort);
  };

  useEffect(() => {
    var data = [
      {
        diagnosisCode: "E03.9",
        description: "Hypothyroidism",
        queryComment:
          "Please confirm if the patient currently has a diagnosis of XXX. It was previously reported on mm-dd-yyyy under PMH/Problem List. Please update the chart with the most current status (active/resolved) and the current treatment/plan for the condition if any. Thank you!Diagnosis listed under Assessment/problem list/PMH/Radiology/Lab, whereas there is no supporting documentation found. Please evaluate and update the condition with current management if the diagnosis is active.  Thank you.",
        queryVersion: 1,
        currentQuery: true,
        createdBy: "Michael Johnson",
      },
      {
        diagnosisCode: "I27.20",
        description: "Pulmonary hypertension",
        queryComment:
          "Please confirm if the patient currently has a diagnosis of XXX. It was previously reported on mm-dd-yyyy under PMH/Problem List. Please update the chart with the most current status (active/resolved) and the current treatment/plan for the condition if any. Thank you!Diagnosis listed under Assessment/problem list/PMH/Radiology/Lab, whereas there is no supporting documentation found. Please evaluate and update the condition with current management if the diagnosis is active.  Thank you.",
        queryVersion: 1,
        currentQuery: true,
        createdBy: "Michael Johnson",
      },
      {
        diagnosisCode: "E03.4",
        description: "Hypothyroidism",
        queryComment: "test",
        queryVersion: 2,
        currentQuery: true,
        createdBy: "Michael Johnson",
      },
    ];

    setMeatQueryList(data);
  }, []);

  return (
    <div className={`show`}>
      <Header />
      <div className={visitStyles.headerFixed}>
        <div class="content-body">
          <div
            className={`container-fluid ${visitStyles.container_fluid_patient}`}
          >
            <div className={styles.mainContainer}>
              <div className="row">
                <div className="col-xl-3">
                  <label>Search by Name or ID</label>
                  <div class="form-group has-search">
                    <FontAwesomeIcon
                      className="fa fa-search form-control-feedback"
                      icon={faSearch}
                    />
                    <input
                      type="text"
                      className="form-control new-form-control"
                      placeholder="Search"
                    />
                  </div>
                </div>
                <div className="col-xl-3">
                  <label>Date</label>
                  <div class="form-group has-search">
                    <FontAwesomeIcon
                      className="fa fa-search form-control-feedback"
                      icon={faSearch}
                    />
                    <input
                      type="text"
                      className="form-control new-form-control"
                      placeholder="Search"
                    />
                  </div>
                </div>
                <div className="my-post-content pt-3">
                  <div className={visitStyles.meat_head_card}>
                    <div className="row">
                      <div className="col-xl-1">
                        <label>Codes</label>
                      </div>
                      <div className="col-xl-2">
                        <label>Description</label>
                      </div>
                      <div className="col-xl-2">
                        <label>Published By</label>
                      </div>
                      <div className="col-xl-2">
                        <label>Date & Time</label>
                      </div>
                      <div className="col-xl-2">
                        <label>Message</label>
                      </div>
                      <div className="col-xl-2">
                        <label>Reason</label>
                      </div>
                      <div className="col-xl-1">
                        <label></label>
                      </div>
                    </div>
                  </div>
                  {meatQueryList?.length != 0 ? (
                    <div className={visitStyles.container}>
                      <div className={visitStyles.hccStickey_head}>
                        {meatQueryList?.map((item) => (
                          <>
                            {item.currentQuery == true ? (
                              <div
                                className={`${visitStyles.meat_details_card}`}
                              >
                                <>
                                  {item.diagnosisCode == selectPreviousCode ? (
                                    <div className="d-flex justify-content-between">
                                      <span className={styles.currentBadge}>
                                        Current
                                      </span>
                                      <span
                                        className={styles.moreBtn}
                                        onClick={() =>
                                          setSelectPreviousCode(null)
                                        }
                                      >
                                        Less
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="text-end">
                                      <span
                                        className={styles.moreBtn}
                                        onClick={() =>
                                          getPreviousData(item.diagnosisCode)
                                        }
                                      >
                                        More
                                      </span>
                                    </div>
                                  )}
                                </>
                                <div className="row">
                                  <div className="col-xl-1 d-grid">
                                    <span className="font-bold meat-name-details">
                                      {item.diagnosisCode}
                                    </span>
                                  </div>
                                  <div className="col-xl-2">
                                    <span className="meat-name-details">
                                      {item.description}
                                    </span>
                                  </div>
                                  <div className="col-xl-2 d-grid">
                                    <span className="meat-name-details">
                                      {item.createdBy}
                                    </span>
                                  </div>
                                  <div className="col-xl-2 d-grid">
                                    <span className="meat-name-details">
                                      {moment(item.createdAt).format(
                                        "MM-DD-YYYY & HH:MM:SS"
                                      )}
                                    </span>
                                  </div>
                                  <div className="col-xl-2 d-grid">
                                    <span
                                      onClick={() => meatQueriedComments(item)}
                                      className="cr-pointer meat-name-details"
                                    >
                                      {SVGICON.comment}
                                    </span>
                                  </div>
                                  <div className="col-xl-2 d-grid">
                                    <span className="meat-name-details">
                                      {item.reason}
                                    </span>
                                  </div>
                                  <div className="col-xl-1">
                                    <div
                                      onClick={() =>
                                        addMeatQuery(item, "Update")
                                      }
                                      className={styles.edit_meat_query}
                                    >
                                      {SVGICON.meatQueryEdit}
                                    </div>
                                  </div>
                                </div>
                                {item.diagnosisCode == selectPreviousCode ? (
                                  <>
                                    <span className={styles.previousBadge}>
                                      Previous
                                    </span>
                                    {meatQueryListPrevious?.map((item) => (
                                      <div>
                                        <div className="row">
                                          <div className="col-xl-1 d-grid">
                                            <span className="font-bold meat-name-details">
                                              {item.diagnosisCode}
                                            </span>
                                          </div>
                                          <div className="col-xl-2">
                                            <span className="meat-name-details">
                                              {item.description}
                                            </span>
                                          </div>
                                          <div className="col-xl-2 d-grid">
                                            <span className="meat-name-details">
                                              {item.createdBy}
                                            </span>
                                          </div>
                                          <div className="col-xl-2 d-grid">
                                            <span className="meat-name-details">
                                              {moment(item.createdAt).format(
                                                "MM-DD-YYYY & HH:MM:SS"
                                              )}
                                            </span>
                                          </div>
                                          <div className="col-xl-2 d-grid">
                                            <span
                                              onClick={() =>
                                                meatQueriedComments(item)
                                              }
                                              className="cr-pointer meat-name-details"
                                            >
                                              {SVGICON.comment}
                                            </span>
                                          </div>
                                          <div className="col-xl-2 d-grid">
                                            <span className="meat-name-details">
                                              {item.reason}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </>
                                ) : null}
                              </div>
                            ) : null}
                          </>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Query;
