import React from "react";
import { Offcanvas, Button } from "react-bootstrap";
import { actions as tenantActions } from "../../../../stores/tenantAdmin/patientSync";
import { connect } from "react-redux";
import { Form, Input, Select } from "antd";
import downloadImg from "../../../../images/fihr/download.png";
import uploaderImg from "../../../../images/fihr/uploaderImg.png";
import UploadFile from "../uploadFile";
import { useSelector } from "react-redux";
import { useState } from "react";
import ENDPOINTS from "../../../../utility/enpoints";
import axios from "../../../../utility/axiosConfig";
import Image from "next/image";
import style from "../fhir.module.css";

const FhirDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  uploadType,
  fileList,
  setFileList,
  // getCreateBatch,
  // getAllBatches,
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

        // return axios.post(
        //   `${ENDPOINTS.apiEndoint}management/batch/upload`,
        //   formData,
        //   headers
        // );
      });

      // const responses = await Promise.all(uploadPromises);
      // responses.forEach((res) => {
      //   if (res.data.status === "SUCCESS") {
      //     form.resetFields();
      //   }
      // });
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
          {uploadType === "upload" ? "Upload New Batch" : "Create batch"}{" "}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="container-fluid">
          <Form form={form} name="basic" layout="vertical" onFinish={onFinish}>
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

            <Form.Item
              label={
                <label>
                  Batch ID <span className="text-danger">*</span>{" "}
                </label>
              }
              name="batchID"
              rules={[
                {
                  required: true,
                  message: "Please Enter Batch ID ",
                },
              ]}
            >
              <Input name="batchID" maxLength={10} />
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
                mode="tags"
                name="inputType"
                style={{ width: "100%" }}
                options={[
                  { label: "Excel", value: "EXCEL" },
                  { label: "Csv", value: "CSV" },
                ]}
                size="large"
              />
            </Form.Item>
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
                  message: "Please Upload File",
                },
              ]}
            >
              <UploadFile
                filelList={fileList}
                setFileList={setFileList}
                uploaderImg={uploaderImg}
                subText="Upload Excel, CSV, Json & Drag and drop your files"
              />
            </Form.Item>
            <Form.Item label={<label>Sample File Input</label>}>
              <Button type="button" className={style.sampleBtnStyle}>
                Sample excel.xlsx
                <Image
                  src={downloadImg}
                  alt="noImage"
                  className={style.sampleFileImg}
                />
              </Button>
            </Form.Item>

            <Form.Item>
              <div className="col-xl-12 mb-3 d-grid justify-content-center">
                <Button type="submit">SUBMIT</Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};
const enhancer = connect((state) => ({}), {
  getCreateBatch: tenantActions.getCreateBatch,
  getAllBatches: tenantActions.getAllBatches,
});
export default enhancer(FhirDrawer);
