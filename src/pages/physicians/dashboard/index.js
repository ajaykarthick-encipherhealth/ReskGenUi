import React, { useEffect } from "react";
import Header from "../../../jsx/layouts/nav/Header";
// import visitStyles from "../../styles/visitdata.module.css";
import Valid from "./valid";
import Suggested from "./suggested";
import Meat from "./meat";
import Styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { actions as physicianActions } from "../../../stores/physician/dashboard";
import HighRisk from "./OIG";
import Data from "./data.json";

const PhysicianDashboard = ({ getAllPhysician, getPhysiciansDetails }) => {
  const getPhysicians = async () => {
    try {
      const res = await getAllPhysician();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPhysicians();
  }, []);
  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      <Header />
      <div className="mt-5">
        <div className="row p-3 pt-5">
          <div className="col-3">
            <div
              className="card p-3 "
              style={{
                background:
                  "linear-gradient(125.27deg, #22D3EE -5.61%, #98E3F0 103.22%)",
              }}
            >
              <div className="text-center">
                <div className={Styles.fontHead}>TOTAL FILE COUNT</div>
                <div className={Styles.fontHead}>
                  {getPhysiciansDetails?.data?.response?.totalPatientCount
                    ? getPhysiciansDetails?.data?.response?.totalPatientCount
                    : 0}
                </div>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div
              className="card p-3"
              style={{
                background:
                  "linear-gradient(125.38deg, #A78BFA -3.55%, #D3CEE4 103.44%)",
              }}
            >
              {" "}
              <div className="text-center">
                <div className={Styles.fontHead}>DOCUMENT REVENUE</div>
                <div className={Styles.fontHead}>
                  $
                  {getPhysiciansDetails?.data?.response?.validRafAmount
                    ? getPhysiciansDetails?.data?.response?.validRafAmount.toFixed(
                        2
                      )
                    : 0}
                </div>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div
              className="card p-3"
              style={{
                background:
                  "linear-gradient(125.16deg, #5D87FF -3.91%, #C7D0EB 104.39%)",
              }}
            >
              <div className="text-center">
                <div className={Styles.fontHead}>CARE GAP REVENUE</div>
                <div className={Styles.fontHead}>
                  $
                  {getPhysiciansDetails?.data?.response?.suggestedRafAmount
                    ? getPhysiciansDetails?.data?.response?.suggestedRafAmount.toFixed(
                        2
                      )
                    : 0}
                </div>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div
              className="card p-3"
              style={{
                background:
                  "linear-gradient(125.78deg, #FFAE1F -3.87%, #F2CF92 103.81%)",
              }}
            >
              <div className="text-center">
                <div className={Styles.fontHead}>TOTAL REVENUE</div>
                <div className={Styles.fontHead}>
                  $
                  {getPhysiciansDetails?.data?.response?.suggestedRafAmount &&
                  getPhysiciansDetails?.data?.response?.validRafAmount
                    ? Number(
                        getPhysiciansDetails?.data?.response
                          ?.suggestedRafAmount +
                          getPhysiciansDetails?.data?.response?.validRafAmount
                      ).toFixed(2)
                    : 0}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row p-3 pt-0">
          <div className="col-12 mb-2">
            <div className="d-flex justify-content-between">
              <h3>Valid Diagnosis</h3>
              {/* <div className="card "> */}
              <div className="d-flex align-items-end px-2">
                <div className="pb-2">TOTAL REVENUE INCREASE: </div>&nbsp;
                <div className={Styles.revenue}>
                  {getPhysiciansDetails?.data?.response?.differencePercentage}
                  %&nbsp; <FontAwesomeIcon icon={faArrowUp} />
                </div>
              </div>
            </div>
            {/* </div> */}
            <div className="card p-3">
              <Valid
                data={
                  getPhysiciansDetails?.data?.response
                    ?.validPhysicianDiagnosisCodeCountDTO
                }
                counts={{
                  validDiseaseRafSum:
                    getPhysiciansDetails?.data?.response?.validDiseaseRafSum,
                  validRafAmount:
                    getPhysiciansDetails?.data?.response?.validRafAmount,
                }}
              />
            </div>
          </div>
          <div className="col-12 mt-4 pt-3">
            <h3>Care Gap Analysis - Suggested Diagnosis</h3>
            <div className="card p-3">
              <Suggested
                data={
                  getPhysiciansDetails?.data?.response
                    ?.suggestedPhysicianDiagnosisCodeCountDTO
                }
                counts={{
                  validDiseaseRafSum:
                    getPhysiciansDetails?.data?.response?.suggestedRafSum,
                  validRafAmount:
                    getPhysiciansDetails?.data?.response?.suggestedRafAmount,
                }}
              />
            </div>
          </div>
          <div className="col-12 mt-4 pt-3">
            <h3>Meat Criteria</h3>
            <div className="card p-3">
              <Meat
                data={[
                  getPhysiciansDetails?.data?.response?.treatmentCount,
                  getPhysiciansDetails?.data?.response?.assessmentCount,
                  getPhysiciansDetails?.data?.response?.evaluationCount,
                  getPhysiciansDetails?.data?.response?.monitorCount,
                ]}
                meatCount={
                  getPhysiciansDetails?.data?.response?.validPhysicianDiagnosisCodeCountDTO?.map(
                    (item) => item.count
                  ).length > 0
                    ? getPhysiciansDetails?.data?.response?.validPhysicianDiagnosisCodeCountDTO
                        .map((item) => item.count)
                        .reduce((tol, item) => tol + item)
                    : 0
                }
                totalFullMeat={
                  getPhysiciansDetails?.data?.response?.suggestedPhysicianDiagnosisCodeCountDTO?.map(
                    (item) => item.count
                  ).length > 0
                    ? getPhysiciansDetails?.data?.response?.suggestedPhysicianDiagnosisCodeCountDTO
                        .map((item) => item.count)
                        .reduce((tol, item) => tol + item)
                    : 0
                }
              />
            </div>
          </div>
          <div className="col-12 mt-4 pt-3">
            <h3>OIG - High Risk Diagnosis Code</h3>
            <div className="card p-3">
              <HighRisk
                data={
                  getPhysiciansDetails?.data?.response
                    ?.oigMeatCheckDtoResponseList ?? []
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    getPhysiciansDetails: state.physician.dashboard.dashboard,
  }),
  {
    getAllPhysician: physicianActions.getAllPhysician,
  }
);

export default enhancer(PhysicianDashboard);
