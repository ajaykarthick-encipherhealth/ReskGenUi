import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { notification } from "antd";
import { Select, Modal } from "antd";
import { Button, Form, Input, Space, DatePicker } from "antd";
import moment from "moment";
import axios from "../../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../../utility/enpoints";
import styles from "../../hcc/styles.module.css";
import { getMeatQueryList } from "../../../../../../store/actions/ReviewerAction/PatientDetailsAction";
import RegularButton from "../../../../../../components/button";
import visitStyles from "../../../../../../styles/visitdata.module.css";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const { Option } = Select;

const EditHccForm = ({
  formValues,
  isEditHccForm,
  setIsEditHccForm,
  handleCloseModal,
}) => {
  // console.log(formValues)
  const dispatch = useDispatch();
  const patientDetailsResult = useSelector(
    (state) => state?.ReviewerReducers?.patientDetails
  );
  // console.log(patientDetailsResult?.result.response?.dos)
  const [isMeatForm, setIsMeatForm] = useState(false);
  const [addValidCodeCheck, setAddValidCodeCheck] = useState(null);
  const [hccFormDetails, setHccFormDetails] = useState(null);
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

  const providerInfoList = [
    { value: "authorizedProvider", label: "Authorized Provider" },
    { value: "noCredential", label: "No Credential" },
    { value: "unAuthorizeProvider", label: "UnAuthorize Provider" },
    { value: "unSigned", label: "Un Signed" },
  ];
  const onFinishHcc = async (form) => {
    var patientId = localStorage.getItem("patientId");
    var orgId = localStorage.getItem("orgId");
    var dataFormat = {
      patientId: patientId,
      orgId: orgId,
      previousDiagnosisCode: form.diagnosisCode,
      newPreviousDiagnosisCode: form.diagnosisCode,
      year: patientDetailsResult?.result.response?.dos,
      headers: form.sections,
      providers: form.selectProviderInfo,
      encounterDate: form.encounterDates,
    };
    console.log(dataFormat);
    console.log(providerInfoAllDetails);
    // try {
    //   const response = await axios.post(
    //     ENDPOINTS.apiEndoint +
    //       `aiservice/patient/update`,
    //     dataFormat
    //   );
    //   if (response?.status == 200) {
    //     handleCloseModal();
    //     notification.success({
    //       message: "Updated Successfully!",
    //       placement: "top",
    //       duration: 1,
    //     });
    //     dispatch(
    //       getMeatQueryList(
    //         patientDetailsResult?.result?.response?.dos,
    //         patientId
    //       )
    //     );
    //   } else {
    //   }
    // } catch (e) {}
  };

  const onFinishFailed = (form) => {};
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
      providersAllDetails.push({ name: providerName, info: providerInfo });
      providers.push({ value: providerName, label: providerName });
      selectProviders.push(providerName);
      setProviderNameList([...providers, ...providerNameList]);
      setProviderInfoAllDetails([
        ...providersAllDetails,
        ...providerInfoAllDetails,
      ]);
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
        dates.push({
          value: moment(encounterDate).format("MM/DD/YYYY"),
          label: moment(encounterDate).format("MM/DD/YYYY"),
        });
        setEncounterList([...dates, ...encounterList]);
        setEncounterDate("");
      } else {
        notification.warning({
          message: "Already encounter date is present",
          placement: "top",
          duration: 1,
        });
      }
    }else{ notification.warning({
      message: "Please select date",
      placement: "top",
      duration: 1,
    });
  }
  };

  const closeModal = () => {
    setProviderInfoSelectClose(true);
    setTimeout(() => {
      setIsEditHccForm(false);
    }, 1);
  };

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
    setTimeout(() => {
      setIsFormShow(true);
    }, 1);
  }, [formValues?.providerName]);

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
              name="validateOnly"
              layout="vertical"
              autoComplete="off"
              initialValues={{
                diagnosisCode: formValues?.diagnosisCode,
                actualDescription: formValues?.dbDescription,
                selectProviderInfo: selectProviderNameList,
                encounterDates: selectEncounterList,
                sections: selectSectionList,
              }}
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
                              disabled={providerName && providerInfo.length !=0 ? false : true}
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
                              Cancel
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
