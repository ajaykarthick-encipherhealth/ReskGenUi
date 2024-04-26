import React, { useState, useRef, useEffect } from "react";
import { Tab, Nav } from "react-bootstrap";
import visitStyles from "../../../../../styles/visitdata.module.css";
import VisitData from "./visitData";
import Combo from "./combo";
import Meat from "./meat";
import RafScore from "./raf";
import MeatQuery from "./meatQuery";
import File from "./file";
const Hcc = ({ year }) => {
  const [activeTabHead, setActiveTabHead] = useState(1);
  const [flagTagActive, setFlagTagActive] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [activeMeatTitle, setActiveMeatTitle] = useState(null);

  const selectTab = (num) => {
    setFlagTagActive(false);
    setActiveTabHead(num)
    if (num == 2) {
      setFlagTagActive(true);
    }
    if(num == 4){
      setActiveMeatTitle(null);
    }
    setPopoverVisible(false);
  };
  
  useEffect(() => {
    setTimeout(() => {
      setActiveMeatTitle (null);
    }, 10000);
  }, [activeMeatTitle]);

  return (
    <>
      <div className={visitStyles.visitdata_tab_body}>
        <div className={`profile-tab ${visitStyles.visitdata_header_card2}`}>
          <div className="custom-tab-1 ">
            <Tab.Container activeKey={activeTabHead}>
              <div className="row">
                <div className="col-xl-8">
                  <Nav as="ul" className="nav nav-tabs">
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey={1}
                        className={visitStyles.navColor}
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
                        onClick={() =>selectTab(2)}
                      >
                        Visit Data
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey={3}
                        className={visitStyles.navColor}
                        onClick={() =>selectTab(3)}
                      >
                        Combination Codes
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey={4}
                        className={visitStyles.navColor}
                        onClick={() => selectTab(4)}
                      >
                        MEAT Criteria
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey={5}
                        className={visitStyles.navColor}
                        onClick={() => selectTab(5)}
                      >
                        RAF Score
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        to="#my-posts"
                        eventKey={6}
                        className={visitStyles.navColor}
                        onClick={() =>selectTab(6)}
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
              <Tab.Pane id="my-posts" eventKey={1}>
                  <File
                    popoverVisible={popoverVisible}
                    setPopoverVisible={setPopoverVisible}
                    year={year}
                    setActiveTabHead={setActiveTabHead}
                    setActiveMeatTitle={setActiveMeatTitle}
                  />
                </Tab.Pane>
                <Tab.Pane id="my-posts" eventKey={2}>
                  <VisitData setActiveTabHead={setActiveTabHead}/>
                </Tab.Pane>
                <Tab.Pane id="my-posts" eventKey={3}>
                  <Combo />
                </Tab.Pane>
                <Tab.Pane id="my-posts" eventKey={4}>
                  <Meat activeMeatTitle={activeMeatTitle}/>
                </Tab.Pane>
                <Tab.Pane id="my-posts" eventKey={5}>
                  <RafScore />
                </Tab.Pane>
                <Tab.Pane id="my-posts" eventKey={6}>
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
