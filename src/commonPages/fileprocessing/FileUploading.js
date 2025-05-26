import { message, Select } from "antd";
import React from "react";
import { Offcanvas, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { emrTypeOptions, getYears } from "../../utils/reusable";

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
  emrType,
  isUpload,
}) => {
  const validateFileName = (fileName) => {
    // Regular expression to detect double extensions
    const doubleExtensionPattern = /\.[^/.]+(\.[^/.]+)$/;
    return !doubleExtensionPattern.test(fileName);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fileInput = e.target;
  
    if (!file) return;
  
    const isPdf = file.type === "application/pdf";
    const hasPdfExtension = file.name.toLowerCase().endsWith(".pdf");
    const hasDoubleExtension = /\.[^/.]+(\.[^/.]+)$/.test(file.name);
  
    if (isPdf && hasPdfExtension && !hasDoubleExtension) {
      onChangeFile([file]); 
    } else {
      message.error("Only valid .pdf files are allowed.");
      fileInput.value = "";
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
          {isUpload ? "Upload Patient Details" : "Add Patient Details"}
        </h5>
        <button type="button" className="btn-close" onClick={handleClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div className="offcanvas-body">
        <div
          data-testid={isUpload ? "upload-form" : "Add-patient-form"}
          className="container-fluid"
        >
          <Form
            data-testid={isUpload ? "upload" : "Add-patient"}
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
                  data-testid="patientId"
                  required
                  type="text"
                  value={inputValue?.patientId}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="col-xl-12 mb-3">
                {/* <Form.Label>
                  Patient Name <span className="text-danger">*</span>{" "}
                </Form.Label>
                <Form.Control
                  name="name"
                  data-testid="patient-name"
                  required
                  type="text"
                  value={inputValue?.name}
                  onChange={(e) => handleChange(e)}
                /> */}
              </div>

              <div className="col-xl-12 mb-3">
                <Form.Label>
                  File <span className="text-danger">*</span>{" "}
                </Form.Label>
                <Form.Control
                  data-testid="fileInput"
                  required
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  disabled={isLoadingBtn ? true : false}
                />
              </div>
              <div className="col-xl-12 mb-3">
                <Form.Label>
                  Year of Service <span className="text-danger">*</span>{" "}
                </Form.Label>
                <Select
                  placeholder="Select Year"
                  name="year"
                  data-testid="select-year"
                  maxTagCount="responsive"
                  className={`ant_select_form mb-2`}
                  style={{ height: "42px" }}
                  onChange={(selOption, val) => {
                    handleChange(selOption, "year");
                  }}
                  showSearch
                  value={inputValue?.year || null}
                  options={getYears()}
                  required
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
                placeholder="Select EMR Type"
                name="emrType"
                data-testid="emr-select"
                maxTagCount="responsive"
                className={`ant_select_form  mb-2`}
                style={{ height: "42px" }}
                onChange={(selOption, val) => {
                  handleChange(selOption, "dos");
                  setEmrType(selOption === "Other" ? "-" : selOption);
                }}
                showSearch
                value={emrType || null}
                options={emrTypeOptions}
                required
              />
              {errors?.emr && (
                <div className="text-danger fs-12">{errors?.emr}</div>
              )}
            </div>
            <div>
              {!isLoadingBtn ? (
                <Button
                  type="submit"
                  id="submit-Button"
                  name="submit-Button"
                  className="btn-sm me-1"
                  style={{ backgroundColor: "#04306f" }}
                >
                  {"Submit"}
                </Button>
              ) : (
                <button className="btns btns-primary" disabled>
                  Loading...
                </button>
              )}
              <Button
                id="cancel-Button"
                name="cancel-Button"
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
