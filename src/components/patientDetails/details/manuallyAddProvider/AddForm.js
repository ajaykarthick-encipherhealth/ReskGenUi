import {
  Button,
  DatePicker,
  Form,
  Input,
  notification,
  Radio,
  Select,
  Switch,
} from "antd";
import React, { useState } from "react";
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
  dosDeatilsAction,
  selectedDosValue,
  dosAndProvidersList,
  dosYearDefalutSelect,
  getpatientDetailsData,
  patientDetailsLoad,
}) => {
  const [btnName, setBtnName] = useState(null);
  const validateThreeDigitNumber = (_, value) => {
    if (!value || /^\d{1,3}$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Please enter a valid page number"));
  };

  const AddProvider = async (values, providersLists) => {
    setBtnName("LOADING...");
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
      fileId: providersLists ? providersLists?.fileId : customFileId || "",
    };

    if (data?.dos) {
      const result = providersList
        ? false
        : dosAndProvidersList?.some(
            (item) => item?.dateOfService === data?.dos
          );
      if (!result) {
        const res = await getAddProviderAndDOS(data);
        if (res.status == "SUCCESS") {
          setBtnName(null);
          patientDetailsLoad(true);
          getResponePopup(res);
          getAddProviderAndDOSList(
            dosYear?.length > 0 ? dosYear[0]?.value : ""
          );
          dosDeatilsAction(
            patientId,
            dosYear?.length > 0 ? dosYear[0]?.value : ""
          );
          getpatientDetailsData(
            patientId,
            patientDetailsResult?.processedYear,
            patientDetailsResult?.dateOfService,
            "",
            ""
          );
          patientDetailsLoad(false);
          form.resetFields();
        } else {
          setBtnName(null);
          getResponePopup(res);
        }
      } else {
        setBtnName(null);
        return notification.warning({
          description: "DOS already exists",
          duration: 2,
        });
      }
    }
  };
  const customDisableDate = (current) => {
    const year = dosYearDefalutSelect?.value || dosYearDefalutSelect;
    return current.year() !== year;
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
      <div
        className={style.formContainer}
        id="manuallyAdd-container"
        name="manuallyAdd-container"
      >
        <Form
          id="manuallyAddForm"
          name="manuallyAddForm"
          form={form}
          onFinish={AddProvider}
          layout="vertical"
          autoComplete="off"
        >
          {/* dos */}
          <Form.Item
            id="manuallyAddDos"
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
              format="MM-DD-YYYY"
              data-testid="providersList-dateOfService"
              disabledDate={customDisableDate}
              defaultPickerValue={dayjs(
                `${dosYearDefalutSelect?.value || dosYearDefalutSelect}-01-01`
              )}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              disabled={providersList?.dateOfService ? true : false}
            />
          </Form.Item>
          <Form.Item
            id="dosSubstring-manually-add"
            label={<label className={style.dateField}>DOS Substring</label>}
            name="dosSubstring"
            rules={[
              {
                required: true,
                message: "Please Enter DOS Substring",
              },
            ]}
          >
            <Input
              data-testid="providersList-dosSubstring"
              placeholder="DOS Substring"
              disabled={providersList?.dosSubstring ? true : false}
            />
          </Form.Item>
          <Form.Item
            id="dosStartPageNumber-manually-add"
            label={
              <label className={style.dateField}>DOS Start Page Number</label>
            }
            name="dosStartPageNumber"
            rules={[
              { required: true, message: "Please enter DOS Start Page Number" },
              { validator: validateThreeDigitNumber },
            ]}
          >
            <Input
              data-testid="providersList-dosStartPageNumber"
              maxLength={3}
              placeholder="DOS Start Page Number"
              disabled={providersList?.dosStartPageNumber ? true : false}
            />
          </Form.Item>
          <Form.Item
            id="dosEndPageNumber-manually-add"
            label={
              <label className={style.dateField}>DOS End Page Number</label>
            }
            name="dosEndPageNumber"
            rules={[
              { required: true, message: "Please enter DOS End Page Number" },
              { validator: validateThreeDigitNumber },
            ]}
          >
            <Input
              data-testid="providersList-dosEndPageNumber"
              maxLength={3}
              placeholder="DOS End Page Number"
              disabled={providersList?.dosEndPageNumber ? true : false}
            />
          </Form.Item>
          {/* provider */}
          <Form.Item
            id="manuallyAddProviderName"
            label={<label className={style.dateField}>Provider Name</label>}
            name="providerName"
            rules={[{ required: true, message: "Please Enter Provider" }]}
          >
            <Input
              data-testid="providersList-providerName"
              placeholder="Provider Name"
            />
          </Form.Item>
          <Form.Item
            id="manuallyAddProviderPageNumber"
            label={
              <label className={style.dateField}>Provider Page Number</label>
            }
            name="providerPageNumber"
            rules={[
              { required: true, message: "Please enter Provider Page Number" },
              { validator: validateThreeDigitNumber },
            ]}
          >
            <Input
              data-testid="providersList-providerName-page-number"
              maxLength={3}
              placeholder="Provider Page Number"
            />
          </Form.Item>
          <Form.Item
            id="mauallyAddProviderCredentials"
            label={
              <label className={style.dateField}>Provider Credentials</label>
            }
            name="providerCredentials"
            rules={[
              { required: true, message: "Please Enter Provider Credentials" },
            ]}
          >
            <Input
              data-testid="providerList-providerCredentials"
              placeholder="Provider Credentials"
            />
          </Form.Item>
          <Form.Item
            id="manuallyAddProviderReference"
            label={
              <label className={style.dateField}>Provider Reference</label>
            }
            name="providerReference"
            rules={[
              { required: true, message: "Please enter Provider Reference" },
            ]}
          >
            <Input
              data-testid="providerList-providerReference"
              placeholder="Provider Reference"
            />
          </Form.Item>
          <Form.Item
            id="manuallyAddProviderSignStatus"
            label={
              <label className={style.dateField}>Provider Sign Status</label>
            }
            name="isProviderSigned"
            // rules={[
            //   { required: true, message: "Please Switch Provider Sign Status" },
            // ]}
          >
            <Switch data-testid="providerList-isProviderSigned" />
          </Form.Item>
          <Form.Item
            id="manuallyAddFiletype"
            label={<label className={style.dateField}>File Type</label>}
            name="fileType"
            rules={[{ required: true, message: "Please Select File Type" }]}
          >
            <Radio.Group>
              <Radio
                data-testid="providerList-Lab"
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
                data-testid="providerList-Radiology"
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
              <Radio data-testid="providerList-Chart" value={"CHART"}>
                Chart
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            className="d-flex justify-content-center"
            id="manuallyAddProvider-submit"
          >
            <Button
              data-testid="providerList-submit"
              htmlType="submit"
              type="primary"
              className="btn btn-sm ms-2 flr width-max-content custom-btn-style"
              disabled={btnName ? true : false}
            >
              {btnName ? btnName : providersList ? "UPDATE" : "ADD"}
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
    dosAndProvidersList:
      state.patientDetails?.details?.dosAndProvidersList?.data?.response,
  }),
  {
    getAddProviderAndDOS: allActions.getAddProviderAndDOS,
    getAddProviderAndDOSList: allActions.getAddProviderAndDOSList,
    dosDeatilsAction: allActions.dosDeatilsAction,
    getpatientDetailsData: allActions.patientDetailsAction,
    patientDetailsLoad: allActions.patientDetailsLoad,
  }
);
export default connector(AddForm);
