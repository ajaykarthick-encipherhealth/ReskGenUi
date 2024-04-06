import React, { useState, useRef, useEffect } from "react";
import { Tab, Nav } from "react-bootstrap";
import visitStyles from "../../../../../styles/visitdata.module.css";
import styles from "./styles.module.css";
import VisitData from "./visitData";
import Combo from "./combo";
import Meat from "./meat";
import RafScore from "./raf";
import MeatQuery from "./meatQuery";
import File from "./file";
const Hcc = () => {
  const [activeTabHead, setActiveTabHead] = useState("file");
  const [flagTagActive, setFlagTagActive] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const selectTab = (num) => {
    setFlagTagActive(false);
    if(num == 1){
      setFlagTagActive(true)
    }
    setPopoverVisible(false)
  };
  return (
    <>
      <div className={visitStyles.visitdata_tab_body}>
        <div className={`profile-tab ${visitStyles.visitdata_header_card2}`}>
          <div className="custom-tab-1 ">
            <Tab.Container defaultActiveKey={activeTabHead}>
              <div className="row">
                <div className="col-xl-8">
                  <Nav as="ul" className="nav nav-tabs">
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey="file"
                        className={visitStyles.navColor}
                        onClick={() => selectTab(5)}
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
                        onClick={() => selectTab(1)}
                      >
                        Visit Data
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey="comboDiseases"
                        className={visitStyles.navColor}
                        onClick={() => selectTab(2)}
                      >
                        Combination Codes
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey="meatCriteria"
                        className={visitStyles.navColor}
                        onClick={() => selectTab(3)}
                      >
                        MEAT Criteria
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey="RafScore"
                        className={visitStyles.navColor}
                        onClick={() => selectTab(4)}
                      >
                        RAF Score
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey="query"
                        className={visitStyles.navColor}
                        onClick={() => selectTab(6)}
                      >
                        Query
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
                {flagTagActive == true ? (
                  <div className="col-xl-4">
                    <div className={visitStyles.flags}>
                      <div className={visitStyles.flags}>
                        <span className={visitStyles.hccFlag}></span>
                        <span className={visitStyles.flagCodes}>HCC</span>
                      </div>
                      <div className={visitStyles.flags}>
                        <span className={visitStyles.suggestedFlag}></span>
                        <span className={visitStyles.flagCodes}>SUGGESTED</span>
                      </div>
                      <div className={visitStyles.flags}>
                        <span className={visitStyles.deleteFlag}></span>
                        <span className={visitStyles.flagCodes}>DELETED</span>
                      </div>
                      <div className={visitStyles.flags}>
                        <span className={visitStyles.nonhccFlag}></span>
                        <span className={visitStyles.flagCodes}>NON HCC</span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

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
                <Tab.Pane id="my-posts" eventKey="RafScore">
                  <RafScore />
                </Tab.Pane>
                <Tab.Pane id="my-posts" eventKey="file">
                  <File popoverVisible={popoverVisible} setPopoverVisible={setPopoverVisible}/>
                </Tab.Pane>
                <Tab.Pane id="my-posts" eventKey="query">
                  <MeatQuery />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hcc;
