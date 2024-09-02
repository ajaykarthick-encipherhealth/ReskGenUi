import React, { useState, useEffect } from "react";
import { notification, Select } from "antd";
import { connect, useSelector } from "react-redux";
import { Button, Offcanvas } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import axios from "../../../../../utility/axiosConfig";
import { validateYear } from "../../../../headerFilters/functions";
import ENDPOINTS from "../../../../../utility/enpoints";
import { actions as detailsActions } from "../../../../../stores/patient/details";
import { getResponePopup, validateFileName } from "../../../../../utils/reusable";

const AddLabForm = ({
  setOpen,
  open,
  patientDetailsResult,
  getPatientLabDosList,
  processedYearResult,
  title
}) => {
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState({ year: "", emr:"" });
  const [inputValue, setInputValue] = useState({
    year: "",
    name: "",
    patientId: "",
  });
  const [emrType, setEmrType] = useState("");
  const [selectFile, setSelectFile] = useState(null);

  const handleChange = async (e, name) => {
    const key =  name == "dos" ? "dos" : e.target.name;
    const value = name == "dos" ? e : e.target.value;
    if (e?.target?.name === "year") {
      const validateYearField = validateYear(e.target.value, setError);
      if (validateYearField) {
        setError({ ...error, year: "" });
        setInputValue({ ...inputValue, [key]: value });
      } else {
        console.log(validateYearField);
      }
    } else if (name == "dos") {
      if (value) {
        setInputValue({ ...inputValue, [key]: value });
        setError({ ...error, emr: "" });
      } else {
        setError({ ...error, emr: "Please Select EMR Type" });
      }
    } else {
      setInputValue({ ...inputValue, [key]: value });
    }
  };

  const handleFileChange = (files) => {
    const file = files[0];
    if (file && validateFileName(file.name)) {
      setSelectFile(file);
    } else {
      message.error("Invalid files");
      const fileValue = document.getElementById("fileInput");
      fileValue.value = "";
    }
  };

  const handleSubmitReport = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true && emrType) {
      setIsLoadingBtn(true);
      event.preventDefault();
      event.stopPropagation();
      submitReport();
    } else if (!emrType) {
      setError({ ...error, emr: "Please Select EMR Type" });
    }
    setValidated(true);
  };

  const submitReport = async () => {
    const orgId = localStorage.getItem("orgId");
    const tenId = localStorage.getItem("tenantId");
    const uId = localStorage.getItem("userId");
    const formData = new FormData();
    formData.append("file", selectFile);
    formData.append("orgid", orgId);
    formData.append("tenantid", tenId);
    formData.append("userid", uId);
    formData.append("patientid", inputValue.patientId);
    formData.append("dos", inputValue.year);
    formData.append("emrtype", emrType);
    const headers = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    var apiUrl = ENDPOINTS.apiEndoint +`aiservice/ai/upload/radiology`;
    if(title == "LAB"){
      apiUrl = ENDPOINTS.apiEndoint +`aiservice/ai/upload/lab`;
    }
    try {
      const response = await axios.post(apiUrl,
        formData,
        headers
      );
      var res = response.data;
      if (res?.status == "SUCCESS") {
        getPatientLabDosList(
          patientDetailsResult?.data?.response?.patientId,
          processedYearResult?.data?.response[0]
        );
        setOpen(false);
        setIsLoadingBtn(false);
        getResponePopup(response);
      } else if (res?.status == "CUSTOM_EXCEPTION") {
        setIsLoadingBtn(false);
        getResponePopup(response);
      } else if (res?.status == "USER_DEFINED_ERROR") {
        setIsLoadingBtn(false);
        getResponePopup(response);
      }
    } catch (error) {
      setIsLoadingBtn(false);
    }
  };
  const handleClose = () => {
    setOpen(false);
    setError({ year: "", emr: "" })
    setEmrType('')
  }

  useEffect(() => {
    inputValue.patientId = patientDetailsResult?.data?.response?.patientId;
    inputValue.name = patientDetailsResult?.data?.response?.patientName;
  }, [patientDetailsResult?.data?.response]);

  return (
    <Offcanvas
      onHide={setOpen}
      show={open}
      className="offcanvas-end"
      placement="end"
    >
      <div className="offcanvas-header">
        {title == "LAB" ?
        <h5 className="modal-title" id="#gridSystemModal">
          Add Patient Lab Report
        </h5>:  <h5 className="modal-title" id="#gridSystemModal">
        Add Patient Radiology
        </h5>}
        <button
          type="button"
          className="btn-close"
          onClick={handleClose}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div className="offcanvas-body">
        <div className="container-fluid">
          <Form noValidate validated={validated} onSubmit={handleSubmitReport}>
            <div className="row">
              <div className="col-xl-12 mb-3">
                <Form.Label>
                  Patient ID
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  name="patientId"
                  required
                  type="text"
                  value={inputValue.patientId}
                  onChange={handleChange}
                />
              </div>
              <div className="col-xl-12 mb-3">
                <Form.Label>
                  Year of Service
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  name="year"
                  required
                  type="number"
                  min="1"
                  onChange={handleChange}
                />
                {error?.year && (
                  <div className="text-danger fs-12">{error.year}</div>
                )}
              </div>

              <div className="col-xl-12 mb-3">
                <Form.Label>
                  File
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="application/pdf,text/plain"
                  required
                  onChange={(e) => handleFileChange(e.target.files)}
                  disabled={isLoadingBtn ? true : false}
                />
              </div>
              <div className="col-xl-12 mb-3">
              <Form.Label>
                EMR Type<span className="text-danger">*</span>
              </Form.Label>
              <Select
                // mode="multiple"
                showSearch
                name="emrType"
                maxTagCount="responsive"
                className={`ant_select_form hcc_form mb-2`}
                onChange={(selOption, val) => {
                  handleChange(selOption, "dos");
                  setEmrType(selOption);
                }}
                value={emrType}
                options={[
                  { label: "ADSC", value: "ADSC" },
                  { label: "Advanced MD", value: "Advanced MD" },
                  { label: "Amazing Charts", value: "Amazing Charts" },
                  { label: "Aprima", value: "Aprima" },
                  { label: "Athena", value: "Athena" },
                  { label: "Allegiance MD", value: "Allegiance MD" },
                  { label: "Bizmatics", value: "Bizmatics" },
                  { label: "Cronos", value: "Cronos" },
                  { label: "DR RIAZ U HAQUE MD", value: "DR RIAZ U HAQUE MD" },
                  { label: "Eclinicalworks", value: "Eclinicalworks" },
                  { label: "EMD", value: "EMD" },
                  { label: "EpicCare", value: "EpicCare" },
                  { label: "Glenwood Systems", value: "Glenwood Systems" },
                  { label: "Happy MD", value: "Happy MD" },
                  { label: "Insync", value: "Insync" },
                  { label: "IPatientCare", value: "IPatientCare" },
                  { label: "NextGen", value: "NextGen" },
                  { label: "PointClickCare", value: "PointClickCare" },
                  { label: "Paper", value: "Paper" },
                  { label: "Power to Practice", value: "Power to Practice" },
                  { label: "Practice Fusion", value: "Practice Fusion" },
                  { label: "Prognosis", value: "Prognosis" },
                  { label: "Tebra", value: "Tebra" },
                  { label: "Term SVR", value: "Term SVR" },
                  {
                    label: "Aprima Facility Portal",
                    value: "Aprima Facility Portal",
                  },
                  { label: "Micro MD", value: "Micro MD" },
                  { label: "IMS", value: "IMS" },
                  { label: "Other", value: "-" },
                ]}
                required
              />
              {error?.emr && (
                <div className="text-danger fs-12">{error?.emr}</div>
              )}
            </div>
            </div>

            <div>
              <Button type="submit" className="btn btn-primary btn-sm me-1">
                {isLoadingBtn ? "Loading..." : "Submit"}
              </Button>
              <Button
                onClick={handleClose}
                className="btn btn-danger btn-sm light ms-1"
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Offcanvas>
  );
};

const enhancer = connect(
  (state) => ({
    patientDetailsResult: state?.patientDetails?.details?.patientResult,
    processedYearResult: state?.patientDetails.details?.processedYear,
  }),
  {
    getPatientLabDosList: detailsActions.labDosDeatilsAction,
  }
);
export default enhancer(AddLabForm);
