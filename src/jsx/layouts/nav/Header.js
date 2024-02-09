import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import "react-chat-widget/lib/styles.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Button } from "react-bootstrap";
import {
  Badge,
  Dropdown,
  Select,
  Tooltip,
  Drawer,
  Popover,
  Avatar,
} from "antd";
import styles from "../../../styles/file-managemnt.module.css";
import { IMAGES, SVGICON } from "../../constant/theme";
import {
  AdminMenuList,
  MenuList,
  PhysicanMenuList,
  L2AuditMenuList,
  L2AuditorMenuList,
} from "./Menu";
import ENDPOINTS from "../../../utility/enpoints";
import axios from "../../../utility/axiosConfig";
import { getChatReply } from "../../../store/actions/DashboardActions";
import {
  getNotificationAlert,
  getNotificationList,
  getNotificationAlertClear,
} from "../../../store/actions/NotificationAction";
import Notification from "../../../components/notification/index";
import { getFilteredList } from "../../../store/actions/PatientsActions";
import CodeIcon from "../../../images/svg/CodeIcon";
import Search from "../../../components/search";
import {
  getAccuracy,
  getCoderDetails,
} from "../../../store/actions/AuthActions";
import Selector from "../../../components/selector";
import ChatCommunication from "../../../components/chatCommunication/index";
import { renderUserPrfoile } from "../../../components/headerFilters/functions";
import {logoutAllDevice } from "../../../services/AuthService";


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

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const notificationAlertData = useSelector(
    (state) => state?.notificationDatas?.notificationAlert
  );
  const notificationResponse = useSelector(
    (state) => state?.notificationDatas?.notificationList
  );

  const msgReply = useSelector((state) => state.workFlow.chatReply);
  const accuracy = useSelector((state) => state.auth.accuracy);

  const codDetails = useSelector((state) => state.auth.codeDetails);
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
  const [isChat, setIsChat] = useState(false);
  const [profileImg, setProfileImg] = useState();
  const [lastName, setLastName] = useState();

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
    Swal.fire({
      title: "Warning!",
      text: "Do you want Logout!",
      icon: "warning",
      confirmButtonText: "Logout",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      closeOnConfirm: false,
    }).then( async (result) => {
      if (result.isConfirmed) {
        await logoutAllDevice();
        localStorage.clear();
        localStorage.removeItem("loginCheck");
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        window.location = "/login";
      }
    });
  };

  const getUserIdDetails = async (userId) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      ENDPOINTS.apiEndoint + `dbservice/user/get?userName=${userId}`
    );
    setUserIdDetails(response?.data?.response);
    setProfileImg(response?.data?.response?.profileImageUrl);
    setUserName(response?.data?.response?.firstName);
    setLastName(response?.data?.response?.lastName);
    setDropdownContent(response?.data?.response?.role);
    var userId = response?.data?.response?.id;
    dispatch(getNotificationList(userId));
    const sse = new EventSource(
      `${ENDPOINTS?.apiEndoint}communication/push-notifications/${userId}?token=${token}`
    );
    sse.addEventListener("user-list-event", (event) => {
      const data = JSON.parse(event.data);
      if (data.length != 0) {
        dispatch(getNotificationAlert(data));
        dispatch(getNotificationList(userId));
      }
    });
    sse.onerror = () => {
      sse.close();
    };
    return () => {
      sse.close();
    };
  };
  const percentage = 95;
  const PopContent = (
    <div className={styles.innerPop}>
      <div className={styles.codesContainer}>
        <div style={{ width: "70%" }}>
          {btnItems?.map((data) => (
            <button
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
      </div>
      <div className={styles.codesContainer}>
        <div className={styles.codesContainer2}>
          <Search searchlabel={""} setSearch={setSearch} />
        </div>
      </div>
      <div className={styles.displayDiv}>
        {codDetails?.response
          ? codDetails?.response?.map((data) => (
              <div className={styles.hoverDiv}>
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

  const TerminalComponent = dynamic(
    () => import("react-chat-widget").then((mod) => mod.Widget),
    {
      ssr: false,
    }
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
    } else if (key === "l1auditor") {
      router.push("/physician/dashboard");
    } else if (key === "l2auditor") {
      router.push("/l2Auditor/dashboard");
    }
  };
  const getMenuListByRole = (role) => {
    switch (role) {
      case "admin":
        return AdminMenuList;
      case "l1auditor":
        return PhysicanMenuList;
      case "l2auditor":
        return L2AuditorMenuList;
      default:
        return [];
    }
  };
  useEffect(() => {
    var loginCheck = localStorage.getItem("loginCheck");
    const userRoleLocal = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("role");

    getUserIdDetails(userId);
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
          window.location = "/login";
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
    // window.open("/chat",'_blank');
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
  }, [msgReply, selectedbtn, search, selectedOption]);

  return (
    <div className={`header ${headerFix ? "is-fixed" : ""}`}>
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">
            <div className="header-logo">
              <Image src={IMAGES.loginPageLogo} />
            </div>
            {stateActive != "/physician/home" ? (
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
                        }}
                      >
                        <Link href={data.to} className="d-flex">
                          <div className="menu-icon">{data.iconStyle}</div>{" "}
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
                        {userRole !== "admin" && (
                          <Popover
                            content={PopContent}
                            placement="bottom"
                            trigger={"click"}
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

                        <Tooltip
                          title={` Quality : ${
                            userRole === "l1auditor"
                              ? percentage
                              : Math.round(accuracy?.data?.response)
                          }%`}
                        >
                          <div className="header-progress">
                            <div style={{ width: 40, height: 40 }}>
                              <CircularProgressbar
                                value={
                                  userRole === "l1auditor"
                                    ? percentage
                                    : Math.round(accuracy?.data?.response)
                                }
                                text={`${
                                  userRole === "l1auditor"
                                    ? percentage
                                    : Math.round(accuracy?.data?.response)
                                }%`}
                              />

                              {/* <div style={{fontSize:"10px", textAlign:"center", fontWeight:"bold"}}>Quality</div> */}
                            </div>
                          </div>
                        </Tooltip>
                        <div
                          className="chatheaderIcon"
                          onClick={() => gotoChat()}
                        >
                          <Image src={IMAGES.chatIcons} alt="" />
                        </div>

                        <div
                          className="notificationIcon"
                          onClick={() => notificationDrawer()}
                        >
                          <Badge
                            count={notificationAlertData?.length}
                            color="#3479fe"
                          >
                            {SVGICON.dashboardNotification}
                          </Badge>
                        </div>
                        <div
                          className="header-media d-flex"
                          onClick={logoutFunction}
                          style={{ marginLeft: "-10px" }}
                        >
                          <div className="header-info2 d-flex align-items-center">
                            <div
                              className="header-media"
                              style={{ marginTop: "-2px" }}
                            >
                              {renderUserPrfoile(
                                userName,
                                lastName,
                                profileImg,
                                "header"
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mx-15">
                          <span className="text-dark-50 ms-2 header-name font-weight-bolder font-size-base d-flex mr-3">
                            {userName}
                          </span>

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
                            <span className="text-dark-50 ms-2 header-name font-weight-bolder font-size-base d-flex mr-3">
                              {currentRole}
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
          <Notification notificationResponse={notificationResponse?.data} />
        ) : null}
      </Drawer>
      {openMsg ? (
        <div className="chat-box ">
          <ChatCommunication openMsg={openMsg} offMsg={setOpenMsg} />
        </div>
      ) : null}
    </div>
  );
};

export default Header;
