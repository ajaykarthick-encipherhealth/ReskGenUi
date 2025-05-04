import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { Button, Drawer, Form, Input, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { actions as patientSyncAction } from "../../../../stores/tenantAdmin/patientSync";
import { getResponePopup } from "../../../../utils/reusable";
import { priorityOptions } from "../../../../components/headerFilters/functions";
import modalStyle from "../../../../pages/tenantadmin/allocateduser/allocate/style.module.css";

const RoasterDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  reportActiveTab,
  providerRoasterExcel,
  practiceRoasterExcel,
  patientRoasterExcel,
  tinRoasterExcel,
  reUpload,
  getProviderRoaster,
  getPatientRoaster,
  getTinRoaster,
  getPracticeRoaster,
  pageNumber,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState([]);

  const onClose = () => {
    setIsDrawerOpen(false);
    form.resetFields();
  };
  const onFinish = async (formVal) => {
    try {
      const file = formVal.excelFile?.originFileObj;
      if (!file) {
        message.error("No file selected.");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("priority", formVal.priority);
      if (reUpload) formData.append("retryId", reUpload);

      const uploadActions = {
        "Provider Roaster": {
          postApi: providerRoasterExcel,
          getApi: getProviderRoaster,
        },
        "Practice Roaster": {
          postApi: practiceRoasterExcel,
          getApi: getPracticeRoaster,
        },
        "Patient Roaster": {
          postApi: patientRoasterExcel,
          getApi: getPatientRoaster,
        },
        "Tin Roaster": {
          postApi: tinRoasterExcel,
          getApi: getTinRoaster,
        },
      };

      const action = uploadActions[reportActiveTab];
      if (action) {
        const res = await action.postApi({ obj: formData });
        if (res?.status === "SUCCESS") {
          getResponePopup(res);
          action.getApi({ pageNo: pageNumber });
          onClose();
        } else {
          getResponePopup(res);
          action.getApi({ pageNo: pageNumber });
          onClose();
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file) => {
    const isExcel =
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel";
    if (!isExcel) {
      message.error("You can only upload Excel files!");
    }
    return isExcel || Upload.LIST_IGNORE;
  };
  const handleChange = (value) => {
    setPriority(value);
  };
  return (
    <Drawer
      title={"Add Roaster Details"}
      width={450}
      onClose={onClose}
      open={isDrawerOpen}
      style={{ padding: "10px" }}
    >
      <div className="container-fluid pt-4">
        <Form
          autoComplete="off"
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label={
              <label>
                Priority <span className="text-danger">*</span>
              </label>
            }
            name="priority"
            rules={[
              {
                required: true,
                message: "Please select a priority",
              },
            ]}
          >
            <Select
              id="select-priority"
              className={modalStyle.prioritySelect}
              options={priorityOptions}
              placeholder="Set priority"
              onChange={handleChange}
              value={priority}
            />
          </Form.Item>

          <Form.Item
            label="Upload Excel File"
            name="excelFile"
            valuePropName="file"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e && e.fileList.length ? e.fileList[0] : null;
            }}
            rules={[{ required: true, message: "Please upload an Excel file" }]}
          >
            <Upload
              beforeUpload={beforeUpload}
              maxCount={1}
              showUploadList={true}
              customRequest={({ file, onSuccess }) => {
                setTimeout(() => {
                  onSuccess("ok");
                }, 0);
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <div className="col-xl-12 mb-3 mt-4 d-grid justify-content-center">
              <Button
                className="btn btn-sm ms-2 flr width-max-content custom-btn-style"
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
              >
                <span className="p-2">Upload</span>
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Drawer>
  );
};

const enhancer = connect((state) => ({}), {
  providerRoasterExcel: patientSyncAction.providerRoasterExcelAction,
  practiceRoasterExcel: patientSyncAction.practiceRoasterExcelAction,
  patientRoasterExcel: patientSyncAction.patientRoasterExcelAction,
  tinRoasterExcel: patientSyncAction.tinRoasterExcelAction,
  // getProviderRoaster: patientSyncAction.providerRoasterAction,
  // getPatientRoaster: patientSyncAction.patientRoasterAction,
  // getPracticeRoaster: patientSyncAction.praticeRoasterAction,
  // getTinRoaster: patientSyncAction.tinRoasterAction,
});
export default enhancer(RoasterDrawer);
