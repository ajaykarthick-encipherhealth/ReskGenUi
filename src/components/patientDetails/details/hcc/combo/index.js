import React, { useState, useEffect } from "react";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { useSelector, useDispatch, connect } from "react-redux";
import { notification, Tag, Modal } from "antd";
import { Button, Offcanvas } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import styles from "../styles.module.css";
import { manuallyAddComboCode } from "../../../../../services/PatientsListSevice";
import CamboTree from "../org";
import PdfViewer from "../../PdfViewerComponent";
import { getPatientDetails } from "../../components/function/GetData";
import { actions as detailsActions } from "../../../../../stores/patient/details";
import ComboCard from "../../components/COMBO";
import ModelIndex from "../../components/model/Index";

const Combo = ({
  activeComboTree,
  patientDetailsResult,
  getpatientDetailsData,
  hccFileDetails,
  fileDosPageNumberList,
}) => {
  const dispatch = useDispatch();
  const sectionColorList = useSelector(
    (state) => state?.ReviewerReducers?.sectionColorList
  );
  const [isModalOpenCaptureSection, setIsModalOpenCaptureSection] =
    useState(false);
  const [comboDiseaseCodesList, setComboDiseaseCodesList] = useState([]);
  const [invalidComboDiseaseCodesList, setInvalidComboDiseaseCodesList] =
    useState([]);
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [patientDocumentResult, setPatientDocumentResult] = useState([]);
  const [selectFileURL, setSelectFileURL] = useState([]);
  const [validated, setValidated] = useState(false);
  const [opens, setOpens] = useState(false);
  const [combiTree, setCombiTree] = useState({});
  const [inputValue, setInputValue] = useState({
    year: "",
    name: "",
    patientId: "",
    notes: "",
    diagnosisCode: "",
    actualDescription: "",
    capturedSections: "",
    encodedDate: "",
    flag: "",
    comments: "",
    description: "",
    queryReason: "",
    providerName: "",
    imagingTestHeader: "",
    headerName: "",
    queryComment: "",
    reason: "",
    diagnosisCodeQuery: "",
    comboCode: "",
    additionalCode: "",
  });
  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [encounterDateMatching, setEncounterDateMatching] = useState([]);
  const [fileModalHeader, setFileModalHeader] = useState("");
  const [isAddComboCode, setIsAddComboCode] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [search, setSearch] = useState(false);
  const [confirmNotesModalValid, setConfirmNotesModalValid] = useState(false);
  const [isValidAction, setIsValidAction] = useState("");
  const [selectDisDetails, setSelectDisDetails] = useState('');

  const handleChange = async (e) => {
    const key = e.target.name;
    if (key == "diagnosisCodeQuery") {
      getFindValidDiagnosisCode(e.target.value);
    }
    if (key == "diagnosisCode") {
      getFindValidDiagnosisCode(e.target.value);
    }
    if (key == "encodedDate") {
      setInputValueFileDate(e.target.value);
    }
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  useEffect(() => {
    var orgId = localStorage.getItem("orgId");
    var tenId = localStorage.getItem("tenantId");
    getPatientDetails(
      orgId,
      tenId,
      setPatientDocumentResult,
      "",
      "",
      "",
      setEncounterDateMatching,
      setCaptureSectionMatching,
      "",
      patientDetailsResult,
      dispatch,
      sectionColorList,
      "",
      setComboDiseaseCodesList
    );
  }, [patientDetailsResult]);

  useEffect(() => {
    if (hccFileDetails?.data?.response) {
      setSelectFileURL(hccFileDetails?.data?.response);
    }
  }, [hccFileDetails]);

  const onchangeCombo = (data, code) => {
    var title = data.diagnosisCodeCombo;
  data.dateOfService = patientDetailsResult?.data?.response?.dateOfService;
  data.processedYear = patientDetailsResult?.data?.response?.processedYear;
  data.dbDescription = data.actualDescription
    ? data.actualDescription
    : data.diseaseName;
  (data.fileId = patientDetailsResult?.data?.response?.fileId),
    setSelectDiseasesName(title);
  setSelectDisDetails(data);
  };


  const handleCloseModal = () => {
    setConfirmNotesModalValid(false);
    setValidated(false);
    setIsModalOpenCaptureSection(false);
    setIsAddComboCode(false);
    setFileLoading(false);
  };

  const handleChangeSuggested = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  const addComboCode = () => {
    setIsAddComboCode(true);
  };

  const handleSubmitComboCode = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      let updateDataformat = {
        patientId: patientDetailsResult?.data?.response?.patientId,
        dosYear: "",
        comboCode: inputValue.comboCode,
        additionalCode: inputValue.additionalCode,
        description: inputValue.description,
      };
      let result = await manuallyAddComboCode(updateDataformat);
      if (result.status == "SUCCESS") {
        setIsAddComboCode(false);
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
        getpatientDetailsData(
          patientDetailsResult?.data?.response?.patientId,
          patientDetailsResult?.data?.response?.processedYear,
          patientDetailsResult?.data?.response?.dateOfService
        );
      }

      setValidated(true);
    }
  };

  const showErrorMessage = () => {
    setOpens(false);
    notification.destroy();
    notification.info({ message: "Tree Not Available", duration: 1 });
  };

  useEffect(() => {
    if (activeComboTree) {
      comboDiseaseCodesList?.map((item) => {
        if (
          item.diagnosisCodeCombo.replace(".", "") ==
          activeComboTree.diagnosisCode.replace(".", "")
        ) {
          setOpens(true);
          setCombiTree([{ ...item, expanded: true }]);
        }
      });
    }
  }, [activeComboTree]);

  return (
    <>
      {fileLoading ? (
        <div className={styles.overlay_style}>
          <div className={styles.overlay__inner_style}>
            <div className={styles.overlay__content_style}>
              <span className={styles.spinner_style}></span>
            </div>
          </div>
        </div>
      ) : null}
      <div className={`${visitStyles.comboContainer}`}>
        <div className={`row ${visitStyles.comboContainer2}`}>
          <div className="col-xl-6">
            <div className={`${visitStyles.comboTitle}`}>
              <span>VALID CODES </span>
            </div>
            <ComboCard
              list={comboDiseaseCodesList}
              captureSectionMatching={captureSectionMatching}
              encounterDateMatching={encounterDateMatching}
              okText="OK"
              cancelText="Cancel"
              popConfirmTitle="You want move to delete?"
              setOpens={setOpens}
              setCombiTree={setCombiTree}
              setSearch={setSearch}
              setFileLoading={setFileLoading}
              setFileModalHeader={setFileModalHeader}
              onchangeCombo={onchangeCombo}
              setIsModalOpenCaptureSection={setIsModalOpenCaptureSection}
              isAddComboCode={true}
              addComboCode={addComboCode}
              setConfirmNotesModalValid ={setConfirmNotesModalValid}
              setIsValidAction ={setIsValidAction}
              patientDocumentResult={patientDocumentResult}
            />
          </div>

          <div className="col-xl-6">
            <div className={`${visitStyles.comboTitle}`}>
              <span>DELETED COMBO CODES </span>
            </div>
            <ComboCard
              list={invalidComboDiseaseCodesList}
              captureSectionMatching={captureSectionMatching}
              encounterDateMatching={encounterDateMatching}
              okText="OK"
              cancelText="Cancel"
              popConfirmTitle="You want move to valid?"
              setOpens={setOpens}
              setCombiTree={setCombiTree}
              setSearch={setSearch}
              setFileLoading={setFileLoading}
              setFileModalHeader={setFileModalHeader}
              onchangeCombo={onchangeCombo}
              setIsModalOpenCaptureSection={setIsModalOpenCaptureSection}
              isAddComboCode={false}
              setConfirmNotesModalValid ={setConfirmNotesModalValid}
              setIsValidAction ={setIsValidAction}
              patientDocumentResult={patientDocumentResult}
            />
          </div>
        </div>
      </div>

      {isModalOpenCaptureSection && (
        <Modal
          title={fileModalHeader}
          centered
          open={isModalOpenCaptureSection}
          style={{ top: 1 }}
          onOk={handleCloseModal}
          onCancel={handleCloseModal}
          width="95%"
          footer={false}
        >
          <div className="section-container">
            <div className="row">
              <div className="col-xl-5">
                <ComboCard
                  list={comboDiseaseCodesList}
                  captureSectionMatching={captureSectionMatching}
                  encounterDateMatching={encounterDateMatching}
                  okText="OK"
                  cancelText="Cancel"
                  popConfirmTitle="You want move to delete?"
                  setOpens={setOpens}
                  setCombiTree={setCombiTree}
                  setSearch={setSearch}
                  setFileLoading={setFileLoading}
                  setFileModalHeader={setFileModalHeader}
                  onchangeCombo={onchangeCombo}
                  setIsModalOpenCaptureSection={setIsModalOpenCaptureSection}
                  isAddComboCode={false}
                  addComboCode={addComboCode}
                  setConfirmNotesModalValid ={setConfirmNotesModalValid}
                  setIsValidAction ={setIsValidAction}
                  patientDocumentResult={patientDocumentResult}
                />
              </div>
              <div className="col-xl-7">
                {selectFileURL && (
                  <PdfViewer
                    src={selectFileURL}
                    searchQuery={search?.value ? search?.value : ""}
                    pageNumber={search?.page ? search?.page : 1}
                    headers={search?.headers}
                    headerContent={search?.headerContent}
                  />
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
      {opens && combiTree[0]?.children?.length > 0 ? (
        <Modal
          title={fileModalHeader}
          width="90%"
          centered
          open={opens}
          onOk={() => setOpens(false)}
          onCancel={() => setOpens(false)}
          footer={null}
        >
          <CamboTree
            tree={combiTree}
            setOpens={setOpens}
            setCombiTree={setCombiTree}
          />
        </Modal>
      ) : (
        opens && showErrorMessage()
      )}
        <ModelIndex
        title={selectDiseasesName}
        openState={confirmNotesModalValid}
        setFileLoading={setFileLoading}
        handleCloseModal={handleCloseModal}
        setConfirmNotesModalValid={setConfirmNotesModalValid}
        isValidAction={isValidAction}
        selectDisDetails={selectDisDetails}
      />

      <Offcanvas
        onHide={handleCloseModal}
        show={isAddComboCode}
        className="offcanvas-end"
        placement="end"
      >
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">
            Add Combo Code
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => handleCloseModal()}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="container-fluid">
            <Form
              noValidate
              validated={validated}
              onSubmit={handleSubmitComboCode}
            >
              <div className="row">
                <div className="col-xl-12 mb-3">
                  <Form.Label>
                    Combo Code <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    id="comboCode"
                    name="comboCode"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-xl-12 mb-3">
                  <Form.Label>Additional Code</Form.Label>
                  <Form.Control
                    type="text"
                    id="additionalCode"
                    name="additionalCode"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-xl-12 mb-3">
                  <Form.Label>
                    Description <span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    onChange={handleChangeSuggested}
                    rows="5"
                    required
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
      </Offcanvas>
    </>
  );
};
const enhancer = connect(
  (state) => ({
    patientDetailsResult: state?.patientDetails?.details?.patientResult,
    hccFileDetails: state?.patientDetails?.details?.hccFileResult,
    fileDosPageNumberList: state?.patientDetails?.details?.dosPageNumberResult,
  }),
  {
    getpatientDetailsData: detailsActions.patientDetailsAction,
  }
);
export default enhancer(Combo);
