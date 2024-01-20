import React from "react";
import { Offcanvas, Spinner, Button } from "react-bootstrap";
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
}) => {
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
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-xl-12 mb-3">
                <Form.Label>
                  Patient Id <span className="text-danger">*</span>{" "}
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
                  required
                  type="file"
                  accept="application/pdf,text/plain"
                  onChange={(e) => onChangeFile(e.target.files)}
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
            </div>

            <div>
              <Button type="submit" className="btn btn-primary btn-sm me-1">
                {"Submit"}
              </Button>
              <Button
                className="btn-sm me-1"
                onClick={() => setAddPatient(false)}
                style={{
                  backgroundColor: "#ffdede",
                  borderColor: "#ffdede",
                  color: "#ff5e5e",
                  //   height: "32px",
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

export default FileUploading;
