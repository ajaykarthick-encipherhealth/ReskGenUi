import React, { useEffect, useState } from "react";
import { Select, notification, Modal } from "antd";
import { useRouter } from "next/router";
import LoginBack from "../../images/logo/login-back.jpg";
import styles from "../../styles/auth.module.css";
import RegularButton from "../../components/button";
import { getStorage, removeStorage, setStorage } from "../../utils/storages";
import { connect } from "react-redux";
import { actions as allActions } from "../../stores/authFlows";
import { getLogoImage } from "./reusableFun";
import { priorityOptions } from "../../components/headerFilters/functions";
import { getResponePopup } from "../../utils/reusable";

const SelectRole = ({
  getAllRoles,
  getProxyRoles,
  proxyRoles,
  allRolesData,
}) => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleError, setRoleError] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const roleOptions = allRolesData?.userRoles?.map((client) => ({
    label: client.proxyRole.replaceAll('_', ' '),
    value: client.proxyRole,
  }));
  
  const onSubmitRole = async (e) => {
    e.preventDefault();

    if (!selectedRole) {
      setRoleError(true);
      return;
    }
    const selectedRoleObj = allRolesData?.userRoles?.find(
      (role) => role.proxyRole === selectedRole
    );
    if (selectedRoleObj) {
      setStorage("proxyRole", selectedRoleObj?.proxyRole);
      setStorage("userAllRoles", JSON.stringify(allRolesData?.userRoles));
      setStorage("accessMenuList", JSON.stringify(selectedRoleObj?.accessList));
      setStorage("roleId", selectedRoleObj?.roleId);
      setStorage("aliasName", selectedRoleObj?.aliasName);
      loginSuccessCallBack();
    } else {
      console.error("Selected role not found in userRoles array");
    }
  };

  const handleLogout = () => {
    setConfirmModal(false);
    loginSuccessCallBack();
  };

  const loginSuccessCallBack = () => {
    notification.success({
      message: "Login Successfully",
      duration: 1,
    });
    setRoleError(false);    
    const rolesMapping = {
      admin: { userRole: "admin", route: "/admin/dashboard" },
      reviewer: { userRole: "reviewer", route: "/reviewer/dashboard" },
      CODER_1: { userRole: "CODER_1", route: "/reviewer/dashboard" },
      CODER_2: { userRole: "CODER_2", route: "/reviewer/dashboard" },
      QA: { userRole: "QA", route: "/reviewer/dashboard" },
      DOWNLOADER: { userRole: "DOWNLOADER", route: "/reviewer/dashboard" },
      OWNER: { userRole: "OWNER", route: "/reviewer/dashboard" },
      supervisor: { userRole: "supervisor", route: "/supervisor/dashboard" },
      provider: { userRole: "provider", route: "/provider/fhirTable" },
      TENANT_ADMIN: {
        userRole: "TENANT_ADMIN",
        route: "/tenantadmin/dashboard",
      },
      physician: { userRole: "physician", route: "/physicians/dashboard" },
      record_analyst: {
        userRole: "record_analyst",
        route: "/analyst/patients",
      },
    };

    const selectedRoleInfo = rolesMapping[selectedRole];
    if (selectedRoleInfo && !roleError) {
      setStorage("userRole", selectedRoleInfo?.userRole);
      setLoading(true);
      router?.push(selectedRoleInfo?.route);
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

  useEffect(() => {
    getRolesApi();
  }, []);


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

              <form onSubmit={onSubmitRole}>
                <div className="mb-4">
                  <label className="mb-1 text-dark">Select Role</label>
                  <div
                    id="role"
                    name="role"
                    style={{
                      height: "100px",
                      marginTop: "5px",
                    }}
                  >
                    <Select
                      id="select-role"
                      name="select-role"
                      style={{ width: "100%", height: "2.75rem" }}
                      placeholder="Select Role"
                      onChange={(value) => {
                        setSelectedRole(value);
                        setRoleError(false);
                      }}
                      value={selectedRole}
                      options={roleOptions}
                    />
                    {roleError && (
                      <span className="text-danger fs-12">
                        Please Select Role
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className="d-flex justify-content-between "
                  id="next-btn"
                  name="next-btn"
                >
                  <RegularButton
                    onClick={() => {
                      setSelectedRole(null);
                      setRoleError(false);
                      router?.push(`/client`);
                    }}
                    type="outline"
                    name="BACK"
                    width="240px"
                  />
                  <RegularButton
                    type="submit"
                    name="NEXT"
                    width="240px"
                    loading={loading}
                    disabled={loading}
                  />
                </div>
              </form>
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
    loginData: state.authReducer?.loginData?.data?.response,
    proxyRoles: state.authReducer?.getAllProxyRoles?.data?.response,
    allRolesData: state.authReducer?.getAllRoles?.data?.response,
  }),
  {
    getLogin: allActions.getLogin,
    getProxyRoles: allActions.proxyRoles,
    getAllRoles: allActions.allRoles,
  }
);
export default connector(SelectRole);
