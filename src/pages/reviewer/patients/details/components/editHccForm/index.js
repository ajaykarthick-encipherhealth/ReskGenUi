import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { notification } from "antd";
import { Select, Modal } from "antd";
import { Button, Form, Input, Space, DatePicker } from "antd";
import moment from "moment";
import axios from "../../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../../utility/enpoints";
import styles from "../../hcc/styles.module.css";
import { getPatientDetailsResult } from "../../../../../../store/actions/ReviewerAction/PatientDetailsAction";
import RegularButton from "../../../../../../components/button";
import visitStyles from "../../../../../../styles/visitdata.module.css";

const { TextArea } = Input;

const { Option } = Select;

const EditHccForm = ({
  formValues,
  isEditHccForm,
  setIsEditHccForm,
  formEditPlace,
}) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch();
  const patientDetailsResult = useSelector(
    (state) => state?.ReviewerReducers?.patientDetails
  );
  const [addValidCodeCheck, setAddValidCodeCheck] = useState(true);
  const [providerNameList, setProviderNameList] = useState([]);
  const [selectProviderNameList, setSelectProviderNameList] = useState([]);
  const [encounterList, setEncounterList] = useState([]);
  const [selectEncounterList, setSelectEncounterList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectSectionList, setSelectSectionList] = useState([]);
  const [isFormShow, setIsFormShow] = useState(false);
  const [providerName, setProviderName] = useState(null);
  const [providerInfo, setProviderInfo] = useState([]);
  const [encounterDate, setEncounterDate] = useState("");
  const [providerInfoSelectOpen, setProviderInfoSelectOpen] = useState(false);
  const [providerInfoSelectClose, setProviderInfoSelectClose] = useState(false);
  const [providerInfoAllDetails, setProviderInfoAllDetails] = useState([]);
  const [formInitialValues, setFormInitialValues] = useState(null);
  const [isCheck, setIsCHeck] = useState(true);

  const providerInfoList = [
    { value: "authorizedProvider", label: "Authorized Provider" },
    { value: "noCredential", label: "No Credential" },
    { value: "unAuthorizeProvider", label: "UnAuthorize Provider" },
    { value: "unSigned", label: "Un Signed" },
  ];
  const onFinishHcc = async (form) => {
    if (addValidCodeCheck == true || addValidCodeCheck == null) {
      var patientId = localStorage.getItem("patientId");
      const dateList = form.encounterDates;
      var providerGet = [];
      console.log(providerInfoAllDetails,form.selectProviderInfo,formValues)

      if (providerInfoAllDetails) {
        providerGet = providerInfoAllDetails?.filter((o1) =>
          form.selectProviderInfo.some((o2) => o1.providerName === o2)
        );
      }
      var dataFormat = {
        patientId: patientId,
        oldDiagnosisCode: formValues.diagnosisCode,
        newDiagnosisCode: form.diagnosisCode,
        year: patientDetailsResult?.result.response?.dos,
        capturedSections: form.sections,
        provider: providerGet,
        encounterDate: dateList.join(", "),
        diseaseSource: formEditPlace,
        description: form.actualDescription,
      };
      try {
        const response = await axios.put(
          ENDPOINTS.apiEndoint + `aiservice/disease/editdisease`,
          dataFormat
        );
        if (response?.data?.status == "SUCCESS") {
          setProviderInfoSelectClose(true);
          setTimeout(() => {
            setIsEditHccForm(false);
          }, 1);
          notification.success({
            message: "Updated Successfully!",
            placement: "top",
            duration: 1,
          });
          dispatch(getPatientDetailsResult(patientId));
        } else {
        }
      } catch (e) {}
    } else {
      notification.warning({
        message: "Please enter valid diagnosis code ",
        placement: "top",
        duration: 1,
      });
    }
  };

  const onFinishFailed = (form) => {};
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
      console.log(providerInfoAllDetails)
      setProviderName(null);
      setProviderInfo([]);
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

  const closeModal = () => {
    setProviderInfoSelectClose(true);
    setTimeout(() => {
      setIsEditHccForm(false);
    }, 1);
  };

  useEffect(() => {
    var initalForm = {
      diagnosisCode: formValues?.diagnosisCode,
      actualDescription: formValues?.dbDescription,
      selectProviderInfo: selectProviderNameList,
      encounterDates: selectEncounterList,
      sections: selectSectionList,
    };
    setFormInitialValues(initalForm);
    console.log(initalForm)
    form.setFieldsValue(initalForm)
  }, [selectEncounterList, selectProviderNameList,form]);

  useEffect(() => {
    setIsFormShow(false);
    setProviderNameList([]);
    setSelectProviderNameList([]);
    var providers = [];
    var selectProviders = [];
    var dates = [];
    var selectDates = [];
    var section = [];
    var selectSection = [];
    formValues?.providerName?.map((res) => {
      providers.push({ value: res, label: res });
      selectProviders.push(res);
    });
    formValues?.encounterDateSplit?.map((res) => {
      dates.push({ value: res, label: res });
      selectDates.push(res);
    });
    formValues?.capturedSections?.map((res) => {
      section.push({ value: res, label: res });
      selectSection.push(res);
    });
    setProviderNameList(providers);
    setSelectProviderNameList(selectProviders);
    setEncounterList(dates);
    setSelectEncounterList(selectDates);
    setSectionList(section);
    setSelectSectionList(selectSection);
    console.log(formValues.providerDeatils)
    if (formValues?.providerDeatils) {
      setProviderInfoAllDetails(formValues.providerDeatils);
    }
    var initalForm = {
      diagnosisCode: formValues?.diagnosisCode,
      actualDescription: formValues?.dbDescription,
      selectProviderInfo: selectProviders,
      encounterDates: selectDates,
      sections: selectSection,
    };
    setFormInitialValues(initalForm);
    setTimeout(() => {
      setIsFormShow(true);
    }, 1);
  }, [formValues]);

  return (
    <>
      <Modal
        title="Edit"
        centered
        open={isEditHccForm}
        onOk={() => {
          setIsEditHccForm(false);
        }}
        onCancel={() => {
          closeModal();
        }}
        width="50%"
        footer={false}
      >
        {isFormShow ? (
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
                    label="Code *"
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
                </div>
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
                                value={providerName}
                                onChange={onChangeName}
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
                <div className="col-xl-6">
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
                <div className="col-xl-12">
                  <Form.Item label="Description" name="actualDescription">
                    <TextArea
                      name="actualDescription"
                      className="form-textarea"
                      autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                  </Form.Item>
                </div>
              </div>
              <Form.Item>
                <Space>
                  <RegularButton type="submit" name="Update" width={100} />
                  <RegularButton
                    type="outline"
                    name="Cancel"
                    width={100}
                    method="reset"
                    onClick={() => {
                      closeModal();
                    }}
                  />
                </Space>
              </Form.Item>
            </Form>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default EditHccForm;
