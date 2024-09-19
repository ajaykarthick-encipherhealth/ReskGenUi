import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, connect } from "react-redux";
import { Modal } from "antd";
import { Button } from "react-bootstrap";
import { Offcanvas } from "react-bootstrap";
import { Input, notification, Form, Space } from "antd";
import { Select } from "antd";
import moment from "moment";
import {
  submitMeatQuery,
  updateMeatQuery,
} from "../../../../../services/PatientsListSevice";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";
import styles from "../../hcc/styles.module.css";
import visitStyles from "../../../../../styles/visitdata.module.css";
import RegularButton from "../../../../../components/button";
import { actions as detailsActions } from "../../../../../stores/patient/details";
import { getResponePopup } from "../../../../../utils/reusable";

const { Option } = Select;
const { TextArea } = Input;

const AddMeatQuery = ({
  handleCloseModal,
  isMeatQueryModal,
  setIsMeatQueryModal,
  isUpdate,
  queryFormValues,
  patientDetailsResult,
  getMeatQueryList,
  year,
  isDosSelected = "",
  getpatientDetailsData
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [meatQueryResult, setMeatQueryResult] = useState([]);
  const [meatQueryUpdate, setMeatQueryUpdate] = useState(false);
  const [addValidCodeCheck, setAddValidCodeCheck] = useState(null);
  const [meatQueriedDetailsModal, setMeatQueriedDetailsModal] = useState(false);
  const [meatQueriedDetailsShow, setMeatQueriedDetailsShow] = useState(true);
  const [inputValue, setInputValue] = useState({
    queryComment: "",
  });
  const [formInitialValues, setFormInitialValues] = useState(null);

  const headersList = [
    { value: "A/P", label: "A/P" },
    { value: "PMH", label: "PMH" },
    { value: "HPI", label: "HPI" },
    { value: "Physical Exam", label: "Physical Exam" },
    { value: "VITALS", label: "VITALS" },
    { value: "OTHERS", label: "OTHERS" },
  ];

  const queryReasons = [
    { value: "Diagnosis Not Supported", label: "Diagnosis Not Supported" },
    { value: "H/o condition", label: "H/o condition" },
    { value: "MEAT not Sufficient", label: "MEAT not Sufficient" },
    { value: "Imaging Query", label: "Imaging Query" },
    { value: "More Specific Diagnosis", label: "More Specific Diagnosis" },
    { value: "OTHERS", label: "OTHERS" },
  ];

  const imagingtest = [
    { value: "A/P", label: "A/P" },
    { value: "PMH", label: "PMH" },
    { value: "HPI", label: "HPI" },
    { value: "Physical Exam", label: "Physical Exam" },
    { value: "VITALS", label: "VITALS" },
    // { value: "OTHERS", label: "OTHERS" },
    { value: "X-ray", label: "X-ray" },
    { value: "CT Scan", label: "CT Scan" },
    { value: "MRI", label: "MRI" },
    { value: "Ultrasound", label: "Ultrasound" },
    { value: "PET Scan", label: "PT Scan " },
    { value: "Mammography", label: "Mammography" },
    { value: "Fluoroscopy", label: "Fluoroscopy" },
    { value: "Bone Densitometry", label: "Bone Densitometry" },
    { value: "Nuclear Medicine Imaging", label: "Nuclear Medicine Imaging" },
    { value: "Angiography", label: "Angiography" },
    { value: "Myelography", label: "Myelography" },
    { value: "Arthrogram", label: "Arthrogram" },
    { value: "Barium Swallow/Test", label: "Barium Swallow/Test" },
    { value: "Hysterosalpingography", label: "Hysterosalpingography" },
    { value: "Fistulogram", label: "Fistulogram" },
    { value: "Cholangiography", label: "Cholangiography" },
    { value: "Sialography", label: "Sialography" },
    { value: "Discography", label: "Discography" },
    { value: "Lymphangiography", label: "Lymphangiography" },
    { value: "Intravenous Pyelogram", label: "Intravenous Pyelogram" },
    { value: "OTHERS", label: "OTHERS" },
  ];

  const onFinish = async (value) => {
    var patientId = localStorage.getItem("patientId");
    var dataformat = {
      patientId: patientId,
      diagnosisCode: value.diagnosisCode?.toLowerCase(),
      queryReason: value.queryReason,
      providerName: value.providerName
        ? value.providerName
        : queryFormValues?.providerNames[0],
      headerName: value.headerName,
      description: value.description,
      dateOfService: value.dateOfService
        ? value.dateOfService
        : queryFormValues?.dateOfServices[0],
    };
    if (isUpdate) {
      var result = await updateMeatQuery(dataformat);
      if (result.status == "SUCCESS") {
        getResponePopup({
          message: "Query updated successfully.",
          status: "SUCCESS",
        });
        setIsMeatQueryModal(false);
        inputValue.queryComment = result.response.queryComment;
        setMeatQueryResult(result.response);
        form.resetFields();
        // setMeatQueriedDetailsModal(true);
        getMeatQueryList(patientId, year, isDosSelected);
        getpatientDetailsData(patientId, year, isDosSelected)
      }
    } else {
      var result = await submitMeatQuery(dataformat);
      if (result.status == "SUCCESS") {
        getResponePopup({
          message: "Query submitted successfully.",
          status: "SUCCESS",
        });
        setIsMeatQueryModal(false);
        inputValue.queryComment = result.response.queryComment;
        setMeatQueryResult(result.response);
        form.resetFields();
        // setMeatQueriedDetailsModal(true);
        getMeatQueryList(patientId, year, isDosSelected);
        getpatientDetailsData(patientId, year, isDosSelected)
      }
    }
  };

  const updateMeatQueryComments = async () => {
    var patientId = localStorage.getItem("patientId");
    var updateDataformat = {
      patientId: patientId,
      diagnosisCode: formInitialValues?.diagnosisCode,
      dos: patientDetailsResult?.data?.response?.dos,
      queryComment: inputValue.queryComment,
    };
    var result = await updateMeatQuery(updateDataformat);
    if (result.status == "SUCCESS") {
      setMeatQueryResult(result.response);
      setIsMeatQueryModal(false);
      notification.success({
        message: result.message,
        placement: "top",
        duration: 1,
      });
      setMeatQueriedDetailsModal(false);
      setMeatQueriedDetailsShow(false);
    } else {
    }
  };

  const handleChange = async (e) => {
    const key = e.target.name;
    if (key == "diagnosisCodeQuery") {
      getFindValidDiagnosisCode(e.target.value);
    }
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  const handleSelect = (value, title) => {
    setInputValue({ ...inputValue, [title]: value });
  };

  const handleChangeCode = (e) => {
    getFindValidDiagnosisCode(e.target.value);
  };

  const emailSplitFunction = (email) => {
    if (meatQueriedDetailsModal) {
      let emailSplit = email?.split("@");
      if (emailSplit) {
        return emailSplit[0].charAt(0).toUpperCase() + emailSplit[0].slice(1);
      }
    }
  };

  const getFindValidDiagnosisCode = async (value) => {
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

  useEffect(() => {
    var initalForm = {
      diagnosisCode: queryFormValues?.diagnosisCode,
      providerName: queryFormValues?.providerName
        ? queryFormValues?.providerNames[0]
        : "",
      dateOfService: queryFormValues?.dateOfService
        ? queryFormValues?.dateOfServices[0]
        : "",
      headerName: queryFormValues?.headerName,
      queryReason: queryFormValues?.queryReason,
      description: queryFormValues?.diseaseName
        ? queryFormValues?.diseaseName
        : queryFormValues?.description,
    };
    if (queryFormValues?.providerName) {
      setMeatQueryUpdate(true);
    }
    setFormInitialValues(initalForm);
    form.setFieldsValue(initalForm);
  }, [queryFormValues, form]);

  return (
    <>
      <Offcanvas
        onHide={handleCloseModal}
        show={isMeatQueryModal}
        className="offcanvas-end"
        placement="end"
      >
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">
            Meat Query
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => handleCloseModal()}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="container-fluid">
            <Form
              form={form}
              name="validateOnly"
              layout="vertical"
              autoComplete="off"
              initialValues={formInitialValues}
              onFinish={onFinish}
            >
              <Form.Item label="DX Code" name="diagnosisCode">
                <Input
                  name="diagnosisCode"
                  onChange={handleChangeCode}
                  className={styles.formControl}
                  disabled
                />
              </Form.Item>
              <Form.Item label="Description" name="description">
                <Input
                  name="description"
                  className={styles.formControl}
                  disabled
                />
              </Form.Item>
              <Form.Item>
                <Form.Item
                  label={
                    <label>
                      Quick Query<span className="text-danger">*</span>
                    </label>
                  }
                  name="headerName"
                  rules={[
                    {
                      required: true,
                      message: "Please select Quick Query",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    maxTagCount="responsive"
                    className={`ant_select_form hcc_form mb-2`}
                    options={imagingtest}
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <label>
                      Query Reason<span className="text-danger">*</span>
                    </label>
                  }
                  name="queryReason"
                  rules={[
                    {
                      required: true,
                      message: "Please select Query Reason",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    maxTagCount="responsive"
                    className={`ant_select_form hcc_form mb-2`}
                    options={queryReasons}
                  />
                </Form.Item>
                {/* <Form.Item
                  label="Radiology Suggest"
                  name="imagingTestHeader"
                  rules={[
                    {
                      required: false,
                      message: "Please select radiology suggest",
                    },
                  ]}
                >
                  <Select
                    className={`ant_select_form hcc_form mb-2`}
                    allowClear
                  >
                    {imagingtest?.map((data) => (
                      <Option key={data?.value} value={data?.value}>
                        {data?.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Reason For Suggest *"
                  name="queryReason"
                  rules={[
                    {
                      required: true,
                      message: "Please select reason for suggest",
                    },
                  ]}
                >
                  <Select
                    className={`ant_select_form hcc_form mb-2`}
                    allowClear
                  >
                    {queryReasons?.map((data) => (
                      <Option key={data?.value} value={data?.value}>
                        {data?.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Description *"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please enter description",
                    },
                  ]}
                >
                  <TextArea
                    name="actualDescription"
                    className="form-textarea"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                  />
                </Form.Item>
                {meatQueryUpdate && (
                  <Form.Item
                    label="Reason *"
                    name="reason"
                    rules={[
                      {
                        required: true,
                        message: "Please enter reason",
                      },
                    ]}
                  >
                    <TextArea
                      name="reason"
                      className="form-textarea"
                      autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                  </Form.Item>
                )} */}

                <Space>
                  <RegularButton type="submit" name="Save" width={100} />
                  <RegularButton
                    type="outline"
                    name="Cancel"
                    width={100}
                    method="reset"
                    onClick={() => {
                      handleCloseModal();
                    }}
                  />
                </Space>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Offcanvas>
      <Modal
        title="Meat Queried Details"
        centered
        open={meatQueriedDetailsModal}
        onOk={handleCloseModal}
        onCancel={() => setMeatQueriedDetailsModal(false)}
        footer={null}
        className="meat-queriedmodal visitdata-modalCentent"
      >
        <div className="offcanvas-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-6">
                <div className={styles.publishedByDetails}>
                  <span className={styles.meatQueried_head}>
                    {meatQueryResult.diagnosisCode}
                  </span>
                  <p className={styles.meatQueried_details}>
                    {meatQueryResult.description}
                  </p>
                </div>
              </div>
              <div className="col-xl-6">
                <div className={styles.publishedByDetails}>
                  <span className={styles.meatQueried_head}>
                    Published By :
                  </span>
                  <p className={styles.publisheddetails}>
                    Name - {emailSplitFunction(meatQueryResult.createdBy)}
                  </p>
                  <p className={styles.publisheddetails}>
                    Date & Time -{" "}
                    {moment(meatQueryResult.createdAt).format(
                      "MM-DD-YYYY && HH:MM:SS"
                    )}
                  </p>
                  <p className={styles.publisheddetails}>
                    Reason - {meatQueryResult.reason}
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.meatCommentCard}>
              <div className={styles.meatCommentCard2}>
                <div>
                  <span className={styles.meatQueried_head}>Subject</span>
                  <p className={styles.meatQueried_details}>
                    We've identified the following details that may pertain to
                    records associated with{" "}
                    <b>{patientDetailsResult?.data?.response?.patientName}</b>.
                  </p>
                </div>
                <div>
                  <span className={styles.meatQueried_head}>
                    Dear Dr {meatQueryResult.providerName}
                  </span>
                  {!meatQueriedDetailsShow ? (
                    <p className={styles.meatQueried_details}>
                      {meatQueryResult.queryComment}
                    </p>
                  ) : (
                    <textarea
                      className={`${styles.queryTextarea}`}
                      id="queryComment"
                      name="queryComment"
                      onChange={handleChange}
                      rows="5"
                      value={inputValue.queryComment}
                    ></textarea>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.meat_queryfooterBtn}>
              <button
                className={styles.meat_querySaveBtn}
                onClick={() => updateMeatQueryComments(false)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

const enhancer = connect(
  (state) => ({
    patientDetailsResult: state?.patientDetails?.details?.result,
    isDosSelected: state.patientDetails.details?.getSelectedDosDetails,
  }),
  {
    getpatientDetailsData: detailsActions.patientDetailsAction,
    getMeatQueryList: detailsActions.meatQueryAction,
  }
);
export default enhancer(AddMeatQuery);
