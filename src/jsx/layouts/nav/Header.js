import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, connect } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import "react-chat-widget/lib/styles.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Button } from "react-bootstrap";
import {
  Badge,
  Dropdown,
  Tooltip,
  Drawer,
  Popover,
  Modal,
  Divider,
  Spin,
} from "antd";
import {
  LoadingOutlined,
  CloseCircleOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import styles from "../../../styles/file-managemnt.module.css";
import { IMAGES } from "../../constant/theme";
import {
  AdminMenuList,
  PhysicanMenuList,
  L2AuditorMenuList,
  ProviderMenuList,
  EHRMenuList,
  PhysicianMenuList,
} from "./Menu";
import ENDPOINTS from "../../../utility/enpoints";
import {
  getNotificationAlert,
  getNotificationAlertClear,
} from "../../../store/actions/NotificationAction";
import Notification from "../../../components/notification/index";
import {
  getFilteredList,
  getPatientID,
} from "../../../store/actions/PatientsActions";
import CodeIcon from "../../../images/svg/CodeIcon";
import Search from "../../../components/search";
import Selector from "../../../components/selector";
import ChatCommunication from "../../../components/chatCommunication/index";
import { renderUserPrfoile } from "../../../components/headerFilters/functions";
import ImageUploader from "../../../components/imageUploading/ImageUploader";
import editImg from "../../../images/svg/edit.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faBell } from "@fortawesome/free-regular-svg-icons";
import {
  getAccuracy,
  getCoderDetails,
  getCurrentUser,
  logoutAllDevice,
} from "../../../stores/authflow/actions";
import { actions as dashbaordActions } from "../../../stores/reviewer/dashboard";

const btnItems = [
  {
    id: 1,
    name: "ICD-10",
  },
  {
    id: 2,
    name: "HCC",
  },
];

const Options = [
  {
    value: "both",
    label: "BOTH",
  },
  {
    value: "CMS",
    label: "CMS",
  },
  {
    value: "RX",
    label: "RX",
  },
];

const Header = ({
  notificationResponse,
  getNotificationList,
  getTenentLogo,
  tenent,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const notificationAlertData = useSelector(
    (state) => state?.notificationDatas?.notificationAlert
  );

  const msgReply = useSelector((state) => state?.workFlow?.chatReply);
  const accuracy = useSelector((state) => state?.auth?.accuracy);
  const currentUserInfo = useSelector((state) => state?.auth?.userInfo);
  const codDetails = useSelector((state) => state?.auth?.codeDetails);
  const profileUploadedTime = useSelector((state) => state?.auth?.url);
  const stateActive = router.pathname;
  const [headerFix, setheaderFix] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [menuList, setMenuList] = useState([]);
  const [userIdDetails, setUserIdDetails] = useState(null);
  const [open, setOpen] = useState(false);
  const [openMsg, setOpenMsg] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedOption, setSelectedOption] = useState("Both");
  const [selectedbtn, setSelectedBtn] = useState("ICD-10");
  const [dropdownContent, setDropdownContent] = useState();
  const [currentRole, setCurrentRole] = useState();
  const [profileImg, setProfileImg] = useState();
  const [lastName, setLastName] = useState();
  const [openUploader, setOpenUploader] = useState();
  const [openContent, setOpenContent] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);

  const getStatus = (data) => {
    const isCMS = data?.cmsHcc_model_category_V24_for_2023_payment_year;
    const isRX = data?.rxHcc_model_category_V08_for_2023_payment_year;

    if (isCMS === "Yes" && isRX === "Yes") {
      return "CMS RX";
    } else if (isCMS === "Yes") {
      return "CMS";
    } else if (isRX === "Yes") {
      return "RX";
    } else {
      return "";
    }
  };

  const onClose = () => {
    setOpen(false);
    setOpenMsg(false);
  };

  const logoutFunction = async () => {
    setOpenContent(true);
    Swal.fire({
      title: "Warning!",
      text: "Do you want Logout!",
      icon: "warning",
      confirmButtonText: "Logout",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      closeOnConfirm: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const userRole = localStorage.getItem("role");
        await logoutAllDevice();
        localStorage.clear();
        if (userRole != "ehr") {
          window.location = "/login";
        } else {
          window.location = "/ehrlogin";
        }
      }
    });
  };

  const getUserIdDetails = async (currentUserInfo) => {
    const token = localStorage.getItem("token");
    const getUserId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("role");

    setUserIdDetails(currentUserInfo?.data?.response);
    setProfileImg(currentUserInfo?.data?.response?.profileImageUrl);
    setUserName(currentUserInfo?.data?.response?.firstName);
    setLastName(currentUserInfo?.data?.response?.lastName);
    setDropdownContent(currentUserInfo?.data?.response?.role);
    if (getUserId == "johnson@encipherhealth.onmicrosoft.com") {
      setDropdownContent(["TENANT"]);
    }
    if (userRole === "ehr") {
      setDropdownContent(["EHR"]);
    }
    let userId = currentUserInfo?.data?.response?.id;
    const userName = currentUserInfo?.data?.response?.userName;

    getNotificationList(userId);
    const sse = new EventSource(
      `${ENDPOINTS?.apiEndoint}communication/push-notifications/${userName}?token=${token}`
    );
    sse.addEventListener("user-list-event", (event) => {
      const data = JSON.parse(event.data);
      if (data.length != 0) {
        dispatch(getNotificationAlert(data));
        getNotificationList(userId);
      }
    });
    sse.onerror = () => {
      sse.close();
    };
    return () => {
      sse.close();
    };
  };

  const PopContent = (
    <div className={styles.innerPop}>
      <div className={styles.codesContainer}>
        <div
          style={{
            width: "90%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            {btnItems?.map((data) => (
              <button
                key={data?.id}
                onClick={() => {
                  setSelectedBtn(data?.name);
                }}
                className={
                  selectedbtn === data?.name
                    ? styles.activeBtn
                    : styles.inactiveBtn
                }
              >
                {data?.name}
              </button>
            ))}
          </div>
          <div style={{ width: "30%", margin: "-25px 30px 0 0" }}>
            {selectedbtn === "HCC" && (
              <Selector
                selectlabel={""}
                setSelectedOption={setSelectedOption}
                selectOptions={Options}
                defaultSelectValue1={Options[0]}
              />
            )}
          </div>
          <div className={styles.closeContainer}>
            <CloseCircleOutlined
              onClick={() => setPopoverVisible(false)}
              className={styles.close_icon}
            />
          </div>
        </div>
      </div>
      <div className={styles.codesContainer}>
        <div className={styles.codesContainer2}>
          <Search searchlabel={""} setSearch={setSearch} />
        </div>
      </div>
      <div className={styles.displayDiv}>
        {codDetails?.response
          ? codDetails?.response?.map((data) => (
              <div className={styles.hoverDiv} key={data?.id}>
                {data?.diagnosisCode} &nbsp;
                {data?.description}&nbsp;
                {selectedbtn === "HCC" && (
                  <>
                    {getStatus(data) === "CMS" && (
                      <span className={styles.cmsStatus}>
                        {getStatus(data)}
                      </span>
                    )}
                    {getStatus(data) === "RX" && (
                      <span className={styles.rxStatus}>{getStatus(data)}</span>
                    )}
                    {getStatus(data) === "CMS RX" && (
                      <>
                        <span
                          className={styles.cmsStatus}
                          style={{ marginRight: "5px" }}
                        >
                          CMS
                        </span>
                        <span className={styles.rxStatus}>RX</span>
                      </>
                    )}
                  </>
                )}
              </div>
            ))
          : null}
      </div>
    </div>
  );

  const notificationDrawer = async () => {
    setOpen(true);
    dispatch(getNotificationAlertClear([]));
  };

  const items = dropdownContent
    ?.map((data) => ({
      key: data.toLowerCase(),
      label: data.charAt(0).toUpperCase() + data.slice(1).toLowerCase(),
    }))
    .filter(
      (info) =>
        info.key.toLowerCase() !== userRole?.toLowerCase() &&
        info.label.toLowerCase() !== userRole?.toLowerCase()
    );

  const onClick = ({ key }) => {
    localStorage.setItem("userRole", key);
    if (key === "admin") {
      router.push("/admin/user");
    } else if (key === "reviewer") {
      router.push("/reviewer/dashboard");
    } else if (key === "supervisor") {
      router.push("/supervisor/dashboard");
    } else if (key === "tenant") {
      router.push("/tenant/fhirTable");
    } else if (key === "ehr") {
      router.push("/ehr/patients");
    }
  };
  const getMenuListByRole = (role) => {
    switch (role) {
      case "admin":
        return AdminMenuList;
      case "reviewer":
        return PhysicanMenuList;
      case "supervisor":
        return L2AuditorMenuList;
      case "tenant":
        return ProviderMenuList;
      case "ehr":
        return EHRMenuList;
      case "physician":
        return PhysicianMenuList;
      default:
        return [];
    }
  };
  useEffect(() => {
    var loginCheck = localStorage.getItem("loginCheck");
    const userRoleLocal = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("role");

    dispatch(getCurrentUser(userId, router));
    setUserRole(userRoleLocal);
    setCurrentRole(userRole);
    setMenuList(getMenuListByRole(userRoleLocal));

    if (loginCheck !== "true") {
      Swal.fire({
        title: "Error!",
        text: "Session Expired",
        icon: "error",
        confirmButtonText: "Logout",
        confirmButtonColor: "#DD6B55",
        closeOnConfirm: false,
      }).then((result) => {
        if (result.isConfirmed) {
          if (userRole != "ehr") {
            window.location = "/login";
          } else {
            window.location = "/ehrlogin";
          }
        }
      });
    }

    window.addEventListener("scroll", () => {
      setheaderFix(window.scrollY > 50);
    });

    dispatch(getAccuracy());
  }, []);

  const gotoChat = () => {
    setOpenMsg(true);
  };
  useEffect(() => {
    const userRoleLocal = localStorage.getItem("userRole");

    if (selectedbtn && userRoleLocal !== "admin") {
      dispatch(
        getCoderDetails({
          name: selectedbtn?.toLowerCase(),
          search: search.toUpperCase(),
          selectedOption: selectedOption.toLowerCase(),
          router,
        })
      );
    }
    if (currentUserInfo) {
      getUserIdDetails(currentUserInfo);
    }
  }, [msgReply, selectedbtn, search, selectedOption, currentUserInfo]);

  useEffect(() => {
    getTenentLogo();
  }, []);

  return (
    <div className={`header ${headerFix ? "is-fixed" : ""}`}>
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">
            <div className="d-flex">
              <div className="header-logo ">
                <Image src={IMAGES.headerLogo} />
              </div>
              {tenent?.data?.response?.companyLogoLink && (
                <div className="d-flex justify-content-center align-items-center">
                  <span
                    className="mx-2"
                    style={{
                      borderLeft: "2px solid #000",
                      width: "2px",
                      height: "30px",
                    }}
                  ></span>
                  <img
                    src={tenent?.data?.response?.companyLogoLink}
                    alt="tenetLog"
                    width={100}
                    height={70}
                  />
                </div>
              )}
            </div>

            {stateActive != "/reviewer/home" ? (
              <div>
                <ul className="metismenu header-menu d-flex" id="menu">
                  {menuList.map((data, index) => {
                    return (
                      <li
                        className={` ${
                          stateActive === data.to ||
                          stateActive === data.childRoute ||
                          stateActive === data.childRoute2
                            ? "header-active"
                            : ""
                        }`}
                        key={index}
                        onClick={() => {
                          dispatch(getFilteredList(null));
                          dispatch(getPatientID(null));
                          localStorage.removeItem("patientId");
                        }}
                      >
                        <Link href={data.to} className="d-flex">
                          <div
                            className="menu-icon"
                            style={{ paddingRight: "5px" }}
                          >
                            {data.iconStyle}
                          </div>{" "}
                          <span className={`nav-text header-nav-text`}>
                            {data.title}
                          </span>
                          <span></span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
            <div className="header-right d-flex align-items-center">
              <ul className="navbar-nav ">
                <li className="nav-item ps-3">
                  <div className="header-profile2 cr-pointer">
                    <div className="nav-link i-false" as="div">
                      <div className="header-info2 d-flex align-items-center">
                        {userRole !== "admin" && userRole !== "tenant" && (
                          <Popover
                            content={PopContent}
                            placement="bottom"
                            trigger={"click"}
                            open={popoverVisible}
                            onOpenChange={() => setPopoverVisible(true)}
                          >
                            <Button className={styles.codeBtn}>
                              <div style={{ margin: " -7px 0 0 -25px" }}>
                                <CodeIcon />
                              </div>
                              <div style={{ margin: " -6px 0 0 -7px" }}>
                                Codes
                              </div>
                            </Button>
                          </Popover>
                        )}

                        {userRole === "reviewer" && (
                          <Tooltip
                            title={` Quality : ${
                              accuracy?.data?.response
                                ? Math.round(accuracy?.data?.response)
                                : 100
                            }%`}
                          >
                            <div className="header-progress">
                              <div style={{ width: 40, height: 40 }}>
                                <CircularProgressbar
                                  value={
                                    accuracy?.data?.response
                                      ? Math.round(accuracy?.data?.response)
                                      : Math.round(100)
                                  }
                                  text={`${
                                    accuracy?.data?.response
                                      ? Math.round(accuracy?.data?.response)
                                      : Math.round(100)
                                  }%`}
                                />
                              </div>
                            </div>
                          </Tooltip>
                        )}

                        {userRole === "tenant" && (
                          <div
                            className="chatheaderIcon"
                            onClick={() => router.push("/tenantAdmin/settings")}
                          >
                            <SettingOutlined
                              style={{
                                width: "23px",
                                height: "26px",
                                marginTop: "8px",
                                fontWeight: "700",
                                marginRight: "10px",
                                color: "#241572",
                                fontSize: "30px",
                              }}
                            />
                          </div>
                        )}
                        <div
                          className="chatheaderIcon"
                          onClick={() => gotoChat()}
                        >
                          <div style={{ color: "#04306f" }}>
                            <div style={{ color: "#04306f" }}>
                              <FontAwesomeIcon
                                icon={faMessage}
                                className={styles.bellIcon}
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  marginTop: "8px",
                                  fontWeight: "700",
                                  marginRight: "10px",
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div
                          className="notificationIcon"
                          onClick={() => notificationDrawer()}
                        >
                          <Badge
                            count={notificationAlertData?.length}
                            color="#04306f"
                          >
                            <div style={{ color: "#04306f" }}>
                              <FontAwesomeIcon
                                icon={faBell}
                                className={`fa-regular ${styles.bellIcon}`}
                              />
                            </div>
                          </Badge>
                        </div>
                        <div className="header-media d-flex">
                          <Popover
                            trigger="click"
                            content={
                              !openContent && (
                                <div className={styles.popDIv}>
                                  <div
                                    style={{
                                      margin: "20px 0px 0 30px",
                                      display: "flex",
                                    }}
                                  >
                                    <div
                                      style={{ width: "80px", height: "80px" }}
                                    >
                                      {profileUploadedTime?.loading ? (
                                        <Spin
                                          indicator={
                                            <LoadingOutlined
                                              style={{ fontSize: 24 }}
                                            />
                                          }
                                          loading={profileUploadedTime?.loading}
                                          style={{ marginTop: "10px" }}
                                        />
                                      ) : (
                                        renderUserPrfoile(
                                          userName,
                                          lastName,
                                          profileImg,
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
                                        className={styles.edit}
                                      >
                                        <span>
                                          <Image src={editImg} alt="noimg" />
                                        </span>
                                      </div>
                                    </div>
                                    <div style={{ margin: "10px 0 0 5px" }}>
                                      <span
                                        className="ms-2 header-name d-flex mr-3"
                                        style={{
                                          fontWeight: "700",
                                          fontSize: "16px",
                                        }}
                                      >
                                        {userName}
                                      </span>
                                      <span
                                        className="text-[#4F4F4F] ms-2 subHeader-name d-flex mr-3 "
                                        style={{
                                          fontWeight: "500",
                                          fontSize: "6px",
                                        }}
                                      >
                                        {currentRole == "reviewer"
                                          ? "Reviewer"
                                          : currentRole == "supervisor"
                                          ? "Supervisor"
                                          : currentRole == "tenant"
                                          ? "Tenant Admin"
                                          : currentRole == "ehr"
                                          ? "EHR"
                                          : "Admin"}
                                      </span>
                                    </div>
                                  </div>

                                  <Divider className={styles.divider} />
                                  <div
                                    className={styles.footerDiv}
                                    onClick={logoutFunction}
                                  >
                                    {/* <Image src={logout} /> */}
                                    <span className={styles.footerCont}>
                                      {" "}
                                      Log out
                                    </span>
                                  </div>
                                </div>
                              )
                            }
                          >
                            <div>
                              <div className="header-info2 d-flex align-items-center">
                                <div
                                  className="header-media"
                                  style={{ marginTop: "-3px" }}
                                  onClick={() => setOpenContent(false)}
                                >
                                  {profileUploadedTime?.loading ? (
                                    <Spin
                                      indicator={
                                        <LoadingOutlined
                                          style={{ fontSize: 20 }}
                                        />
                                      }
                                      loading={profileUploadedTime?.loading}
                                      style={{ marginTop: "10px" }}
                                    />
                                  ) : (
                                    renderUserPrfoile(
                                      userName,
                                      lastName,
                                      profileImg,
                                      "header"
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </Popover>
                        </div>
                        <div className="mx-15">
                          <div
                            className="text-dark-50 ms-2 header-name d-flex mr-3"
                            style={{ fontWeight: "700", fontSize: "16px" }}
                          >
                            {userName}
                          </div>

                          {items?.length > 0 && userIdDetails != "" ? (
                            <span className="ms-2 d-flex mt-1">
                              <Dropdown
                                menu={{
                                  items,
                                  onClick,
                                }}
                                trigger={["click"]}
                              >
                                <span
                                  className="header-name"
                                  style={{ marginLeft: "10px" }}
                                >
                                  {userRole}
                                  <DownOutlined
                                    style={{ margin: "0 0 0 5px" }}
                                  />
                                </span>
                              </Dropdown>
                            </span>
                          ) : (
                            <span
                              className="text-[#4F4F4F] ms-2 subHeader-name d-flex mr-3"
                              style={{ fontWeight: "500", fontSize: "6px" }}
                            >
                              {currentRole == "reviewer"
                                ? "Reviewer"
                                : currentRole == "supervisor"
                                ? "Supervisor"
                                : currentRole == "tenant"
                                ? "Tenant"
                                : currentRole == "ehr"
                                ? "EHR"
                                : "Admin"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <Drawer
        title="Notification"
        placement="right"
        closable={true}
        onClose={onClose}
        open={open}
      >
        {!openMsg ? (
          <Notification
            notificationResponse={notificationResponse?.data?.response}
          />
        ) : null}
      </Drawer>

      <Modal
        title="Upload Profile Image"
        open={openUploader}
        onOk={() => setOpenUploader(false)}
        onCancel={() => setOpenUploader(false)}
      >
        <div>
          <ImageUploader
            setOpenUploader={setOpenUploader}
            setOpenContent={setOpenContent}
          />
        </div>
      </Modal>
      {openMsg ? (
        <div className="chat-box ">
          <ChatCommunication openMsg={openMsg} offMsg={setOpenMsg} />
        </div>
      ) : null}
    </div>
  );
};
const enhancer = connect(
  (state) => ({
    notificationResponse: state?.reviewer?.dashboard?.notification,
    tenent: state?.reviewer?.dashboard?.tenentLogo,
  }),
  {
    getNotificationList: dashbaordActions.notificationAction,
    getTenentLogo: dashbaordActions.tenentLogoAction,
  }
);
export default enhancer(Header);
