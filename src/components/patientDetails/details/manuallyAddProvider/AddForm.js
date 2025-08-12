import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  notification,
  Radio,
  Select,
  Spin,
  Switch,
} from "antd";
import React, { useEffect, useState } from "react";
import style from "./styles.module.css";
import { getLocalStored } from "../../../../utils/storages";
import { connect } from "react-redux";
import { actions as allActions } from "../../../../stores/patient/details";
import { disableFutureDate } from "../../../headerFilters/functions";
import dayjs from "dayjs";
import { getResponePopup } from "../../../../utils/reusable";
import { actions as tinActions } from "../../../../stores/tenantAdmin/tin";

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
  allCredentialList,
  getCredentials,
  getProviderNameLoad,
  getExistingDos,
  getSelectedDos,
  year,
  setSelectDosValue,
  getProviderNPIList,
  getProviderNameList,
  isTrashView,
}) => {
  const [btnName, setBtnName] = useState(null);
  const [providerOptions, setProviderOptions] = useState([]);
  const [credentialOptions, setCredentialOptions] = useState([]);
  const [dosExistsError, setDosExistsError] = useState(null);
  const { patientId = null } = getLocalStored();
  const [opt, setOpt] = useState([]);

  const validateThreeDigitNumber = (_, value) => {
    const number = Number(value);
    if (!value || (/^\d{1,3}$/.test(value) && number > 0)) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error("Please enter a valid positive number (1-999)")
    );
  };
  const noWhitespaceOnly = (_, value) => {
    if (!value || value.trim() === "") {
      return Promise.reject(
        new Error("Reference cannot be empty or just spaces")
      );
    }
    if (/^\s/.test(value)) {
      return Promise.reject(new Error("Reference cannot start with a space"));
    }
    return Promise.resolve();
  };

  const AddProvider = async (values, providersLists) => {
    setBtnName("LOADING...");
    const customFileId =
      values?.fileType === "CHART"
        ? patientDetailsResult?.fileId
        : patientDetailsResult?.fileInfos?.find(
            (data) => data?.stateIndicator === values?.fileType
          )?.fileId;

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
      providerNpi: values?.providerNpi || "",
      providerName: values?.providerName?.key
        ? values?.providerName?.key
        : values?.providerName || "",
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
        getAddProviderAndDOSList({ year });
        dosDeatilsAction(patientId, year);
        setSelectDosValue(
          data?.newDateOfService ? data.newDateOfService : data?.dateOfService
        );
        getpatientDetailsData(
          patientId,
          patientDetailsResult?.processedYear,
          data?.newDateOfService ? data.newDateOfService : data?.dateOfService,
          "",
          ""
        );
        getSelectedDos(
          data?.newDateOfService ? data.newDateOfService : data?.dateOfService
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
  const physicianSignaturePresent = Form.useWatch("physicianNotPresent", form);
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
  const handleChanges = async (e) => {
    const value = e.target.value || "";
    if (value.length !== 10 || value.includes(" ")) {
      form.setFieldsValue({ providerName: null });
      setOpt([]);
      return;
    }
    if (value?.length === 10 && !value.includes(" ")) {
      try {
        const res = await getProviderNPIList({ obj: { number: value } });
        if (res?.status === "SUCCESS" && res?.response?.basic) {
          const { firstName, lastName } = res.response.basic;
          if (firstName && lastName) {
            form.setFieldsValue({
              providerName: `${firstName} ${lastName}`,
            });
          } else {
            form.setFieldsValue({
              providerName: null,
            });
          }
        } else {
          form.setFieldsValue({
            providerName: null,
          });
        }
      } catch (error) {
        form.setFieldsValue({
          providerName: null,
        });
      }
    }
  };

  const handleChange = async (value, key) => {
    const isFirstName = key === "firstName";
    if (isFirstName && value.length > 2) {
      try {
        const res = await getProviderNameList({
          firstName: isFirstName ? value : "",
        });
        if (res?.status === "SUCCESS") {
          const data = res?.response?.npiResponseDtoList?.map((item) => ({
            label: `${item.basic.firstName} ${item.basic.lastName}`,
            value: `${item.basic.firstName} ${item.basic.lastName}`,
            number: item.number,
          }));
          setOpt(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch provider names:", error);
      }
    } else {
      setOpt([]);
    }
  };
  const customDisableDate = (current) => {
    const year = dosYearDefalutSelect?.value || dosYearDefalutSelect;
    return current.year() !== year;
  };
  useEffect(() => {
    getProvider();
  }, []);
  useEffect(() => {
    getCredentials();
  }, []);

  useEffect(() => {
    if (Array.isArray(allProviderList)) {
      const names = allProviderList
        .map((item) => item?.providerName)
        .filter((name) => !!name);
      setProviderOptions(names);
    }
  }, [allProviderList]);

  useEffect(() => {
    if (Array.isArray(allCredentialList)) {
      const names = allCredentialList
        .map((item) => item?.credentials)
        .filter((name) => !!name);
      setCredentialOptions(names);
    }
  }, [allCredentialList]);
  return (
    <div>
      <div className={style.formContainer} id="manuallyAdd-container">
        <Form
          id="manuallyAddForm"
          name="manuallyAddForm"
          form={form}
          onFinish={(values) => AddProvider(values, providersList)}
          onFinishFailed={({ errorFields }) => {
            if (errorFields?.length) {
              notification.warning({
                message: "Form Incomplete",
                description:
                  "Please fill all the required fields before submitting.",
                duration: 2,
              });
            }
          }}
          layout="vertical"
          autoComplete="off"
          initialValues={{
            faceToFace: true,
            visitType: "OFFICE",
          }}
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
                    dos: originalDos || selectedDos,
                    newDos: originalDos ? selectedDos : undefined,
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
            rules={[
              { required: true, message: "Please Enter DOS Substring" },
              { validator: noWhitespaceOnly },
            ]}
          >
            <Input placeholder="DOS Substring" />
          </Form.Item>

          <Form.Item
            label={
              <label className={style.dateField}>DOS Start Page Number</label>
            }
            maxLength={3}
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
            maxLength={3}
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
            initialValue={true}
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
            initialValue={true}
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
            // rules={[
            //   { required: true, message: "Please enter Reviewer Comments" },
            // ]}
          >
            <Input.TextArea rows={3} placeholder="Enter Reviewer Comments" />
          </Form.Item>
          <Form.Item
            label={<label className={style.dateField}>Physician Inquiry</label>}
            name="physicianInquiry"
            // rules={[
            //   { required: true, message: "Please enter Physician Inquiry" },
            // ]}
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

          {!physicianSignaturePresent && (
            <>
              <Form.Item
                label="NPI Number"
                name="providerNpi"
                rules={[
                  { required: true, message: "Please Enter NPI Number" },
                  { pattern: /^\d+$/, message: "Only numbers are allowed" },
                ]}
              >
                <Input
                  style={{ width: "100%", height: "2.75rem" }}
                  placeholder="Enter NPI Number"
                  onChange={handleChanges}
                  maxLength={10}
                  onClear={() => setOpt([])}
                  onBlur={() => {
                    const selected = form.getFieldValue("providerNpi");
                    if (!selected) {
                      setOpt([]);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === " ") {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>
              <Form.Item
                label={<label className={style.dateField}>Provider Name</label>}
                name="providerName"
                rules={[{ required: true, message: "Please Select Provider" }]}
              >
                <Select
                  style={{ width: "100%", height: "2.75rem" }}
                  showSearch
                  placeholder="Select Provider Name"
                  labelInValue
                  filterOption={false}
                  onSearch={(value) => handleChange(value, "firstName")}
                  onChange={(value, subValue) => {
                    form.setFieldsValue({
                      providerNpi: subValue?.number || null,
                      lastName: subValue?.lastName || null,
                      firstName: subValue?.firstName || null,
                    });
                  }}
                  onInputKeyDown={(e) => {
                    if (e.target.selectionStart === 0 && e.key === " ") {
                      e.preventDefault();
                    }
                  }}
                  onClear={() => setOpt([])}
                  onBlur={() => {
                    const selected = form.getFieldValue("firstName");
                    if (!selected) {
                      setOpt([]);
                    }
                  }}
                  notFoundContent={
                    getProviderNameLoad ? <Spin size="small" /> : "No data"
                  }
                  options={!getProviderNameLoad && opt}
                />
              </Form.Item>
              <Form.Item
                label={
                  <label className={style.dateField}>
                    Provider Page Number
                  </label>
                }
                name="providerPageNumber"
                rules={[
                  {
                    required: true,
                    message: "Please enter Provider Page Number",
                  },
                  { validator: validateThreeDigitNumber },
                ]}
              >
                <Input maxLength={3} placeholder="Provider Page Number" />
              </Form.Item>
              <Form.Item
                label={
                  <label className={style.dateField}>
                    Please Select Provider Credentials
                  </label>
                }
                name="providerCredentials"
                // rules={[
                //   {
                //     required: true,
                //     message: " Please Select Provider Credentials",
                //   },
                // ]}
              >
                <Select
                  placeholder="Select Provider Credentials"
                  showSearch
                  optionFilterProp="children"
                  style={{ height: "42px" }}
                  allowClear
                >
                  {credentialOptions.map((credentials, index) => (
                    <Select.Option key={index} value={credentials}>
                      {credentials}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={
                  <label className={style.dateField}>Provider Reference</label>
                }
                name="providerReference"
                rules={[
                  {
                    required: true,
                    message: "Please enter Provider Reference",
                  },
                  { validator: noWhitespaceOnly },
                ]}
              >
                <Input placeholder="Provider Reference" />
              </Form.Item>
            </>
          )}

          <Form.Item
            label={<label className={style.dateField}>File Type</label>}
            name="fileType"
            rules={[{ required: true, message: "Please Select File Type" }]}
          >
            <Radio.Group>
              <Radio
                value={"LAB"}
                //said by uvais
                disabled={
                  // !patientDetailsResult?.fileInfos?.length &&
                  // !providersList?.fileType
                  true
                }
              >
                Lab
              </Radio>
              <Radio
                value={"RADIOLOGY"}
                //said by uvais
                disabled={
                  // !patientDetailsResult?.fileInfos?.length &&
                  // !providersList?.fileType
                  true
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
              className=" btn btn-sm ms-2 flr width-max-content custom-btn-style"
              disabled={!!btnName || isTrashView}
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
    allCredentialList:
      state?.patientDetails?.details?.credentialList?.data?.response,
    existingDos: state?.patientDetails?.details?.existingDos,
    getProviderNameLoad: state?.tenantAdmin?.tin?.getProviderNameLoad,
  }),
  {
    getAddProviderAndDOS: allActions.getAddProviderAndDOS,
    getAddProviderAndDOSList: allActions.getAddProviderAndDOSList,
    dosDeatilsAction: allActions.dosDeatilsAction,
    getpatientDetailsData: allActions.patientDetailsAction,
    getSelectedDos: allActions.getSelectedDos,
    patientDetailsLoad: allActions.patientDetailsLoad,
    getProvider: allActions.getProviderList,
    getCredentials: allActions.getCredentialList,
    getExistingDos: allActions.getDosExist,
    getProviderNPIList: tinActions.getProviderNPIList,
    getProviderNameList: tinActions.getProviderNameList,
  }
);

export default connector(AddForm);
