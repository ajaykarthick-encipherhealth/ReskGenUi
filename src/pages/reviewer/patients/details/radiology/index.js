import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import visitStyles from "../../../../../styles/visitdata.module.css";
import VisitData from "./visitData";
import File from "./file";
import Combo from "./combo";
import Meat from "./meat";
import {
  getRadiologyDetails,
  getRadiologyFileDetails,
} from "../../../../../store/actions/ReviewerAction/PatientDetailsAction";
import SpinnerDots from "../../../../../components/spinner";

const Radiology = ({}) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const radiologyDetailsResult = useSelector(
    (state) => state?.ReviewerReducers?.radiologyDeatils
  );
  const radiologyFile = useSelector(
    (state) => state?.ReviewerReducers?.radiologyFileDetails
  );
  useEffect(() => {
    const patientId = localStorage.getItem("patientId");
    dispatch(getRadiologyDetails(patientId));
  }, []);

  useEffect(() => {
    if (radiologyDetailsResult?.result?.response) {
      console.log(radiologyDetailsResult?.result?.response);
      if (radiologyDetailsResult?.result?.response?.radiologyFileDetail) {
        dispatch(
          getRadiologyFileDetails(
            radiologyDetailsResult?.result?.response?.radiologyFileDetail[0]
              .azureBlobPath
          )
        );
        setIsLoading(true);
      }
    }
  }, [radiologyDetailsResult?.result?.response]);

  return (
    <>
      <div className={visitStyles.visitdata_tab_body}>
        <div className={`profile-tab ${visitStyles.visitdata_header_card2}`}>
          <div className="custom-tab-1">
            <Tab.Container defaultActiveKey="file">
              <div className="row">
                <div className="col-xl-11">
                  <Nav as="ul" className="nav nav-tabs">
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey="file"
                        className={visitStyles.navColor}
                        activeClassName={visitStyles.activeLink}
                      >
                        File
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey="validDiseases"
                        className={visitStyles.navColor}
                        activeClassName={visitStyles.activeLink}
                      >
                        Visit Data
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey="comboDiseases"
                        className={visitStyles.navColor}
                        activeClassName={visitStyles.activeLink}
                      >
                        Combination Codes
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey="meatCriteria"
                        className={visitStyles.navColor}
                        activeClassName={visitStyles.activeLink}
                      >
                        MEAT Criteria
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
                <div className="col-xl-1">
                  <div className={visitStyles.sideHeaderTitle}>
                    <span>RADIOLOGY</span>
                  </div>
                </div>
              </div>
              {!isLoading ? (
                <SpinnerDots />
              ) : (
                <Tab.Content>
                  <Tab.Pane id="my-posts" eventKey="validDiseases">
                    <VisitData />
                  </Tab.Pane>

                  <Tab.Pane id="my-posts" eventKey="comboDiseases">
                    <Combo />
                  </Tab.Pane>
                  <Tab.Pane id="my-posts" eventKey="meatCriteria">
                    <Meat />
                  </Tab.Pane>
                  <Tab.Pane id="my-posts" eventKey="file">
                    <File />
                  </Tab.Pane>
                </Tab.Content>
              )}
            </Tab.Container>
          </div>
        </div>
      </div>
    </>
  );
};

export default Radiology;
