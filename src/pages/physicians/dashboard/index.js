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

const PhysicianDashboard = ({getAllPhysician, getPhysiciansDetails}) => {
  const getPhysicians = async () => {
    try {
      const res = await getAllPhysician();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPhysicians()
  }, [])

  console.log(getPhysiciansDetails, "testing");
  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      <Header />
      <div className="mt-5">
        <div className="row p-3">
          <div className="col-12 mb-2">
            <div className="d-flex justify-content-between">
              <h3>Valid Diagnosis</h3>
              {/* <div className="card "> */}
              <div className="d-flex align-items-end px-2">
                <div className="pb-2">TOTAL REVENUE INCREASE: </div>&nbsp;
                <div className={Styles.revenue}>
                  {getPhysiciansDetails?.data?.response?.differencePercentage}%&nbsp;{" "}
                  <FontAwesomeIcon icon={faArrowUp} />
                </div>
              </div>
            </div>
            {/* </div> */}
            <div className="card p-3">
              <Valid
                data={getPhysiciansDetails?.data?.response?.validCount}
                counts={{
                  validDiseaseRafSum: getPhysiciansDetails?.data?.response?.validDiseaseRafSum,
                  validRafAmount: getPhysiciansDetails?.data?.response?.validRafAmount,
                }}
              />
            </div>
          </div>
          <div className="col-12 mt-4">
            <h3>Suggested Diagnosis</h3>
            <div className="card p-3">
              <Suggested
                data={getPhysiciansDetails?.data?.response?.suggestedCount}
                counts={{
                  validDiseaseRafSum: getPhysiciansDetails?.data?.response?.suggestedRafSum,
                  validRafAmount: getPhysiciansDetails?.data?.response?.suggestedRafAmount,
                }}
              />
            </div>
          </div>
          <div className="col-12 mt-4">
            <h3>Meat Criteria</h3>
            <div className="card p-3">
              <Meat
                data={[
                  getPhysiciansDetails?.data?.response?.treatmentCount,
                  getPhysiciansDetails?.data?.response?.assessmentCount,
                  getPhysiciansDetails?.data?.response?.evaluationCount,
                  getPhysiciansDetails?.data?.response?.monitorCount,
                ]}
                meatCount={getPhysiciansDetails?.data?.response?.totalMeatCount}
                totalFullMeat={getPhysiciansDetails?.data?.response?.totalFullMeatCount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const enhancer = connect((state) => ({
    getPhysiciansDetails: state.physician.dashboard.dashboard
}), {
    getAllPhysician: physicianActions.getAllPhysician,
});

export default enhancer(PhysicianDashboard);
