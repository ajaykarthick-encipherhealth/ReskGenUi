import { message } from "antd";
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
      const fileValue = document.getElementById('fileInput')
      fileValue.value = ""
    }
  };
  return (
    <Offcanvas
      onHide={setAddPatient}
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
          onClick={() => setAddPatient(false)}
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
            <div>
              {!isLoadingBtn ? 
              <Button type="submit" className="btn btn-primary btn-sm me-1">
                {"Submit"}
              </Button> :
              <button className="btns btns-primary" disabled>Loading...</button>}
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
