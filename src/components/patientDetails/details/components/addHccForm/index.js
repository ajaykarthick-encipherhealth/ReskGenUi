import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, connect } from "react-redux";
import { notification } from "antd";
import { Select } from "antd";
import { Button, Form, Input, Space, DatePicker, Switch } from "antd";
import moment from "moment";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";
import styles from "../../hcc/styles.module.css";
import RegularButton from "../../../../../components/button";
import visitStyles from "../../../../../styles/visitdata.module.css";
import SelectButton from "../../../../../components/btnSelect";
import { actions as detailsActions } from "../../../../../stores/patient/details";
import path from "path";
import { getStorage } from "../../../../../utils/storages";

const { TextArea } = Input;

const { Option } = Select;

const AddHccForm = ({
  handleCloseModal,
  isMeatNew,
  isAddHccForm,
  diagnosisCode,
  setIsAddHccForm,
  patientDetailsResult,
  getpatientDetailsData,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
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
  const [hyperlinkForm, setHyperlinkForm] = useState({
    header: "",
    pageNumber: "",
    substring: "",
    dateOfService: "",
  });

  const providerInfoList = [
    { value: "authorizedProvider", label: "Authorized Provider" },
    { value: "noCredential", label: "No Credential" },
    { value: "unAuthorizeProvider", label: "UnAuthorize Provider" },
    { value: "unSigned", label: "Un Signed" },
  ];
  const [providerInfoSelectOpen, setProviderInfoSelectOpen] = useState(false);
  const [providerInfoSelectClose, setProviderInfoSelectClose] = useState(false);
  const [providerNameList, setProviderNameList] = useState([]);
  const [selectProviderNameList, setSelectProviderNameList] = useState([]);
  const [sectionSelectOpen, setSectionSelectOpen] = useState(false);
  const [sectionSelectClose, setSectionSelectClose] = useState(false);
  const [sectionList, setSectionList] = useState([]);
  const [selectSectionList, setSelectSectionList] = useState([]);
  const [encounterList, setEncounterList] = useState([]);
  const [selectEncounterList, setSelectEncounterList] = useState([]);
  const [encounterDate, setEncounterDate] = useState("");
  const [providerInfoAllDetails, setProviderInfoAllDetails] = useState([]);
  const [providerName, setProviderName] = useState(null);
  const [providerInfo, setProviderInfo] = useState([]);
  const [hyperlinkOpen, setHyperlinksOpen] = useState(false);
  const [hyperlinkClose, setHyperlinkClose] = useState(false);
  const [hyperlinkList, setHyperlinkList] = useState([]);
  const [hyperlinkListSelect, setHyperlinkListSelect] = useState([]);

  const [mhyperlinkOpen, setMHyperlinksOpen] = useState(false);
  const [mhyperlinkClose, setMHyperlinkClose] = useState(false);
  const [mhyperlinkList, setMHyperlinkList] = useState([]);
  const [mhyperlinkListSelect, setMHyperlinkListSelect] = useState([]);

  const [ehyperlinkOpen, setEHyperlinksOpen] = useState(false);
  const [ehyperlinkClose, setEHyperlinkClose] = useState(false);
  const [ehyperlinkList, setEHyperlinkList] = useState([]);
  const [ehyperlinkListSelect, setEHyperlinkListSelect] = useState([]);

  const [ahyperlinkOpen, setAHyperlinksOpen] = useState(false);
  const [ahyperlinkClose, setAHyperlinkClose] = useState(false);
  const [ahyperlinkList, setAHyperlinkList] = useState([]);
  const [ahyperlinkListSelect, setAHyperlinkListSelect] = useState([]);

  const [thyperlinkOpen, setTHyperlinksOpen] = useState(false);
  const [thyperlinkClose, setTHyperlinkClose] = useState(false);
  const [thyperlinkList, setTHyperlinkList] = useState([]);
  const [thyperlinkListSelect, setTHyperlinkListSelect] = useState([]);

  const onFinishHcc = async (form) => {
    setIsMeatForm(true);
    if (addValidCodeCheck == null || !addValidCodeCheck) {
      setAddValidCodeCheck(true);
    }
    // var authorizedProvider = form.selectProviderInfo;
    // form.encounterDate = moment(form.encounterDate).format("MM-DD-YYYY");
    // form.capturedSections = [form.capturedSections];
    // form.provider = [
    //   {
    //     authorizedProvider:
    //       form.selectProviderInfo == "authorizedProvider" ? true : false,
    //     noCredential: form.selectProviderInfo == "noCredential" ? true : false,
    //     unAuthorizeProvider:
    //       form.selectProviderInfo == "unAuthorizeProvider" ? true : false,
    //     unSigned: form.selectProviderInfo == "unSigned" ? true : false,
    //     providerName: form.providerName,
    //   },
    // ];

    setHccFormDetails(form);
  };
  const onFinishMeat = async (form) => {
    var patientId = getStorage("patientId");
    var providerGet = [];
    if (providerInfoAllDetails) {
      providerGet = providerInfoAllDetails?.filter((o1) =>
        hccFormDetails.selectProviderInfo.some((o2) => o1.providerName === o2)
      );
    }
    var newDataFormat = {
      patientId:patientId,
      diagnosisCode :hccFormDetails.diagnosisCode,
      description : hccFormDetails.actualDescription,
      provider: providerGet,
      capturedSections:hccFormDetails.sections,
      dateOfServices:selectEncounterList,
      hyperlinks:hyperlinkList,
      monitorAspect:form.monitor,
      monitorHyperLink:mhyperlinkList,
      evaluateAspect:form.evaluate,
      evaluateHyperLink:ehyperlinkList,
      assessmentAspect:form.assessment,
      assessmentHyperLink:ahyperlinkList,
      treatmentAspect:form.treatment,
      treatmentHyperLink:thyperlinkList,

    }
    form.encounterDate = hccFormDetails.encounterDate;
    form.diagnosisCode = hccFormDetails.diagnosisCode;
    form.radiology = false;
    form.lab = false;
    form.isManuallyAdded = true;
    form.diagnosisCode = hccFormDetails.diagnosisCode;
    form.diseaseName = hccFormDetails.actualDescription;
    form.isMeatCriteriaPresent =
      isFilled.includes("M") ||
      isFilled.includes("E") ||
      isFilled.includes("A") ||
      isFilled.includes("T");
    var dataFormat = {
      patientId: patientId,
      year: patientDetailsResult?.data?.response?.dos,
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
        getpatientDetailsData(
          patientId,
          patientDetailsResult?.data?.response?.processedYear,
          patientDetailsResult?.data?.response?.dateOfService
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

  const onChangeProvider = (e) => {
    setProviderInfo(e);
  };
  const onChangeName = (e) => {
    setProviderName(e.target.value);
  };
  const onChangeEncounterDate = (e) => {
    setEncounterDate(e.target.value);
  };
  const addProvider = () => {
    if (providerName) {
      var providers = [];
      var selectProviders = [];
      var providersAllDetails = [];
      var providersMap = {
        providerName: providerName,
        authorizedProvider: providerInfo == "authorizedProvider" ? true : false,
        noCredential: providerInfo == "noCredential" ? true : false,
        unAuthorizeProvider:
          providerInfo == "unAuthorizeProvider" ? true : false,
        unSigned: providerInfo == "unSigned" ? true : false,
      };
      providersAllDetails.push(providersMap);
      providers.push({ value: providerName, label: providerName });
      selectProviders.push(providerName);
      setProviderNameList([...providers, ...providerNameList]);
      setSelectProviderNameList([
        ...selectProviders,
        ...selectProviderNameList,
      ]);
      setProviderInfoAllDetails([
        ...providersAllDetails,
        ...providerInfoAllDetails,
      ]);
      setProviderName(null);
      setProviderInfo([]);
      setProviderInfoSelectClose(true);
    }
  };

  const addEnconterDate = () => {
    if (encounterDate) {
      const checkUsername = (obj) =>
        obj.value === moment(encounterDate).format("MM/DD/YYYY");
      if (!encounterList.some(checkUsername)) {
        var dates = [];
        var selectDates = [];
        dates.push({
          value: moment(encounterDate).format("MM/DD/YYYY"),
          label: moment(encounterDate).format("MM/DD/YYYY"),
        });
        selectDates.push(moment(encounterDate).format("MM/DD/YYYY"));
        setEncounterList([...dates, ...encounterList]);
        setSelectEncounterList([...selectDates, ...selectEncounterList]);
        setEncounterDate("");
      } else {
        notification.warning({
          message: "Already encounter date is present",
          placement: "top",
          duration: 1,
        });
      }
    }
  };

  const handleChangeHyperlink = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setHyperlinkForm({ ...hyperlinkForm, [key]: value });
  };
  const addHyperlink = async (title) => {
    if (hyperlinkForm.header) {
      var hyperlinks = [];
      var selectHyperlinks = [];
      hyperlinks.push({
        header: hyperlinkForm.header,
        pageNumber: hyperlinkForm.pageNumber,
        substring: hyperlinkForm.substring,
        dateOfService: hyperlinkForm.dateOfService,
      });
      selectHyperlinks.push(hyperlinkForm.header);
      if (title == "H") {
        setHyperlinkList([...hyperlinks, ...hyperlinkList]);
        setHyperlinkListSelect([...selectHyperlinks, ...hyperlinkListSelect]);
      }
      if (title == "M") {
        setMHyperlinkList([...hyperlinks, ...mhyperlinkList]);
        setMHyperlinkListSelect([...selectHyperlinks, ...mhyperlinkListSelect]);
      }
      if (title == "E") {
        setEHyperlinkList([...hyperlinks, ...ehyperlinkList]);
        setEHyperlinkListSelect([...selectHyperlinks, ...ehyperlinkListSelect]);
      }
      if (title == "A") {
        setAHyperlinkList([...hyperlinks, ...ahyperlinkList]);
        setAHyperlinkListSelect([...selectHyperlinks, ...ahyperlinkListSelect]);
      }
      if (title == "T") {
        setTHyperlinkList([...hyperlinks, ...thyperlinkList]);
        setTHyperlinkListSelect([...selectHyperlinks, ...thyperlinkListSelect]);
      }
      hyperlinkForm.header = "";
      hyperlinkForm.pageNumber = "";
      hyperlinkForm.substring = "";
      hyperlinkForm.dateOfService = "";
      // setHyperlinkForm{\}
      setHyperlinkClose(true);
      setMHyperlinkClose(true);
      setEHyperlinkClose(true);
      setAHyperlinkClose(true);
      setTHyperlinkClose(true);
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
  useEffect(() => {
    var initalForm = {
      selectProviderInfo: selectProviderNameList,
      encounterDates: selectEncounterList,
      hyperlinks: hyperlinkListSelect,
      mhyperlinks: mhyperlinkListSelect,
      ehyperlinks: ehyperlinkListSelect,
      ahyperlinks: ahyperlinkListSelect,
      thyperlinks: thyperlinkListSelect,


    };
    setFormInitialValues(initalForm);
    form.setFieldsValue(initalForm);
  }, [selectEncounterList, selectProviderNameList, hyperlinkListSelect,mhyperlinkListSelect,ehyperlinkListSelect,ahyperlinkListSelect,thyperlinkListSelect, form]);
console.log(selectProviderNameList)
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
            <div className="row">
              <div className="col-xl-6">
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
              </div>
              <div className="col-xl-6">
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
                  <Input
                    name="actualDescription"
                    className={styles.formControl}
                  />
                </Form.Item>
              </div>

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
                <div className="col-xl-6">
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
                            return Promise.reject(
                              "Please enter 10 digit number"
                            );
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
                </div>
              )}
              <div className="col-xl-6">
                <Form.Item label="Provider Name" name="selectProviderInfo">
                  <Select
                    mode="tags"
                    maxTagCount="responsive"
                    className={`ant_select_form hcc_form mb-2`}
                    open={
                      providerInfoSelectClose == true
                        ? false
                        : providerInfoSelectOpen
                    }
                    onClick={() =>
                      providerInfoSelectClose == true
                        ? setProviderInfoSelectClose(false)
                        : setProviderInfoSelectOpen(true)
                    }
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <div
                          className={`col-xl-12 ${styles.provideraddheader}`}
                        >
                          <div className="col-xl-12 mt-1">
                            <Input
                              placeholder="Please enter name"
                              onChange={onChangeName}
                              value={providerName}
                            />
                          </div>
                          <div className="col-xl-12 mt-1">
                            <Select
                              className={`ant_select_form hcc_form mb-2`}
                              placeholder="Select"
                              onChange={onChangeProvider}
                              value={providerInfo}
                            >
                              {providerInfoList?.map((data) => (
                                <Option key={data?.value} value={data?.value}>
                                  {data?.label}
                                </Option>
                              ))}
                            </Select>
                          </div>
                        </div>
                        <div className={styles.editAction}>
                          <Button
                            className="save-sm-btn"
                            onClick={() => addProvider()}
                            style={{ width: "50px" }}
                            disabled={
                              providerName && providerInfo.length != 0
                                ? false
                                : true
                            }
                          >
                            Add
                          </Button>
                          <Button
                            className="cancel-sm-btn"
                            style={{
                              width: "50px",
                              marginLeft: "5px",
                              marginRight: "10px",
                            }}
                            onClick={() => {
                              setProviderInfoSelectClose(true);
                            }}
                          >
                            Close
                          </Button>
                        </div>
                      </>
                    )}
                  >
                    {providerNameList?.map((data) => (
                      <Option key={data?.value} value={data?.value}>
                        {data?.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-xl-6">
                {/* <Form.Item label="Section" name="selectSection">
                  <Select
                    mode="tags"
                    maxTagCount="responsive"
                    className={`ant_select_form hcc_form mb-2`}
                    open={
                      sectionSelectClose == true ? false : sectionSelectOpen
                    }
                    onClick={() =>
                      sectionSelectClose == true
                        ? setSectionSelectClose(false)
                        : setSectionSelectOpen(true)
                    }
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <div
                          className={`col-xl-12 ${styles.provideraddheader}`}
                        >
                          <div className="col-xl-12 mt-1">
                            <Input
                              placeholder="Please enter name"
                              onChange={onChangeName}
                              value={providerName}
                            />
                          </div>
                          <div className="col-xl-12 mt-1">
                            <Select
                              className={`ant_select_form hcc_form mb-2`}
                              placeholder="Select"
                              onChange={onChangeProvider}
                              value={providerInfo}
                            >
                              {providerInfoList?.map((data) => (
                                <Option key={data?.value} value={data?.value}>
                                  {data?.label}
                                </Option>
                              ))}
                            </Select>
                          </div>
                        </div>
                        <div className={styles.editAction}>
                          <Button
                            className="save-sm-btn"
                            onClick={() => addProvider()}
                            style={{ width: "50px" }}
                            disabled={
                              providerName && providerInfo.length != 0
                                ? false
                                : true
                            }
                          >
                            Add
                          </Button>
                          <Button
                            className="cancel-sm-btn"
                            style={{
                              width: "50px",
                              marginLeft: "5px",
                              marginRight: "10px",
                            }}
                            onClick={() => {
                              setSectionSelectClose(true);
                            }}
                          >
                            Close
                          </Button>
                        </div>
                      </>
                    )}
                  >
                    {providerNameList?.map((data) => (
                      <Option key={data?.value} value={data?.value}>
                        {data?.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item> */}
                <Form.Item label="Section" name="sections">
                  <Select
                    mode="tags"
                    maxTagCount="responsive"
                    className={`ant_select_form hcc_form mb-2`}
                  >
                    {sectionList?.map((data) => (
                      <Option key={data?.value} value={data?.value}>
                        {data?.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-xl-6">
                <Form.Item label="Hyperlinks" name="hyperlinks">
                  <Select
                    mode="tags"
                    maxTagCount="responsive"
                    className={`ant_select_form hcc_form mb-2`}
                    open={hyperlinkClose == true ? false : hyperlinkOpen}
                    onClick={() =>
                      hyperlinkClose == true
                        ? setHyperlinkClose(false)
                        : setHyperlinksOpen(true)
                    }
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <div
                          className={`col-xl-12 ${styles.provideraddheader}`}
                        >
                          <div className="col-xl-12 mt-1">
                            <Input
                              name="header"
                              placeholder="Please enter header name"
                              onChange={handleChangeHyperlink}
                              value={hyperlinkForm?.header}
                            />
                          </div>
                          <div className="col-xl-12 mt-1">
                            <Input
                              name="pageNumber"
                              type="number"
                              placeholder="Please enter page number"
                              onChange={handleChangeHyperlink}
                              value={hyperlinkForm?.pageNumber}
                            />
                          </div>
                          <div className="col-xl-12 mt-1">
                            <Input
                              name="substring"
                              placeholder="Please enter sub string"
                              onChange={handleChangeHyperlink}
                              value={hyperlinkForm?.substring}
                            />
                          </div>
                          <div className="col-xl-12 mt-1">
                            <Input
                              type="date"
                              name="dateOfService"
                              placeholder="Please select date "
                              onChange={handleChangeHyperlink}
                              value={hyperlinkForm?.dateOfService}
                            />
                          </div>
                        </div>
                        <div className={styles.editAction}>
                          <Button
                            className="save-sm-btn"
                            onClick={() => addHyperlink("H")}
                            style={{ width: "50px" }}
                            disabled={
                              hyperlinkForm?.header &&
                              hyperlinkForm?.pageNumber &&
                              hyperlinkForm?.substring &&
                              hyperlinkForm?.dateOfService
                                ? false
                                : true
                            }
                          >
                            Add
                          </Button>
                          <Button
                            className="cancel-sm-btn"
                            style={{
                              width: "50px",
                              marginLeft: "5px",
                              marginRight: "10px",
                            }}
                            onClick={() => {
                              setHyperlinkClose(true);
                            }}
                          >
                            Close
                          </Button>
                        </div>
                      </>
                    )}
                  >
                    {hyperlinkList?.map((data) => (
                      <Option key={data?.header} value={data?.header}>
                        {data?.header}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-xl-6">
                <Form.Item label="Encounter Date" name="encounterDates">
                  <Select
                    mode="tags"
                    maxTagCount="responsive"
                    className={`ant_select_form hcc_form mb-2`}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <div
                          className={`col-xl-12 ${styles.provideraddheader}`}
                        >
                          <div className="col-xl-12 mt-1">
                            {/* <DatePicker  type={"date"} format="MM/DD/YYYY"   placeholder="Please select date" value={encounterDate} onChange={onChangeEncounterDate} /> */}
                            <Input
                              type={"date"}
                              format="MM/DD/YYYY"
                              placeholder="Please select date"
                              value={encounterDate}
                              onChange={onChangeEncounterDate}
                            />
                          </div>
                        </div>
                        <div className={styles.editAction}>
                          <Button
                            className="save-sm-btn"
                            style={{ width: "50px" }}
                            onClick={() => addEnconterDate()}
                            disabled={encounterDate ? false : true}
                          >
                            Add
                          </Button>
                        </div>
                      </>
                    )}
                  >
                    {encounterList?.map((data) => (
                      <Option key={data?.value} value={data?.value}>
                        {data?.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>

            {/* <Form.Item label="Provider name" name="providerName">
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
            </Form.Item>  */}

            {/* <Form.Item
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
            </Form.Item> */}
            {/* <Form.Item
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
            </Form.Item> */}

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
          form={form}
          name="validateOnly"
          layout="vertical"
          autoComplete="off"
          initialValues={{
            remember: true,
            formInitialValues
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
            <span className="mb-2">Activice Header: </span>
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
                {/* <Form.Item
                  label="Monitor Header"
                  name="monitorCapturedFromHeader"
                >
                  <Input
                    name="monitorCapturedFromHeader"
                    className={styles.formControl}
                  />
                </Form.Item> */}
                <Form.Item label="Monitor" name="monitor">
                  <Input name="monitor" className={styles.formControl} />
                </Form.Item>
                <Form.Item label="Hyperlinks" name="mhyperlinks">
                  <Select
                    mode="tags"
                    maxTagCount="responsive"
                    className={`ant_select_form hcc_form mb-2`}
                    open={mhyperlinkClose == true ? false : mhyperlinkOpen}
                    onClick={() =>
                      mhyperlinkClose == true
                        ? setMHyperlinkClose(false)
                        : setMHyperlinksOpen(true)
                    }
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <div
                          className={`col-xl-12 ${styles.provideraddheader}`}
                        >
                          <div className="col-xl-12 mt-1">
                            <Input
                              name="header"
                              placeholder="Please enter header name"
                              onChange={handleChangeHyperlink}
                              value={hyperlinkForm?.header}
                            />
                          </div>
                          <div className="col-xl-12 mt-1">
                            <Input
                              name="pageNumber"
                              type="number"
                              placeholder="Please enter page number"
                              onChange={handleChangeHyperlink}
                              value={hyperlinkForm?.pageNumber}
                            />
                          </div>
                          <div className="col-xl-12 mt-1">
                            <Input
                              name="substring"
                              placeholder="Please enter sub string"
                              onChange={handleChangeHyperlink}
                              value={hyperlinkForm?.substring}
                            />
                          </div>
                          <div className="col-xl-12 mt-1">
                            <Input
                              type="date"
                              name="dateOfService"
                              placeholder="Please select date "
                              onChange={handleChangeHyperlink}
                              value={hyperlinkForm?.dateOfService}
                            />
                          </div>
                        </div>
                        <div className={styles.editAction}>
                          <Button
                            className="save-sm-btn"
                            onClick={() => addHyperlink("M")}
                            style={{ width: "50px" }}
                            disabled={
                              hyperlinkForm?.header &&
                              hyperlinkForm?.pageNumber &&
                              hyperlinkForm?.substring &&
                              hyperlinkForm?.dateOfService
                                ? false
                                : true
                            }
                          >
                            Add
                          </Button>
                          <Button
                            className="cancel-sm-btn"
                            style={{
                              width: "50px",
                              marginLeft: "5px",
                              marginRight: "10px",
                            }}
                            onClick={() => {
                              setMHyperlinkClose(true);
                            }}
                          >
                            Close
                          </Button>
                        </div>
                      </>
                    )}
                  >
                    {mhyperlinkList?.map((data) => (
                      <Option key={data?.header} value={data?.header}>
                        {data?.header}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            )}
            {selectMeat == "E" && (
              <>
                {/* <Form.Item
                  label="Evaluate Header"
                  name="evaluateCapturedFromHeader"
                >
                  <Input
                    name="evaluateCapturedFromHeader"
                    className={styles.formControl}
                  />
                </Form.Item> */}
                <Form.Item label="Evaluate" name="evaluate">
                  <Input name="evaluate" className={styles.formControl} />
                </Form.Item>
                <Form.Item label="Hyperlinks" name="ehyperlinks">
                  <Select
                    mode="tags"
                    maxTagCount="responsive"
                    className={`ant_select_form hcc_form mb-2`}
                    open={ehyperlinkClose == true ? false : ehyperlinkOpen}
                    onClick={() =>
                      ehyperlinkClose == true
                        ? setEHyperlinkClose(false)
                        : setEHyperlinksOpen(true)
                    }
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <div
                          className={`col-xl-12 ${styles.provideraddheader}`}
                        >
                          <div className="col-xl-12 mt-1">
                            <Input
                              name="header"
                              placeholder="Please enter header name"
                              onChange={handleChangeHyperlink}
                              value={hyperlinkForm?.header}
                            />
                          </div>
                          <div className="col-xl-12 mt-1">
                            <Input
                              name="pageNumber"
                              type="number"
                              placeholder="Please enter page number"
                              onChange={handleChangeHyperlink}
                              value={hyperlinkForm?.pageNumber}
                            />
                          </div>
                          <div className="col-xl-12 mt-1">
                            <Input
                              name="substring"
                              placeholder="Please enter sub string"
                              onChange={handleChangeHyperlink}
                              value={hyperlinkForm?.substring}
                            />
                          </div>
                          <div className="col-xl-12 mt-1">
                            <Input
                              type="date"
                              name="dateOfService"
                              placeholder="Please select date "
                              onChange={handleChangeHyperlink}
                              value={hyperlinkForm?.dateOfService}
                            />
                          </div>
                        </div>
                        <div className={styles.editAction}>
                          <Button
                            className="save-sm-btn"
                            onClick={() => addHyperlink("E")}
                            style={{ width: "50px" }}
                            disabled={
                              hyperlinkForm?.header &&
                              hyperlinkForm?.pageNumber &&
                              hyperlinkForm?.substring &&
                              hyperlinkForm?.dateOfService
                                ? false
                                : true
                            }
                          >
                            Add
                          </Button>
                          <Button
                            className="cancel-sm-btn"
                            style={{
                              width: "50px",
                              marginLeft: "5px",
                              marginRight: "10px",
                            }}
                            onClick={() => {
                              setEHyperlinkClose(true);
                            }}
                          >
                            Close
                          </Button>
                        </div>
                      </>
                    )}
                  >
                    {ehyperlinkList?.map((data) => (
                      <Option key={data?.header} value={data?.header}>
                        {data?.header}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            )}
            {selectMeat == "A" && (
              <>
                {/* <Form.Item
                  label={
                    <label>
                      Assessment Header&nbsp;
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
                </Form.Item> */}
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
                <Form.Item label="Hyperlinks" name="ahyperlinks">
                  <Select
                    mode="tags"
                    maxTagCount="responsive"
                    className={`ant_select_form hcc_form mb-2`}
                    open={ahyperlinkClose == true ? false : ahyperlinkOpen}
                    onClick={() =>
                      ahyperlinkClose == true
                        ? setAHyperlinkClose(false)
                        : setAHyperlinksOpen(true)
                    }
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <div
                          className={`col-xl-12 ${styles.provideraddheader}`}
                        >
                          <div className="col-xl-12 mt-1">
                            <Input
                              name="header"
                              placeholder="Please enter header name"
                              onChange={handleChangeHyperlink}
                              value={hyperlinkForm?.header}
                            />
                          </div>
                          <div className="col-xl-12 mt-1">
                            <Input
                              name="pageNumber"
                              type="number"
                              placeholder="Please enter page number"
                              onChange={handleChangeHyperlink}
                              value={hyperlinkForm?.pageNumber}
                            />
                          </div>
                          <div className="col-xl-12 mt-1">
                            <Input
                              name="substring"
                              placeholder="Please enter sub string"
                              onChange={handleChangeHyperlink}
                              value={hyperlinkForm?.substring}
                            />
                          </div>
                          <div className="col-xl-12 mt-1">
                            <Input
                              type="date"
                              name="dateOfService"
                              placeholder="Please select date "
                              onChange={handleChangeHyperlink}
                              value={hyperlinkForm?.dateOfService}
                            />
                          </div>
                        </div>
                        <div className={styles.editAction}>
                          <Button
                            className="save-sm-btn"
                            onClick={() => addHyperlink("A")}
                            style={{ width: "50px" }}
                            disabled={
                              hyperlinkForm?.header &&
                              hyperlinkForm?.pageNumber &&
                              hyperlinkForm?.substring &&
                              hyperlinkForm?.dateOfService
                                ? false
                                : true
                            }
                          >
                            Add
                          </Button>
                          <Button
                            className="cancel-sm-btn"
                            style={{
                              width: "50px",
                              marginLeft: "5px",
                              marginRight: "10px",
                            }}
                            onClick={() => {
                              setAHyperlinkClose(true);
                            }}
                          >
                            Close
                          </Button>
                        </div>
                      </>
                    )}
                  >
                    {ahyperlinkList?.map((data) => (
                      <Option key={data?.header} value={data?.header}>
                        {data?.header}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            )}
            {selectMeat == "T" && (
              <>
                {/* <Form.Item
                  label="Treatment Header"
                  name="treatmentCapturedFromHeader"
                >
                  <Input
                    name="treatmentCapturedFromHeader"
                    className={styles.formControl}
                  />
                </Form.Item> */}
                <Form.Item label="Treatment" name="treatment">
                  <Input name="treatment" className={styles.formControl} />
                </Form.Item>
                <Form.Item label="Hyperlinks" name="thyperlinks">
                  <Select
                    mode="tags"
                    maxTagCount="responsive"
                    className={`ant_select_form hcc_form mb-2`}
                    open={thyperlinkClose == true ? false : thyperlinkOpen}
                    onClick={() =>
                      thyperlinkClose == true
                        ? setTHyperlinkClose(false)
                        : setTHyperlinksOpen(true)
                    }
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <div
                          className={`col-xl-12 ${styles.provideraddheader}`}
                        >
                          <div className="col-xl-12 mt-1">
                            <Input
                              name="header"
                              placeholder="Please enter header name"
                              onChange={handleChangeHyperlink}
                              value={hyperlinkForm?.header}
                            />
                          </div>
                          <div className="col-xl-12 mt-1">
                            <Input
                              name="pageNumber"
                              type="number"
                              placeholder="Please enter page number"
                              onChange={handleChangeHyperlink}
                              value={hyperlinkForm?.pageNumber}
                            />
                          </div>
                          <div className="col-xl-12 mt-1">
                            <Input
                              name="substring"
                              placeholder="Please enter sub string"
                              onChange={handleChangeHyperlink}
                              value={hyperlinkForm?.substring}
                            />
                          </div>
                          <div className="col-xl-12 mt-1">
                            <Input
                              type="date"
                              name="dateOfService"
                              placeholder="Please select date "
                              onChange={handleChangeHyperlink}
                              value={hyperlinkForm?.dateOfService}
                            />
                          </div>
                        </div>
                        <div className={styles.editAction}>
                          <Button
                            className="save-sm-btn"
                            onClick={() => addHyperlink("T")}
                            style={{ width: "50px" }}
                            disabled={
                              hyperlinkForm?.header &&
                              hyperlinkForm?.pageNumber &&
                              hyperlinkForm?.substring &&
                              hyperlinkForm?.dateOfService
                                ? false
                                : true
                            }
                          >
                            Add
                          </Button>
                          <Button
                            className="cancel-sm-btn"
                            style={{
                              width: "50px",
                              marginLeft: "5px",
                              marginRight: "10px",
                            }}
                            onClick={() => {
                              setTHyperlinkClose(true);
                            }}
                          >
                            Close
                          </Button>
                        </div>
                      </>
                    )}
                  >
                    {thyperlinkList?.map((data) => (
                      <Option key={data?.header} value={data?.header}>
                        {data?.header}
                      </Option>
                    ))}
                  </Select>
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

const enhancer = connect(
  (state) => ({
    patientDetailsResult: state?.patientDetails?.details?.patientResult,
  }),
  {
    getpatientDetailsData: detailsActions.patientDetailsAction,
  }
);
export default enhancer(AddHccForm);
