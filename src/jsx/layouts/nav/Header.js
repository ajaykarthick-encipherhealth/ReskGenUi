import React, { useState, useEffect, useRef, use } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import "react-chat-widget/lib/styles.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Badge, Dropdown, Tooltip, Drawer, Modal, Button, Select } from "antd";
import {
  DownOutlined,
  SettingOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import CodeRoot from "../../../images/menu/coderootv4.png";
import styles from "../../../styles/file-managemnt.module.css";
import {
  AdminMenuList,
  PhysicanMenuList,
  L2AuditorMenuList,
  ProviderMenuList,
  EHRMenuList,
  PhysicanMenu,
  Analyst,
  QAMenuList,
} from "./Menu";
import Notification from "../../../components/notification/index";
import ChatCommunication from "../../../components/chatCommunication/index";
import ImageUploader from "../../../components/imageUploading/ImageUploader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faBell } from "@fortawesome/free-regular-svg-icons";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { logoutAllDevice } from "../../../stores/authflow/actions";
import { actions as dashbaordActions } from "../../../stores/reviewer/dashboard";
import { actions as userActions } from "../../../stores/supervisor/users";
import Codify from "../../../pages/codify";
import { actions as webSocketActions } from "../../../stores/websocket";
import { getStorage, removeStorage, setStorage } from "../../../utils/storages";
import { actions as allActions } from "../../../stores/supervisor/auditedQueue";
import { actions as detailsActions } from "../../../stores/patient/details";
import { actions as authActions } from "../../../stores/authFlows";
import { actions as reportActions } from "../../../stores/admin/report";
import { actions as uploadImagesAction } from "../../../stores/authflow/imageUpload";
import { actions as tenantAction } from "../../../stores/tenantAdmin/patientSync";
import Profile from "./profile";
import { getResponePopup } from "../../../utils/reusable";
import { getHeaderLoge } from "../../../pages/twofactorauthentication/reusableFun";
import { actions as tinActions } from "../../../stores/tenantAdmin/tin";
import { actions as tableAction } from "../../../stores/tableView";
import CardSkeleton from "../../../components/skeleton/card";

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
  preSendURl,
  getUrl,
  updateImage,
  getRoutedData,
  getAllProjects,
  getAllClientDetails,
  clientDetails,
  projectDetails,
  getAllRoles,
  allRolesData,
  pageLoad,
  getPageRendering,
  getAllTin,
  tinDetails,
  getTableData,
}) => {
  const router = useRouter();
  const fileInputRef = useRef(null);
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
  const [nextMenuList, setNextMenuList] = useState(false);
  const [user, setUser] = useState(null);
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: null,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [backupSelectedClient, setBackupSelectedClient] = useState(null);
  const [backupSelectedProject, setBackupSelectedProject] = useState(null);
  const [backupSelectedTin, setBackupSelectedTin] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTin, setSelectedTin] = useState(null);
  const [roles, setRoles] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [projectListCheck, setProjectListCheck] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  const proxyRole = getStorage("proxyRole");
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
      text: "Do you want to Logout!",
      icon: "warning",
      confirmButtonText: "Logout",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      closeOnConfirm: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const userRole = getStorage("userRole");
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
    const userRole = getStorage("userRole");

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

  const items = allRolesData?.userRoles?.map((data) => ({
    label: data.proxyRole,
    key: data.proxyRole,
  }));

  // const onClick = ({ key }) => {
  //   setProjectListCheck(true);
  //   const allRoles = JSON.parse(getStorage("userAllRoles"));
  //   let selectedRoleObj = allRoles?.find((res) => res.proxyRole === key);
  //   if (!selectedRoleObj) {
  //     selectedRoleObj = allRoles?.find(
  //       (res) => res?.details?.proxyRole === key
  //     );
  //   }
  //   const accessMenuList = selectedRoleObj
  //     ? selectedRoleObj
  //     : selectedRoleObj?.details;
  //   setStorage("userRole", key);
  //   setStorage(
  //     "proxyRole",
  //     accessMenuList?.proxyRole
  //       ? accessMenuList?.proxyRole
  //       : accessMenuList?.details.proxyRole
  //   );
  //   setStorage(
  //     "roleId",
  //     accessMenuList?.roleId
  //       ? accessMenuList?.roleId
  //       : accessMenuList?.details.roleId
  //   );
  //   setStorage(
  //     "aliasName",
  //     accessMenuList?.aliasName
  //       ? accessMenuList?.aliasName
  //       : accessMenuList?.details.aliasName
  //   );

  //   setStorage(
  //     "accessMenuList",
  //     JSON.stringify(
  //       accessMenuList?.accessList
  //         ? accessMenuList.accessList
  //         : accessMenuList?.details?.accessList
  //     )
  //   );

  //   if (key === "Admin") {
  //     router.push("/admin/dashboard");
  //   } else if (key === "CODER_1" || key === "CODER_2" || key === "QA") {
  //     if (router?.pathname != "/reviewer/dashboard") {
  //       router.push("/reviewer/dashboard");
  //     } else {
  //       router.push("/reviewer/dashboard").then(() => {
  //         window.location.reload();
  //       });
  //     }
  //   } else if (key === "Supervisor") {
  //     router.push("/supervisor/dashboard");
  //   } else if (
  //     key === "TENANT_ADMIN" ||
  //     key === "DOWNLOADER" ||
  //     key === "OWNER"
  //   ) {
  //     if (router?.pathname != "/tenantadmin/dashboard") {
  //       router.push("/tenantadmin/dashboard");
  //     } else {
  //       router.push("/tenantadmin/dashboard").then(() => {
  //         window.location.reload();
  //       });
  //     }
  //   } else if (key === "Ehr") {
  //     router.push("/ehr/patients");
  //   }
  // };
  const onClick = ({ key }) => {
    setProjectListCheck(true);
    const allRoles = JSON.parse(getStorage("userAllRoles"));
    let selectedRoleObj = allRoles?.find((res) => res.proxyRole === key);
    if (!selectedRoleObj) {
      selectedRoleObj = allRoles?.find(
        (res) => res?.details?.proxyRole === key
      );
    }

    const accessMenuList =
      selectedRoleObj?.accessList || selectedRoleObj?.details?.accessList || [];

    setStorage("userRole", key);
    setStorage(
      "proxyRole",
      selectedRoleObj?.proxyRole || selectedRoleObj?.details?.proxyRole
    );
    setStorage(
      "roleId",
      selectedRoleObj?.roleId || selectedRoleObj?.details?.roleId
    );
    setStorage(
      "aliasName",
      selectedRoleObj?.aliasName || selectedRoleObj?.details?.aliasName
    );
    setStorage("accessMenuList", JSON.stringify(accessMenuList));

    const firstAccess = accessMenuList[0];
    const dynamicPath =
      firstAccess?.title?.toLowerCase().replace(/\s+/g, "") || "dashboard";
    // const dynamicRoute = `/tenantadmin/${dynamicPath}`;
    let dynamicRoute = "";
    if (
      selectedRoleObj?.details?.role === "REVIEWER" ||
      selectedRoleObj?.details?.role === "QA"
    ) {
      dynamicRoute = `/reviewer/${dynamicPath}`;
    } else {
      dynamicRoute = `/tenantadmin/${dynamicPath}`;
    }
    if (router.pathname !== dynamicRoute) {
      router.push(dynamicRoute);
    } else {
      router.push(dynamicRoute).then(() => {
        window.location.reload();
      });
    }
  };

  const getMenuListByRole = (role) => {
    const allRoles = JSON?.parse(getStorage("userAllRoles"));
    let selectedRoleObj = allRoles?.find((res) => res.proxyRole === role);
    if (!selectedRoleObj) {
      selectedRoleObj = allRoles?.find(
        (res) => res?.details?.proxyRole === role
      );
    }
    const accessMenuList = selectedRoleObj?.accessList
      ? selectedRoleObj?.accessList
      : selectedRoleObj?.details?.accessList;

    switch (role) {
      case "admin":
        return AdminMenuList;
      case "CODER_1":
        return PhysicanMenuList(accessMenuList);
      case "CODER_2":
        return PhysicanMenuList(accessMenuList);
      case "QA":
        return PhysicanMenuList(accessMenuList);
      case "DOWNLOADER":
        return ProviderMenuList(accessMenuList);
      case "OWNER":
        return ProviderMenuList(accessMenuList);
      case "supervisor":
        return L2AuditorMenuList;
      case "TENANT_ADMIN":
        return ProviderMenuList(accessMenuList);
      case "ehr":
        return EHRMenuList;
      case "record analyst":
        return Analyst;
      case "physician":
        // return PhysicianMenuList;
        return PhysicanMenu;
      case "qa":
        return QAMenuList;
      default:
        return [];
    }
  };

  const gotoChat = () => {
    setOpenMsg(true);
    setPopoverVisible(false);
  };
  const handleSettingsClick = () => {
    router.push("/tenantadmin/settings");
  };
  useEffect(() => {
    getTableData({ reloadTrue: true });
  }, []);

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
    const newWidth = drawerWidth - 100;
    const limitedWidth = Math.max(newWidth, 500);
    setDrawerWidth(limitedWidth);
  };

  const titleWithIcons = (
    <div className="d-flex align-items-center justify-content-between">
      <div className={styles.heading}>Code Root</div>
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
            color: drawerWidth <= 500 ? "gray" : "#241571",
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
    if (countUnread > 0 && !open) {
      notificationSoundRef.current.play().catch((error) => {
        console.error("Error playing notification sound:", error);
      });
    }
  }, [webSocketNotificationData, notificationResponse, open]);
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
    const userRole = getStorage("aliasName");
    const tenentId = getStorage("tenantId");
    // getCurrentUserInfo({ userId });
    setUserRole(userRoleLocal);
    setCurrentRole(userRole);
    setTenentId(tenentId);
    setMenuList(getMenuListByRole(userRoleLocal));
    setUser(userId);

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
          id={data.title}
          name={data.title}
          className={`header-transition ${
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
            getRoutedData(null);
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
          <div
            id={data.title}
            name={data.title}
            className="d-flex cursor-pointer"
          >
            <div
              className="menu-icon"
              style={{ paddingRight: "5px", color: "#04306f" }}
            >
              {stateActive === data.to ? data.activeIcon : data.iconStyle}
            </div>
            <span
              id={data.title}
              name={data.title}
              className={`nav-text header-nav-text text-truncate`}
            >
              {data.title}
            </span>
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
          item?.childRoute3 === window.location?.pathname ||
          item?.childRoute4 === window.location?.pathname
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
  const handleChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      const type = selectedFile?.name?.split(".").pop();
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = 600;
          canvas.height = 600;
          ctx.drawImage(img, 0, 0, 600, 600);
          canvas.toBlob(async (blob) => {
            const croppedFile = new File([blob], `cropped.${type}`, {
              type: selectedFile.type,
            });
            await preSendCall(type, croppedFile);
          }, selectedFile.type);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const preSendCall = async (type, croppedFile) => {
    try {
      setLoading(true);
      const res = await preSendURl({ type, croppedFile });
      if (res?.response) {
        getBlobImageUrl(res?.response, type, croppedFile);
        setSelectedFile(null);
      }
    } catch (error) {
      setOpenUploader(false);
      setLoading(false);
      setSelectedFile(null);
      throw error;
    }
  };

  const getBlobImageUrl = async (data, type, file) => {
    const userId = getStorage("userId");
    try {
      const res = await getUrl({ url: data, urlType: type, file });
      if (res.status === 201) {
        const userUpdateResponse = await updateImage({ url: data });
        if (userUpdateResponse?.response) {
          setUser((prevUser) => ({
            ...prevUser,
            profileImageUrl: data,
          }));

          setOpenUploader(false);
          setLoading(false);
          getResponePopup({
            status: "SUCCESS",
            message: "Profile Upload Successfully!",
          });
          await getCurrentUserInfo({ userId });
          setOpenContent(false);
        }
      }
    } catch (error) {
      setOpenUploader(false);
      setLoading(false);
      throw error;
    }
  };

  const handleDeleteImg = async () => {
    try {
      const userId = getStorage("userId");
      const res = await deleteProfile();
      if (res?.status === "SUCCESS") {
        getResponePopup({
          status: "SUCCESS",
          message: "Profile Deleted Successfully!",
        });
        // getCurrentUserInfo({ userId });
      } else {
        getResponePopup(res);
      }
    } catch (error) {
      console.error("error deleting profile", error);
    }
  };

  const TinOptions = tinDetails?.map((client) => ({
    label: client.tinName,
    value: client.tinNumber,
  }));

  const clientOptions = clientDetails?.map((client) => ({
    label: client.clientName,
    value: client.clientId,
  }));

  const handleClientChange = async (value) => {
    setStorage("client", value.value);
    setSelectedClient(value);
    const res = await getAllProjects();
    if (res?.response?.length === 0) {
      setSelectedClient(backupSelectedClient);
      setStorage("client", backupSelectedClient);
      return getResponePopup({
        status: "EXCEPTION",
        message: "No projects",
        duration: 5,
      });
    } else {
      getProjectDataList();
      setSelectedProject(res?.response[0]?.projectName);
      setStorage("project", res?.response[0]?.id);
    }
  };

  const handleTinChange = (value) => {
    setSelectedTin(value);
    setStorage("tinNumber", value?.value);
    getPageRendering(value);
  };

  const handleProjectChange = async (value) => {
    setSelectedProject(value);
    setStorage("project", value.value);

    const res = await getAllRoles();
    if (res?.response?.userRoles?.length === 0) {
      setSelectedProject(backupSelectedProject);
      setStorage("project", backupSelectedProject);
      return getResponePopup({
        status: "EXCEPTION",
        message: "No Role for this project",
        duration: 8,
      });
    } else {
      // getProjectDataList();
      getPageRendering(value);
      getRoles();
    }
  };

  const getRoles = async () => {
    const res = await getAllRoles();
    if (res.status == "SUCCESS") {
      const data = res?.response?.userRoles?.map((data) => ({
        label: data.proxyRole,
        key: data.proxyRole,
        details: data,
      }));
      if (data?.length > 0) {
        setRoles(data);
        setStorage(
          "accessMenuList",
          JSON?.stringify(data[0].details.accessList)
        );
        setStorage("userAllRoles", JSON?.stringify(data));
        setStorage("roleId", data[0].details?.roleId);
        setStorage("proxyRole", data[0].label);
        // setCurrentRole(data[0].label);
        setMenuList(getMenuListByRole(data[0].label));
        getMenuListByRole(data[0].label);
        onClick({ key: data[0].label });
      }
    }
  };

  const getRole = async () => {
    const res = await getAllRoles();
    if (res?.status === "SUCCESS") {
      const userName = res?.response?.userName;
      setStorage("userName", userName);
      setUserEmail(userName);
      const data = res?.response?.userRoles?.map((data) => ({
        label: data.aliasName,
        key: data.proxyRole,
        details: data,
      }));
      setRoles(data);
      //  setCurrentRole(data[0]?.label);
    }
  };

  useEffect(() => {
    if (allRolesData) {
      const data = allRolesData?.userRoles?.map((data) => ({
        label: data.aliasName,
        key: data.proxyRole,
        details: data,
      }));
      setRoles(data);
      setStorage("userAllRoles", JSON?.stringify(data));
    }
  }, [allRolesData]);

  const getProjectDataList = async () => {
    const res = await getAllProjects();
    if (res.status == "SUCCESS") {
      const projectOptions = res.response?.map((client) => ({
        label: client.projectName,
        value: client.id,
      }));
      setProjectList(projectOptions);
      const res1 = await getAllRoles();
      if (res1?.response?.userRoles?.length === 0) {
        setSelectedClient(backupSelectedProject);
        setStorage("project", backupSelectedProject);
        return getResponePopup({
          status: "EXCEPTION",
          message: "No Roles",
        });
      } else {
        getRoles();
      }
    }
  };

  const getProjectDataLists = async () => {
    const res = await getAllProjects();
    if (res?.status == "SUCCESS") {
      const projectOptions = res.response?.map((client) => ({
        label: client.projectName,
        value: client.id,
      }));
      setProjectList(projectOptions);
      setProjectListCheck(false);
    }
  };

  useEffect(() => {
    getProjectDataLists();
  }, [pageLoad]);

  useEffect(() => {
    getAllClientDetails();
  }, [pageLoad]);

  useEffect(() => {
    getAllTin();
  }, [pageLoad]);
  useEffect(() => {
    getRole();
  }, []);
  // useEffect(() => {
  //   const userRole = getStorage("proxyRole");
  //   if (
  //     tinDetails?.length > 0 &&
  //     (!selectedTin || selectedTin === "") &&
  //     userRole === "QA"
  //   ) {
  //     const defaultTinNumber = tinDetails[0].tinNumber;
  //     setSelectedTin(defaultTinNumber);
  //     setStorage("tinNumber", defaultTinNumber);
  //     getPageRendering(defaultTinNumber);
  //   }
  // }, [tinDetails, selectedTin]);

  // useEffect(() => {
  //   if (projectListCheck) {
  //     // setTimeout(() => {
  //     const defaultClient = getStorage("client");
  //     const defaultProject = getStorage("project");

  //     if (defaultClient) setSelectedClient(defaultClient);
  //     setBackupSelectedClient(defaultClient);
  //     if (defaultProject) setSelectedProject(defaultProject);
  //     setBackupSelectedProject(defaultProject);

  //   }
  //   // }, 2000);
  // }, [projectListCheck]);

  useEffect(() => {
    if (projectListCheck) {
      const defaultClient = getStorage("client");
      const defaultProject = getStorage("project");
      const defaultTinNumber = getStorage("tinNumber");
      const userRole = getStorage("proxyRole");
      if (
        tinDetails?.length > 0 &&
        (!selectedTin || selectedTin === "") &&
        userRole === "QA"
      ) {
        const defaultTinNumberIndex = tinDetails[0].tinNumber;
        if (defaultTinNumber || defaultTinNumberIndex) {
          setSelectedTin(defaultTinNumber || defaultTinNumberIndex);
          setBackupSelectedTin(defaultTinNumber);
        }
      }

      if (defaultClient) setSelectedClient(defaultClient);
      setBackupSelectedClient(defaultClient);

      if (defaultProject) setSelectedProject(defaultProject);
      setBackupSelectedProject(defaultProject);
    }
  }, [projectListCheck, tinDetails, selectedTin]);

  useEffect(() => {
    if (projectDetails) {
      const projectOptions = projectDetails?.map((client) => ({
        label: client.projectName,
        value: client.id,
      }));
      setProjectList(projectOptions);
    }
  }, [projectDetails]);
  return (
    <div className={`header ${headerFix ? "is-fixed" : ""}`}>
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">
            <div className="d-flex">
              {getHeaderLoge()}
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
              <div className="d-flex gap-3">
                {/* {projectListCheck  ?
                <div className="mt-3 d-flex">
                  <CardSkeleton  height={30}/>
                  <div className="mx-2">
                  <CardSkeleton  height={30}/>
                  </div>
                </div>: */}
                <>
                  <div className="mt-3">
                    <Select
                      placeholder="Client"
                      style={{ width: 150 }}
                      value={clientOptions && selectedClient}
                      onChange={(e, value) => handleClientChange(value)}
                      options={clientOptions}
                    />
                  </div>
                  <div className="mt-3">
                    <Select
                      placeholder="Sample Project"
                      style={{ width: 150 }}
                      value={!projectListCheck ? selectedProject : []}
                      onChange={(e, value) => handleProjectChange(value)}
                      options={projectList}
                    />
                  </div>
                  {proxyRole === "QA" ? (
                    <div className="mt-3">
                      <Select
                        placeholder="Select Tin"
                        style={{ width: 150 }}
                        value={selectedTin}
                        onChange={(e, value) => handleTinChange(value)}
                        options={TinOptions}
                      />
                    </div>
                  ) : null}
                </>
                {/* } */}
              </div>
            </div>
            {/* {projectListCheck  ?
                <div className="w-100 mt-1 me-2">
                  <CardSkeleton  height={30}/>
                  </div>
             : */}
            <>
              {stateActive != "/reviewer/home" ? (
                <div header-transition>
                  <ul
                    className={`metismenu header-menu d-flex`}
                    id="menuList"
                    name="menuList"
                  >
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
                  <li className="nav-item">
                    <div className="header-profile2">
                      <div className="nav-link i-false " as="div">
                        <div className="header-info2 d-flex align-items-center">
                          <div
                            id="coderoot"
                            name="coderoot"
                            className={styles.codify}
                          >
                            {/* <div>{SVGICON.codify}</div> */}
                            <Tooltip placement="bottom" title={"CodeRoot"}>
                              <img
                                id="codify"
                                name="codify"
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
                          {userRole === "CODER_1" ||
                            (userRole === "CODER_2" && (
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
                            ))}
                          {userRole === "TENANT_ADMIN" && (
                            <div
                              id="settingsIcon"
                              name="settingsIcon"
                              className="chatheaderIcon cr-pointer"
                              onClick={handleSettingsClick}
                            >
                              <SettingOutlined
                                data-testid="settings-icon"
                                name="settings-icon"
                                style={{
                                  width:
                                    stateActive === "/tenantadmin/settings"
                                      ? "30px"
                                      : "23px",
                                  height:
                                    stateActive === "/tenantadmin/settings"
                                      ? "30px"
                                      : "26px",
                                  marginTop: "8px",
                                  fontWeight: "700",
                                  marginRight: "10px",
                                  fontSize: "30px",
                                  cursor: "pointer",
                                  color:
                                    stateActive === "/tenantadmin/settings"
                                      ? "#fff"
                                      : "#04306F",
                                  backgroundColor:
                                    stateActive === "/tenantadmin/settings"
                                      ? "#04306F"
                                      : "",
                                  padding:
                                    stateActive === "/tenantadmin/settings"
                                      ? "6px"
                                      : "",
                                  borderRadius:
                                    stateActive === "/tenantadmin/settings"
                                      ? "9px"
                                      : "",
                                }}
                              />
                            </div>
                          )}
                          {tenentId !=
                            "7f41538e-2329-4ecc-890f-03c93cccb934" && (
                            <div
                              className="chatheaderIcon cursor-pointer"
                              id="chatIcon"
                              name="chatIcon"
                              onClick={() => gotoChat()}
                            >
                              {/* <div style={{ color: "#04306F" }}> */}
                              <div
                                id="chat-icon"
                                name="chat-icon"
                                style={{ color: "#04306F" }}
                              >
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
                                {/* </div> */}
                              </div>
                            </div>
                          )}
                          <div
                            className={`notificationIcon ${
                              notificationCount < 9 ? "me-3" : "me-4"
                            }`}
                            onClick={() => notificationDrawer()}
                            id="notificationIcon"
                            name="notificationIcon"
                          >
                            <Badge
                              id="notification-badge"
                              name="notification-badge"
                              count={notificationCount}
                              color="#04306F"
                            >
                              <div
                                id="notification-icon"
                                name="notification-icon"
                                style={{ color: "#04306F" }}
                              >
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
                            userEmail={userEmail}
                          />
                          <div className="mx-15">
                            <div
                              className="text-dark-50 ms-2 header-name d-flex mr-3"
                              style={{ fontWeight: "600", fontSize: "18px" }}
                            >
                              {userEmail?.split("@")[0]}
                            </div>

                            {roles?.length > 0 && userIdDetails != "" ? (
                              <span className="ms-2 d-flex mt-1 d-flex">
                                <Dropdown
                                  menu={{
                                    items: roles,
                                    defaultSelectedKeys: userRole,
                                    onClick,
                                  }}
                                  trigger={["click"]}
                                >
                                  <span
                                    className="header-name d-flex font1"
                                    style={{ margin: "-5px 0px 0 10px" }}
                                  >
                                    {currentRole?.split("_")?.join(" ")}

                                    <DownOutlined
                                      style={{ margin: "0 0 0 5px" }}
                                    />
                                  </span>
                                </Dropdown>
                              </span>
                            ) : (
                              <span
                                className="text-[#4F4F4F] ms-2 text-truncate subHeader-name d-flex mr-3"
                                style={{ fontWeight: "500", fontSize: "6px" }}
                              >
                                {currentRole?.split("_")?.join(" ")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </>
            {/* } */}
          </div>
        </nav>
      </div>

      <Drawer
        title="Notification"
        placement="right"
        closable={true}
        onClose={onClose}
        open={open}
        width={600}
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
        // footer={
        //   profileImg
        //     ? [
        //         <div className="customDelete">
        //           <Button
        //             onClick={() => {
        //               deleteProfile();
        //               setOpenUploader(false);
        //             }}
        //           >
        //             Delete
        //           </Button>
        //         </div>,
        //       ]
        //     : []
        // }
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            Ok
          </Button>,
          profileImg && (
            <span className="customDelete p-2">
              <Button
                key="delete"
                onClick={() => {
                  handleDeleteImg();

                  setOpenUploader(false);
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                disabled={loading}
              >
                Delete
              </Button>
            </span>
          ),
          <Button
            key="cancel"
            onClick={() => {
              setOpenContent(false);
              setOpenUploader(false);
              setSelectedFile(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
          >
            Cancel
          </Button>,
        ]}
        onCancel={() => {
          setOpenContent(false);
          setOpenUploader(false);
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
      >
        <div>
          <ImageUploader
            setOpenUploader={setOpenUploader}
            setOpenContent={setOpenContent}
            handleChange={handleChange}
            setLoading={setLoading}
            loading={loading}
            selectedFile={selectedFile}
            fileInputRef={fileInputRef}
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
    deleteImage: state?.authReducer?.deleteProfileImg?.data,
    projectDetails: state.authReducer?.getProjectDetails?.data?.response,
    clientDetails: state.authReducer?.getClientDetails?.data?.response,
    allRolesData: state.authReducer?.getAllRoles?.data?.response,
    pageLoad: state?.tenantAdmin?.tin?.getPageRendering,
    tinDetails: state.authReducer?.getTinDropdown?.data?.response,
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
    deleteProfile: authActions.deleteProfileImg,
    preSendURl: uploadImagesAction.getuploadurl,
    getUrl: uploadImagesAction.getURL,
    updateImage: uploadImagesAction.updateImage,
    getCurrentUser: userActions.getCurrentUserInfo,
    getRoutedData: tenantAction.getRoutedData,
    getAllProjects: authActions.projectDetails,
    getAllClientDetails: authActions.clientDetails,
    getAllRoles: authActions.allRoles,
    getPageRendering: tinActions.pageRendering,
    getAllTin: authActions.tinsDropdown,
    getTableData: tableAction.tableViewAction,
  }
);
export default enhancer(Header);
