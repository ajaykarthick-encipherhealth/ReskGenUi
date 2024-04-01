import React  from "react";
import { Form, Offcanvas, Button } from "react-bootstrap";
import UploadFile from "../uploadFile";

function FhirDrawer({ isDrawerOpen, setIsDrawerOpen }) {
  const handleClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Offcanvas show={isDrawerOpen} className="offcanvas-end" placement="end">
      <Offcanvas.Header closeButton onClick={handleClose}>
        <Offcanvas.Title> Update New Batch </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="container-fluid">
          <Form noValidate>
            <div className="row">
              <div className="col-xl-12 mb-3">
                <Form.Label>
                  Batch Name <span className="text-danger">*</span>{" "}
                </Form.Label>
                <Form.Control
                  name="name"
                  required
                  type="text"
                  placeholder="Enter batch name"
                  // onChange={handleChange}
                />
              </div>

              <div className=" col-xl-12 mb-3">
                <Form.Label>
                  Upload File <span className="text-danger">*</span>{" "}
                </Form.Label>
                <UploadFile title="Upload Excel, CSV & Drag and drop your files" />
              </div>

              <div className="col-xl-12 mb-3">
                <Form.Label>
                  Year of Service <span className="text-danger">*</span>{" "}
                </Form.Label>
                <Form.Control
                  name="year"
                  required
                  type="number"
                  placeholder="Enter year of service"
                  // onChange={handleChange}
                />
              </div>

              {/* Proceed Button */}
              <div className="col-xl-12 mb-3 d-grid justify-content-center">
                <Button type="submit">Proceed</Button>
              </div>
            </div>
          </Form>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default FhirDrawer;
