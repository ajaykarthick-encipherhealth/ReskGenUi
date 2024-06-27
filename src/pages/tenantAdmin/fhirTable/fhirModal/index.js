import React from "react";
import { Offcanvas, Button } from "react-bootstrap";
import { actions as tenantActions } from "../../../../stores/tenantAdmin";
import { connect } from "react-redux";
import { Form, Input, Select } from "antd";
import { getYears } from "../../../../utils/reusable";
import UploadFile from "../uploadFile";
import { useSelector } from "react-redux";
import { useState } from "react";
import ENDPOINTS from "../../../../utility/enpoints";
import axios from "../../../../utility/axiosConfig";

const FhirDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  uploadType,
  fileList,
  setFileList,
  getCreateBatch,
  getAllBatches,
  selectedBatch,
  setSelectedBatch,
}) => {
  const [form] = Form.useForm();
  const handleClose = (form) => {
    setIsDrawerOpen(false);
    form.resetFields();
    if (setSelectedBatch) {
      setSelectedBatch();
    }
  };
  const reportActiveTab = useSelector((state) => state.AuditReport?.activetab);

  const handleFileUpload = async () => {
    try {
      const uploadPromises = fileList.map((item) => {
        const formData = new FormData();
        formData.append("file", item);
        formData.append("batchId", selectedBatch?.id);
        formData.append("yearOfServices", selectedBatch?.yearOfService);

        const headers = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

        return axios.post(
          `${ENDPOINTS.apiEndoint}management/batch/upload`,
          formData,
          headers
        );
      });

      const responses = await Promise.all(uploadPromises);
      responses.forEach((res) => {
        if (res.data.status === "SUCCESS") {
          form.resetFields();
        }
      });
      setIsDrawerOpen(false);
    } catch (err) {
      console.error("Error uploading files:", err);
    }
  };

  const onFinish = async (formVal) => {
    if (reportActiveTab === "PDF") {
      if (uploadType !== "upload") {
        const res = await getCreateBatch({ info: formVal });
        if (res.status === "SUCCESS") {
          await getAllBatches({ page: 0 });
          form.resetFields();
        }
      } else {
        handleFileUpload();
      }
    }
  };

  return (
    <Offcanvas show={isDrawerOpen} className="offcanvas-end" placement="end">
      <Offcanvas.Header closeButton onClick={() => handleClose(form)}>
        <Offcanvas.Title>
          {" "}
          {uploadType === "upload" ? "Update New Batch" : "Create batch"}{" "}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="container-fluid">
          <Form form={form} name="basic" layout="vertical" onFinish={onFinish}>
            {uploadType !== "upload" && (
              <Form.Item
                label={
                  <label>
                    Batch Name <span className="text-danger">*</span>{" "}
                  </label>
                }
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Batch Name ",
                  },
                ]}
              >
                <Input name="batchid" />
              </Form.Item>
            )}
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
              >
                <UploadFile filelList={fileList} setFileList={setFileList} />
              </Form.Item>
            )}
            {uploadType !== "upload" && (
              <Form.Item
                label={
                  <label>
                    Year of Service <span className="text-danger">*</span>{" "}
                  </label>
                }
                name="yearOfService"
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
            )}
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
};
const enhancer = connect((state) => ({}), {
  uploadBatch: tenantActions.batchUpload,
  getCreateBatch: tenantActions.getCreateBatch,
  getAllBatches: tenantActions.getAllBatches,
});
export default enhancer(FhirDrawer);
