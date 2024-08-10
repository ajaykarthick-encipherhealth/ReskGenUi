import React, { useState, useEffect } from "react";
import { notification } from "antd";
import { connect, useSelector } from "react-redux";
import { Button, Offcanvas } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import axios from "../../../../../utility/axiosConfig";
import { validateYear } from "../../../../headerFilters/functions";
import ENDPOINTS from "../../../../../utility/enpoints";
import { actions as detailsActions } from "../../../../../stores/patient/details";
import { getResponePopup } from "../../../../../utils/reusable";

const AddLabForm = ({
  setOpen,
  open,
  patientDetailsResult,
  getPatientLabDosList,
  processedYearResult,
}) => {
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState({ year: "" });
  const [inputValue, setInputValue] = useState({
    year: "",
    name: "",
    patientId: "",
  });
  const [selectFile, setSelectFile] = useState(null);

  const handleChange = async (e) => {
    const key = e.target.name;
    if (e.target.name === "year") {
      const validateYearField = validateYear(e.target.value, setError);
      if (validateYearField) {
        setError({ year: "" });
        setInputValue({ ...inputValue, [key]: value });
      }
    }
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  const onChangeReportFile = (e) => {
    setSelectFile(e[0]);
  };

  const handleSubmitReport = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      setIsLoadingBtn(true);
      event.preventDefault();
      event.stopPropagation();
      submitReport();
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
    const headers = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const response = await axios.post(
        ENDPOINTS.apiEndoint +
          `aiservice/ai/upload/lab
          `,
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
        <h5 className="modal-title" id="#gridSystemModal">
          Add Patient Lab Report
        </h5>
        <button
          type="button"
          className="btn-close"
          onClick={() => setOpen(false)}
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
                  onChange={(e) => onChangeReportFile(e.target.files)}
                  disabled={isLoadingBtn ? true : false}
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="btn btn-primary btn-sm me-1">
                {isLoadingBtn ? "Loading..." : "Submit"}
              </Button>
              <Button
                onClick={() => setOpen(false)}
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
