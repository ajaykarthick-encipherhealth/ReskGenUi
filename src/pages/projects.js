import React, { useEffect, useState } from "react";
import { Select, notification, Modal, Spin, Form, Skeleton } from "antd";
import { useRouter } from "next/router";
import LoginBack from "../images/logo/login-back.jpg";
import styles from "../styles/auth.module.css";
import RegularButton from "../components/button";
import { removeStorage, setStorage } from "../utils/storages";
import { connect } from "react-redux";
import { actions as allActions } from "../stores/authFlows";
import { getLogoImage } from "./twofactorauthentication/reusableFun";
import { useMsal } from "@azure/msal-react";
import { createIdGens, getResponePopup } from "../utils/reusable";
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
  clientLoading,
  allRolesData,
  projectLoading,
  roleLoading,
  id,
}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [confirmModal, setConfirmModal] = useState(false);
  const { accounts } = useMsal();
  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);

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

  const loginSuccessCallBack = () => {
    notification.success({
      message: "Login Successfully",
      duration: 1,
    });

    const values = form.getFieldsValue();

    const selectedRoleObj = allRolesData?.userRoles?.find(
      (role) => role.proxyRole === values.role
    );

    const accessList = selectedRoleObj?.panelList?.accessListForPanel1 || [];
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
    router?.push(dynamicRoute);
  };

  const handleFormSubmit = async () => {
    setSubmitLoading(true);
    try {
      const values = await form.validateFields();
      const { client, project, role } = values;

      if (!client || !project || !role) {
        return;
      }

      const selectedRoleObj = allRolesData?.userRoles?.find(
        (role) => role.proxyRole === values.role
      );
      if (selectedRoleObj) {
        setStorage("proxyRole", selectedRoleObj?.proxyRole);
        setStorage("userAllRoles", JSON.stringify(allRolesData?.userRoles));
        setStorage(
          "accessMenuList",
          JSON.stringify(selectedRoleObj?.panelList?.accessListForPanel1)
        );
        setStorage("roleId", selectedRoleObj?.roleId);
        setStorage("aliasName", selectedRoleObj?.aliasName);
        setStorage("headerAliasName", selectedRoleObj?.aliasName);
        loginSuccessCallBack();
      }
    } catch (error) {
      console.error("Form validation failed:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleLogout = () => {
    setConfirmModal(false);
    loginSuccessCallBack();
  };

  const clientGetApi = async () => {
    try {
      const response = await getAllClientDetails();
      if (response?.status !== "SUCCESS") {
        getResponePopup(response);
      }
    } catch (error) {
      getResponePopup(error);
    }
  };

  const projectGetApi = async () => {
    try {
      const response = await getAllProjects();
      if (response?.status !== "SUCCESS") {
        getResponePopup(response);
      }
    } catch (error) {
      getResponePopup(error);
    }
  };

  const getRolesApi = async () => {
    try {
      const response = await getAllRoles();
      if (response?.status !== "SUCCESS") {
        getResponePopup(response);
      }
    } catch (error) {
      getResponePopup(error);
    }
  };

  const clientIdApi = async () => {
    try {
      const response = await getAllClientId();
      if (response?.status === "USER_DEFINED_ERROR") {
        ssoLogout();
      }
    } catch (error) {
      getResponePopup(error);
    }
  };

  // Initial load
  useEffect(() => {
    clientIdApi();
  }, []);

  // Load client details when clientIdData is available
  useEffect(() => {
    if (clientIdData) {
      setStorage("orgId", clientIdData?.orgId);
      clientGetApi();
    }
  }, [clientIdData]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (accounts && accounts.length > 0) {
        setIsLoading(false);
      } else {
        const timeout = setTimeout(() => {
          if (!accounts || accounts.length === 0) {
            router.push("/");
          }
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [accounts, router]);

  const onValuesChange = (value, name) => {
    if (name === "client") {
      setStorage("client", value);
      form.setFieldsValue({
        client: value,
        project: null,
        role: null,
      });
      removeStorage("project");
      removeStorage("proxyRole");
      projectGetApi();
    } else {
      setStorage("project", value);
      form.setFieldsValue({ project: value, role: null });
      removeStorage("proxyRole");
      getRolesApi();
    }
  };

  useEffect(() => {
    const values = form.getFieldsValue();
    const isAllFieldsFilled = values.role;
    setIsFormValid(isAllFieldsFilled);
  }, [form.getFieldsValue()]);

  useEffect(() => {
    setStorage("userId", allRolesData?.userName);
  });

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
              {isLoading ? (
                <div>
                  <Skeleton.Input
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: 550, height: 500 }}
                    active
                    block={true}
                  />
                </div>
              ) : (
                <div>
                  <div className=" d-flex align-items-center justify-content-center">
                    <h2 className="title fontWeight2 p-2">
                      Your Gateway to CogentAI
                    </h2>
                  </div>
                  {/* <h6 className="login-title">
                    <span>Login</span>
                  </h6> */}
                  <Form
                    form={form}
                    onFinish={handleFormSubmit}
                    layout="vertical"
                    onValuesChange={(allValues) => {
                      const isAllFieldsFilled = allValues.role;
                      setIsFormValid(isAllFieldsFilled);
                    }}
                    data-testid={
                      id
                        ? createIdGens("loginForm" + id)
                        : createIdGens("loginForm")
                    }
                  >
                    <Form.Item name="client" label={<>Client</>}>
                      <Select
                        data-testid={
                          id
                            ? createIdGens("loginClient" + id)
                            : createIdGens("loginClient")
                        }
                        placeholder="Select Client"
                        loading={clientLoading}
                        style={{
                          width: "100%",
                          height: "2.75rem",
                          cursor: "pointer",
                        }}
                        onChange={(value) => onValuesChange(value, "client")}
                        options={clientOptions}
                        notFoundContent={
                          clientLoading ? (
                            <div className="d-flex justify-content-center align-items-center">
                              <Spin size="small" />
                            </div>
                          ) : null
                        }
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        showSearch
                      />
                    </Form.Item>
                    <Form.Item name="project" label={<>Project</>}>
                      <Select
                        data-testid={
                          id
                            ? createIdGens("loginProject" + id)
                            : createIdGens("loginProject")
                        }
                        placeholder="Select Project"
                        loading={projectLoading}
                        style={{
                          width: "100%",
                          height: "2.75rem",
                          cursor: "pointer",
                        }}
                        onChange={(value) => onValuesChange(value, "project")}
                        options={projectOptions}
                        disabled={!form.getFieldValue("client")}
                        notFoundContent={
                          projectLoading ? (
                            <div className="d-flex justify-content-center align-items-center">
                              <Spin size="small" />
                            </div>
                          ) : null
                        }
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        showSearch
                      />
                    </Form.Item>
                    <Form.Item name="role" label={<>Role</>}>
                      <Select
                        data-testid={
                          id
                            ? createIdGens("loginRole" + id)
                            : createIdGens("loginRole")
                        }
                        placeholder="Select Role"
                        loading={roleLoading}
                        style={{
                          width: "100%",
                          height: "2.75rem",
                          cursor: "pointer",
                        }}
                        options={roleOptions}
                        onChange={(e) => form.setFieldValue("role", e)}
                        disabled={!form.getFieldValue("project")}
                        notFoundContent={
                          roleLoading ? (
                            <div className="d-flex justify-content-center align-items-center">
                              <Spin size="small" />
                            </div>
                          ) : null
                        }
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        showSearch
                      />
                    </Form.Item>
                    <div className="d-flex justify-content-between mt-5">
                      <RegularButton
                        type="submit"
                        name="SUBMIT"
                        width="400px"
                        loading={!submitLoading}
                        disabled={!form.getFieldsValue()?.role}
                      />
                    </div>
                  </Form>
                </div>
              )}
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
    clientLoading: state.authReducer?.clientLoader,
    projectLoading: state.authReducer?.projectLoader,
    roleLoading: state.authReducer?.roleLoader,
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
