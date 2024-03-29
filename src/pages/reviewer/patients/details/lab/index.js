import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import visitStyles from "../../../../../styles/visitdata.module.css";
import VisitData from "./visitData";
import File from "./file";
import Meat from "./meat";
import {
  getLabDetails,
  getLabFileDetails,
} from "../../../../../store/actions/ReviewerAction/PatientDetailsAction";
import SpinnerDots from "../../../../../components/spinner";

const Lab = ({}) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const labDetailsResult = useSelector(
    (state) => state?.ReviewerReducers?.labDeatils
  );
  const radiologyFile = useSelector(
    (state) => state?.ReviewerReducers?.labFileDetails
  );
  const labDetailsResultTest = useSelector(
    (state) => state?.ReviewerReducers
  );
  console.log(labDetailsResultTest)
  useEffect(() => {
    const patientId = localStorage.getItem("patientId");
    dispatch(getLabDetails(patientId));
  }, []);

  useEffect(() => {
    if (labDetailsResult?.result?.response) {
      console.log(labDetailsResult?.result?.response);
      if (labDetailsResult?.result?.response?.labFileDetail) {
        dispatch(
          getLabFileDetails(
            labDetailsResult?.result?.response?.labFileDetail[0]
              .azureBlobPath
          )
        );
        setIsLoading(true);
      }
    }
  }, [labDetailsResult?.result?.response]);

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
                    <span>LAB</span>
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
                  <Tab.Pane id="my-posts" eventKey="file">
                    <File />
                  </Tab.Pane>
                  <Tab.Pane id="my-posts" eventKey="meatCriteria">
                    <Meat />
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

export default Lab;
