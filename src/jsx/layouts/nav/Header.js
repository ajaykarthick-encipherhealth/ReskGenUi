import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import { DownOutlined } from "@ant-design/icons";
import "react-chat-widget/lib/styles.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Button } from "react-bootstrap";
import { Badge, Dropdown, Select, Tooltip, Drawer, Popover } from "antd";
import styles from "../../../styles/file-managemnt.module.css";
import { IMAGES, SVGICON } from "../../constant/theme";
import {
  AdminMenuList,
  MenuList,
  PhysicanMenuList,
  L2AuditMenuList,
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
import { getCoderDetails } from "../../../store/actions/AuthActions";
import Selector from "../../../components/selector";

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
    value: "ALL",
    label: "ALL",
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
const data = [
  { label: "Admin", key: "admin" },
  { label: "L1auditor", key: "l1auditor" },
];
const codeDta = {
  status: "SUCCESS",
  message: "Success!!",
  response: [
    {
      id: "6546413c4f4d3691438862f4",
      diagnosisCode: "I10",
      description: "Essential (primary) hypertension",
      cmsHcc_model_category_V22: 0,
      cmsHcc_model_category_V24: 0,
      rxHcc_model_category_V05: 187,
      rxHcc_model_category_V08: 0,
      cmsHcc_model_category_V22_for_2023_payment_year: "No",
      cmsHcc_model_category_V24_for_2023_payment_year: "No",
      rxHcc_model_category_V05_for_2023_payment_year: "Yes",
      rxHcc_model_category_V08_for_2023_payment_year: "Yes",
    },
  ],
};

const Header = () => {
  const dispatchValue = useDispatch();
  const router = useRouter();
  const notificationAlertData = useSelector(
    (state) => state?.notificationDatas?.notificationAlert
  );
  const notificationResponse = useSelector(
    (state) => state?.notificationDatas?.notificationList
  );
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
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedbtn, setSelectedBtn] = useState("ICD-10");
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
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
        window.location = "/userlogin";
      }
    });
  };

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
  const percentage = 95;

  const getStatus = (data) => {
    if (data?.cmsHcc_model_category_V22_for_2023_payment_year === "Yes") {
      return "CMS";
    } else if (data?.rxHcc_model_category_V05_for_2023_payment_year === "Yes") {
      return "RX";
    } else return "";
  };
  const PopContent = (
    <div className={styles.innerPop}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
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
        <div style={{ width: "30%", marginTop: "-25px" }}>
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
      <div
        style={{
          width: "80%",
          margin: "10px 50px",
        }}
      >
        <Search
          searchlabel={""}
          setSearch={setSearch}
          style={{ border: "1px solid red" }}
        />
      </div>
      <div className={styles.displayDiv}>
        {codDetails?.response
          ? codDetails?.response?.map((data) => (
              <div className={styles.hoverDiv}>
                {data?.diagnosisCode}
                {data?.description} &nbsp;
                {selectedbtn === "HCC" && (
                  <span
                    className={
                      getStatus(data) === "CMS"
                        ? styles.cmsStatus
                        : getStatus(data) === "RX"
                        ? styles.rxStatus
                        : ""
                    }
                  >
                    {getStatus(data)}
                  </span>
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

  const dispatch = useDispatch();
  const msgReply = useSelector((state) => state.workFlow.chatReply);

  const handleNewUserMessage = (newMessage) => {
    dispatch(getChatReply(newMessage));
  };

  const handleQuickButtonClicked = (data) => {
    console.log(data);
  };

  const notificationDrawer = async () => {
    setOpen(true);
    dispatchValue(getNotificationAlertClear([]));
  };

  const items = data?.filter(
    (info) => info?.key?.toLowerCase() !== userRole?.toLowerCase()
  );

  const onClick = ({ key }) => {
    localStorage.setItem("userRole", key);
    if (key === "admin") {
      router.push("/admin/user");
    } else if (key === "l1auditor") {
      router.push("/physician/dashboard");
    }
  };
  useEffect(() => {
    var loginCheck = localStorage.getItem("loginCheck");
    var userName = localStorage.getItem("userName");
    const userRoleLocal = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    getUserIdDetails(userId);

    setUserRole(userRoleLocal);
    setUserName(userName);
    if (userRoleLocal === "admin") {
      setMenuList(AdminMenuList);
    } else if (userRoleLocal === "l1auditor") {
      setMenuList(PhysicanMenuList);
    } else {
      setMenuList([]);
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
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const { addResponseMessage } = require("react-chat-widget");
      addResponseMessage(msgReply ? msgReply : "Welcome to CogentAI!");
    }
    if (selectedbtn) {
      dispatch(
        getCoderDetails({
          name: selectedbtn?.toLowerCase(),
          search: search,
          selectedOption:selectedOption,
          router,
        })
      );
    }
  }, [msgReply, selectedbtn, search,selectedOption]);

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
                        {userRole !== "admin" && (
                          <Popover
                            content={PopContent}
                            placement="bottom"
                            trigger={"click"}
                          >
                            <Button className={styles.codeBtn}>
                              <CodeIcon /> Codes
                            </Button>
                          </Popover>
                        )}
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
                            {/* <Dropdown>
<Dropdown.Toggle
className="nav-link i-false"
as="div"
> */}
                            <div className="header-info2 d-flex align-items-center">
                              <div className="header-media">
                                <Image src={IMAGES.profileImage} />
                              </div>
                            </div>
                            {/* </Dropdown.Toggle> */}
                            {/* <Dropdown.Menu align="end">
<div className=" border-0 mb-0">
<span className="dropdown-item ai-icon ">
{SVGICON.Logout}{" "}
<span className="ms-2">Logout </span>
</span>
</div>
</Dropdown.Menu> */}
                            {/* </Dropdown> */}
                          </div>
                        </div>
                        <div className="mx-15">
                          <span className="text-dark-50 ms-2 header-name font-weight-bolder font-size-base d-flex mr-3">
                            {userName}
                          </span>

                          {userIdDetails != "" ? (
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
                          ) : null}
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
