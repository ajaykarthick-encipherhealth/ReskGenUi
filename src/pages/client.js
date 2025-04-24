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

const SelectClient = ({ getLogin, getProxyRoles, proxyRoles }) => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleError, setRoleError] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);




  const onSubmitRole = async (e) => {
    router.push("/twofactorauthentication/selectrole");
    e.preventDefault();
  };

  const handleLogout = () => {
    setConfirmModal(false);
    loginSuccessCallBack();
  };

  useEffect(() => {
    getProxyRoles();
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
          <div className="col-lg-6 col-md-7 col-sm-12 mx-auto align-self-center ">
            <div className="login-client ">
              <form onSubmit={onSubmitRole}>
                <div className="mt-4">
                  <label className="mb-1 text-dark">Select Project</label>
                  <div
                    id="role"
                    name="role"
                    style={{
                      height: "100px",
                      marginTop: "5px",
                    }}
                  >
                    <Select
                      id="select-project"
                      name="select-project"
                      style={{ width: "100%", height: "2.75rem" }}
                      placeholder="Select Project"
                      onChange={(value) => {
                        setSelectedRole(value?.toLowerCase());
                        setRoleError(false);
                      }}
                      options={priorityOptions}
                    />
                    {roleError && (
                      <span className="text-danger fs-12">
                        Please Select Project
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
export default connector(SelectClient);
