import React, { useState, useEffect } from "react";
import { Tab, Nav } from "react-bootstrap";
import { useDispatch,useSelector } from "react-redux";
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
import moment from "moment";
import { getPatientDosList } from "../../../../store/actions/ReviewerAction/PatientDetailsAction";

const { Option } = Select;

const Hcc = ({ year }) => {
  const dispatch = useDispatch();
  const patientDosResult = useSelector(
    (state) => state?.ReviewerReducers?.patientDosList
  );
  const [activeTabHead, setActiveTabHead] = useState(1);
  const [flagTagActive, setFlagTagActive] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [activeMeatTitle, setActiveMeatTitle] = useState(null);
  const [activeComboTree, setActiveComboTree] = useState(null);
  const [pageNumberOptions, setPageNumberOptions] = useState([]);
  const [search, setSearch] = useState();

  // console.log(patientDosResult)

  const dosSummaries = [
    {
      dos: {
        date: "2023-10-08T18:30:00.000Z",
      },
      startPageNumber: 1,
      endPagNumber: 9,
    },
    {
      dos: {
        date: "2023-09-24T18:30:00.000Z",
      },
      startPageNumber: 10,
      endPagNumber: 12,
    },
    {
      dos: {
        date: "2023-07-14T18:30:00.000Z",
      },
      startPageNumber: 13,
      endPagNumber: 15,
    },
    {
      dos: {
        date: "2023-06-21T18:30:00.000Z",
      },
      startPageNumber: 16,
      endPagNumber: 19,
    },
    {
      dos: {
        date: "2023-05-25T18:30:00.000Z",
      },
      startPageNumber: 20,
      endPagNumber: 27,
    },
    {
      dos: {
        date: "2023-01-16T18:30:00.000Z",
      },
      startPageNumber: 28,
      endPagNumber: 37,
    },
    {
      dos: {
        date: "2022-09-11T18:30:00.000Z",
      },
      startPageNumber: 38,
      endPagNumber: 45,
    },
    {
      dos: {
        date: "2022-05-08T18:30:00.000Z",
      },
      startPageNumber: 46,
      endPagNumber: 54,
    },
    {
      dos: {
        date: "2022-02-06T18:30:00.000Z",
      },
      startPageNumber: 55,
      endPagNumber: 58,
    },
    {
      dos: {
        date: "2021-10-10T18:30:00.000Z",
      },
      startPageNumber: 59,
      endPagNumber: 66,
    },
    {
      dos: {
        date: "2021-09-07T18:30:00.000Z",
      },
      startPageNumber: 67,
      endPagNumber: 74,
    },
    {
      dos: {
        date: "2021-06-29T18:30:00.000Z",
      },
      startPageNumber: 75,
      endPagNumber: 77,
    },
    {
      dos: {
        date: "2021-06-28T18:30:00.000Z",
      },
      startPageNumber: 78,
      endPagNumber: 81,
    },
    {
      dos: {
        date: "2021-06-08T18:30:00.000Z",
      },
      startPageNumber: 82,
      endPagNumber: 84,
    },
    {
      dos: {
        date: "2021-03-07T18:30:00.000Z",
      },
      startPageNumber: 85,
      endPagNumber: 94,
    },
    {
      dos: {
        date: "2021-02-21T18:30:00.000Z",
      },
      startPageNumber: 95,
      endPagNumber: 100,
    },
  ];

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
    console.log(moment(value).format("YYYY-MM-DD"));
    const patientId = localStorage.getItem("patientId");
    dispatch(
      getPatientDosList(patientId, moment(value).format("YYYY-MM-DD"))
    );
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
                    <Select placeholder="Select DOS" onChange={handleOptions}>
                      {dosSummaries?.map((data) => (
                        <Option key={data?.dos?.date} value={data?.dos?.date}>
                          {moment(data?.dos?.date).format("MM/DD/YYYY")}
                        </Option>
                      ))}
                    </Select>
                  </Nav.Item>
                  <Nav.Item as="li" className="nav-item mx-4">
                    <Button className="primary">Complete Dos</Button>
                  </Nav.Item>
                   {activeTabHead == 1 &&
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
                          marginLeft: "5px",
                        }}
                      />
                    </div>
                  </Popover> }
                  <Nav.Item as="li" className="nav-item mx-4">
                   {flagTagActive ? (
                <div>
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
                  </Nav.Item> 
                </Nav>
              </div>
              
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
