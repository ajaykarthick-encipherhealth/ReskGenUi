import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faVenusMars,
  faCalendarAlt,
  faIdCardClip,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../../../../jsx/layouts/nav/Header";
import styles from "./styles.module.css";
import { renderUserPrfoileAvatarCustom } from "../../../../components/headerFilters/functions";
import visitStyles from "../../../../styles/visitdata.module.css";
import { IMAGES, SVGICON } from "../../../../jsx/constant/theme";

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
                    <div className="card-body">
                      <div className={`col-xl-6 ${styles.profile_details}`}>
                        <div className="">
                          <div>
                            {renderUserPrfoileAvatarCustom(
                              "Ajit",
                              "Kumar",
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
                          <h6 className="ageDtails">EH_1234</h6>
                        </div>
                        <div className="">
                          <FontAwesomeIcon icon={faUserCircle} />
                          <label>Name</label>
                          <h6 className="ageDtails">Henry</h6>
                        </div>
                        <div className="">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                          <label>Age</label>
                          <h6 className="ageDtails">54</h6>
                        </div>
                        <div className="">
                          <FontAwesomeIcon icon={faVenusMars} />
                          <label>Gender</label>
                          <h6 className="ageDtails">MALE</h6>
                        </div>
                        <div className="">
                          <i className={visitStyles.dob_icon}>
                            {SVGICON.DatebirthIcon}
                          </i>
                          <label>DOB</label>
                          <h6 className="ageDtails">05/07/1877</h6>
                        </div>
                      </div>
                    </div>
                  </div>
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
