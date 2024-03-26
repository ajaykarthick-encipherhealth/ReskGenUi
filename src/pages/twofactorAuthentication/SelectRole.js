import React, { useEffect, useState } from "react";
import { Select, notification, Modal } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { IMAGES } from "../../jsx/constant/theme";
import LoginBack from "../../images/logo/login-back.jpg";
import styles from "../../styles/auth.module.css";
import { checkDeviceLogin, logoutAllDevice } from "../../services/AuthService";
import RegularButton from "../../components/button";

const SelectRole = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleError, setRoleError] = useState(false);
  const [role, setRole] = useState();
  const [decodedParams, setDecodedParams] = useState();
  const [confirmModal, setConfirmModal] = useState(false);

  const rolesList = role?.slice().reverse();
  const items = [
    { value: "physician", label: "PHYSICIAN" },
    { value: "provider", label: "TENANT ADMIN" },
  

    ...(rolesList?.length > 0
      ? rolesList?.map((info) => ({
          value: info,
          label: info,
        }))
      : []),
  ];

  const onSubmitRole = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setRoleError(true);
    } else {
      loginSuccessCallBack();
    }
  };

  const handleLogout = () => {
    logoutAllDevice();
    checkDeviceLogin();
    setConfirmModal(false);
    loginSuccessCallBack();
  };

  const loginSuccessCallBack = () => {
    notification.success({
      message: "Login Successfully",
      duration: 1,
    });
    localStorage.removeItem("password");
    setRoleError(false);
    const rolesMapping = {
      admin: { userRole: "admin", route: "/admin/dashboard" },
      reviewer: { userRole: "reviewer", route: "/reviewer/dashboard" },
      supervisor: { userRole: "supervisor", route: "/supervisor/dashboard" },
      provider: { userRole: "provider", route: "/provider/fhirTable" },
      provider: { userRole: "tenant", route: "/tenantAdmin/fhirTable" },

      physician: { userRole: "physician", route: "/physician/dashboard" },
    };
    const selectedRoleInfo = rolesMapping[selectedRole];
    if (selectedRoleInfo && !roleError) {
      localStorage.setItem("userRole", selectedRoleInfo?.userRole);
      localStorage.setItem("role", selectedRole);
      router?.push(selectedRoleInfo?.route);
    }
  };
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const encodedParams = urlParams.get("params");
    const decodedParams = JSON.parse(atob(encodedParams));
    const { mfa, username, password } = decodedParams;
    const skipParam = decodedParams?.skipEntry;
    const encodeParams = btoa(
      JSON.stringify({
        mfa: mfa,
        skipEntry: skipParam,
        username: username,
        password: password,
      })
    );
    setDecodedParams(encodeParams);

    let rolesArray = JSON.parse(localStorage.getItem("roles"));
    let getUserId = localStorage.getItem("userId");
    if (getUserId == "johnson@encipherhealth.onmicrosoft.com") {
      rolesArray = ["TENANT ADMIN"];
    }
    setRole(rolesArray);
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
                <Image className="login-logo" src={IMAGES.loginPageLogo1} />
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-7 col-sm-12 mx-auto align-self-center">
            <div className="login-form">
              <div className="login-head">
                <h5 className="title">Log in to your account</h5>
              </div>
              <h6 className="login-title">
                <span>Login</span>
              </h6>

              <form onSubmit={onSubmitRole}>
                <div className="mb-4">
                  <label className="mb-1 text-dark">Select Role</label>
                  <div
                    style={{
                      height: "100px",
                      marginTop: "5px",
                    }}
                  >
                    <Select
                      style={{ width: "100%", height: "2.75rem" }}
                      placeholder="Select Role"
                      onChange={(value) => {
                        setSelectedRole(value?.toLowerCase());
                        setRoleError(false);
                      }}
                      options={items}
                    />
                  </div>
                  {roleError && (
                    <span className="text-danger fs-12">
                      Please Select Role
                    </span>
                  )}
                </div>
                <div className="d-flex justify-content-between">
                  <RegularButton
                    onClick={() => {
                      setSelectedRole(null);
                      setRoleError(false);
                      router?.push({
                        pathname: `/twofactorAuthentication/Authentication`,
                        search: `params=${decodedParams}`,
                      });
                    }}
                    type="outline"
                    name="BACK"
                    width="240px"
                  />
                  <RegularButton type="submit" name="NEXT" width="240px" />
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

export default SelectRole;
