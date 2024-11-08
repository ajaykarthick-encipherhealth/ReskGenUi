import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import Image from "next/image";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import "react-chat-widget/lib/styles.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  Badge,
  Dropdown,
  Tooltip,
  Drawer,
  Popover,
  Modal,
  Divider,
  Spin,
  Button,
} from "antd";
import {
  LoadingOutlined,
  CloseCircleOutlined,
  DownOutlined,
  SettingOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import CodeRoot from "../../../images/menu/coderootv4.png";
import styles from "../../../styles/file-managemnt.module.css";
import { IMAGES, SVGICON } from "../../constant/theme";
import {
  AdminMenuList,
  PhysicanMenuList,
  L2AuditorMenuList,
  ProviderMenuList,
  EHRMenuList,
  PhysicianMenuList,
  PhysicanMenu,
  Analyst,
} from "./Menu";
import Notification from "../../../components/notification/index";
import ChatCommunication from "../../../components/chatCommunication/index";
import ImageUploader from "../../../components/imageUploading/ImageUploader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faBell } from "@fortawesome/free-regular-svg-icons";
import {
  faBook,
  faChevronLeft,
  faChevronRight,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import {
  getAccuracy,
  getCoderDetails,
  getCurrentUser,
  logoutAllDevice,
} from "../../../stores/authflow/actions";
import { actions as dashbaordActions } from "../../../stores/reviewer/dashboard";
import { actions as userActions } from "../../../stores/supervisor/users";
import Codify from "../../../pages/codify";
import { actions as webSocketActions } from "../../../stores/websocket";
import { getStorage, removeStorage, setStorage } from "../../../utils/storages";
import { actions as allActions } from "../../../stores/supervisor/auditedQueue";
import { actions as detailsActions } from "../../../stores/patient/details";
import { actions as authActions } from "../../../stores/authFlows";
import { actions as reportActions } from "../../../stores/admin/report";
import Profile from "./profile";

const Header = ({
  notificationResponse,
  getNotificationList,
  getTenentLogo,
  tenent,
  webSocketNotificationData,
  getNotificationData,
  postUnReadCount,
  getFilteredList,
  getPatientID,
  getCurrentUserInfo,
  currentUserInfo,
  getCoderDetails,
  getAccuracy,
  profileUploadedTime,
  accuracy,
  getActiveTab,
  getReportActiveTab,
  deleteProfile,
  deleteImage,
}) => {
  const router = useRouter();
  const menuItemsPerPage = 5;
  const stateActive = router.pathname;
  const [headerFix, setheaderFix] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [tenentId, setTenentId] = useState(null);
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
  const [opened, setOpened] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(700);
  const [notificationCount, setNotificationCount] = useState(0);
  const notificationSoundRef = useRef(null);
  const [nextMenuList, setNextMenuList] = useState(false)
  const [user,setUser]=useState(null)
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: null,
  });
  const [animate, setAnimate] = useState(false);
  const showDrawer = () => {
    setOpened(true);
    setPopoverVisible(false);
  };
  const onClosed = () => {
    setOpened(false);
    setDrawerWidth(700);
  };

  const onClose = () => {
    setOpen(false);
    setOpenMsg(false);
    const res = webSocketNotificationData?.filter(
      (r) => r?.webSocketType != "NOTIFICATION"
    );
    getNotificationData(res);
  };

  const logoutFunction = async () => {
    setOpenContent(false);
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
        const userRole = getStorage("role");
        await logoutAllDevice();
        sessionStorage.clear();
        removeStorage();
        if (userRole != "ehr") {
          window.location = "/login";
        } else {
          window.location = "/ehrlogin";
        }
      }
    });
  };

  const getUserIdDetails = async (currentUserInfo) => {
    const token = getStorage("token");
    const getUserId = getStorage("userId");
    const userRole = getStorage("role");

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

    getNotificationList(userId);
  };
  const notificationDrawer = async () => {
    setOpen(true);
    setNotificationCount(0);
    postUnReadCount();
    setPopoverVisible(false);
  };
  const formattedRoles = dropdownContent?.map((role) =>
    role
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );

  const items = formattedRoles
    ?.map((data) => ({
      key: data,
      label: data,
    }))
    .filter(
      (info) =>
        info.key.toLowerCase() !== userRole?.replace(/_/g, " ")?.toLowerCase() &&
        info.label.toLowerCase() !== userRole?.replace(/_/g, " ")?.toLowerCase()
    );

  const onClick = ({ key }) => {
    setStorage("userRole", key.replace(/ /g, "_"));
    if (key === "Admin") {
      router.push("/admin/dashboard");
    } else if (key === "Reviewer") {
      router.push("/reviewer/dashboard");
    } else if (key === "Supervisor") {
      router.push("/supervisor/dashboard");
    } else if (key === "Tenant Admin") {
      router.push("/tenantAdmin/dashboard");
    } else if (key === "Ehr") {
      router.push("/ehr/patients");
    }
  };
  const getMenuListByRole = (role) => {
    switch (role?.replace(/_/g, " ")?.toLowerCase()) {
      case "admin":
        return AdminMenuList;
      case "reviewer":
        return PhysicanMenuList;
      case "supervisor":
        return L2AuditorMenuList;
      case "tenant admin":
        return ProviderMenuList;
      case "ehr":
        return EHRMenuList;
      case "record analyst":
        return Analyst;
      case "physician":
        // return PhysicianMenuList;
        return PhysicanMenu;
      default:
        return [];
    }
  };

  const gotoChat = () => {
    setOpenMsg(true);
    setPopoverVisible(false);
  };
  useEffect(() => {
    if (selectedbtn) {
      getCoderDetails({
        name: selectedbtn?.toLowerCase(),
        search: search?.toUpperCase(),
        selectedOption: selectedOption.toLowerCase(),
      });
    }
    if (currentUserInfo) {
      getUserIdDetails(currentUserInfo);
    }
  }, [selectedbtn, search, selectedOption, currentUserInfo]);

  useEffect(() => {
    getTenentLogo();
  }, []);

  const handleExpand = () => {
    const newWidth = drawerWidth + 100;
    const limitedWidth = Math.min(newWidth, 1000);
    setDrawerWidth(limitedWidth);
  };

  const handleResize = () => {
    const newWidth = drawerWidth - 200;
    const limitedWidth = Math.max(newWidth, 500);
    setDrawerWidth(limitedWidth);
  };

  const titleWithIcons = (
    <div className="d-flex align-items-center justify-content-between">
      <div className={styles.heading}>CodeRoot</div>
      <div className="d-flex gap-3">
        <PlusCircleOutlined
          onClick={() => handleExpand()}
          className="lead"
          style={{
            color: drawerWidth >= 1000 ? "gray" : "#241571",
          }}
        />
        {drawerWidth / 10}%
        <MinusCircleOutlined
          className="lead"
          onClick={() => handleResize()}
          style={{
            color: drawerWidth <= 600 ? "gray" : "#241571",
          }}
        />
      </div>
    </div>
  );
  useEffect(() => {
    const count = webSocketNotificationData?.filter(
      (r) => r?.webSocketType == "NOTIFICATION"
    );
    var countUnread =
      notificationResponse?.data?.response?.totalUnreadCount + count?.length;
    setNotificationCount(countUnread ? countUnread : 0);

    notificationSoundRef.current = new Audio("/messageSound.mp3");
    // Play notification sound
    if (countUnread > 0) {
      notificationSoundRef.current.play().catch((error) => {
        console.error("Error playing notification sound:", error);
      });
    }
  }, [webSocketNotificationData, notificationResponse]);
  useEffect(() => {
    if (
      !open &&
      notificationResponse?.data?.response?.totalUnreadCount !== undefined
    ) {
      var countUnread = notificationResponse?.data?.response?.totalUnreadCount;
      setNotificationCount(countUnread ? countUnread : 0);
    } else {
      setNotificationCount(0);
    }
  }, [notificationResponse?.data?.response?.totalUnreadCount, open]);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    var loginCheck = getStorage("loginCheck");
    const userRoleLocal = getStorage("userRole");
    const userId = getStorage("userId");
    const userRole = getStorage("role");
    const tenentId = getStorage("tenantId");
    getCurrentUserInfo({ userId });
    setUserRole(userRoleLocal);
    setCurrentRole(userRole);
    setTenentId(tenentId);
    setMenuList(getMenuListByRole(userRoleLocal));
    setUser(userId)

    if (!loginCheck) {
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
          removeStorage();
        }
      });
    }

    window.addEventListener("scroll", () => {
      setheaderFix(window.scrollY > 50);
    });

    getAccuracy();
  }, []);

  const renderMenuItems = (condition) => {
    return condition?.map((data, index) => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      let encodedParams = null;
      if (currentRole == "Tenant Admin") {
        encodedParams = urlParams.get("isTenantAdminTracking");
      } else {
        encodedParams = urlParams.get("isAdminTracking");
      }

      return (
        <li
          className={` ${
            stateActive === data.to ||
            ((currentRole === "Admin" || currentRole === "Tenant Admin") &&
            encodedParams
              ? stateActive === data.childRoute3
              : stateActive === data.childRoute) ||
            stateActive === data.childRoute2
              ? "header-active"
              : `${styles.menuListItems}`
          }
          } ${styles.transformed}`}
          key={index}
          onClick={() => {
            getFilteredList(null);
            getPatientID(null);
            getActiveTab(null);
            getReportActiveTab(null);
            router.push(
              {
                pathname: `${data?.to}`,
                query: { ...screenSize },
              },
              `${data?.to}`
            );
            localStorage.removeItem("patientId");
          }}
        >
          <div className="d-flex cursor-pointer">
            <div
              className="menu-icon"
              style={{ paddingRight: "5px", color: "#04306f" }}
            >
              {stateActive === data.to ? data.activeIcon : data.iconStyle}
            </div>
            <span className={`nav-text header-nav-text`}>{data.title}</span>
            <span></span>
          </div>
        </li>
      );
    });
  };

  useEffect(() => {
    if (window !== "undefined") {
      const updateScreenSize = () => {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      updateScreenSize();
      window.addEventListener("resize", updateScreenSize);
      const currentPath = menuList?.find(
        (item) =>
          item?.to === window.location?.pathname ||
          item?.childRoute === window.location?.pathname ||
          item?.childRoute2 === window.location?.pathname ||
          item?.childRoute3 === window.location?.pathname
      );
      if (
        currentPath &&
        currentPath &&
        menuList?.slice(5).some((item) => item.title === currentPath?.title)
      ) {
        setNextMenuList(true);
      } else {
        setNextMenuList(false);
      }
      return () => {
        window.removeEventListener("resize", updateScreenSize);
      };
    }
  }, [router, menuList]);

  useEffect(()=>{
    if(deleteImage?.status === 'SUCCESS'){
      getCurrentUserInfo( {userId:user})
    }  
  },[deleteImage])

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
                    width={70}
                    height={40}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
            </div>
            {stateActive != "/reviewer/home" ? (
              <div>
                <ul className={`metismenu header-menu d-flex`} id="menu">
                  {nextMenuList && screenSize?.width <= 1527 && (
                    <div className="d-flex justify-content-center align-items-center">
                      <div
                        className={`d-flex justify-content-center align-items-center cursor-pointer rounded-4 ${styles.addonDiv}`}
                        onClick={() => {
                          setNextMenuList(false);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faChevronLeft}
                          className="fs-6"
                        />
                      </div>
                    </div>
                  )}
                  {renderMenuItems(
                    screenSize?.width <= 1527 &&
                      screenSize?.width != null &&
                      screenSize?.height != null
                      ? nextMenuList
                        ? menuList?.slice(5)
                        : menuList?.slice(0, 5)
                      : menuList
                  )}

                  {menuList?.length > 5 &&
                    !nextMenuList &&
                    screenSize?.width <= 1527 &&
                    screenSize?.width != null &&
                    screenSize?.height != null &&
                    menuList?.length > menuItemsPerPage &&
                    !nextMenuList && (
                      <div className="d-flex justify-content-center align-items-center">
                        <div
                          className={`d-flex justify-content-center align-items-center cursor-pointer rounded-4 ${styles.addonDiv}`}
                          onClick={() => {
                            setNextMenuList(true);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faChevronRight}
                            className="fs-6"
                          />
                        </div>
                      </div>
                    )}
                </ul>
              </div>
            ) : null}
            <div className="header-right d-flex align-items-center">
              <ul className="navbar-nav ">
                <li className="nav-item ps-3">
                  <div className="header-profile2 cr-pointer">
                    <div className="nav-link i-false" as="div">
                      <div className="header-info2 d-flex align-items-center">
                        <div className={styles.codify}>
                          {/* <div>{SVGICON.codify}</div> */}
                          <Tooltip placement="bottom" title={"CodeRoot"}>
                            <img
                              src={CodeRoot.src}
                              width={"35px"}
                              height={"27px"}
                              onClick={showDrawer}
                            />
                          </Tooltip>
                          {/* <FontAwesomeIcon onClick={showDrawer} icon={faBook} /> */}
                        </div>

                        <Drawer
                          title={titleWithIcons}
                          onClose={onClosed}
                          open={opened}
                          width={drawerWidth}
                          destroyOnClose={true}
                        >
                          <Codify
                            drawerWidth={drawerWidth}
                            setDrawerWidth={setDrawerWidth}
                          />
                        </Drawer>
                        {/* NOTE i remove userRole !== "admin" logic because PRAVIN
                        told me to show admin also, so if Logesh ask anything to
                        this please tell him like this */}
                        {/* {(userRole !== "tenant_admin" || userRole != "reviewer") && (
                          <Popover
                            content={PopContent}
                            placement="bottom"
                            trigger={"click"}
                            open={popoverVisible}
                            onOpenChange={handleOpenChange}
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
                        )} */}
                        {userRole === "Reviewer" && (
                          <Tooltip
                            title={` Quality : ${
                              accuracy ? Math.round(accuracy) : 100
                            }%`}
                          >
                            <div className="header-progress">
                              <div style={{ width: 40, height: 40 }}>
                                <CircularProgressbar
                                  value={
                                    accuracy
                                      ? Math.round(accuracy)
                                      : Math.round(100)
                                  }
                                  text={`${
                                    accuracy
                                      ? Math.round(accuracy)
                                      : Math.round(100)
                                  }%`}
                                />
                              </div>
                            </div>
                          </Tooltip>
                        )}
                        {userRole === "tenant_admin" && (
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
                                color: "#04306F",
                                fontSize: "30px",
                              }}
                            />
                          </div>
                        )}
                        {tenentId != "7f41538e-2329-4ecc-890f-03c93cccb934" && (
                          <div
                            className="chatheaderIcon"
                            onClick={() => gotoChat()}
                          >
                            <div style={{ color: "#04306F" }}>
                              <div style={{ color: "#04306F" }}>
                                <FontAwesomeIcon
                                  icon={faMessage}
                                  className={styles.bellIcon}
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    marginTop: "8px",
                                    fontWeight: "700",
                                    marginRight: "10px",
                                    color: "#04306F",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        <div
                          className="notificationIcon"
                          onClick={() => notificationDrawer()}
                        >
                          <Badge count={notificationCount} color="#04306F">
                            <div style={{ color: "#04306F" }}>
                              <FontAwesomeIcon
                                icon={faBell}
                                className={`fa-regular ${styles.bellIcon}`}
                                styles={{ color: "#04306F" }}
                              />
                            </div>
                          </Badge>
                        </div>
                        <Profile
                          openContent={openContent}
                          setOpenContent={setOpenContent}
                          setOpenUploader={setOpenUploader}
                          openUploader={openUploader}
                          profileUploadedTime={profileUploadedTime}
                          currentRole={currentRole}
                          currentUserInfo={currentUserInfo}
                          logoutFunction={logoutFunction}
                          profileImageUrl={profileImg}
                          userName={userName}
                        />
                        <div className="mx-15">
                          <div
                            className="text-dark-50 ms-2 header-name d-flex mr-3"
                            style={{ fontWeight: "700", fontSize: "16px" }}
                          >
                            {userName}
                          </div>

                          {items?.length > 0 && userIdDetails != "" ? (
                            <span className="ms-2 d-flex mt-1 d-flex">
                              <Dropdown
                                menu={{
                                  items,
                                  onClick,
                                }}
                                trigger={["click"]}
                              >
                                <span
                                  className="header-name d-flex"
                                  style={{ margin: "-5px 0px 0 10px" }}
                                >
                                  {currentRole == "Record Analyst"
                                    ? "Analyst"
                                    : userRole
                                        ?.replace(/_/g, " ")
                                        ?.toLowerCase()}
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
                              {currentRole?.replace(/_/g, " ")}
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
        {!openMsg ? <Notification open={open} /> : null}
      </Drawer>

      <Modal
        title="Upload Profile Image"
        open={openUploader}
        maskClosable={false}
        onOk={() => {
          setOpenUploader(false);
          setOpenContent(false);
        }}
        closable={true}
        footer={profileImg ? [
          <div className="customDelete">
          <Button onClick={()=>{deleteProfile()
            setOpenUploader(false);
          }}>
            Delete
          </Button></div>
        ]:[]}
        onCancel={() => {
          setOpenContent(false);
          setOpenUploader(false);
        }}
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
    currentUserInfo: state?.loggedInUser.currentUser,
    webSocketNotificationData:
      state?.tenantAdmin?.webSocket?.webSocketNotificationDetails?.data,
    accuracy: state?.authReducer?.getAccuracy?.getAccuracy?.data?.response,
    profileUploadedTime: state?.authReducer?.getUpdateImageLoading,
    deleteImage:state?.authReducer?.deleteProfileImg?.data
  }),
  {
    getNotificationList: dashbaordActions.notificationAction,
    getTenentLogo: dashbaordActions.tenentLogoAction,
    getNotificationData: webSocketActions.websocketNotificationAction,
    postUnReadCount: dashbaordActions.unReadCountPostAction,
    getFilteredList: allActions.getFilteredList,
    getPatientID: detailsActions.getPatientID,
    getCurrentUserInfo: userActions.getCurrentUserInfo,
    getCoderDetails: authActions.getCoderDetails,
    getAccuracy: authActions.getAccuracy,
    getActiveTab: reportActions.activeTab,
    getReportActiveTab: reportActions.activeTab,
    deleteProfile:authActions.deleteProfileImg
  }
);
export default enhancer(Header);
