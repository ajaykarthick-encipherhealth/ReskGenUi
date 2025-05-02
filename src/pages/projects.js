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
import { useMsal } from "@azure/msal-react";
import PageLoading from "../components/page-loading";
import { getResponePopup } from "../utils/reusable";

const SelectProject = ({
  getAllClientId,
  clientIdData,
  getAllClientDetails,
  clientDetails,
}) => {
  const router = useRouter();
  const [selectClient, setSelectClient] = useState(null);
  const [clientError, setClientError] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const { accounts } = useMsal();
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const [selectValue, setSelectValue] = useState([]);


  const clientOptions = clientDetails?.map((client) => ({
    label: client.clientName,
    value: client.clientId,
  }));
  const onSubmitClient = async (e) => {
    e.preventDefault();
    if (!selectClient) {
      setClientError(true);
      return;
    }
    setClientError(false);
    setStorage("client", selectClient);
    setLoading(true);
    router.push("/client");
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
    if (clientIdData) {
      setStorage("orgId", clientIdData?.orgId);
      clientGetApi();
    }
  }, [clientIdData]);

  useEffect(() => {
    getAllClientId();
    setSelectValue(getStorage("client") && getStorage("client"))
    setSelectClient(getStorage("client") && getStorage("client"))
  }, []);

  // useEffect(() => {
  //   if (accounts && accounts.length > 0) {
  //     setIsLoading(false);
  //   } else {
  //     const timeout = setTimeout(() => {
  //       if (!accounts || accounts.length === 0) {
  //         router.push("/");
  //       }
  //     }, 3000);
  //     return () => clearTimeout(timeout);
  //   }
  // }, [accounts, router]);
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

              <form onSubmit={onSubmitClient}>
                {/* <div className="mb-4">
                  <label className="mb-1 text-dark">Select Cleint</label>
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
                        setSelectClient(value?.toLowerCase());
                        setClientError(false);
                      }}
                      options={clientOptions}
                    />
                    {clientError && (
                      <span className="text-danger fs-12">
                        Please Select Client
                      </span>
                    )}
                  </div>
                </div> */}
                <div className="mb-4">
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
                      loading={loadingClients}
                      onChange={(value) => {
                        setSelectClient(value?.toLowerCase());
                        setClientError(false);
                        setSelectValue(value)
                      }}
                      value={selectValue}
                      options={clientOptions}
                      notFoundContent={
                        loadingClients ? (
                          <div className="d-flex justify-content-center align-items-center">
                            <Spin size="small" />
                          </div>
                        ) : null
                      }
                    />
                    {clientError && (
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
    clientIdData: state.authReducer?.getClientId?.data?.response,
    clientDetails: state.authReducer?.getClientDetails?.data?.response,
  }),
  {
    getAllClientId: allActions.clientId,
    getAllClientDetails: allActions.clientDetails,
  }
);
export default connector(SelectProject);
