import { Divider, Image, Popover, Spin } from "antd";
import React from "react";
import styles from "../../../styles/file-managemnt.module.css";
import { LoadingOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { capitalizeFirstLetter, renderUserPrfoile } from "../../../components/headerFilters/functions";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { getLocalStored, getStorage } from "../../../utils/storages";

const Profile = ({
  openContent,
  setOpenContent,
  setOpenUploader,
  openUploader,
  profileUploadedTime,
  currentRole,
  currentUserInfo,
  logoutFunction,
  profileImageUrl,
  userName,
  userEmail,
  allRolesData,
}) => {
    const { name = "" } = getLocalStored();
  return (
    <>
      <div
        id="profileTab"
        name="profileTab"
        className="header-media ant-badge cursor-pointer d-flex me-1"
      >
        <Popover
          trigger="click"
          open={openContent}
          content={
            <div className={styles.popDIv}>
              <div
                id="profile-close"
                name="profile-close"
                className={styles.closeContainer2}
              >
                <CloseCircleOutlined
                  id="close-profileTab"
                  name="close-profileTab"
                  onClick={() => setOpenContent(false)}
                  className={styles.close_icon}
                />
              </div>
              <div
                style={{
                  margin: "20px 0px 0 30px",
                  display: "flex",
                  gap: "20px",
                }}
              >
                <div style={{ width: "80px", height: "80px" }}>
                  {profileUploadedTime?.loading ? (
                    <Spin
                      indicator={<LoadingOutlined style={{ fontSize: 24 }} />}
                      loading={profileUploadedTime?.loading}
                      style={{ marginTop: "10px" }}
                    />
                  ) : (
                    renderUserPrfoile(
                      allRolesData?.firstName,
                      allRolesData?.lastName,
                      allRolesData?.profileImageUrl,
                      "header",
                      "70px",
                      "70px"
                    )
                  )}
                  <div
                    onClick={() => {
                      setOpenContent(false);
                      setOpenUploader(!openUploader);
                    }}
                    id="editIcon"
                    name="editIcon"
                    className={styles.edit}
                  >
                    <span id="profile-edit" name="profile-edit">
                      <FontAwesomeIcon
                        icon={faPen}
                        style={{ marginTop: "7px" }}
                      />
                    </span>
                  </div>
                </div>

                <div className="">
                  <span
                    className="d-flex mt-3 align-items-center"
                    style={{
                      fontWeight: "600",
                      fontSize: "16px",
                    }}
                  >
                    {`${capitalizeFirstLetter(allRolesData?.firstName)} ${capitalizeFirstLetter(allRolesData?.lastName)}`.trim()}
                  </span>

                  <span
                    className="text-[#4F4F4F]  subHeader-name d-flex mr-3 "
                    style={{
                      fontWeight: "500",
                      fontSize: "6px",
                    }}
                  >
                    {currentRole?.split("_")?.join(" ")}
                  </span>
                </div>
              </div>

              <Divider className={styles.divider} />
              <div
                id="logout-btn"
                name="logout-btn"
                className={styles.footerDiv}
                onClick={logoutFunction}
              >
                {/* <Image src={logout} /> */}
                <span id="logout" name="logout" className={styles.footerCont}>
                  {" "}
                  Log out
                </span>
              </div>
            </div>
          }
        >
          <div>
            <div className="header-info2 d-flex align-items-center">
              <div
                className="header-media  cursor-pointer"
                style={{ marginRight: "10px" }}
                onClick={() => setOpenContent(true)}
              >
                {profileUploadedTime ? (
                  <Spin
                    indicator={<LoadingOutlined style={{ fontSize: 20 }} />}
                    loading={profileUploadedTime}
                    style={{ marginTop: "10px" }}
                  />
                ) : (
                  renderUserPrfoile(
                    allRolesData?.firstName,
                    allRolesData?.lastName,
                    allRolesData?.profileImageUrl,
                    "header",
                    "40px",
                    "40px"
                  )
                )}
              </div>
            </div>
          </div>
        </Popover>
      </div>
    </>
  );
};

const enhancer = connect(
  (state) => ({
    currentUserInfo: state?.loggedInUser.currentUser?.data?.response,
  }),
  {}
);

export default enhancer(Profile);
