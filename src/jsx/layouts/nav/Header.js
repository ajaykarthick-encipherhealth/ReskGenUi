import React, { useState, useContext, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import Link from "next/link";

import { IMAGES, SVGICON } from "../../constant/theme";
import { ThemeContext } from "../../../context/ThemeContext";
import Image from "next/image";
import { useRouter } from "next/router";
import { Logout } from "../../../store/actions/AuthActions";
import Swal from "sweetalert2";
import {
  AdminMenuList,
  MenuList,
  PhysicanMenuList,
  L2AuditMenuList,
} from "./Menu";
import ENDPOINTS from "../../../utility/enpoints";
import axios from "../../../utility/axiosConfig";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Badge, Select, Tooltip } from "antd";
import "react-chat-widget/lib/styles.css";
import dynamic from "next/dynamic";
import { getChatReply } from "../../../store/actions/DashboardActions";
import { Drawer } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";

import {
  getNotificationAlert,
  getNotificationList,
  getNotificationAlertClear,
} from "../../../store/actions/NotificationAction";

import Notification from "../../../components/notification/index";
import { getFilteredList } from "../../../store/actions/PatientsActions";

const Header = ({ onNote }) => {
  const dispatchValue = useDispatch();
  const [headerFix, setheaderFix] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();
  const [stateActive, setStateActive] = useState(router.pathname);
  const [userRole, setUserRole] = useState("");
  const [menuList, setMenuList] = useState([]);
  const [userIdDetails, setUserIdDetails] = useState("");
  const [open, setOpen] = useState(false);
  const [toggleChatBox, setToggleChatBox] = useState(true);
  const [openMsg, setOpenMsg] = useState(false);
  const notificationAlertData = useSelector(
    (state) => state?.notificationDatas?.notificationAlert
  );
  const notificationResponse = useSelector(
    (state) => state?.notificationDatas?.notificationList
  );
  const currentUserRole = useSelector((state) => state.auth.selectedRole);

  useEffect(() => {
    var loginCheck = localStorage.getItem("loginCheck");
    var userName = localStorage.getItem("userName");
    const userRoleLocal = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    getUserIdDetails(userId);

    // dispatchValue(getNotificationAlert("c58c4c29-df4a-4c9e-9277-d58ad9b9d9d8", token));

    setUserRole(userRoleLocal);
    setUserName(userName);
     if (currentUserRole?.toLowerCase() === "admin") {
      setMenuList(AdminMenuList);
    } else {
      setMenuList(PhysicanMenuList);
    }
    if (loginCheck != "true") {
      Swal.fire({
        title: "Error!",
        text: "Session Expired",
        icon: "error",
        confirmButtonText: "Logout",
        confirmButtonColor: "#DD6B55",
        closeOnConfirm: false,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location = "/userlogin";
        }
      });
    }
    window.addEventListener("scroll", () => {
      setheaderFix(window.scrollY > 50);
    });
  }, [currentUserRole]);

  const onClose = () => {
    setOpen(false);
    setOpenMsg(false);
  };

  const logoutFunction = () => {
    Swal.fire({
      title: "Warning!",
      text: "Do you want Logout!",
      icon: "warning",
      confirmButtonText: "Logout",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      closeOnConfirm: false,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        localStorage.removeItem("loginCheck");
        window.location = "/userlogin";
      }
    });
  };

  const options = [
    {
      value: "jack",
      label: "Jack",
    },
    {
      value: "lucy",
      label: "Lucy",
    },
    {
      value: "tom",
      label: "Tom",
    },
  ];

  const getUserIdDetails = async (userId) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      ENDPOINTS.apiEndoint + `dbservice/user/get?userName=${userId}`
    );
    setUserIdDetails(response.data.response);
    var userId = response.data.response?.id;
    dispatchValue(getNotificationList(userId));
    const sse = new EventSource(
      `${ENDPOINTS?.apiEndoint}communication/push-notifications/${userId}?token=${token}`
    );
    sse.addEventListener("user-list-event", (event) => {
      const data = JSON.parse(event.data);
      if (data.length != 0) {
        dispatchValue(getNotificationAlert(data));
        dispatchValue(getNotificationList(userId));
      }
    });
    sse.onerror = () => {
      sse.close();
    };
    return () => {
      sse.close();
    };

    // setUserIdDetails(response.data.response);
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };

  // Filter `option.label` match the user type `input`
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const percentage = 95;

  const PopContent = (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          style={{
            marginRight: "10px",
            border: "0.2px solid #241571",
            borderRadius: "8px",
            background: "#04306F",
            boxShadow: "0px 2px 6px 0px rgba(0, 0, 0, 0.08)",
            width: "90px",
            height: "35px",
            borderRadius: "6px",
            color: "#FFF",
          }}
        >
          ICD - 10
        </button>

        <button
          style={{
            marginRight: "10px",
            border: "0.2px solid #241571",
            borderRadius: "8px",
            background: "white",
            boxShadow: "0px 2px 6px 0px rgba(0, 0, 0, 0.08)",
            width: "90px",
            height: "35px",
            borderRadius: "6px",
            color: "black",
          }}
        >
          ICD - 10
        </button>
      </div>
      <div
        style={{
          margin: "10px 50px",
          width: "146px",
          height: "22px",
        }}
      >
        <Select
          showSearch
          placeholder="Select a person"
          optionFilterProp="children"
          onChange={onChange}
          onSearch={onSearch}
          filterOption={filterOption}
          options={options}
          // style={{ width: "180px", height: "30px" }}
        />
      </div>
    </>
  );

  const TerminalComponent = dynamic(
    () => import("react-chat-widget").then((mod) => mod.Widget),
    {
      ssr: false,
    }
  );

  const dispatch = useDispatch();
  const msgReply = useSelector((state) => state.workFlow.chatReply);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { addResponseMessage } = require("react-chat-widget");
      addResponseMessage(msgReply ? msgReply : "Welcome to CogentAI!");
    }
  }, [msgReply]);

  const handleNewUserMessage = (newMessage) => {
    dispatch(getChatReply(newMessage));
  };

  const handleQuickButtonClicked = (data) => {
    console.log(data);
  };

  const notificationDrawer = async () => {
    setOpen(true)
    dispatchValue(getNotificationAlertClear([]));
  };

  const emailSplitFunction = (email) => {
    let emailSplit = email.split("@");
    return emailSplit[0];
  };

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
                          stateActive === data.childRoute
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
                        <TerminalComponent
                          handleNewUserMessage={handleNewUserMessage}
                          handleQuickButtonClicked={handleQuickButtonClicked}
                          showBadge={false}
                          emojis={true}
                          title="CogentAI"
                          subtitle="Chat with CogentAI"
                        />
                        <Tooltip title={` Quality : ${percentage}%`}>
                          <div className="notificationIcon">
                            <div style={{ width: 40, height: 40 }}>
                              <CircularProgressbar
                                value={percentage}
                                text={`${percentage}%`}
                              />

                              {/* <div style={{fontSize:"10px", textAlign:"center", fontWeight:"bold"}}>Quality</div> */}
                            </div>
                          </div>
                        </Tooltip>

                        <div
                          className="notificationIcon"
                          onClick={() => notificationDrawer()}
                        >
                          <Badge
                            count={notificationAlertData.length}
                            color="#3479fe"
                          >
                            {SVGICON.dashboardNotification}
                          </Badge>
                        </div>
                        <div
                          className="header-media d-flex"
                          onClick={logoutFunction}
                        >
                          {/* <Image src={IMAGES.profileImage}/> */}

                          <div>
                            <Dropdown>
                              <Dropdown.Toggle
                                className="nav-link i-false"
                                as="div"
                              >
                                <div className="header-info2 d-flex align-items-center">
                                  <div className="header-media">
                                    <Image src={IMAGES.profileImage} />
                                  </div>
                                </div>
                              </Dropdown.Toggle>
                              <Dropdown.Menu align="end">
                                <div className=" border-0 mb-0">
                                  <span className="dropdown-item ai-icon ">
                                    {SVGICON.Logout}{" "}
                                    <span className="ms-2">Logout </span>
                                  </span>
                                </div>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>

                          <div>
                            <span className="text-dark-50 ms-2 header-name font-weight-bolder font-size-base d-flex mr-3">
                              {userName}
                            </span>
                            {userIdDetails != "" ? (
                              <span className="ms-2 d-flex mt-1">
                                {/* {SVGICON.Logout}{" "} */}
                                <h6 className="logout-name">
                                  {/* {userIdDetails?.role[0]}{" "} */}
                                  {currentUserRole}
                                </h6>
                              </span>
                            ) : null}
                          </div>
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
          <Notification notificationResponse={notificationResponse} />
        ) : null}
      </Drawer>
    </div>
  );
};

export default Header;
