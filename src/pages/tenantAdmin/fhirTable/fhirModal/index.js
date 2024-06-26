import React from "react";
import { Offcanvas, Button } from "react-bootstrap";
// import UploadFile from "../uploadFile";
import { actions as tenantActions } from "../../../../stores/tenantAdmin";
import { connect } from "react-redux";
import { Form, Input, Select } from "antd";
import { getYears } from "../../../../utils/reusable";
import { getStorage } from "../../../../utils/storages";
import ENDPOINTS from "../../../../utility/enpoints";
import axios from "../../../../utility/axiosConfig";
import UploadFile from "../uploadFile";

function FhirDrawer({
  isDrawerOpen,
  setIsDrawerOpen,
  uploadType,
  uploadBatch,
  filelList,
  setFileList,
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

  return (
    <Offcanvas show={isDrawerOpen} className="offcanvas-end" placement="end">
      <Offcanvas.Header closeButton onClick={handleClose}>
        <Offcanvas.Title>
          {" "}
          {uploadType === "upload" ? "Update New Batch" : "Create batch"}{" "}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="container-fluid">
          <Form
            form={form}
            name="validateOnly"
            layout="vertical"
            onFinish={onFinish}
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
            {uploadType !== "upload" && (
              <Form.Item
                label={
                  <label>
                    TotalFile Count <span className="text-danger">*</span>{" "}
                  </label>
                }
                name="totalFileCount"
                rules={[
                  {
                    required: true,
                    message: "Please Enter TotalFile Count ",
                  },
                ]}
              >
                <Input name="totalFileCount" maxLength={10} />
              </Form.Item>
            )}
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
                <UploadFile filelList={filelList} setFileList={setFileList} />
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
