import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import {connect } from "react-redux";
import visitStyles from "../../../../styles/visitdata.module.css";
import VisitData from "./visitData";
import File from "./file";
import Combo from "./combo";
import Meat from "./meat";
import SpinnerDots from "../../../../components/spinner";
import { actions as detailsActions } from "../../../../stores/patient/details";


const Radiology = ({getRadiologyDetails,getRadiologyFileDetails,radiologyDetailsResult}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTabHead, setActiveTabHead] = useState(1);
  const [activeMeatTitle, setActiveMeatTitle] = useState(null);

  const selectTab = (num) => {
    setActiveTabHead(num);
    if (num == 4) {
      setActiveMeatTitle(null);
    }
  };

  useEffect(() => {
    const patientId = localStorage.getItem("patientId");
    getRadiologyDetails(patientId)
  }, []);

  useEffect(() => {
    if (radiologyDetailsResult?.data?.response) {
      if (radiologyDetailsResult?.data?.response?.radiologyFileDetail) {
          getRadiologyFileDetails(
            radiologyDetailsResult?.data?.response?.radiologyFileDetail[0]
              .azureBlobPath
          )
        setIsLoading(true);
      }
    }
  }, [radiologyDetailsResult?.data?.response]);

  useEffect(() => {
    setTimeout(() => {
      setActiveMeatTitle(null);
    }, 10000);
  }, [activeMeatTitle]);

  return (
    <>
      <div className={visitStyles.visitdata_tab_body}>
        <div className={`profile-tab ${visitStyles.visitdata_header_card2}`}>
          <div className="custom-tab-1">
            <Tab.Container activeKey={activeTabHead}>
              <div className="row">
                <div className="col-xl-11">
                  <Nav as="ul" className="nav nav-tabs">
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey={1}
                        className={visitStyles.navColor}
                        activeClassName={visitStyles.activeLink}
                        onClick={() => selectTab(1)}
                      >
                        File
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey={2}
                        className={visitStyles.navColor}
                        activeClassName={visitStyles.activeLink}
                        onClick={() => selectTab(2)}
                      >
                        Visit Data
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey={3}
                        className={visitStyles.navColor}
                        activeClassName={visitStyles.activeLink}
                        onClick={() => selectTab(3)}
                      >
                        Combination Codes
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey={4}
                        className={visitStyles.navColor}
                        activeClassName={visitStyles.activeLink}
                        onClick={() => selectTab(4)}
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
                  <Tab.Pane id="my-posts" eventKey={1}>
                    <File
                      setActiveTabHead={setActiveTabHead}
                      setActiveMeatTitle={setActiveMeatTitle}
                    />
                  </Tab.Pane>
                  <Tab.Pane id="my-posts" eventKey={2}>
                    <VisitData
                      setActiveTabHead={setActiveTabHead}
                      setActiveMeatTitle={setActiveMeatTitle}
                    />
                  </Tab.Pane>
                  <Tab.Pane id="my-posts" eventKey={3}>
                    <Combo />
                  </Tab.Pane>
                  <Tab.Pane id="my-posts" eventKey={4}>
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


const enhancer = connect(
  (state) => ({
    radiologyDetailsResult :state?.patientDetails?.details?.radiologyResult
  }),
  {
    getRadiologyDetails:detailsActions.radiologyDetailsAction,
    getRadiologyFileDetails:detailsActions.radiologyFileAction,
  }
);
export default enhancer(Radiology);