import { Button, DatePicker, Form, Input, Radio, Select, Switch } from "antd";
import React from "react";
import style from "./styles.module.css";
import { getStorage } from "../../../../utils/storages";
import { connect } from "react-redux";
import { actions as allActions } from "../../../../stores/patient/details";
import { disableFutureDate } from "../../../headerFilters/functions";
import dayjs from "dayjs";
import { getResponePopup } from "../../../../utils/reusable";
const AddForm = ({
  form,
  selectDosValue,
  providersList,
  patientDetailsResult,
  getAddProviderAndDOS,
  dosYear,
  getAddProviderAndDOSList,
  dosDeatilsAction
}) => {
  const validateThreeDigitNumber = (_, value) => {
    if (!value || /^\d{1,3}$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Please enter a valid page number"));
  };

  const AddProvider = async (values, providersList) => {
    const customFileId =
      values?.fileType === "CHART"
        ? patientDetailsResult?.fileId
        : patientDetailsResult?.fileInfos?.find(
            (data) => data?.stateIndicator === values?.fileType
          )?.fileId;
    // const customFileId =
    //   patientDetailsResult?.fileInfos?.length > 0
    //     ? patientDetailsResult?.fileInfos?.find(
    //         (data) => data?.stateIndicator === values?.fileType
    //       )?.fileId
    //     : patientDetailsResult?.fileId;
    const patientId = getStorage("patientId");
    const data = {
      patientId: patientId,
      ...values,
      dos: dayjs(values.dos).format("YYYY-MM-DD"),
      fileId: providersList ? providersList?.fileId : customFileId || "",
    };

    const res = await getAddProviderAndDOS(data);
    if (res.status == "SUCCESS") {
      getResponePopup(res);
      getAddProviderAndDOSList(dosYear?.length > 0 ? dosYear[0]?.value : "");
      dosDeatilsAction(patientId,dosYear?.length > 0 ? dosYear[0]?.value : "")
      form.resetFields();
    }
  };

  return (
    <div>
      {/* {showAddForm ? (
        <>
          <div className="d-flex justify-content-between">
            <label
              className={`${style.dateField} d-flex justify-content-center align-items-center`}
            >
              DOS
            </label>
            <Button
              className={style.cancelBtn}
              onClick={() => {
                setShowAddForm(false);
              }}
            >
              cancel
            </Button>
          </div>
          <div className="providerAddPicker">
            <DatePicker
              defaultValue={dayjs("05-20-2017", dateFormat)}
              format={dateFormat}
              suffixIcon={false}
              value={selectedDate ? dayjs(selectedDate, dateFormat) : ""}
              style={{ border: "1px solid #8888" }}
              onChange={handleDatePicker}
              className="providerAddPicker"
            />
          </div>
          <div className={style.formContainer}>
            <Form
              form={form}
              onFinish={AddProvider}
              layout="vertical"
              autoComplete="off"
            >
              <Form.Item
                label={<label className={style.dateField}>Provider Name</label>}
                name="providerName"
                rules={[
                  { required: true, message: " Please Enter Provider name" },
                ]}
              >
                <Input placeholder="Enter Provider name" />
              </Form.Item>
              <Form.Item
                label={<label className={style.dateField}>Page Number</label>}
                name="pageNumber"
                rules={[
                  { required: true, message: "Please enter page number" },
                  { validator: validateThreeDigitNumber },
                ]}
              >
                <Input maxLength={3} placeholder="Enter Page Number" />
              </Form.Item>
              <Form.Item className="d-flex justify-content-center">
                <Button htmlType="submit" type="primary">
                  ADD
                </Button>
              </Form.Item>
            </Form>
            <div className={`row`} style={{ padding: "0px 10px" }}>
              {viewProvidersList({
                list: providersList,
                isDeletable: true,
                handleDelete: handleDelete,
              })}
            </div>
            {providersList?.length > 0 && (
              <div className="d-flex justify-content-center mt-4">
                <Tooltip title={selectedDate ? "" : "Please Select Date"}>
                  <Button
                    type="primary"
                    onClick={submitProviderForm}
                    disabled={selectedDate ? false : true}
                  >
                    Submit
                  </Button>
                </Tooltip>
              </div>
            )}
          </div>
        </>
      ) : (
        <Button
          type="primary"
          onClick={() => {
            setShowAddForm(!showAddForm);
          }}
        >
          Add
        </Button>
      )} */}
      <div className={style.formContainer}>
        <Form
          form={form}
          onFinish={AddProvider}
          layout="vertical"
          autoComplete="off"
        >
          {/* dos */}
          <Form.Item
            label={<label className={style.dateField}>Date Of Service</label>}
            name="dos"
            rules={[
              {
                required: true,
                message: "Please Enter DOS",
              },
            ]}
            className="manuallyAddPicker"
          >
            <DatePicker
              disabledDate={(current) => disableFutureDate(current)}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            />
          </Form.Item>
          <Form.Item
            label={<label className={style.dateField}>DOS Substring</label>}
            name="dosSubstring"
            rules={[
              {
                required: true,
                message: "Please Enter DOS Substring",
              },
            ]}
          >
            <Input placeholder="DOS Substring" />
          </Form.Item>
          <Form.Item
            label={
              <label className={style.dateField}>DOS Start Page Number</label>
            }
            name="dosStartPageNumber"
            rules={[
              { required: true, message: "Please enter DOS Start Page Number" },
              { validator: validateThreeDigitNumber },
            ]}
          >
            <Input maxLength={3} placeholder="DOS Start Page Number" />
          </Form.Item>
          <Form.Item
            label={
              <label className={style.dateField}>DOS End Page Number</label>
            }
            name="dosEndPageNumber"
            rules={[
              { required: true, message: "Please enter DOS End Page Number" },
              { validator: validateThreeDigitNumber },
            ]}
          >
            <Input maxLength={3} placeholder="DOS End Page Number" />
          </Form.Item>
          {/* provider */}
          <Form.Item
            label={<label className={style.dateField}>Provider Name</label>}
            name="providerName"
            rules={[{ required: true, message: "Please Enter Provider" }]}
          >
            <Input placeholder="Provider Name" />
          </Form.Item>
          <Form.Item
            label={
              <label className={style.dateField}>Provider Page Number</label>
            }
            name="providerPageNumber"
            rules={[
              { required: true, message: "Please enter Provider Page Number" },
              { validator: validateThreeDigitNumber },
            ]}
          >
            <Input maxLength={3} placeholder="Provider Page Number" />
          </Form.Item>
          <Form.Item
            label={
              <label className={style.dateField}>Provider Credentials</label>
            }
            name="providerCredentials"
            rules={[
              { required: true, message: "Please Enter Provider Credentials" },
            ]}
          >
            <Input placeholder="Provider Credentials" />
          </Form.Item>
          <Form.Item
            label={
              <label className={style.dateField}>Provider Reference</label>
            }
            name="providerReference"
            rules={[
              { required: true, message: "Please enter Provider Reference" },
            ]}
          >
            <Input placeholder="Provider Reference" />
          </Form.Item>
          <Form.Item
            label={
              <label className={style.dateField}>Provider Sign Status</label>
            }
            name="isProviderSigned"
            rules={[
              { required: true, message: "Please Switch Provider Sign Status" },
            ]}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label={<label className={style.dateField}>File Type</label>}
            name="fileType"
            rules={[{ required: true, message: "Please Select File Type" }]}
          >
            <Radio.Group>
              <Radio
                value={"LAB"}
                disabled={
                  patientDetailsResult?.fileInfos?.length > 0 &&
                  providersList?.fileType
                    ? false
                    : true
                }
              >
                Lab
              </Radio>
              <Radio
                value={"RADIOLOGY"}
                disabled={
                  patientDetailsResult?.fileInfos?.length > 0 &&
                  providersList?.fileType
                    ? false
                    : true
                }
              >
                Radiology
              </Radio>
              <Radio value={"CHART"}>Chart</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item className="d-flex justify-content-center">
            <Button htmlType="submit" type="primary">
              {providersList ? "UPDATE" : "ADD"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

const connector = connect(
  (state) => ({
    patientDetailsResult:
      state?.patientDetails?.details?.patientResult?.data?.response,
  }),
  {
    getAddProviderAndDOS: allActions.getAddProviderAndDOS,
    getAddProviderAndDOSList: allActions.getAddProviderAndDOSList,
    dosDeatilsAction: allActions.dosDeatilsAction,
  }
);
export default connector(AddForm);
