import React, { useState, useEffect } from "react";
import { Tab, Nav } from "react-bootstrap";
import visitStyles from "../../../../styles/visitdata.module.css";
import VisitData from "./visitData";
import Combo from "./combo";
import Meat from "./meat";
import RafScore from "./raf";
import MeatQuery from "./meatQuery";
import File from "./file";
import { Button, Dropdown, Popover, Select } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faClose } from "@fortawesome/free-solid-svg-icons";
import styles from "../hcc/styles.module.css";

const Hcc = ({ year }) => {
  const [activeTabHead, setActiveTabHead] = useState(1);
  const [flagTagActive, setFlagTagActive] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [activeMeatTitle, setActiveMeatTitle] = useState(null);
  const [activeComboTree, setActiveComboTree] = useState(null);
  const [pageNumberOptions, setPageNumberOptions] = useState([]);
  const [search, setSearch] = useState();
  const selectTab = (num) => {
    setFlagTagActive(false);
    setActiveTabHead(num);
    if (num == 2) {
      setFlagTagActive(true);
    }
    if (num == 4) {
      setActiveMeatTitle(null);
    }
    if (num == 3) {
      setActiveComboTree(null);
    }
    setPopoverVisible(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setActiveMeatTitle(null);
    }, 10000);
  }, [activeMeatTitle]);
  const handleOptions = (value) => {
    console.log(value);
  };
  const handleChangePageNumber = async (value) => {
    setPopoverVisible(false);
    var str_array = value.split(",");
    var pageNumber = str_array[0];
    setSearch({
      value: "",
      page: pageNumber,
    });
  };
  const PopContent = (
    <div className={styles.innerPop}>
      <div className={styles.displayDiv}>
        {/* <div className={styles.closeContainer}>
          <FontAwesomeIcon
            icon={faClose}
            style={{
              size: 5,
              color: "#fff",
            }}
            className={styles.close_icon}
            onClick={() => setPopoverVisible(false)}
          />
        </div> */}
        {pageNumberOptions
          ? pageNumberOptions?.map((data) => (
              <div className={styles.hoverDiv}>
                <div className={`row ${styles.selectDetailsContainer}`}>
                  <div className="col-xl-3">
                    <span className={styles.selectHead}>{data.label}</span>
                  </div>
                  {data?.options.map((data2) => (
                    <div className={`col-xl-3 ${styles.selectDetailsDiv}`}>
                      <span
                        onClick={() => handleChangePageNumber(data2.value)}
                        className={styles.selectDetails}
                      >
                        {data2?.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );

  return (
    <div className={visitStyles.visitdata_tab_body}>
      <div className={`profile-tab ${visitStyles.visitdata_header_card2}`}>
        <div className="custom-tab-1 ">
          <Tab.Container activeKey={activeTabHead}>
            <div className="row">
              <div className="col-xl-12">
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
                      onClick={() => selectTab(6)}
                    >
                      Query
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li" className="nav-item">
                    <Select
                      placeholder="Select DOS"
                      option={[]}
                      onChange={handleOptions}
                    />
                  </Nav.Item>
                  <Nav.Item as="li" className="nav-item mx-4">
                    <Button>hg</Button>
                  </Nav.Item>
                  <Popover
                    // open={popoverVisible}
                    content={PopContent}
                    placement="bottom"
                    trigger={"click"}
                    // onOpenChange={() => setPopoverVisible(false)}
                  >
                    <div className={styles.dosContainer}>
                      <span className={styles.dosPageNumber}>
                        Select Dos Page Number
                      </span>
                      <FontAwesomeIcon
                        icon={faAngleDown}
                        style={{
                          size: 10,
                          color: "#e6e6e6",
                          marginLeft:"5px"
                        }}
                      />
                    </div>
                  </Popover>
                </Nav>
              </div>
              {flagTagActive ? (
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
                  setActiveComboTree={setActiveComboTree}
                  pageNumberOptions={pageNumberOptions}
                  setPageNumberOptions={setPageNumberOptions}
                  search={search}
                  setSearch={setSearch}
                />
              </Tab.Pane>
              <Tab.Pane id="my-posts" eventKey={2}>
                <VisitData
                  setActiveTabHead={setActiveTabHead}
                  setActiveMeatTitle={setActiveMeatTitle}
                  setActiveComboTree={setActiveComboTree}
                />
              </Tab.Pane>
              <Tab.Pane id="my-posts" eventKey={3}>
                <Combo activeComboTree={activeComboTree} />
              </Tab.Pane>
              <Tab.Pane id="my-posts" eventKey={4}>
                <Meat activeMeatTitle={activeMeatTitle} year={year} />
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
  );
};

export default Hcc;
