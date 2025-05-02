import React, { useEffect, useState } from "react";
import { Select, notification, Modal, Spin } from "antd";
import { useRouter } from "next/router";
import LoginBack from "../images/logo/login-back.jpg";
import styles from "../styles/auth.module.css";
import RegularButton from "../components/button";
import { getStorage, removeStorage, setStorage } from "../utils/storages";
import { connect } from "react-redux";
import { actions as allActions } from "../stores/authFlows";
import { getLogoImage } from "./twofactorauthentication/reusableFun";
import { getResponePopup } from "../utils/reusable";

const SelectClient = ({ projectDetails, getAllProjects }) => {
  const router = useRouter();
  const [selectClient, setSelectClient] = useState(null);
  const [clientError, setClientError] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProject, setLoadingProject] = useState(true);
  const [selectValue, setSelectValue] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectClient) {
      setClientError(true);
      return;
    }
    setStorage("project", selectClient);
    setLoading(true);
    router.push("/twofactorauthentication/selectrole");
  };

  const handleLogout = () => {
    setConfirmModal(false);
  };

  const projectOptions = projectDetails?.map((client) => ({
    label: client.projectName,
    value: client.id,
  }));
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

  useEffect(() => {
    projectGetApi();
  }, []);

  useEffect(() => {
    setSelectValue(getStorage("project") && getStorage("project"));
    setSelectClient(getStorage("project") && getStorage("project"));
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

              <form onSubmit={onSubmit}>
                <div className="mb-4">
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
                      id="select-role"
                      name="select-role"
                      style={{ width: "100%", height: "2.75rem" }}
                      placeholder="Select Project"
                      loading={loadingProject}
                      onChange={(value) => {
                        setSelectClient(value?.toLowerCase());
                        setClientError(false);
                        setSelectValue(value);
                      }}
                      options={projectOptions}
                      value={selectValue}
                      notFoundContent={
                        loadingProject ? (
                          <div className="d-flex justify-content-center align-items-center">
                            <Spin size="small" />
                          </div>
                        ) : null
                      }
                    />
                    {clientError && (
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
                 <Button className={styles.outer}  onClick={() => {
                      router?.push('/projects'); 
                    }} > BACK </Button>
                  <RegularButton
                    type="submit"
                    name="NEXT"
                    width="240px"
                    loading={loading}
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
    projectDetails: state.authReducer?.getProjectDetails?.data?.response,
  }),
  {
    getAllProjects: allActions.projectDetails,
  }
);
export default connector(SelectClient);
