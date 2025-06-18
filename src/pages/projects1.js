import React, { useEffect, useState } from "react";
import { Select, notification, Modal, Spin, Form } from "antd";
import { useRouter } from "next/router";
import LoginBack from "../images/logo/login-back.jpg";
import styles from "../styles/auth.module.css";
import RegularButton from "../components/button";
import { getStorage, removeStorage, setStorage } from "../utils/storages";
import { connect } from "react-redux";
import { actions as allActions } from "../stores/authFlows";
import { getLogoImage } from "./twofactorauthentication/reusableFun";
import { useMsal } from "@azure/msal-react";
import PageLoading from "../components/page-loading";
import { getResponePopup } from "../utils/reusable";
import { ssoLogout } from "../../lib/authService";
// import Client from "./client";
const SelectProject = ({
  getAllClientId,
  clientIdData,
  getAllClientDetails,
  clientDetails,
  projectDetails,
  getAllProjects,
  getAllRoles,
  getProxyRoles,
  proxyRoles,
  allRolesData,
}) => {
  const router = useRouter();
  const [selectClient, setSelectClient] = useState(null);
  const [selectProject, setSelectProject] = useState(null);
  const [selectRole, setSelectRole] = useState(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [clientError, setClientError] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const { accounts } = useMsal();
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const [selectValue, setSelectValue] = useState([]);
  const [selectClientValue, setSelectClientValue] = useState([]);
  const [selectRoleValue, setSelectRoleValue] = useState([]);
  const [isClientSelected, setIsClientSelected] = useState(false);
  const clientOptions = clientDetails?.map((client) => ({
    label: client.clientName,
    value: client.clientId,
  }));
  const projectOptions = projectDetails?.map((client) => ({
    label: client.projectName,
    value: client.id,
  }));
  const roleOptions = allRolesData?.userRoles?.map((client) => ({
    label: client.aliasName.replaceAll("_", " "),
    value: client.proxyRole,
  }));
 
  const onSubmitClient = async (e) => {
    // e.preventDefault();
    if (!selectClient) {
      setClientError(true);
      return;
    }
    setClientError(false);
    setStorage("client", selectClient);
    setLoading(true);
    // router.push("/client");
  };
  const onSubmitProject = async (e) => {
    // e.preventDefault();
    if (!selectProject) {
      setClientError(true);
      return;
    }
    setStorage("project", selectProject);
    setLoading(true);
    // router.push("/twofactorauthentication/selectrole");
  };
  const loginSuccessCallBack = () => {
      notification.success({
        message: "Login Successfully",
        duration: 1,
      });
      // setRoleError(false);
  
      const selectedRoleObj = allRolesData?.userRoles?.find(
        (role) => role.proxyRole === selectRole
      );
  
      const accessList = selectedRoleObj?.accessList || [];
  
      const firstAccess = accessList[0];
      let dynamicRoute = "";
      if (firstAccess?.title) {
        const title = firstAccess.title.toLowerCase().replace(/\s+/g, "");
        if (
          selectedRoleObj?.role === "REVIEWER" ||
          selectedRoleObj?.role === "QA"
        ) {
          dynamicRoute = `/reviewer/${title}`;
        } else {
          dynamicRoute = `/tenantadmin/${title}`;
        }
      }
      setStorage("userRole", selectedRoleObj?.proxyRole);
      setLoading(true);
      router?.push(dynamicRoute);
    };
  
  const onSubmitRole = async (e) => {
    // e.preventDefault();

    if (!selectRole) {
      setRoleError(true);
      return;
    }
    const selectedRoleObj = allRolesData?.userRoles?.find(
      (role) => role.proxyRole === selectRole
    );
    if (selectedRoleObj) {
      setStorage("proxyRole", selectedRoleObj?.proxyRole);
      setStorage("userAllRoles", JSON.stringify(allRolesData?.userRoles));
      setStorage("accessMenuList", JSON.stringify(selectedRoleObj?.accessList));
      setStorage("roleId", selectedRoleObj?.roleId);
      setStorage("aliasName", selectedRoleObj?.aliasName);
      setStorage("headerAliasName", selectedRoleObj?.aliasName);
      loginSuccessCallBack();
    } else {
      console.error("Selected role not found in userRoles array");
    }
  };

  const handleLogout = () => {
    setConfirmModal(false);
    loginSuccessCallBack();
  };

  useEffect(() => {
    if (clientIdData?.userName) {
      setStorage("userId", clientIdData.userName);
    }
  }, [clientIdData?.userName]);

  const clientGetApi = async () => {
    setLoadingClients(true);
    try {
      const response = await getAllClientDetails();
      if (response?.status !== "SUCCESS") {
        getResponePopup(response);
      }
    } catch (error) {
      getResponePopup(error);
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    if (!selectClient) {
      setClientError(true);
      return;
    }
    setClientError(false);
    setLoading(true);
    projectGetApi();
  }, [selectClient]);

  useEffect(() => {
    if (clientIdData) {
      setStorage("orgId", clientIdData?.orgId);
      clientGetApi();
    }
  }, [clientIdData]);

  const clientIdApi = async () => {
    try {
      const response = await getAllClientId();
      if (response?.status == "USER_DEFINED_ERROR") {
        ssoLogout();
      }
    } catch (error) {
      getResponePopup(error);
    }
  };

  const projectGetApi = async () => {
    setLoadingProject(true);
    try {
      const response = await getAllProjects();
      if (response?.status !== "SUCCESS") {
        getResponePopup(response);
      }
    } catch (error) {
      getResponePopup(error);
    } finally {
      setLoadingProject(false);
    }
  };

  const getRolesApi = async () => {
    setLoading(true);
    try {
      const response = await getAllRoles();
      if (response?.status !== "SUCCESS") {
        getResponePopup(response);
      }
    } catch (error) {
      getResponePopup(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectProject) {
      setClientError(true);
      return;
    }
    setClientError(false)
    setLoading(true);
    getRolesApi();
  }, [selectClientValue]);

  useEffect(() => {
    clientIdApi();
    setSelectValue(getStorage("client") && getStorage("client"));
    setSelectClient(getStorage("client") && getStorage("client"));
  }, []);

  useEffect(() => {
    setSelectProject(getStorage("project") && getStorage("project"));
    setSelectClientValue(getStorage("project") && getStorage("project"));
  }, []);

  useEffect(() => {
    if (accounts && accounts.length > 0) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      const timeout = setTimeout(() => {
        if (!accounts || accounts.length === 0) {
          router.push("/");
        }
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [accounts, router]);

  if (isLoading) {
    return <div>{/* <PageLoading /> */}</div>;
  }

  return (
    <div className="page-wraper">
      <div className="login-account">
        <div className={`row h-100 ${styles.loginContainer}`}>
          <div className="col-lg-6 align-self-start">
            <div
              className="account-info-area"
              style={{ backgroundImage: "url(" + LoginBack + ")" }}
            >
              <div className="login-content">
                <p className="sub-title"></p>
                {getLogoImage()}
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-7 col-sm-12 mx-auto align-self-center">
            <div className="login-form">
              <div className=" d-flex align-items-center justify-content-center">
                <h2 className="title fontWeight2 ">Login to Your Account</h2>
              </div>
              <h6 className="login-title">
                <span>Login</span>
              </h6>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={""}
        open={confirmModal}
        centered
        onOk={handleLogout}
        onCancel={() => setConfirmModal(false)}
      ></Modal>
    </div>
  );
};

const connector = connect(
  (state) => ({
    clientIdData: state.authReducer?.getClientId?.data?.response,
    clientDetails: state.authReducer?.getClientDetails?.data?.response,
    projectDetails: state.authReducer?.getProjectDetails?.data?.response,
    loginData: state.authReducer?.loginData?.data?.response,
    proxyRoles: state.authReducer?.getAllProxyRoles?.data?.response,
    allRolesData: state.authReducer?.getAllRoles?.data?.response,
  }),
  {
    getAllClientId: allActions.clientId,
    getAllClientDetails: allActions.clientDetails,
    getAllProjects: allActions.projectDetails,
    getLogin: allActions.getLogin,
    getProxyRoles: allActions.proxyRoles,
    getAllRoles: allActions.allRoles,
  }
);
export default connector(SelectProject);
