import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import visitStyles from "../../../../styles/visitdata.module.css";
import VisitData from "./visitData";
import File from "./file";
import Meat from "./meat";
import {
  getLabDetails,
  getLabFileDetails,
} from "../../../../store/actions/ReviewerAction/PatientDetailsAction";
import SpinnerDots from "../../../../components/spinner";

const Lab = ({}) => {
  const [isLoading, setIsLoading] = useState(true);
  const labDetailsResult = useSelector(
    (state) => state?.ReviewerReducers?.labDeatils
  );
  const dispatch = useDispatch();
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
    dispatch(getLabDetails(patientId));
  }, []);

  useEffect(() => {
    if (labDetailsResult?.result?.response) {
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
