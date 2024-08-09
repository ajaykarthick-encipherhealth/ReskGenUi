import { message, Select } from "antd";
import React from "react";
import { Offcanvas, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";

const FileUploading = ({
  addPatient,
  setAddPatient,
  validated,
  handleSubmit,
  inputValue,
  handleChange,
  isLoadingBtn,
  onChangeFile,
  errors,
  setEmrType,
  handleClose,
  emrType
}) => {
  const validateFileName = (fileName) => {
    // Regular expression to detect double extensions
    const doubleExtensionPattern = /\.[^/.]+(\.[^/.]+)$/;
    return !doubleExtensionPattern.test(fileName);
  };

  const handleFileChange = (files) => {
    const file = files[0];
    if (file && validateFileName(file.name)) {
      onChangeFile(files);
    } else {
      message.error("Invalid files");
      const fileValue = document.getElementById("fileInput");
      fileValue.value = "";
    }
  };
  return (
    <Offcanvas
      onHide={handleClose}
      show={addPatient}
      className="offcanvas-end"
      placement="end"
    >
      <div className="offcanvas-header">
        <h5 className="modal-title" id="#gridSystemModal">
          Add Patient Details
        </h5>
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
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div className="row">
              <div className="col-xl-12 mb-3">
                <Form.Label>
                  Patient ID <span className="text-danger">*</span>{" "}
                </Form.Label>
                <Form.Control
                  name="patientId"
                  required
                  type="text"
                  value={inputValue?.patientId}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="col-xl-12 mb-3">
                <Form.Label>
                  Patient Name <span className="text-danger">*</span>{" "}
                </Form.Label>
                <Form.Control
                  name="name"
                  required
                  type="text"
                  value={inputValue?.name}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="col-xl-12 mb-3">
                <Form.Label>
                  File <span className="text-danger">*</span>{" "}
                </Form.Label>
                <Form.Control
                  id="fileInput"
                  required
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e.target.files)}
                  disabled={isLoadingBtn ? true : false}
                />
              </div>
              <div className="col-xl-12 mb-3">
                <Form.Label>
                  Year of Service <span className="text-danger">*</span>{" "}
                </Form.Label>
                <Form.Control
                  name="year"
                  required
                  type="number"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              {errors?.year && (
                <div className="text-danger fs-12">{errors?.year}</div>
              )}
            </div>
            <div className="col-xl-12 mb-3">
              <Form.Label>
                EMR Type<span className="text-danger">*</span>
              </Form.Label>
              <Select
                // mode="multiple"
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
              {errors?.emr && (
                <div className="text-danger fs-12">{errors?.emr}</div>
              )}
            </div>
            <div>
              {!isLoadingBtn ? (
                <Button type="submit" className="btn btn-primary btn-sm me-1">
                  {"Submit"}
                </Button>
              ) : (
                <button className="btns btns-primary" disabled>
                  Loading...
                </button>
              )}
              <Button
                className="btn btn-danger btn-sm light ms-1"
                onClick={() => setAddPatient(false)}
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

export default FileUploading;
