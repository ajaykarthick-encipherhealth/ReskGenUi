import React, { useState } from "react";
import { Modal, Form, Input, Space } from "antd";
import { Button } from "react-bootstrap";
import CamboTree from "../../hcc/org";
import PdfViewer from "../../PdfViewerComponent";
import { handleSubmitValidNotes } from "../function/ReusableFunctions";
import { useDispatch } from "react-redux";

const ModelIndex = ({
  validated,
  handleSubmit,
  title,
  openState,
  handleCloseModal,
  combiTree,
  labReportFile,
  search,
  modalOpenValidContent,
  setFileLoading,
  setConfirmNotesModalValid,
  getPatientDetailsReload,
  isValidAction,
  selectInvalidDetails,
}) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const dispatch = useDispatch();

  return (
    <Modal
      title={title}
      centered
      open={openState}
      onOk={handleCloseModal}
      onCancel={handleCloseModal}
      footer={null}
      width={
        combiTree
          ? "auto"
          : labReportFile
          ? "80%"
          : modalOpenValidContent && "90%"
      }
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
            <Form
              name="validateOnly"
              layout="vertical"
              autoComplete="off"
              form={form}
              onFinish={(values) => {
                handleSubmitValidNotes({
                  values,
                  setFileLoading,
                  setConfirmNotesModalValid,
                  getPatientDetailsReload,
                  isValidAction,
                  selectInvalidDetails,
                  dispatch
                })
                form.resetFields();
              }
            }
            >
              <Form.Item
                label={
                  <label>
                    Reason <span style={{ color: "red" }}>*</span>
                  </label>
                }
                name="reason"
                rules={[
                  {
                    required: true,
                    message: "Please enter reason",
                  },
                ]}
              >
                <TextArea
                  name="reason"
                  className="form-textarea"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="submit" className="btn btn-primary btn-sm me-1">
                    Submit
                  </Button>
                  <Button
                    onClick={() => {
                      handleCloseModal();
                      form.resetFields();
                    }}
                    className="btn btn-danger btn-sm light ms-1"
                  >
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ModelIndex;
