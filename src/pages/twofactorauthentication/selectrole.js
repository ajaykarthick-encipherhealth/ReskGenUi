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

const SelectRole = ({ getLogin ,getProxyRoles,proxyRoles}) => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleError, setRoleError] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  
  const rolesList = JSON.parse(getStorage("roles"));
  const optionsList = rolesList?.map((role) => {
    const proxyObj = proxyRoles?.find((item) => item.role === role);
    return {
      value: role,
      label: proxyObj?.proxyRole?.split("_").join(" ") || role?.split("_").join(" "), 
    };
  });
  const items = [...(rolesList?.length > 0 ? optionsList : [])];
 
  const onSubmitRole = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setRoleError(true);
    } else {
      if (selectedRole.toLowerCase() === "admin") {
        notification.warning({
          message: "Unprivileged access!",
          duration: 1,
        });
      } else {
        const selectedProxyObj = proxyRoles?.find(
          (item) => item.role?.toLowerCase() === selectedRole?.toLowerCase()
        );
        if (selectedProxyObj?.proxyRole) {
          const formattedProxyRole = selectedProxyObj.proxyRole.replace(
            /_/g,
            " "
          );
          const accessList = proxyRoles?.find(
           (item) => item.role?.toLowerCase() === selectedRole?.toLowerCase()
         );
         const roleId = selectedProxyObj?.roleId   
          setStorage("proxyRole", formattedProxyRole);
          setStorage("accessMenuList", JSON.stringify(accessList));
          setStorage("roleId", roleId)
          setStorage("aliasName",selectedProxyObj?.aliasName  )
      }
 
        loginSuccessCallBack();
      }
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
      supervisor: { userRole: "supervisor", route: "/supervisor/dashboard" },
      provider: { userRole: "provider", route: "/provider/fhirTable" },
      tenant_admin: {
        userRole: "tenant_admin",
        route: "/tenantadmin/dashboard",
      },
      physician: { userRole: "physician", route: "/physicians/dashboard" },
      record_analyst: {
        userRole: "record_analyst",
        route: "/analyst/patients",
      },
      // physician: { userRole: "physician", route: "/physician/dashboard" },
    };

    const selectedRoleInfo = rolesMapping[selectedRole];
    if (selectedRoleInfo && !roleError) {

      setStorage("userRole", selectedRoleInfo?.userRole);
      // setStorage("userRole", selectedRole);
      setLoading(true);
      router?.push(selectedRoleInfo?.route);
    }
  };

  // useEffect(() => {
  //   const mfa = JSON.parse(getStorage("mfa"));
  //   const skipEntry = JSON.parse(getStorage("skipEntry"));
  //   const username = getStorage("userId");
  //   const sessionPassword = JSON.parse(getStorage("password"));
  //   const code = getStorage("code");
  //   setPassword(sessionPassword);
  //   removeStorage("password");
  //   if (password) {
  //     // let rolesArray = JSON.parse(getStorage("roles"));
  //     // let getUserId = getStorage("userId");
  //     // if (getUserId == "johnson@encipherhealth.onmicrosoft.com") {
  //     //   rolesArray = ["TENANT ADMIN"];
  //     // }

  //     getLogin({
  //       email: username,
  //       router: router,
  //       code: code,
  //       password: password,
  //       mfa: mfa,
  //       skip: skipEntry,
  //     });
  //   }
  //   if (!username) {
  //     router.push("/login");
  //   }
  // }, []);

  // useEffect(() => {
  //   router.beforePopState(({ url }) => {
  //     router.push("/login");
  //     return false;
  //   });
  //   return () => {
  //     router.beforePopState(() => true);
  //   };
  // }, [router]);

  
  useEffect(()=>{
    getProxyRoles()
  },[])
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
                  <div id="role" name="role"
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
                        setSelectedRole(value?.toLowerCase());
                        setRoleError(false);
                      }}
                      options={items}
                    />
                    {roleError && (
                      <span className="text-danger fs-12">
                        Please Select Role
                      </span>
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-between " id="next-btn" name="next-btn">
                  <RegularButton
                    onClick={() => {
                      setSelectedRole(null);
                      setRoleError(false);
                      router?.push(`/login`);
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
    proxyRoles:state.authReducer?.getAllProxyRoles?.data?.response,
  }),
  {
    getLogin: allActions.getLogin,
    getProxyRoles:allActions.proxyRoles,
  }
);
export default connector(SelectRole);
