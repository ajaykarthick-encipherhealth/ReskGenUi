import React from "react";
import { Offcanvas, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";

const Addpatients = ({
  addPatientId,
  setAddPatientId,
  validated,
  handleSubmitPatientId,
  handleChangePatientId,
}) => {
  return (
    <Offcanvas
      onHide={setAddPatientId}
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
            onSubmit={handleSubmitPatientId}
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
                  pattern="^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$"
                  type="text"
                  onChange={handleChangePatientId}
                />
                <small small id="emailHelp" class="form-text text-muted">Patient Id must contain one special character, numbers and letters.</small>
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
