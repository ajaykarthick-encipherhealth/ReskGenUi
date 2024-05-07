import React from "react";
import Header from "../../jsx/layouts/nav/Header";
import visitStyles from "../../styles/visitdata.module.css";
import Valid from "./valid";
import Suggested from "./suggested";
import Meat from "./meat";
import Data from "./data.json";
import Styles from "./style.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

const physicianView = () => {
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
            <div className={Styles.revenue}>{Data.response.differencePercentage}%&nbsp; <FontAwesomeIcon icon={faArrowUp} /></div></div>
            </div>
            {/* </div> */}
            <div className="card p-3">
              <Valid
                data={Data.response.validCount}
                counts={{
                  validDiseaseRafSum: Data.response.validDiseaseRafSum,
                  validRafAmount: Data.response.validRafAmount,
                }}
              />
            </div>
          </div>
          <div className="col-12 mt-4">
          <h3>Suggested Diagnosis</h3>
            <div className="card p-3">
            <Suggested
                data={Data.response.suggestedCount}
                counts={{
                  validDiseaseRafSum: Data.response.suggestedRafSum,
                  validRafAmount: Data.response.suggestedRafAmount,
                }}
              />
            </div>
          </div>
          <div className="col-12 mt-4">
          <h3>Meat Criteria</h3>
            <div className="card p-3">
              <Meat data={[
                Data.response.treatmentCount,
                Data.response.assessmentCount,
                Data.response.evaluationCount,
                Data.response.monitorCount,
              ]} meatCount={Data.response.totalMeatCount} totalFullMeat={Data.response.totalFullMeatCount}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default physicianView;
