import React, { useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { encyptingPass } from "../../components/headerFilters/functions";
import RegularButton from "../../components/button";
import { actions as allActions } from "../../stores/authFlows";
import { getResponePopup } from "../../utils/reusable";
import { Form, Select } from "antd";

const IsAdmin = ({ loginResponse, setClickAuth, isClickAuth }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clientList, setClientList] = useState([
    {
      label: "CLIENT_1",
      value: "CLIENT_1",
    },
  ]);

  const onLogin = async (e) => {
    e.preventDefault();
  };

  const onSubmitClient = () => {
    setClickAuth("Project");
    form?.resetFields();
  };

  const onSubmitProject = () => {
    setClickAuth("Role");
    form?.resetFields();
  };
  const onSubmitRole = () => {
    // Your logic here
    // form?.resetFields();
  };

  return (
    <div className="col-lg-6 col-md-7 col-sm-12 mx-auto align-self-center">
      <div className="login-form" style={{ minHeight: "330px" }}>
        {isClickAuth == "MS" || isClickAuth == "Google" ? (
          <>
            <div className="d-flex align-items-center justify-content-center">
              <h2 className="title fontWeight2">Log In as Admin</h2>
            </div>

            <h6 className="login-title">
              <span>Login</span>
            </h6>

            <form onSubmit={onLogin} autoComplete="off">
              <div
                id="login-submit"
                name="login-submit"
                className="text-center mt-5"
              >
                <RegularButton
                  type="submit"
                  name="STEP IN"
                  width="100%"
                  loading={loginResponse}
                />
              </div>
              <div
                id="login-submit"
                name="login-submit"
                className="text-center mt-2"
              >
                <RegularButton
                  type="outline"
                  name="BACK"
                  width="100%"
                  loading={loginResponse}
                  onClick={() => setClickAuth(null)}
                />
              </div>
            </form>
          </>
        ) : isClickAuth == "Client" ? (
          <>
            <div className="d-flex align-items-center justify-content-center">
              <h2 className="title fontWeight2">Select Client</h2>
            </div>

            <h6 className="login-title">
              <span>Login</span>
            </h6>

            <Form form={form} layout="vertical" onFinish={onSubmitClient}>
              <Form.Item
                // label="Select Client"
                name="client"
                rules={[{ required: true, message: "Please Select Client" }]}
              >
                <Select
                  id="select-client"
                  name="select-client"
                  placeholder="Select Client"
                  style={{ width: "100%", height: "2.75rem" }}
                >
                  {clientList.map((item) => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item>
                <div
                  className="d-flex justify-content-between "
                  id="next-btn"
                  name="next-btn"
                >
                  <RegularButton
                    onClick={() => {
                      setClickAuth(null);
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
              </Form.Item>
            </Form>
          </>
        ) : isClickAuth == "Project" ? (
          <>
            <div className="d-flex align-items-center justify-content-center">
              <h2 className="title fontWeight2">Select Project</h2>
            </div>

            <h6 className="login-title">
              <span>Login</span>
            </h6>

            <Form form={form} layout="vertical" onFinish={onSubmitProject}>
              <Form.Item
                name="client"
                rules={[{ required: true, message: "Please Select Project" }]}
              >
                <Select
                  id="select-project"
                  name="select-project"
                  placeholder="Select Project"
                  style={{ width: "100%", height: "2.75rem" }}
                >
                  {clientList.map((item) => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item>
                <div
                  className="d-flex justify-content-between "
                  id="next-btn"
                  name="next-btn"
                >
                  <RegularButton
                    onClick={() => {
                      setClickAuth("Client");
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
              </Form.Item>
            </Form>
          </>
        ) : (
          <>
            <div className="d-flex align-items-center justify-content-center">
              <h2 className="title fontWeight2">Select Role</h2>
            </div>

            <h6 className="login-title">
              <span>Login</span>
            </h6>

            <Form form={form} layout="vertical" onFinish={onSubmitRole}>
              <Form.Item
                // label="Select Client"
                name="client"
                rules={[{ required: true, message: "Please Select Role" }]}
              >
                <Select
                  id="select-role"
                  name="select-role"
                  placeholder="Select Role"
                  style={{ width: "100%", height: "2.75rem" }}
                >
                  {clientList.map((item) => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item>
                <div
                  className="d-flex justify-content-between "
                  id="next-btn"
                  name="next-btn"
                >
                  <RegularButton
                    onClick={() => {
                      setClickAuth("Project");
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
              </Form.Item>
            </Form>
          </>
        )}
      </div>
    </div>
  );
};

const connector = connect(
  (state) => ({
    loginResponse: state?.authReducer?.mfaLoader,
  }),
  {
    getMFAValidation: allActions.getMFAValidation,
  }
);
export default connector(IsAdmin);
