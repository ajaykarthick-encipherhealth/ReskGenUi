import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { notification } from "antd";
import { Select } from "antd";
import { Button, Form, Input, Space, DatePicker } from "antd";
import moment from "moment";
import axios from "../../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../../utility/enpoints";
import styles from "../../hcc/styles.module.css";
import { getMeatQueryList, getPatientDetailsResult } from "../../../../../../store/actions/ReviewerAction/PatientDetailsAction";
import RegularButton from "../../../../../../components/button";
import visitStyles from "../../../../../../styles/visitdata.module.css";

const { TextArea } = Input;

const { Option } = Select;

const AddHccForm = ({
  handleCloseModal,
  isAddHccForm,
  diagnosisCode,
  setIsAddHccForm,
}) => {
  const dispatch = useDispatch();
  const patientDetailsResult = useSelector(
    (state) => state?.ReviewerReducers?.patientDetails
  );
  const [isMeatForm, setIsMeatForm] = useState(false);
  const [addValidCodeCheck, setAddValidCodeCheck] = useState(null);
  const [hccFormDetails, setHccFormDetails] = useState(null);
  const [meatDetail, setMeatDetail] = useState(false);
  const providerInfoList = [
    { value: "authorizedProvider", label: "Authorized Provider" },
    { value: "noCredential", label: "No Credential" },
    { value: "unAuthorizeProvider", label: "UnAuthorize Provider" },
    { value: "unSigned", label: "Un Signed" },
  ];
  const onFinishHcc = async (form) => {
    setIsMeatForm(true);
    console.log(addValidCodeCheck);
    if (addValidCodeCheck == null || !addValidCodeCheck) {
      setAddValidCodeCheck(true);
    }
    var authorizedProvider = form.selectProviderInfo;
    form.encounterDate = moment(form.encounterDate).format("MM-DD-YYYY");
    form.capturedSections = [form.capturedSections];
    form.provider = [{
      provider: form.selectProviderInfo == "authorizedProvider" ? true : false,
      noCredential: form.selectProviderInfo == "noCredential" ? true : false,
      unAuthorizeProvider:
        form.selectProviderInfo == "unAuthorizeProvider" ? true : false,
      unSigned: form.selectProviderInfo == "unSigned" ? true : false,
      providerName: form.providerName,
    }];

    console.log(form);
    setHccFormDetails(form);
  };
  const onFinishMeat = async (form) => {
    var patientId = localStorage.getItem("patientId");
    form.encounterDate = hccFormDetails.encounterDate;
    form.radiology = false;
    form.lab = false;
    form.isManuallyAdded = true;
    form.diagnosisCode = hccFormDetails.diagnosisCode;
    form.diseaseName = hccFormDetails.actualDescription;
    form.isMeatCriteriaPresent = true;
    var dataFormat = {
      patientId: patientId,
      year: patientDetailsResult?.result?.response?.dos,
      meatDetail: form,
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
          ENDPOINTS.apiEndoint +
            `dbservice/patient/compute/addvaliddisease`,
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
    console.log(e.target.value);
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

  return (
    <>
      <div className={styles.formTitleContaniner}>
        <h6 className={styles.formTitle}>{isMeatForm ? "MEAT" : "HCC"}</h6>
      </div>
      {!isMeatForm ? (
        <>
          <Form
            name="validateOnly"
            layout="vertical"
            autoComplete="off"
            initialValues={{
              remember: true,
            }}
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
            {addValidCodeCheck == false ? (
              <span className={visitStyles.invalidHccCodeError}>
                Invalid Hcc Code
              </span>
            ) : addValidCodeCheck == true ? (
              <span className={visitStyles.validHccCodeError}>
                Valid Hcc Code
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
                  name="Cancel"
                  width={100}
                  method="reset"
                />
              </Space>
            </Form.Item>
          </Form>
        </>
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
