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
import React, { useEffect, useState } from "react";
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
  getProvider,
  allProviderList,
  existingDos,
  getExistingDos,
}) => {
  const [btnName, setBtnName] = useState(null);
  const [providerOptions, setProviderOptions] = useState([]);
const [dosExistsError, setDosExistsError] = useState(null);

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

    const patientId = getStorage("patientId");

    const formDos = dayjs(values.dateOfService).format("YYYY-MM-DD");
    const originalDos = providersLists?.dateOfService
      ? dayjs(providersLists.dateOfService).format("YYYY-MM-DD")
      : null;

    const data = {
      patientId,
      ...values,
      dateOfService: originalDos || formDos,
      fileId: providersLists?.fileId || customFileId || "",
      faceToFace:
        values.faceToFace === true || values.faceToFace === "Yes"
          ? true
          : values.faceToFace === false || values.faceToFace === "No"
          ? false
          : undefined,
    };

    if (originalDos && originalDos !== formDos) {
      data.newDateOfService = formDos;
    }

    const isSameDate = originalDos && originalDos === formDos;

    const dosExists =
      providersList && isSameDate
        ? false
        : dosAndProvidersList?.some((item) => item?.dateOfService === formDos);

    if (!dosExists) {
      const res = await getAddProviderAndDOS(data);
      if (res.status === "SUCCESS") {
        setBtnName(null);
        patientDetailsLoad(true);
        getResponePopup(res);
        const year = dosYear?.[0]?.value || "";
        getAddProviderAndDOSList({ year });
        dosDeatilsAction(patientId, dosYear?.[0]?.value || "");
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
  };
  const handleCheckboxChange = (changedField, checked) => {
    if (checked) {
      const newValues = {
        physicianSignaturePresent: false,
        physicianNotPresent: false,
        [changedField]: true,
      };
      form.setFieldsValue(newValues);
    }
  };
  const customDisableDate = (current) => {
    const year = dosYearDefalutSelect?.value || dosYearDefalutSelect;
    return current.year() !== year;
  };
  useEffect(() => {
    getProvider();
  }, []);

  // useEffect(() => {
  //   getExistingDos({dos});
  // }, []);

  useEffect(() => {
    if (Array.isArray(allProviderList)) {
      const names = allProviderList
        .map((item) => item?.providerName)
        .filter((name) => !!name);
      setProviderOptions(names);
    }
  }, [allProviderList]);

  console.log(existingDos, "existingDos");
  return (
    <div>
      <div className={style.formContainer} id="manuallyAdd-container">
        <Form
          id="manuallyAddForm"
          name="manuallyAddForm"
          form={form}
          onFinish={(values) => AddProvider(values, providersList)}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label={<label className={style.dateField}>Date Of Service</label>}
            name="dateOfService"
            rules={[{ required: true, message: "Please Enter DOS" }]}
            className="manuallyAddPicker"
          >
           
            <DatePicker
              format="MM-DD-YYYY"
              disabledDate={customDisableDate}
              defaultPickerValue={dayjs(
                `${dosYearDefalutSelect?.value || dosYearDefalutSelect}-01-01`
              )}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              onChange={async (date) => {
                setDosExistsError(null);

                const selectedDos = dayjs(date).format("YYYY-MM-DD");
                const originalDos = providersList?.dateOfService
                  ? dayjs(providersList.dateOfService).format("YYYY-MM-DD")
                  : null;

                try {
                  // If same DOS selected again (while editing), skip the API
                  if (originalDos && selectedDos === originalDos) {
                    form.setFields([
                      {
                        name: "dateOfService",
                        errors: [],
                      },
                    ]);
                    return;
                  }

                  const res = await getExistingDos({
                    dos: originalDos || selectedDos, // for edit, send original
                    newDos: originalDos ? selectedDos : undefined, // send new only if edit mode
                  });

                  if (res?.response === true) {
                    setDosExistsError("Date of Service already exists");
                    form.setFields([
                      {
                        name: "dateOfService",
                        errors: ["Date of Service already exists"],
                      },
                    ]);
                  } else {
                    setDosExistsError(null);
                    form.setFields([
                      {
                        name: "dateOfService",
                        errors: [],
                      },
                    ]);
                  }
                } catch (err) {
                  console.error("Error checking DOS existence", err);
                }
              }}
            />
          </Form.Item>

          <Form.Item
            label={<label className={style.dateField}>DOS Substring</label>}
            name="dosSubstring"
            rules={[{ required: true, message: "Please Enter DOS Substring" }]}
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

          <Form.Item
            label={<label className={style.dateField}>Face To Face</label>}
            name="faceToFace"
            rules={[
              { required: true, message: "Please select Face To Face option" },
            ]}
          >
            <Select
              placeholder="Select Face To Face"
              style={{ height: "42px" }}
            >
              <Select.Option value={true}>Yes</Select.Option>
              <Select.Option value={false}>No</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<label className={style.dateField}>Visit Type</label>}
            name="visitType"
            rules={[{ required: true, message: "Please select Visit Type" }]}
          >
            <Select placeholder="Select Visit Type" style={{ height: "42px" }}>
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
            label={<label className={style.dateField}>Reviewer Comments</label>}
            name="reviewerComments"
            rules={[
              { required: true, message: "Please enter Reviewer Comments" },
            ]}
          >
            <Input.TextArea rows={3} placeholder="Enter Reviewer Comments" />
          </Form.Item>

          <Form.Item
            label={<label className={style.dateField}>Physician Inquiry</label>}
            name="physicianInquiry"
            rules={[
              { required: true, message: "Please enter Physician Inquiry" },
            ]}
          >
            <Input.TextArea rows={3} placeholder="Enter Physician Inquiry" />
          </Form.Item>

          <Form.Item name="physicianSignaturePresent" valuePropName="checked">
            <Checkbox
              onChange={(e) =>
                handleCheckboxChange(
                  "physicianSignaturePresent",
                  e.target.checked
                )
              }
            >
              <span className={style.dateField}>
                Physician Signature Present
              </span>
            </Checkbox>
          </Form.Item>

          <Form.Item name="physicianNotPresent" valuePropName="checked">
            <Checkbox
              onChange={(e) =>
                handleCheckboxChange("physicianNotPresent", e.target.checked)
              }
            >
              <span className={style.dateField}>Physician Not Present</span>
            </Checkbox>
          </Form.Item>

          {/* <Form.Item
            label={<label className={style.dateField}>Provider Name</label>}
            name="providerName"
            rules={[{ required: true, message: "Please Enter Provider" }]}
          >
            <Input placeholder="Provider Name" />
          </Form.Item> */}

          <Form.Item
            label={<label className={style.dateField}>Provider Name</label>}
            name="providerName"
            rules={[{ required: true, message: "Please Select Provider" }]}
          >
            <Select
              placeholder="Select Provider Name"
              showSearch
              optionFilterProp="children"
              style={{ height: "42px" }}
            >
              {providerOptions.map((provider, index) => (
                <Select.Option key={index} value={provider}>
                  {provider}
                </Select.Option>
              ))}
            </Select>
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

          {/* <Form.Item
            label={
              <label className={style.dateField}>Provider Sign Status</label>
            }
            name="isProviderSigned"
          >
            <Switch />
          </Form.Item> */}

          <Form.Item
            label={<label className={style.dateField}>File Type</label>}
            name="fileType"
            rules={[{ required: true, message: "Please Select File Type" }]}
          >
            <Radio.Group>
              <Radio
                value={"LAB"}
                disabled={
                  !patientDetailsResult?.fileInfos?.length &&
                  !providersList?.fileType
                }
              >
                Lab
              </Radio>
              <Radio
                value={"RADIOLOGY"}
                disabled={
                  !patientDetailsResult?.fileInfos?.length &&
                  !providersList?.fileType
                }
              >
                Radiology
              </Radio>
              <Radio value={"CHART"}>Chart</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item className="d-flex justify-content-center">
            <Button
              htmlType="submit"
              type="primary"
              className="btn btn-sm ms-2 flr width-max-content custom-btn-style"
              disabled={!!btnName}
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
    allProviderList:
      state?.patientDetails?.details?.providerList?.data?.response,
    existingDos: state?.patientDetails?.details?.existingDos,
  }),
  {
    getAddProviderAndDOS: allActions.getAddProviderAndDOS,
    getAddProviderAndDOSList: allActions.getAddProviderAndDOSList,
    dosDeatilsAction: allActions.dosDeatilsAction,
    getpatientDetailsData: allActions.patientDetailsAction,
    patientDetailsLoad: allActions.patientDetailsLoad,
    getProvider: allActions.getProviderList,
    getExistingDos: allActions.getDosExist,
  }
);

export default connector(AddForm);
