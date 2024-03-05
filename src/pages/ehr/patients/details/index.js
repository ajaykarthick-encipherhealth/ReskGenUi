import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faVenusMars,
  faCalendarAlt,
  faIdCardClip,
} from "@fortawesome/free-solid-svg-icons";
import { Tabs } from "antd";

import Header from "../../../../jsx/layouts/nav/Header";
import styles from "./styles.module.css";
import { renderUserPrfoileAvatarCustom } from "../../../../components/headerFilters/functions";
import visitStyles from "../../../../styles/visitdata.module.css";
import { IMAGES, SVGICON } from "../../../../jsx/constant/theme";
import Appointments from "./appointment";

const { TabPane } = Tabs;

const UserList = () => {
  return (
    <>
      <div className={`show`}>
        <Header />
        <div class="content-body">
          <div className={`container-fluid ${styles.container_fluid}`}>
            <div className="row">
              <div className="col-xl-12">
                <div className={styles.profileContainer}>
                  <div className={`${visitStyles.patient_info_details}`}>
                    <div className={`col-xl-6 ${styles.profile_details}`}>
                      <div className="">
                        <div>
                          {renderUserPrfoileAvatarCustom(
                            "Francis",
                            "Tomy",
                            null,
                            "header",
                            "40px",
                            "40px"
                          )}
                        </div>
                      </div>
                      <div className="">
                        <FontAwesomeIcon icon={faIdCardClip} />
                        <label>MRN</label>
                        <h6 className="ageDtails">EH-1234</h6>
                      </div>
                      <div className="">
                        <FontAwesomeIcon icon={faUserCircle} />
                        <label>Name</label>
                        <h6 className="ageDtails">Francis Tomy</h6>
                      </div>
                      <div className="">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        <label>Age</label>
                        <h6 className="ageDtails">54</h6>
                      </div>
                      <div className="">
                        <FontAwesomeIcon icon={faVenusMars} />
                        <label>Gender</label>
                        <h6 className="ageDtails">FEMALE</h6>
                      </div>
                      <div className="">
                        <i className={visitStyles.dob_icon}>
                          {SVGICON.DatebirthIcon}
                        </i>
                        <label>DOB</label>
                        <h6 className="ageDtails">05/25/1898 </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-12">
                <div className={styles.detailsContainer}>
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Observations" key="1">
                      {/* <Tabs defaultActiveKey="1">
                        <TabPane tab="Appointments" key="1">
                          <Appointments />
                        </TabPane>
                        <TabPane tab="Clinical Notes" key="2"></TabPane>
                        <TabPane tab="Procedures" key="3">
                          ={" "}
                        </TabPane>
                        <TabPane tab="Allergies" key="4"></TabPane>
                        <TabPane tab="Medications" key="5"></TabPane>
                        <TabPane tab="Assessments" key="6"></TabPane>
                      </Tabs> */}
                      {/* <Ob /> */}
                    </TabPane>
                    <TabPane tab="Conditions" key="2"></TabPane>
                    <TabPane tab="Procedures" key="3"></TabPane>
                    <TabPane tab="Medications" key="4"></TabPane>
                    {/* <TabPane tab="Care Teams" key="5"></TabPane> */}
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserList;
