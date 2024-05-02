import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { notification } from "antd";
import { Select } from "antd";
import { Button, Form, Input, Space, DatePicker, Switch } from "antd";
import moment from "moment";
import axios from "../../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../../utility/enpoints";
import styles from "../../hcc/styles.module.css";
import {
  getMeatQueryList,
  getPatientDetailsResult,
} from "../../../../../../store/actions/ReviewerAction/PatientDetailsAction";
import RegularButton from "../../../../../../components/button";
import visitStyles from "../../../../../../styles/visitdata.module.css";
import SelectButton from "../../../../../../components/btnSelect";

const { TextArea } = Input;

const { Option } = Select;

const AddHccForm = ({
  handleCloseModal,
  isMeatNew,
  isAddHccForm,
  diagnosisCode,
  setIsAddHccForm,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const patientDetailsResult = useSelector(
    (state) => state?.ReviewerReducers?.patientDetails
  );
  const [isMeatForm, setIsMeatForm] = useState(false);
  const [addValidCodeCheck, setAddValidCodeCheck] = useState(null);
  const [hccFormDetails, setHccFormDetails] = useState(null);
  const [meatDetail, setMeatDetail] = useState(false);
  const [isNpiNumber, setIsNpiNumber] = useState(false);
  const [formInitialValues, setFormInitialValues] = useState(null);
  const [providerDetails, setProviderDetails] = useState(null);
  const [selectMeat, setSelectMeat] = useState("M");
  const [isActivice, setIsActivice] = useState(false);
  const [isFilled, setIsFilled] = useState([]);
  const [isFormValidate, setIsFormValidate] = useState({
    assessment: "",
    assessmentCapturedFromHeader: "",
    evaluate: "",
    evaluateCapturedFromHeader: "",
    monitor: "",
    monitorCapturedFromHeader: "",
    treatment: "",
    treatmentCapturedFromHeader: "",
  });

  const providerInfoList = [
    { value: "authorizedProvider", label: "Authorized Provider" },
    { value: "noCredential", label: "No Credential" },
    { value: "unAuthorizeProvider", label: "UnAuthorize Provider" },
    { value: "unSigned", label: "Un Signed" },
  ];
  const onFinishHcc = async (form) => {
    setIsMeatForm(true);
    if (addValidCodeCheck == null || !addValidCodeCheck) {
      setAddValidCodeCheck(true);
    }
    var authorizedProvider = form.selectProviderInfo;
    form.encounterDate = moment(form.encounterDate).format("MM-DD-YYYY");
    form.capturedSections = [form.capturedSections];
    form.provider = [
      {
        authorizedProvider:
          form.selectProviderInfo == "authorizedProvider" ? true : false,
        noCredential: form.selectProviderInfo == "noCredential" ? true : false,
        unAuthorizeProvider:
          form.selectProviderInfo == "unAuthorizeProvider" ? true : false,
        unSigned: form.selectProviderInfo == "unSigned" ? true : false,
        providerName: form.providerName,
      },
    ];

    setHccFormDetails(form);
  };
  const onFinishMeat = async (form) => {
    var patientId = localStorage.getItem("patientId");
    form.encounterDate = hccFormDetails.encounterDate;
    form.diagnosisCode = hccFormDetails.diagnosisCode;
    form.radiology = false;
    form.lab = false;
    form.isManuallyAdded = true;
    form.diagnosisCode = hccFormDetails.diagnosisCode;
    form.diseaseName = hccFormDetails.actualDescription;
    form.isMeatCriteriaPresent =
      (isFilled.includes("M") ||
      isFilled.includes("E") ||
      isFilled.includes("A") ||
      isFilled.includes("T"));
    var dataFormat = {
      patientId: patientId,
      year: patientDetailsResult?.result?.response?.dos,
      meatDetail: { ...form, ...isFormValidate },
      diseaseFormat: hccFormDetails,
    };

    // if (
    //   (form.assessment && form.assessmentCapturedFromHeader) ||
    //   (form.evaluate && form.evaluateCapturedFromHeader) ||
    //   (form.monitor && form.monitorCapturedFromHeader) ||
    //   (treatment && treatmentCapturedFromHeader)
    // ) {
    try {
      const response = await axios.post(
        ENDPOINTS.apiEndoint + `dbservice/patient/compute/addvaliddisease`,
        dataFormat
      );
      if (response?.status == 200) {
        handleCloseModal();
        notification.success({
          message: "Saved Successfully!",
          placement: "top",
          duration: 1,
        });
        dispatch(getPatientDetailsResult(patientId));
        dispatch(
          getMeatQueryList(
            patientDetailsResult?.result?.response?.dos,
            patientId
          )
        );
      } else {
      }
    } catch (e) {}
    // } else {
    //   setMeatDetail(true);
    // }
  };
  const onFinishFailed = (form) => {};
  const [validated, setValidated] = useState(false);
  const handleChangeCode = (e) => {
    getFindValidDiagnosisCode(e.target.value);
  };

  const getFindValidDiagnosisCode = async (value) => {
    setAddValidCodeCheck(null);
    try {
      const response = await axios.get(
        ENDPOINTS.apiEndoint +
          `dbservice/icddisease/finddiseasebycode?diseasecode=${value}`
      );
      if (response.data) {
        if (response.data == "ICD disease not found") {
          setAddValidCodeCheck(false);
        } else {
          setAddValidCodeCheck(true);
        }
      }
    } catch (e) {
      setAddValidCodeCheck(false);
    }
  };

  const getFindNpiNumber = async (e) => {
    if (e.target.value.length == 10) {
      notification.warning({
        message: "Please wait provider details fetch...",
        placement: "top",
        duration: 2,
      });
      try {
        const response = await axios.get(
          ENDPOINTS.apiEndoint +
            `management/provider/getProviderData?npiNumber=${e.target.value}`
        );
        if (response.data) {
          var initalForm = {
            providerName:
              response?.data?.response?.userName +
              " " +
              response?.data?.response?.credential,
            selectProviderInfo: ["Authorized Provider"],
          };
          setProviderDetails(initalForm);
        }
      } catch (e) {
        setProviderDetails(null);
        notification.error({
          message: e.response.data.message,
          placement: "top",
          duration: 2,
        });
      }
    }
  };

  const onChangeSwitch = () => {
    setIsNpiNumber(isNpiNumber ? false : true);
    if (isNpiNumber) {
      setProviderDetails(null);
    }
  };

  useEffect(() => {
    var initalForm = {
      providerName: providerDetails?.providerName,
      selectProviderInfo: providerDetails?.selectProviderInfo,
    };
    setFormInitialValues(initalForm);
    form.setFieldsValue(initalForm);
  }, [providerDetails, form]);

  useEffect(() => {
    if (
      (isFormValidate.assessment &&
        isFormValidate.assessmentCapturedFromHeader) ||
      (isFormValidate.evaluate && isFormValidate.evaluateCapturedFromHeader) ||
      (isFormValidate.monitor && isFormValidate.monitorCapturedFromHeader) ||
      (isFormValidate.treatment && isFormValidate.treatmentCapturedFromHeader)
    ) {
      setMeatDetail(false);
    }
    if (
      isFormValidate.monitor == "" ||
      isFormValidate.monitorCapturedFromHeader == ""
    ) {
      setIsFilled((prev) => prev.filter((item) => item != "M"));
      if (isActivice) setMeatDetail(true);
    } else if (
      isFormValidate.monitor &&
      isFormValidate.monitorCapturedFromHeader
    ) {
      setIsFilled((prev) => [...prev, "M"]);
    }
    if (
      isFormValidate.evaluate == "" ||
      isFormValidate.evaluateCapturedFromHeader == ""
    ) {
      setIsFilled((prev) => prev.filter((item) => item != "E"));
    } else if (
      isFormValidate.evaluate &&
      isFormValidate.evaluateCapturedFromHeader
    ) {
      setIsFilled((prev) => [...prev, "E"]);
    }
    if (
      isFormValidate.treatment == "" ||
      isFormValidate.treatmentCapturedFromHeader == ""
    ) {
      setIsFilled((prev) => prev.filter((item) => item != "T"));
    } else if (
      isFormValidate.treatment &&
      isFormValidate.treatmentCapturedFromHeader
    ) {
      setIsFilled((prev) => [...prev, "T"]);
    }
    if (
      isFormValidate.assessment == "" ||
      isFormValidate.assessmentCapturedFromHeader == ""
    ) {
      setIsFilled((prev) => prev.filter((item) => item != "A"));
    } else if (
      isFormValidate.assessment &&
      isFormValidate.assessmentCapturedFromHeader
    ) {
      setIsFilled((prev) => [...prev, "A"]);
    }
    // handleActivice(meatDetail);
  }, [isFormValidate, meatDetail]);
  console.log(isFormValidate, "isFormValidate");
  return (
    <>
      <div className={styles.formTitleContaniner}>
        <h6 className={styles.formTitle}>{isMeatForm ? "MEAT" : "HCC"}</h6>
      </div>
      {!isMeatForm ? (
        <>
          <Form
            form={form}
            name="validateOnly"
            layout="vertical"
            autoComplete="off"
            initialValues={formInitialValues}
            onFinish={onFinishHcc}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label={
                <label>
                  Code <span style={{ color: "red" }}>*</span>
                </label>
              }
              name="diagnosisCode"
              rules={[
                {
                  required: true,
                  message: "Please enter diagnosis code",
                },
              ]}
            >
              <Input
                name="diagnosisCode"
                onChange={handleChangeCode}
                className={styles.formControl}
              />
            </Form.Item>
            {addValidCodeCheck == true ? (
              <span className={visitStyles.validHccCodeError}>
                Valid Hcc Code
              </span>
            ) : addValidCodeCheck == false ? (
              <span className={visitStyles.invalidHccCodeError}>
                Invalid Hcc Code
              </span>
            ) : null}
            <Form.Item
              label={
                <label>
                  Description <span style={{ color: "red" }}>*</span>
                </label>
              }
              name="actualDescription"
              rules={[
                {
                  required: true,
                  message: "Please enter description",
                },
              ]}
            >
              <Input name="actualDescription" className={styles.formControl} />
            </Form.Item>
            <div style={{ display: "flex", marginBottom: "10px" }}>
              <label>Provider NPI : </label>
              <Switch
                style={{ marginLeft: "15px" }}
                checkedChildren="Yes"
                unCheckedChildren="No"
                defaultChecked={isNpiNumber}
                onChange={() => {
                  onChangeSwitch();
                }}
              />
            </div>

            {isNpiNumber && (
              <Form.Item
                label={
                  <label>
                    NPI Number <span style={{ color: "red" }}>*</span>
                  </label>
                }
                name="npiNumber"
                rules={[
                  {
                    required: true,
                    message: "Please enter npi number",
                  },
                  {
                    validator: (_, value) => {
                      if (value?.length < 10) {
                        return Promise.reject("Please enter 10 digit number");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  type="number"
                  name="providerName"
                  onChange={getFindNpiNumber}
                  maxLength={10}
                  className={styles.formControl}
                  onWheel={(e) => e.target.blur()}
                />
              </Form.Item>
            )}
            <Form.Item label="Provider name" name="providerName">
              <Input name="providerName" className={styles.formControl} />
            </Form.Item>

            <Form.Item label="Provider Info" name="selectProviderInfo">
              <Select className={`ant_select_form hcc_form mb-2`}>
                {providerInfoList?.map((data) => (
                  <Option key={data?.value} value={data?.value}>
                    {data?.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={
                <label>
                  Section<span style={{ color: "red" }}>*</span>
                </label>
              }
              name="capturedSections"
              rules={[
                {
                  required: true,
                  message: "Please enter section code",
                },
              ]}
            >
              <Input name="capturedSections" className={styles.formControl} />
            </Form.Item>
            <Form.Item
              label={
                <label>
                  Encounter date <span style={{ color: "red" }}>*</span>
                </label>
              }
              name="encounterDate"
              rules={[
                {
                  required: true,
                  message: "Please enter encounter date.",
                },
              ]}
            >
              <DatePicker
                name="encounterDate"
                format="MM/DD/YYYY"
                className="form-datepicker"
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <RegularButton type="submit" name="Next" width={100} />
                <RegularButton
                  type="outline"
                  name="Clear"
                  width={100}
                  method="reset"
                  onClick={() => setAddValidCodeCheck(null)}
                />
              </Space>
            </Form.Item>
          </Form>
        </>
      ) : isMeatNew ? (
        <Form
          name="validateOnly"
          layout="vertical"
          autoComplete="off"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinishMeat}
          onFinishFailed={onFinishFailed}
          onChange={(e, val) => {
            setIsFormValidate((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }));
          }}
        >
          <>
            {/* <Form.Item
            label="Activice"
            name="Activice"
          > */}
            <span className="mb-2">Activice : </span>
            <Switch
              name="Activice"
              checkedChildren="No"
              unCheckedChildren="Yes"
              onChange={(e) => {
                setIsActivice(e);
                if (e) {
                  setMeatDetail(e);
                } else {
                  setMeatDetail(false);
                }
              }}
            />
            <div className="my-2 d-flex justify-content-center">
              <SelectButton
                select={selectMeat}
                setSelect={setSelectMeat}
                completed={isFilled}
              />
            </div>
            {selectMeat == "M" && (
              <>
                <Form.Item
                  label="Monitor Header"
                  name="monitorCapturedFromHeader"
                >
                  <Input
                    name="monitorCapturedFromHeader"
                    className={styles.formControl}
                  />
                </Form.Item>
                <Form.Item label="Monitor" name="monitor">
                  <Input name="monitor" className={styles.formControl} />
                </Form.Item>
              </>
            )}
            {selectMeat == "E" && (
              <>
                <Form.Item
                  label="Evaluate Header"
                  name="evaluateCapturedFromHeader"
                >
                  <Input
                    name="evaluateCapturedFromHeader"
                    className={styles.formControl}
                  />
                </Form.Item>
                <Form.Item label="Evaluate" name="evaluate">
                  <Input name="evaluate" className={styles.formControl} />
                </Form.Item>
              </>
            )}
            {selectMeat == "A" && (
              <>
                <Form.Item
                  label={
                    <label>
                      Assessment Header&nbsp;
                      {/* <span style={{ color: "red" }}>*</span> */}
                    </label>
                  }
                  name="assessmentCapturedFromHeader"
                  rules={[
                    {
                      required: false,
                      message: "Please Enter Assessment Header.",
                    },
                  ]}
                >
                  <Input
                    name="assessmentCapturedFromHeader"
                    className={styles.formControl}
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <label>
                      Assessment&nbsp;
                      {/* <span style={{ color: "red" }}>*</span> */}
                    </label>
                  }
                  name="assessment"
                  rules={[
                    {
                      required: false,
                      message: "Please Enter Assessment.",
                    },
                  ]}
                >
                  <Input name="assessment" className={styles.formControl} />
                </Form.Item>
              </>
            )}
            {selectMeat == "T" && (
              <>
                <Form.Item
                  label="Treatment Header"
                  name="treatmentCapturedFromHeader"
                >
                  <Input
                    name="treatmentCapturedFromHeader"
                    className={styles.formControl}
                  />
                </Form.Item>
                <Form.Item label="Treatment" name="treatment">
                  <Input name="treatment" className={styles.formControl} />
                </Form.Item>
              </>
            )}
            <Form.Item>
              <div className=" d-flex justify-content-center">
                <RegularButton
                  type="submit"
                  name="Save"
                  width={100}
                  disabled={meatDetail}
                />
                <RegularButton
                  type="outline"
                  name="Back"
                  width={100}
                  onClick={() => {
                    setIsMeatForm(false);
                  }}
                />
              </div>
            </Form.Item>
          </>
        </Form>
      ) : (
        <>
          <Form
            name="validateOnly"
            layout="vertical"
            autoComplete="off"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinishMeat}
            onFinishFailed={onFinishFailed}
          >
            <>
              <Form.Item
                label="Monitor Header"
                name="monitorCapturedFromHeader"
              >
                <Input
                  name="monitorCapturedFromHeader"
                  className={styles.formControl}
                />
              </Form.Item>
              <Form.Item label="Monitor" name="monitor">
                <Input name="monitor" className={styles.formControl} />
              </Form.Item>
              <Form.Item
                label="Evaluate Header"
                name="evaluateCapturedFromHeader"
              >
                <Input
                  name="evaluateCapturedFromHeader"
                  className={styles.formControl}
                />
              </Form.Item>
              <Form.Item label="Evaluate" name="evaluate">
                <Input name="evaluate" className={styles.formControl} />
              </Form.Item>
              <Form.Item
                label={
                  <label>
                    Assessment Header&nbsp;
                    {/* <span style={{ color: "red" }}>*</span> */}
                  </label>
                }
                name="assessmentCapturedFromHeader"
                rules={[
                  {
                    required: false,
                    message: "Please Enter Assessment Header.",
                  },
                ]}
              >
                <Input
                  name="assessmentCapturedFromHeader"
                  className={styles.formControl}
                />
              </Form.Item>
              <Form.Item
                label={
                  <label>
                    Assessment&nbsp;
                    {/* <span style={{ color: "red" }}>*</span> */}
                  </label>
                }
                name="assessment"
                rules={[
                  {
                    required: false,
                    message: "Please Enter Assessment.",
                  },
                ]}
              >
                <Input name="assessment" className={styles.formControl} />
              </Form.Item>
              <Form.Item
                label="Treatment Header"
                name="treatmentCapturedFromHeader"
              >
                <Input
                  name="treatmentCapturedFromHeader"
                  className={styles.formControl}
                />
              </Form.Item>
              <Form.Item label="Treatment" name="treatment">
                <Input name="treatment" className={styles.formControl} />
              </Form.Item>

              {meatDetail && <label className="my-3">Please enter</label>}
              <Form.Item>
                <Space>
                  <RegularButton type="submit" name="Save" width={100} />
                  <RegularButton
                    type="outline"
                    name="Back"
                    width={100}
                    onClick={() => {
                      setIsMeatForm(false);
                    }}
                  />
                </Space>
              </Form.Item>
            </>
          </Form>
        </>
      )}
    </>
  );
};

export default AddHccForm;
