import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { actions as tenantActions } from "../../../../stores/tenantAdmin/patientSync";
import { connect } from "react-redux";
import { Drawer, Form, Input, Select } from "antd";
import style from "../fhir.module.css";
import downloadImg from "../../../../images/fihr/download.png";
import uploaderImg from "../../../../images/fihr/uploaderImg.png";
import { getYears } from "../../../../utils/reusable";
import UploadFile from "../uploadFile";
import { useSelector } from "react-redux";
import ENDPOINTS from "../../../../utility/enpoints";
import axios from "../../../../utility/axiosConfig";
const inputTypeOptions = [
  { label: "FireZilla", value: "FireZilla" },
  { label: "GoogleDrive", value: "GoogleDrive" },
  { label: "DropBox", value: "DropBox" },
  { label: "CogentUpload", value: "CogentUpload" },
];

const PdfDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  uploadType,
  fileList,
  setFileList,
  getCreateBatch,
  getAllBatches,
  selectedBatch,
  setSelectedBatch,
  upoloadFiles
}) => {
  const [form] = Form.useForm();
  const [selectedType, setSelectedType] = useState(null);

  const handleClose = (form) => {
    setIsDrawerOpen(false);
    form.resetFields();
    setFileList([]);
    setSelectedType(null);
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
          setFileList([]);
          setSelectedType(null);
          setIsDrawerOpen(false);
        }
      } else {
        handleFileUpload();
      }
    }
  };

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={() => handleClose(form)}
      title={uploadType === "upload" ? "Upload New Batch" : "Create batch"}
    >
      <div className="container-fluid">
        <Form form={form} name="basic" layout="vertical" onFinish={onFinish}>
          {uploadType !== "upload" && (
            <Form.Item
              label={<label>Batch Name</label>}
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please Enter Batch Name ",
                },
              ]}
            >
              <Input placeholder="Batch Name" />
            </Form.Item>
          )}
          {uploadType !== "upload" && (
            <>
              <Form.Item
                label={<label>EMR Type</label>}
                name="emrType"
                rules={[
                  {
                    required: true,
                    message: "Please Enter EMR Type",
                  },
                ]}
              >
                <Input placeholder="EMR Type" />
              </Form.Item>
              <Form.Item
                label={<label> File Count</label>}
                name="fileCount"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject(
                          new Error("Please enter the file count")
                        );
                      }
                      if (isNaN(value)) {
                        return Promise.reject(
                          new Error("File count must be a number")
                        );
                      }
                      if (value && (value.length < 0 || value.length >= 7)) {
                        return Promise.reject(
                          new Error("File count length must be less than 7")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder="File Count" />
              </Form.Item>
              <Form.Item
                label={<label>Source</label>}
                name="source"
                rules={[
                  {
                    required: true,
                    message: "Please Enter source",
                  },
                ]}
              >
                <Select
                  name="source"
                  style={{ width: "100%" }}
                  options={inputTypeOptions}
                  size="large"
                  onChange={(value) => {
                    setSelectedType(value);
                    setFileList([]);
                  }}
                  placeholder="Source"
                  allowClear={true}
                />
              </Form.Item>

              {selectedType === "CogentUpload" ? (
                <Form.Item
                  label={
                    <label>
                      Upload File <span className="text-danger">*</span>
                    </label>
                  }
                  name="upload"
                  rules={[
                    {
                      required: false,
                      message: "Please Upload File",
                    },
                  ]}
                >
                  <UploadFile
                    filesList={fileList}
                    setFilesList={setFileList}
                    uploaderImg={uploaderImg}
                    subText={"Upload Excel, CSV, Json files"}
                  />
                </Form.Item>
              ) : (
                selectedType && (
                  <Form.Item
                    label={<label>FilePath / FolderPath</label>}
                    name="FilePath"
                    rules={[
                      {
                        required: true,
                        message: "Please enter FilePath / FolderPath",
                      },
                    ]}
                  >
                    <Input placeholder="FilePath / FolderPath" />
                  </Form.Item>
                )
              )}
            </>
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
              <UploadFile filesList={fileList} setFilesList={setFileList} />
            </Form.Item>
          )}
          <Form.Item
            label={<label>YearOf Service</label>}
            name="yearOfService"
            rules={[
              {
                required: true,
                message: "Please Enter yearOfService ",
              },
            ]}
          >
            <Select
              mode="tags"
              name="yearOfService"
              style={{ width: "100%" }}
              options={getYears()}
              size="large"
              placeholder="year Of Service"
            />
          </Form.Item>
          <Form.Item>
            <div className="col-xl-12 mb-3 d-grid justify-content-center">
              <Button type="submit">{uploadType === "upload" ? "Upload" : "Create" }</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Drawer>
  );
};
const enhancer = connect((state) => ({}), {
  getCreateBatch: tenantActions.getCreateBatch,
  getAllBatches: tenantActions.getAllBatches,
  upoloadFiles:tenantActions.upoloadFiles
});
export default enhancer(PdfDrawer);
