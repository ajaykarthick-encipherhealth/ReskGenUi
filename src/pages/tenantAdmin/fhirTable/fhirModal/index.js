import React from "react";
import { Offcanvas, Button } from "react-bootstrap";
// import UploadFile from "../uploadFile";
import { actions as tenantActions } from "../../../../stores/tenantAdmin";
import { connect } from "react-redux";
import { Form, Input, Select, Upload } from "antd";
import styles from "../fhir.module.css";
import { getYears } from "../../../../utils/reusable";
import { getStorage } from "../../../../utils/storages";
import ENDPOINTS from "../../../../utility/enpoints";
import axios from "../../../../utility/axiosConfig";

function FhirDrawer({
  isDrawerOpen,
  setIsDrawerOpen,
  uploadType,
  uploadBatch,
}) {
  const [form] = Form.useForm();
  const handleClose = () => {
    setIsDrawerOpen(false);
  };

  const onFinish = async (form) => {
    let formData = new FormData();
    formData.append("orgid", await getStorage("orgId"));
    formData.append("tenantid", await getStorage("tenantId"));
    formData.append("userid", await getStorage("userId"));
    formData.append("dos", form.dos[0]);
    formData.append("folderpath", `/mnt/data/${form.batchid}`);
    formData.append("failurepath", `/mnt/data/failure`);
    formData.append("batchid", form.batchid);
    try {
      const headers = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await axios.post(
        ENDPOINTS.apiEndoint +
          `aiservice/ai/batch/upload
        `,
        formData,
        headers
      );
      console.log(response);
    } catch (error) {}
  };
  const onFinishFailed = () => {};

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  return (
    <Offcanvas show={isDrawerOpen} className="offcanvas-end" placement="end">
      <Offcanvas.Header closeButton onClick={handleClose}>
        <Offcanvas.Title> Update New Batch </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="container-fluid">
          <Form
            form={form}
            name="validateOnly"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label={
                <label>
                  Batch Name <span className="text-danger">*</span>{" "}
                </label>
              }
              name="batchid"
              rules={[
                {
                  required: true,
                  message: "Please Enter Batch Name ",
                },
              ]}
            >
              <Input name="batchid" />
            </Form.Item>
            {uploadType == "upload" && (
              <Form.Item
                label={
                  <label>
                    Upload File <span className="text-danger">*</span>
                  </label>
                }
                name="upload"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Upload File ",
                  },
                ]}
              >
                <Upload
                  name="upload"
                  className="avatar-uploader"
                  showUploadList={false}
                  directory
                  multiple
                  onChange={(e) => console.log(e)}
                  style={{ width: "100%" }}
                >
                  <div className={styles.videoflex} style={{ width: "100%" }}>
                    <div className="text-center">
                      <div>{uploadButton}</div>
                    </div>
                  </div>
                </Upload>
              </Form.Item>
            )}
            <Form.Item
              label={
                <label>
                  Year of Service <span className="text-danger">*</span>{" "}
                </label>
              }
              name="dos"
              rules={[
                {
                  required: true,
                  message: "Please Enter Year of Service ",
                },
              ]}
            >
              <Select
                mode="tags"
                name="dos"
                style={{ width: "100%" }}
                options={getYears()}
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <div className="col-xl-12 mb-3 d-grid justify-content-center">
                <Button type="submit">Proceed</Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
const enhancer = connect((state) => ({}), {
  uploadBatch: tenantActions.batchUpload,
});
export default enhancer(FhirDrawer);
