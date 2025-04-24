import React, { useEffect, useState } from "react";
import { Select, notification, Modal } from "antd";
import { useRouter } from "next/router";
import LoginBack from "../images/logo/login-back.jpg";
import styles from "../styles/auth.module.css";
import RegularButton from "../components/button";
import { getStorage, removeStorage, setStorage } from "../utils/storages";
import { connect } from "react-redux";
import { actions as allActions } from "../stores/authFlows";
import { getLogoImage } from "./twofactorauthentication/reusableFun";
import { priorityOptions } from "../components/headerFilters/functions";
import { useMsal } from "@azure/msal-react";
import PageLoading from "../components/page-loading";

const SelectProject = ({ getLogin, getProxyRoles, proxyRoles }) => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleError, setRoleError] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const { accounts } = useMsal();
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const rolesList = JSON.parse(getStorage("roles"));
  const optionsList = rolesList?.map((role) => {
    const proxyObj = proxyRoles?.find((item) => item.role === role);
    return {
      value: role,
      label:
        proxyObj?.proxyRole?.split("_").join(" ") || role?.split("_").join(" "),
    };
  });
  const items = [...(rolesList?.length > 0 ? optionsList : [])];
  const onSubmitRole = async (e) => {
    e.preventDefault();
    router.push("/client");
  };
  

  const handleLogout = () => {
    setConfirmModal(false);
    loginSuccessCallBack();
  };

  useEffect(() => {
    getProxyRoles();
  }, []);

  useEffect(() => {
    if (accounts && accounts.length > 0) {
      setIsLoading(false); // User is authenticated
    } else {
      // Delay redirect slightly to give MSAL time to populate accounts
      const timeout = setTimeout(() => {
        if (!accounts || accounts.length === 0) {
          router.push("/");
        }
      }, 1000); // 500ms wait before redirecting

      return () => clearTimeout(timeout); // Cleanup
    }
  }, [accounts, router]);

  if (isLoading) {
    return (
      <div>
        <PageLoading />
      </div>
    );
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
          <div className="col-lg-6 col-md-7 col-sm-12 mx-auto align-self-center ">
            <div className="login-client ">
              <form onSubmit={onSubmitRole}>
                <div className="mt-4">
                  <label className="mb-1 text-dark">Select Client</label>
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
                      placeholder="Select Client"
                      onChange={(value) => {
                        setSelectedRole(value?.toLowerCase());
                        setRoleError(false);
                      }}
                        options={priorityOptions}
                    />
                    {roleError && (
                      <span className="text-danger fs-12">
                        Please Select Client
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
                    type="submit"
                    name="NEXT"
                    width="400px"
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
  }),
  {
    getLogin: allActions.getLogin,
    getProxyRoles: allActions.proxyRoles,
  }
);
export default connector(SelectProject);
