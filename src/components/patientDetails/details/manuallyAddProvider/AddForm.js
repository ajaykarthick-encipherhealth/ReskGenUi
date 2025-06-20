import {
  Button,
  Checkbox,
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
          {/* Extra Fields*/}
          <Form.Item
            id="face-to-face-manually-add"
            label={<label className={style.dateField}>Face To Face</label>}
            name="faceToFace"
            rules={[
              { required: true, message: "Please select Face To Face option" },
            ]}
          >
            <Select
              placeholder="Select Face To Face"
              data-testid="faceToFace-select"
            >
              <Select.Option value={true}>Yes</Select.Option>
              <Select.Option value={false}>No</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            id="visit-type-manually-add"
            label={<label className={style.dateField}>Visit Type</label>}
            name="visitType"
            rules={[{ required: true, message: "Please select Visit Type" }]}
          >
            <Select
              placeholder="Select Visit Type"
              data-testid="visitType-select"
            >
              <Select.Option value="LAB">LAB</Select.Option>
              <Select.Option value="EEG">EEG</Select.Option>
              <Select.Option value="EKG">EKG</Select.Option>
              <Select.Option value="INPATIENT">INPATIENT</Select.Option>
              <Select.Option value="CONSULT">CONSULT</Select.Option>
              <Select.Option value="SURGERY">SURGERY</Select.Option>
              <Select.Option value="NURSE">NURSE</Select.Option>
              <Select.Option value="OFFICE">OFFICE</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            id="reviewer-comments-manually-add"
            label={<label className={style.dateField}>Reviewer Comments</label>}
            name="reviewerComments"
            rules={[
              { required: true, message: "Please enter Reviewer Comments" },
            ]}
          >
            <Input.TextArea
              data-testid="reviewerComments-textarea"
              placeholder="Enter Reviewer Comments"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            id="physician-enquiry-manually-add"
            label={<label className={style.dateField}>Physician Inquiry</label>}
            name="physicianInquiry"
            rules={[
              { required: true, message: "Please enter Physician Inquiry" },
            ]}
          >
            <Input.TextArea
              data-testid="physicianInquiry-textarea"
              placeholder="Enter Physician Inquiry"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            id="physician-signature-present"
            name="physicianSignaturePresent"
            valuePropName="checked"
          >
            <Checkbox data-testid="physicianSignaturePresent-checkbox">
              <span className={style.dateField}>
                Physician Signature Present
              </span>
            </Checkbox>
          </Form.Item>

          <Form.Item
            id="physician-not-present"
            name="physicianNotPresent"
            valuePropName="checked"
          >
            <Checkbox data-testid="physicianNotPresent-checkbox">
              <span className={style.dateField}>Physician Not Present</span>
            </Checkbox>
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
