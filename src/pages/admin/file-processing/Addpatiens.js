import React from "react";
import { Offcanvas,Button } from "react-bootstrap";
import visitStyles from "../../../styles/visitdata.module.css";
import Form from "react-bootstrap/Form";
import Spinner from "../../../components/spinner";

const Addpatients = ({
  addPatientId,
  setAddPatientId,
  validated,
  handleSubmitPatientId,
  handleChangePatientId,
  isLoadingBtn,
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
          >
            <div className="row">
              <div className="col-xl-12 mb-3">
                <Form.Label>
                  Patient Id <span className="text-danger">*</span>{" "}
                </Form.Label>
                <Form.Control
                  name="patientId"
                  required
                  type="text"
                  onChange={handleChangePatientId}
                />
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
              <Button className="btn-sm me-1"
                onClick={() => setAddPatientId(false)}
                style={{
                  backgroundColor: "#ffdede",
                  borderColor: "#ffdede",
                  color: "#ff5e5e",
                  height: "32px",
                }}
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
