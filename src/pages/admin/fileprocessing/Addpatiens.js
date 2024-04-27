import React, { useState } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";

const Addpatients = ({
  addPatientId,
  setAddPatientId,
  validated,
  handleSubmitPatientId,
  handleChangePatientId,
}) => {
  const [error, setError] = useState("");

  const handleValidation = (event) => {
    const patientId = event.target.value;
    if (/\s/.test(patientId)) {
      setError("Patient ID cannot contain spaces.");
    }else if (!/\d/.test(patientId)) {
      setError("Patient ID must contain at least one number.");
    } else {
      setError("");
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const patientId = event.target.patientId.value;
    if (
      !/\d/.test(patientId) ||
      !/[a-zA-Z]/.test(patientId) ||
      !/[@$!%*?&-]/.test(patientId)
    ) {
      setError(
        "Patient ID must contain at least one letter, one number, and one special character."
      );
    } else {
      handleSubmitPatientId(event);
    }
  };

  return (
    <Offcanvas
      onHide={() => setAddPatientId(false)}
      show={addPatientId}
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
          onClick={() => setAddPatientId(false)}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div className="offcanvas-body">
        <div className="container-fluid">
          <Form
            noValidate
            validated={validated}
            onSubmit={handleFormSubmit}
            autoComplete="off"
          >
            <div className="row">
              <div className="col-xl-12 mb-3">
                <Form.Label>
                  Patient ID <span className="text-danger">*</span>{" "}
                </Form.Label>
                <Form.Control
                  className="text-capitalize"
                  name="patientId"
                  required
                  type="text"
                  onChange={(event) => {
                    handleValidation(event);
                    handleChangePatientId(event);
                  }}
                />
                <small className="form-text text-danger">{error}</small>
              </div>
              <div className="col-xl-12 mb-3">
                <Form.Label>
                  Patient Name <span className="text-danger">*</span>{" "}
                </Form.Label>
                <Form.Control
                  name="patientName"
                  required
                  type="text"
                  onChange={handleChangePatientId}
                />
              </div>
            </div>
            <div>
              <Button type="submit" className="btn btn-primary btn-sm me-1">
                {"Submit"}
              </Button>
              <Button
                className="btn btn-danger btn-sm light ms-1"
                onClick={() => setAddPatientId(false)}
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

export default Addpatients;
