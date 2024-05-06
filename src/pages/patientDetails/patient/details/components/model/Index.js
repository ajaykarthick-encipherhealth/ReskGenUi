import React from "react";
import { Modal } from "antd";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import CamboTree from "../../hcc/org";
import PdfViewer from "../../PdfViewerComponent";

const ModelIndex = ({
  validated,
  handleSubmit,
  title,
  openState,
  handleCloseModal,
  handleChangeSuggested,
  combiTree,
  labReportFile,
  search,
  modalOpenValidContent,
}) => {
  return (
    <Modal
      title={title}
      centered
      open={openState}
      onOk={handleCloseModal}
      onCancel={handleCloseModal}
      footer={null}
      width={combiTree ? "auto" : labReportFile && "80%"}
    >
      {combiTree ? (
        <CamboTree tree={combiTree} />
      ) : labReportFile ? (
        <PdfViewer
          src={labReportFile}
          searchQuery={search?.value ? search?.value : ""}
          pageNumber={search?.page ? search?.page : 1}
          headers={search?.headers}
        />
      ) : modalOpenValidContent ? (
        modalOpenValidContent
      ) : (
        <div className="offcanvas-body">
          <div className="container-fluid">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-xl-12 mb-3">
                  <Form.Label>
                    Reason <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <textarea
                    className="form-control"
                    id="notes"
                    name="notes"
                    onChange={handleChangeSuggested}
                    rows="5"
                  ></textarea>
                </div>
              </div>

              <div>
                <Button type="submit" className="btn btn-primary btn-sm me-1">
                  Submit
                </Button>
                <Button
                  onClick={() => handleCloseModal()}
                  className="btn btn-danger btn-sm light ms-1"
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ModelIndex;
