import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "antd";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Offcanvas } from "react-bootstrap";
import { notification } from "antd";
import { Select } from "antd";
import moment from "moment";
import {
  submitMeatQuery,
  updateMeatQuery,
} from "../../../../../../services/PatientsListSevice";
import axios from "../../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../../utility/enpoints";
import styles from "../../hcc/styles.module.css";
import { getMeatQueryList } from "../../../../../../store/actions/ReviewerAction/PatientDetailsAction";

const { Option } = Select;

const AddMeatQuery = ({
  handleCloseModal,
  isMeatQueryModal,
  diagnosisCode,
  setIsMeatQueryModal,
  meatEditQueryRes,
  save
}) => {
  const dispatch = useDispatch();
  const patientDetailsResult = useSelector(
    (state) => state?.ReviewerReducers?.patientDetails
  );
  const [validated, setValidated] = useState(false);
  const [meatQueryResult, setMeatQueryResult] = useState([]);
  const [meatQueryUpdate, setMeatQueryUpdate] = useState(false);
  const [addValidCodeCheck, setAddValidCodeCheck] = useState(null);
  const [meatQueriedDetailsModal, setMeatQueriedDetailsModal] = useState(false);
  const [meatQueriedDetailsShow, setMeatQueriedDetailsShow] = useState(true);
  const [formErr, setFormErr] = useState({
    providername: "",
    quickQuery: "",
    imagingQuery: "",
    queryReason: "",
    description: "",
  });
  const [inputValue, setInputValue] = useState({
    year: "",
    name: "",
    patientId: "",
    notes: "",
    diagnosisCode: "",
    actualDescription: "",
    capturedSections: "",
    encodedDate: "",
    flag: "",
    comments: "",
    description: "",
    queryReason: "",
    providerName: "",
    imagingTestHeader: "",
    headerName: "",
    queryComment: "",
    reason: "",
    diagnosisCodeQuery: diagnosisCode,
    comboCode: "",
    additionalCode: "",
  });

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

  const handleSubmitMeatQuery = async (event) => {
    setValidated(true);
    const form = event.currentTarget;
    event.preventDefault();
    if (
      inputValue?.providerName === "" ||
      inputValue?.headerName === "" ||
      inputValue?.imagingTestHeader === "" ||
      inputValue?.queryReason === "" ||
      inputValue?.description === "" ||
      inputValue?.reason === "" 
    ) {
      let errors = {
        providername:
          inputValue?.providerName === "" ? "Please enter provider name" : "",
        quickQuery:
          inputValue?.headerName === "" ? "Please select quick query" : "",
        imagingQuery:
          inputValue?.imagingTestHeader === ""
            ? "Please select imaging query"
            : "",
        queryReason:
          inputValue?.queryReason === "" ? "Please select quick reason" : "",
        description:
          inputValue?.description === "" ? "Please enter description" : "",
      };

      setFormErr(errors);
    } else {
      if (form.checkValidity() === true) {
        setValidated(false);
        var patientId = localStorage.getItem("patientId");
        var dataformat = {
          patientId: patientId,
          diagnosisCode: diagnosisCode,
          queryReason: inputValue.queryReason,
          Reason: inputValue.reason,
          providerName: inputValue.providerName,
          imagingTestHeader: inputValue.imagingTestHeader,
          headerName: inputValue.headerName,
          dosYear: patientDetailsResult?.result?.response?.dos,
          description: inputValue.description,
        };
        var result = await submitMeatQuery(dataformat);
        if (result.status == "SUCCESS") {
            setIsMeatQueryModal(false);
          setMeatQueryResult(result.response);
          inputValue.queryComment = result.response.queryComment;
          setMeatQueriedDetailsModal(true);
          inputValue.providerName = "";
          inputValue.headerName = "";
          inputValue.imagingTestHeader = "";
          inputValue.description = "";
          inputValue.queryReason = "";
          inputValue.reason = "";
          dispatch(
            getMeatQueryList(
              patientDetailsResult?.result?.response?.dos,
              patientId
            )
          );
        }
      }
    }
  };
  const updateMeatQueryComments = async () => {
    var patientId = localStorage.getItem("patientId");
    var updateDataformat = {
      patientId: patientId,
      diagnosisCode: diagnosisCode,
      dos: patientDetailsResult?.result?.response?.dos,
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

  const emailSplitFunction = (email) => {
    if (meatQueriedDetailsModal) {
      let emailSplit = email?.split("@");
      return emailSplit[0].charAt(0).toUpperCase() + emailSplit[0].slice(1);
    }
  };

  const getFindValidDiagnosisCode = async (value) => {
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
  };

  useEffect(() => {
    if (validated == true) {
      let errors = {
        providername:
          inputValue?.providerName === "" ? "Please enter provider name" : "",
        quickQuery:
          inputValue?.headerName === "" ? "Please select quick query" : "",
        imagingQuery:
          inputValue?.imagingTestHeader === ""
            ? "Please select imaging query"
            : "",
        queryReason:
          inputValue?.queryReason === "" ? "Please select quick reason" : "",
        description:
          inputValue?.description === "" ? "Please enter description" : "",
      };
      setFormErr(errors);
    }
  }, [inputValue]);
  useEffect(() => {
      setFormErr("");
      inputValue.providerName = "";
      inputValue.headerName = "";
      inputValue.imagingTestHeader = "";
      inputValue.description = "";
      inputValue.queryReason = "";
      inputValue.reason = "";
  }, [diagnosisCode]);
  useEffect(() => {
    setFormErr("");
    inputValue.providerName = meatEditQueryRes?.providerName;
      inputValue.headerName = meatEditQueryRes?.headerName;
      inputValue.imagingTestHeader = meatEditQueryRes?.imagingTestHeader;
      inputValue.description = meatEditQueryRes?.description;
      inputValue.queryReason = meatEditQueryRes?.queryReason;
      inputValue.reason = meatEditQueryRes?.reason;
      setMeatQueryUpdate(true);
}, [meatEditQueryRes]);
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
            <Form noValidate onSubmit={handleSubmitMeatQuery}>
              <div className="row">
                <div className="col-xl-12 mb-3">
                  <Form.Label>
                    DX Code <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    id="diagnosisCodeQuery"
                    name="diagnosisCodeQuery"
                    value={diagnosisCode}
                    onChange={handleChange}
                  />
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
                <div className="col-xl-12 mb-3">
                  <Form.Label>Provider name</Form.Label>
                  <Form.Control
                    type="text"
                    id="providerName"
                    name="providerName"
                    value={inputValue?.providerName}
                    onChange={handleChange}
                  />
                  {formErr?.providername && (
                    <div className="text-danger fs-12">
                      {formErr?.providername}
                    </div>
                  )}
                </div>
                <div className="col-xl-12 mb-4">
                  <Form.Label>
                    Quick Query <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Select
                    defaultValue={inputValue?.headerName}
                    className={`ant_select_form hcc_form mb-2`}
                    onChange={(value) => handleSelect(value, "headerName")}
                  >
                    {headersList?.map((data) => (
                      <Option key={data?.value} value={data?.value}>
                        {data?.label}
                      </Option>
                    ))}
                  </Select>
                  {formErr?.quickQuery && (
                    <div className="text-danger fs-12">
                      {formErr?.quickQuery}
                    </div>
                  )}
                </div>
                <div className="col-xl-12 mb-4">
                  <Form.Label>
                    Imaging Query <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Select
                    defaultValue={inputValue?.imagingTestHeader}
                    className={`ant_select_form hcc_form mb-2`}
                    onChange={(value) =>
                      handleSelect(value, "imagingTestHeader")
                    }
                  >
                    {imagingtest?.map((data) => (
                      <Option key={data?.value} value={data?.value}>
                        {data?.label}
                      </Option>
                    ))}
                  </Select>
                  {formErr?.imagingQuery && (
                    <div className="text-danger fs-12">
                      {formErr?.imagingQuery}
                    </div>
                  )}
                </div>
                <div className="col-xl-12 mb-4">
                  <Form.Label>
                    Query Reason <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Select
                    defaultValue={inputValue?.queryReason}
                    className={`ant_select_form hcc_form mb-2`}
                    onChange={(value) => handleSelect(value, "queryReason")}
                  >
                    {queryReasons?.map((data) => (
                      <Option key={data?.value} value={data?.value}>
                        {data?.label}
                      </Option>
                    ))}
                  </Select>
                  {formErr?.queryReason && (
                    <div className="text-danger fs-12">
                      {formErr?.queryReason}
                    </div>
                  )}
                </div>
                <div className="col-xl-12 mb-4">
                  <Form.Label>
                    Description <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    onChange={handleChange}
                    value={inputValue?.description}
                    rows="5"
                  ></textarea>
                </div>
                {meatQueryUpdate ? (
                  <div className="col-xl-12 mb-4">
                    <Form.Label>
                      Reason   <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <textarea
                      className="form-control"
                      id="reason"
                      name="reason"
                      onChange={handleChange}
                      rows="5"
                      value={inputValue?.reason}
                    ></textarea>
                  </div>
                ) : null}
                {formErr?.reason && (
                  <div className="text-danger fs-12">
                    {formErr?.reason}
                  </div>
                )}
              </div>

              <div>
                <Button type="submit" className="btn btn-primary btn-sm me-1">
                  Submit
                </Button>
                <Button
                  onClick={() => handleCloseModal()}
                  className="btn btn-danger btn-sm light ms-1"
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Offcanvas>
      <Modal
        title="Meat Queried Details"
        centered
        open={meatQueriedDetailsModal}
        onOk={handleCloseModal}
        onCancel={()=>setMeatQueriedDetailsModal(false)}
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
                    <b>{patientDetailsResult?.result?.response?.patientName}</b>
                    .
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

export default AddMeatQuery;
