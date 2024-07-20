import React, { useRef } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import { actions as tenantActions } from "../../../../stores/tenantAdmin/patientSync";
import { connect } from "react-redux";
import { Divider, Drawer, Form, Input, Select, Space } from "antd";
import downloadImg from "../../../../images/fihr/download.png";
import uploaderImg from "../../../../images/fihr/uploaderImg.png";
import UploadFile from "../uploadFile";
import { useState } from "react";
import ENDPOINTS from "../../../../utility/enpoints";
import axios from "../../../../utility/axiosConfig";
import Image from "next/image";
import style from "../fhir.module.css";
import CustomSelect from "../../../../components/customSelect";
import { CloseOutlined } from "@ant-design/icons";
export const getYears = () => {
  const currentYear = new Date().getFullYear();
  let year = [];
  for (let i = 2016; i < currentYear + 1; i++) {
    year.push({ label: i, value: i });
  }
  return year;
};
const inputTypeOptions = [
  { label: "Excel", value: "EXCEL" },
  { label: "Csv", value: "CSV" },
  { label: "Json", value: "JSON" },
  { label: "Manual", value: "MANUAL" },
  { label: "Group Id", value: "GROUP_ID" },
];
const FhirDrawer = ({ isDrawerOpen, setIsDrawerOpen, setSelectedBatch }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [options, setOptions] = useState([]);
  const handleClose = (form) => {
    setFileList([]);
    setSelectedType(null);
    setIsDrawerOpen(false);
    form.resetFields();
    if (setSelectedBatch) {
      setSelectedBatch();
    }
  };

  const generateUUID = () => {
    let dt = new Date().getTime();
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        let r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  };
  const onFinish = async (formVal) => {
    const newUuid = generateUUID();
    // const formData = new FormData();
    // formData.append("file", fileList[0]);
    // formData.append("batchId", newUuid);
    // formData.append("batchName", formVal?.batchName);
    // formData.append("yearOfService", formVal?.yearOfService);
    // formData.append("batchType", "FHIR");
    const headers = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const data = {
      batchId: newUuid,
      batchName: formVal?.batchName,
      yearOfService: formVal?.yearOfService,
      batchType: "FHIR",
      groupId: formVal?.groupId,
    };
    try {
      const res = axios.post(
        `${ENDPOINTS.apiEndoint}management/batch/upload`,
        selectedType === "GROUP_ID" ? data : { ...data, file: fileList[0] },
        selectedType !== "GROUP_ID" && headers
      );
      console.log(res);
      form.resetFields();
    } catch (err) {
      form.resetFields();
    }
  };
  const handleDownload = () => {
    let fileName;
    if (selectedType === "CSV") {
      fileName = "sample.csv";
    } else if (selectedType === "JSON") {
      fileName = "sample.json";
    } else {
      fileName = "sample.xlsx";
    }
    const link = document.createElement("a");
    link.href = `/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    // <Offcanvas show={isDrawerOpen} className="offcanvas-end" placement="end">
    //   <Offcanvas.Header closeButton onClick={() => handleClose(form)}>
    //     <Offcanvas.Title>
    //       {" "}
    //       {uploadType === "upload" ? "Upload New Batch" : "Create batch"}{" "}
    //     </Offcanvas.Title>
    //   </Offcanvas.Header>
    //   <Offcanvas.Body>

    <Drawer
      title={
        <div
          className="d-flex justify-content-between"
          style={{ padding: "10px 0px" }}
        >
          <div>Upload New Batch</div>
          <div className="cr-pointer" onClick={() => handleClose(form)}>
            <CloseOutlined />
          </div>
        </div>
      }
      width={450}
      closable={false}
      onClose={() => handleClose(form)}
      open={isDrawerOpen}
      style={{ padding: "10px" }}
      headerStyle={{ padding: "10px" }}
    >
      <div className="container-fluid pt-4">
        <Form form={form} name="basic" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={
              <label>
                Batch Name <span className="text-danger">*</span>{" "}
              </label>
            }
            name="batchName"
            rules={[
              {
                required: true,
                message: "Please Enter Batch Name ",
              },
            ]}
          >
            <Input name="batchName" placeholder="BatchName" />
          </Form.Item>

          <Form.Item
            label={
              <label>
                Input Type <span className="text-danger">*</span>{" "}
              </label>
            }
            name="inputType"
            rules={[
              {
                required: true,
                message: "Please Enter Input Type ",
              },
            ]}
          >
            <Select
              name="inputType"
              style={{ width: "100%" }}
              options={inputTypeOptions}
              size="large"
              onChange={(value) => {
                setSelectedType(value);
              }}
              placeholder="Input Type"
            />
          </Form.Item>
          <Form.Item
            label={
              <label>
                YearOf Service <span className="text-danger">*</span>{" "}
              </label>
            }
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
          {selectedType === "GROUP_ID" ? (
            <Form.Item
              label={
                <label>
                  Group ID <span className="text-danger">*</span>{" "}
                </label>
              }
              name="groupId"
              rules={[
                {
                  required: true,
                  message: "Please Enter Group Id ",
                },
              ]}
            >
              <Input name="groupId" />
            </Form.Item>
          ) : selectedType === "MANUAL" ? (
            <Form.Item
              label={
                <label>
                  MRN Number<span className="text-danger">*</span>
                </label>
              }
              name="mrnNumber"
              rules={[
                {
                  required: true,
                  message: "Please enter MRN Number",
                },
              ]}
            >
              <div>
                <CustomSelect
                  disabled={false}
                  placeholder="MRN Number"
                  options={options}
                  setOptions={setOptions}
                />
              </div>
            </Form.Item>
          ) : (
            <>
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
                  filelList={fileList}
                  setFileList={setFileList}
                  uploaderImg={uploaderImg}
                  subText={
                    fileList?.length > 0
                      ? fileList[0]?.name
                      : "Upload Excel, CSV, Json or Drag and drop your files"
                  }
                />
              </Form.Item>
              <Form.Item label={<label>Sample File Input</label>}>
                <Button type="button" className={style.sampleBtnStyle}>
                  {selectedType === "CSV"
                    ? "Sample Csv File.csv"
                    : selectedType === "JSON"
                    ? "Sample Json File.json"
                    : "Sample Excel File.xlsx"}
                  <Image
                    src={downloadImg}
                    alt="noImage"
                    className={style.sampleFileImg}
                    onClick={() => {
                      handleDownload();
                    }}
                  />
                </Button>
              </Form.Item>
            </>
          )}

          <Form.Item>
            <div className="col-xl-12 mb-3 d-grid justify-content-center">
              <Button type="submit">SUBMIT</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Drawer>

    //   </Offcanvas.Body>
    // </Offcanvas>
  );
};
const enhancer = connect((state) => ({}), {
  getCreateBatch: tenantActions.getCreateBatch,
  getAllBatches: tenantActions.getAllBatches,
});
export default enhancer(FhirDrawer);
