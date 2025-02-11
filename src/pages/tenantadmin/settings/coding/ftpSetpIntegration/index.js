import React, { useEffect, useState } from "react";
import Style from "../../style.module.css";
import { Input, notification, Button, Form, Modal } from "antd";
import { connect } from "react-redux";
import { actions as settingActions } from "../../../../../stores/tenantAdmin/settings";
import RegularButton from "../../../../../components/button";

const FtpSetpIntegration = ({ getFhirInstructionDetails, getFhirList }) => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState({status:false,data:null});
  const [isSelectEMR, setIsSelectEMR] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [fihrList, setFihrList] = useState([
    { emr: "Filezilla", status: "connected" },
    { emr: "DropBox", status: null },
    { emr: "G-Drive", status: null },
    { emr: "S3", status: null },
    { emr: "Azure Blob", status: null },
  ]);

  const showModal = (info) => {
    setIsModalVisible({status:true,data:info});
  };

  const handleModalClose = () => {
    setIsModalVisible({status:false,data:null});
    form.resetFields();
  };

  const handleSubmit = (values) => {
    setFormData(values);
    setIsConnected(true);
    const updatedFihrList = fihrList.map((item) =>
      item.emr === isSelectEMR ? { ...item, status: "connected" } : item
    );
    setFihrList(updatedFihrList);
    notification.success({
      message: `${isSelectEMR} Connected Successfully`,
      duration: 2,
    });
    handleModalClose();
  };

  useEffect(() => {
    getFhirList();
    getFhirInstructionDetails();
  }, []);

  return (
    <div>
      <div className="p-3">
        <div className={Style.title}>FHIR Integration</div>
      </div>

      <div className="container">
        <div className="row">
          {fihrList.map((item) => (
            <div key={item.emr} className="col-md-2 col-sm-4 col-3 p-2">
              <div
                key={item.emr}
                className={`p-4 m-2 rounded-3 cr-pointer ${Style.borderStyleDisConnect}`}
                onClick={() => setIsSelectEMR(item.emr)}
              >
                <div className="p-2 text-center">
                  <div
                    className="d-flex justify-content-center"
                    // style={{ height: "80px", alignItems: "center", width: "220px" }}
                  >
                    <h3>{item.emr}</h3>
                  </div>
                  <div className="my-1">
                    <span>
                      {isSelectEMR === item.emr
                        ? "Connected"
                        : item.status === "connected"
                        ? "Connected"
                        : "Disconnected"}
                    </span>
                    <span
                      className={Style.flagDot}
                      style={{
                        backgroundColor: `${
                          item.status === "connected" ? "#389e0d" : "#C70000"
                        }`,
                      }}
                    ></span>
                  </div>

                  <div>
                    <Button
                      style={{
                        marginTop: "8px",
                        borderColor:
                          item.status === "connected" ? "#ff4d4f" : "#289A00",
                        backgroundColor:
                          item.status === "connected" ? "#fff1f0" : "#D9FFCC",
                        color:
                          item.status === "connected" ? "#ff4d4f" : "#289A00",
                      }}
                      className={Style.connectBtn}
                      disabled={item.status && isSelectEMR !== item.emr}
                      onClick={()=>showModal(item?.emr)}
                    >
                      {item.status === "connected" ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        title={<div className="font-semibold fs-4 py-2">{isModalVisible?.data}</div>}
        visible={isModalVisible?.status}
        onCancel={handleModalClose}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="User Name"
            name="userName"
            rules={[{ required: true, message: "Please enter User Name" }]}
          >
            <Input placeholder="Enter User Name" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter Password" }]}
          >
            <Input type="password" placeholder="Enter Password" />
          </Form.Item>

          <Form.Item
            label="Host"
            name="host"
            rules={[{ required: true, message: "Please enter Host" }]}
          >
            <Input placeholder="Enter Host" />
          </Form.Item>

          <Form.Item
            label="Port"
            name="port"
            rules={[{ required: true, message: "Please enter Port" }]}
          >
            <Input placeholder="Enter Port" />
          </Form.Item>

          <Form.Item
            label="Base Path"
            name="basePath"
            rules={[{ required: true, message: "Please enter Base Path" }]}
          >
            <Input placeholder="Enter Base Path" />
          </Form.Item>

          <Form.Item>
            <div className="d-flex align-items-center justify-content-center">
              <RegularButton name="Submit" width={100} />
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    data: state?.tenantAdmin?.settings?.fhirInstructions,
    connectStatus: state?.tenantAdmin?.settings?.fhirConnectStatus,
    fhirAllList: state?.tenantAdmin?.settings?.fhirList,
  }),
  {
    getFhirInstructionDetails: settingActions.fhirInstructionsAction,
    getFhirConnectDetails: settingActions.fhirConnectAction,
    getFhirList: settingActions.fhirListAction,
  }
);

export default enhancer(FtpSetpIntegration);
