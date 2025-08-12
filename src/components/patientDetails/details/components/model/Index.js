import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Space, Checkbox } from "antd";
import { Button } from "react-bootstrap";
import CamboTree from "../../hcc/org";
import PdfViewer from "../../PdfViewerComponent";
import {
  getMeatAnyOneFindCheck,
  handleSubmitValidNotes,
} from "../function/ReusableFunctions";
import { connect } from "react-redux";
import EditForm from "./EditForm";
import { actions as detailsActions } from "../../../../../stores/patient/details";
import { suggestedMeatCheck } from "../../../../../stores/patient/details/network";
import { getStorage } from '../../../../../utils/storages'

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
  setOpens,
  setCombiTree,
  setSuggestedMeatForm,
  meatCriteriaList,
  setSelectCardTitle,
  dragItem,
  year,
  patientDetailsLoad,
  getPatientIdData,
  dosDeatilsAction,
}) => {
  const userRole = getStorage("userRole");
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [educationalError, setEducationalError] = useState(false);

  const handleCheckboxChange = (e) => {
    setEducationalError(e.target.checked);
  };
  const onConfirmValidMove = async (openState) => {
    handleCloseModal();
    const customValidAction =
      dragItem?.source?.droppableId === "HCC"
        ? dragItem?.destination?.droppableId === "SUGGESTED"
          ? { name: "Move to Suggested", title: "HCC" }
          : dragItem?.destination?.droppableId === "DELETED"
          ? { name: "Move to Deleted", title: "HCC" }
          : { name: "", title: "" }
        : isValidAction;
    setSelectCardTitle && setSelectCardTitle(customValidAction);

    var meatFoundResult = getMeatAnyOneFindCheck(
      selectDisDetails?.diagnosisCode,
      meatCriteriaList
    );

    if (!meatFoundResult && customValidAction?.name == "Move to HCC") {
      setFileLoading(true);
      const result = await suggestedMeatCheck(selectDisDetails?.diagnosisCode);
      if (result?.response) {
        setSuggestedMeatForm && setSuggestedMeatForm(true);
        setFileLoading(false);
      } else {
        handleSubmitValidNotes({
          setFileLoading,
          setConfirmNotesModalValid,
          getPatientDetailsReload,
          isValidAction: customValidAction,
          selectDisDetails,
          getpatientDetailsData,
          patientDetailsResult,
          getLabDetails,
          getRadiologyDetails,
          handleCloseModal,
          patientDetailsLoad,
          getPatientIdData,
          educationalError,
          setEducationalError,
          dosDeatilsAction,
        });
      }
    } else {
      handleSubmitValidNotes({
        setFileLoading,
        setConfirmNotesModalValid,
        getPatientDetailsReload,
        isValidAction: customValidAction,
        selectDisDetails,
        getpatientDetailsData,
        patientDetailsResult,
        getLabDetails,
        getRadiologyDetails,
        handleCloseModal,
        patientDetailsLoad,
        getPatientIdData,
        educationalError,
        setEducationalError,
        dosDeatilsAction,
      });
    }
  };

  useEffect(() => {
    if (dragItem?.source?.droppableId === "HCC") {
      onConfirmValidMove();
    }
  }, [dragItem]);

  return (
    <>
      {dragItem?.source?.droppableId !== "HCC" &&
        (dragMovemntAction ? (
          <Modal
            title="Are you sure to want move?"
            open={openState}
            centered
            onOk={() => onConfirmValidMove(openState)}
            onCancel={() => handleCloseModal()}
          >
            {(userRole === "CODER_2" || userRole === "QA") && (
              <div className="d-flex flex-column gap-2 w-100">
                <Checkbox
                  checked={educationalError}
                  onChange={handleCheckboxChange}
                  className="ant-badge mt-2"
                >
                  Mark as Educational Error
                </Checkbox>
              </div>
            )}
          </Modal>
        ) : (
          <Modal
            title={title}
            centered
            open={openState}
            onOk={handleCloseModal}
            onCancel={handleCloseModal}
            footer={null}
            closable={isEdit ? false : true}
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
            {openState && combiTree && (
              <CamboTree
                tree={combiTree}
                setOpens={setOpens}
                setCombiTree={setCombiTree}
                setFileLoading={setFileLoading}
                year={year}
              />
            )}
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
              : !setOpenEdit &&
                !combiTree && (
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
                            handleCloseModal,
                            patientDetailsLoad,
                            getPatientIdData,
                            dosDeatilsAction,
                            setEducationalError,
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
          </Modal>
        ))}
    </>
  );
};

const enhancer = connect(
  (state) => ({
    patientDetailsResult: state?.patientDetails?.details?.patientResult,
  }),
  {
    getpatientDetailsData: detailsActions.patientDetailsAction,
    getRadiologyDetails: detailsActions.radiologyDetailsAction,
    getLabDetails: detailsActions.labDetailsAction,
    patientDetailsLoad: detailsActions.patientDetailsLoad,
    getPatientIdData: detailsActions.patientIdDetailsAction,
    dosDeatilsAction: detailsActions.dosDeatilsAction,
  }
);
export default enhancer(ModelIndex);
