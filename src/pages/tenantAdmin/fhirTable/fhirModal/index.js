import React from "react";
import { Offcanvas, Button } from "react-bootstrap";
import { actions as tenantActions } from "../../../../stores/tenantAdmin";
import { connect } from "react-redux";
import { Form, Input, Select } from "antd";
import { getYears } from "../../../../utils/reusable";
import UploadFile from "../uploadFile";
import { useSelector } from "react-redux";
import { useState } from "react";

const FhirDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  uploadType,
  fileList,
  setFileList,
  getCreateBatch,
  getAllBatches,
  getUploadFile,
  selectedBatch,
  setSelectedBatch,
}) => {
  const [form] = Form.useForm();
  const [fileErr, setFileErr] = useState(false);
  const handleClose = () => {
    setIsDrawerOpen(false);
    if (setSelectedBatch()) {
      setSelectedBatch();
    }
  };
  const reportActiveTab = useSelector((state) => state.AuditReport?.activetab);
  const onFinish = async (formVal) => {
    if (reportActiveTab === "PDF") {
      if (uploadType !== "upload") {
        const res = await getCreateBatch({ info: formVal });
        if (res.status === "SUCCESS") {
          await getAllBatches({ page: 0 });
          form.resetFields();
        }
      } else {
        if (fileList?.length > 0) {
          setFileErr(true);
        }
        try {
          const responses = [];
          for (const item of fileList) {
            const res = await getUploadFile({
              info: {
                batchId: selectedBatch?.id,
                yearOfServices: formVal?.yearOfService,
                file:item
                //  {
                //   lastModified: item.lastModified,
                //   lastModifiedDate: item?.lastModifiedDate,
                //   name: item?.name,
                //   size: item?.size,
                //   type: item?.type,
                //   webkitRelativePath: "",
                // },
              },
            });
            responses.push(res);

            if (res.status === "SUCCESS") {
              await getAllBatches({ page: 0 });
              setFileErr(false);
              form.resetFields();
            }
          }
          console.log(responses);
        } catch (err) {
          console.error("Error uploading files:", err);
        }
      }
    }
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
                // rules={[
                //   {
                //     required:filelList?.length>0?false: true,
                //     message: "Please Enter Upload File ",
                //   },
                // ]}
              >
                <UploadFile
                  filelList={fileList}
                  setFileList={setFileList}
                  setFileErr={setFileErr}
                />
                {/* {!fileErr && (
                  <span className="text-red">Please upload the files</span>
                )} */}
              </Form.Item>
            )}
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
  getUploadFile: tenantActions.getUploadFile,
});
export default enhancer(FhirDrawer);
