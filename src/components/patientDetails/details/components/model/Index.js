import React, { useState } from "react";
import { Modal, Form, Input, Space } from "antd";
import { Button } from "react-bootstrap";
import CamboTree from "../../hcc/org";
import PdfViewer from "../../PdfViewerComponent";
import { handleSubmitValidNotes } from "../function/ReusableFunctions";
import { useDispatch,connect } from "react-redux";
import EditForm from "./EditForm";
import { actions as detailsActions } from "../../../../../stores/patient/details";


const ModelIndex = ({
  validated,
  handleSubmit,
  openState,
  title,
  handleCloseModal,
  combiTree,
  labReportFile,
  search,
  modalOpenValidContent,
  setFileLoading,
  setConfirmNotesModalValid,
  getPatientDetailsReload,
  isValidAction,
  selectDisDetails,
  isEdit,
  setOpenEdit,
  initialValues,
  setInitialValues,
  setOpenContent,
  selectedData,
  getpatientDetailsData,
  patientDetailsResult,
  getRadiologyDetails,
  getLabDetails,
  dragMovemntAction,
}) => {
  const [form] = Form.useForm();
 
  const { TextArea } = Input;
   const [opens, setOpens] = useState(false); 
  const [combiTrees, setCombiTree] = useState({});
  const dispatch = useDispatch();
  return (
    <>
    {dragMovemntAction ?
      <>
      <Modal
      title="Are you sure to want move?"
      open={openState}
      centered
      onOk={() =>  handleSubmitValidNotes({
        setFileLoading,
        setConfirmNotesModalValid,
        getPatientDetailsReload,
        isValidAction,
        selectDisDetails,
        getpatientDetailsData,
        patientDetailsResult,
        getLabDetails,
        getRadiologyDetails,
        handleCloseModal
      })
    }
      onCancel={() => handleCloseModal()}
    ></Modal>
      </> :
    <Modal
      title={title}
      centered
      open={openState}
      onOk={handleCloseModal}
      onCancel={handleCloseModal}
      footer={null}
      closable={isEdit?false:true} 
      width={
        combiTree
          ? "90%"
          : labReportFile
          ? "80%"
          : setOpenEdit
          ? "60%"
          : modalOpenValidContent && "90%"
      }
    >
      {openState && combiTree && <CamboTree tree={combiTree}  setOpens={setOpens}
           setCombiTree={setCombiTree} />}
      {labReportFile && (
        <PdfViewer
          src={labReportFile}
          searchQuery={search?.value ? search?.value : ""}
          pageNumber={search?.page ? search?.page : 1}
          headers={search?.headers}
          headerContent={search?.headerContent}
        />
      )}
      {modalOpenValidContent 
        ? modalOpenValidContent
        : !setOpenEdit &&  !combiTree &&  (
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
                      selectDisDetails,
                      getpatientDetailsData,
                      patientDetailsResult,
                      getLabDetails,
                      getRadiologyDetails,
                      handleCloseModal
                    });
                    form.resetFields();
                  }}
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
                      <Button
                        type="submit"
                        className="btn btn-primary btn-sm me-1"
                      >
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
      {isEdit && (
        <EditForm
          setOpenEdit={setOpenEdit}
          initialValues={initialValues}
          setInitialValues={setInitialValues}
          setOpenContent={setOpenContent}
          selectedData={selectedData}
        />
      )}
    </Modal>}
    </>
  );
};

const enhancer = connect(
  (state) => ({
    patientDetailsResult :state?.patientDetails?.details?.patientResult
  }),
  {
    getpatientDetailsData:detailsActions.patientDetailsAction,
    getRadiologyDetails:detailsActions.radiologyDetailsAction,
    getLabDetails:detailsActions.labDetailsAction,

  }
);
export default enhancer(ModelIndex);