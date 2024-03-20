import React from "react";
import styles from "./styles.module.css";
import { Progress } from "antd";

const RafSummary = ({ comparisonData }) => {
  return (
    <>
      <div className={styles.headerTitle2}>
        <h6 className={styles.headerName}>Summary</h6>
      </div>
      <div className={`my-post-content mainCard ${styles.mainCard}`}>
        <div className={styles.accuracyConatiner}>
          <div>
            <h5>Raf Score</h5>
            <div>
              <div className="row">
                {comparisonData?.data?.rafSummary
                  ?.slice(-2)
                  .reverse()
                  ?.map((item) => (
                    <div className="col-xl-6">
                      <div className={styles.rafCard}>
                        <div className={styles.rafTitle}>
                          <span className={styles.previousYearText}>
                            {`${item?.year} RAF`}
                          </span>
                          <h1 className={styles.rafPercentage}>
                            {item?.score}
                          </h1>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <h5></h5>
            <div className={styles.accuracyCard}>
              <div className={styles.accuracyCard2}>
                <div className={`mainCard ${styles.card1}`}>
                  <h6 className={`text-center ${styles.rafHeading1}`}>
                    {/* Cogent AI RAF */}
                  </h6>
                  <Progress
                    type="dashboard"
                    percent={
                      comparisonData?.data?.rafSummary[
                        comparisonData?.data?.rafSummary?.length - 1
                      ]?.score
                    }
                    width={250}
                    format={() => (
                      <>
                        <div>
                          <div className={styles.currentYearText}>
                            {comparisonData?.data?.rafSummary[0]?.year}
                          </div>
                          <div>
                            {comparisonData?.data?.rafSummary[
                              comparisonData?.data?.rafSummary?.length - 1
                            ]?.score
                              ? `${
                                  comparisonData?.data?.rafSummary[
                                    comparisonData?.data?.rafSummary?.length - 1
                                  ]?.score
                                }%`
                              : "0%"}
                          </div>
                        </div>
                      </>
                    )}
                    className="mainCard"
                  />
                </div>
                <div className={styles.card2}>
                  <h6 className={`text-center ${styles.rafHeading2}`}>
                    {/* Client’s RAF */}
                  </h6>

                  <Progress
                    type="dashboard"
                    percent={parseInt(
                      comparisonData?.data
                        ?.differenceBetweenCurrentYearAndPreviousYear
                    )}
                    width={250}
                    format={() => (
                      <>
                        <div>
                          <div className={styles.currentYearText}>
                            {" "}
                            Difference (
                            {comparisonData?.data?.rafSummary[1]?.year} &{" "}
                            {comparisonData?.data?.rafSummary[0]?.year}){" "}
                          </div>
                          <div>
                            {comparisonData?.data
                              ?.differenceBetweenCurrentYearAndPreviousYear
                              ? comparisonData?.data
                                  ?.differenceBetweenCurrentYearAndPreviousYear
                              : "0%"}
                          </div>
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RafSummary;
