import React, { useState } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import styles from "./report.module.css";
import ReviewerReport from "./reviewerReport/indes";
import SentRewiewer from "./sentReport";
import ReceivedReport from "./receivedReport";
import HeaderFilters from "../../../components/headerFilter";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("Reviewer");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div>
        <Header />
        <div className="content-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div>
                  <div className={styles.buttonContainer}>
                    <div className={styles.group}>
                      <button
                        className={
                          activeTab === "Reviewer" ? `${styles.active}` : ""
                        }
                        onClick={() => handleTabClick("Reviewer")}
                      >
                        Reviewer
                      </button>
                      <button
                        className={
                          activeTab === "Sent" ? `${styles.active}` : ""
                        }
                        onClick={() => handleTabClick("Sent")}
                      >
                        Sent
                      </button>
                      <button
                        className={
                          activeTab === "Received" ? `${styles.active}` : ""
                        }
                        onClick={() => handleTabClick("Received")}
                      >
                        Received
                      </button>
                    </div>
                  </div>

                  <div className="tbl-caption  align-items-center">
                          <HeaderFilters
                            // search
                            // setSentSearch={setSentSearch}
                            // setReceivedSearch={setReceivedSearch}
                            // setCoderSearch={setCoderSearch}
                            isSearch={true}
                            // coderSearch={coderSearch}
                            // receivedSearch={receivedSearch}
                            // // sentSearch={sentSearch}
                            // searchlabel="Search by Name"
                            // selector
                            selectlabel=" Status"
                            isSelector={
                              !activeTab ||
                              activeTab === "Reviewer"
                                ? true
                                : false
                            }
                            isRangePicker={true}
                            pickerlabel="Date"
                            // setSelectedOption={setSelectedCoderOpt}
                            // selectOptions={statusOptions}
                            // defaultSelectValue1={""}
                            // selector

                           
                          />
                        </div>

                  <div>
                    {activeTab === "Reviewer" && (
                      <div>
                        <ReviewerReport />
                      </div>
                    )}
                    {activeTab === "Sent" && (
                      <div>
                        <SentRewiewer />
                      </div>
                    )}
                    {activeTab === "Received" && (
                      <div>
                        <ReceivedReport />
                      </div>
                    )}
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

export default Reports;
