import React, { useState, useRef, useEffect } from "react";
import { Badge, Offcanvas } from "react-bootstrap";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { useSelector, useDispatch, connect } from "react-redux";
import {
  Popconfirm,
  Popover,
  Input,
  Space,
  Form,
  Select,
  Button,
  Drawer,
} from "antd";
import { Modal } from "antd";
import { notification } from "antd";
import styles from "../../hcc/styles.module.css";
import CamboTree from "../../hcc/org";
import PdfViewer from "../../PdfViewerComponent";
import RegularButton from "../../../../../components/button";
import { getResponePopup } from "../../../../../utils/reusable";
import AddMeatQuery from "../../components/addMeatQuery";
import {
  getCaptureSectionBackgroundMeatNew,
  getEncounterDateBackground,
  getProviderNameList,
} from "../../components/function/ReusableFunctions";
import { getPatientDetails } from "../../components/function/GetData";
import { actions as detailsActions } from "../../../../../stores/patient/details";
import MeatCard from "../../components/MEAT";
import ModelIndex from "../../components/model/Index";
import ManuallyAdd from "../../components/manuallyAdd";
import { getDateOfServiceBackground } from "../../components/function/DateOfServices";
import { getPatientRadiologyDetailsNew } from "../../components/function/GetDataRadiology";
const { Option } = Select;

const Meat = ({
  activeMeatTitle,
  year,
  patientDetailsResult,
  getpatientDetailsData,
  hccFileDetails,
  fileDosPageNumberList,
  radiologyFile
}) => {
  const dispatch = useDispatch();
  const sectionColorList = useSelector(
    (state) => state?.ReviewerReducers?.sectionColorList
  );
  const [meatEdit, setMeatEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmNotesModalValid, setConfirmNotesModalValid] = useState(false);
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [meatCriteriaList, setMeatCriteriaList] = useState([]);
  const [invalidMeatCriteriaList, setInvalidMeatCriteriaList] = useState([]);
  const [selectCode, setSelectCode] = useState("");
  const [patientDocumentResult, setPatientDocumentResult] = useState([]);
  const [selectFileURL, setSelectFileURL] = useState([]);
  const [validated, setValidated] = useState(false);
  const [opens, setOpens] = useState(false);
  const [newValidDiseaseList, setNewValidDiseaseList] = useState([]);
  const [combiTree, setCombiTree] = useState({});
  const [isModalOpenRadiology, setIsModalOpenRadiology] = useState(false);
  const [isModalOpenLab, setIsModalOpenLab] = useState(false);
  const [suggestedHccList, setSuggestedHccList] = useState([]);
  const [isAddButtonClicked, setIsAddButtonClicked] = useState(false);
  const [deletedHccList, setDeletedHccList] = useState([]);
  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [encounterDateMatching, setEncounterDateMatching] = useState([]);
  const [fileModalHeader, setFileModalHeader] = useState("");
  const [fileInitialPage, setFileInitialPage] = useState(null);
  const [isMeatQueryModal, setIsMeatQueryModal] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [selectMeatResult, setSelectMeatResult] = useState(null);
  const [search, setSearch] = useState(false);
  const [editData, setEditData] = useState({});
  const [queryFormValues, setQueryFormValues] = useState(false);
  const [selectHyperlink, setSelectHyperlink] = useState([]);
  const [selectOtherHyperlink, setSelectOtherHyperlink] = useState([]);
  const [isValidAction, setIsValidAction] = useState("");
  const [selectDisDetails, setSelectDisDetails] = useState(false);
  const [deletedMeatList, setDeletedMeatList] = useState([]);

  useEffect(() => {
    var orgId = localStorage.getItem("orgId");
    var tenId = localStorage.getItem("tenantId");
    getPatientRadiologyDetailsNew(
      orgId,
      tenId,
      setPatientDocumentResult,
      setNewValidDiseaseList,
      setSuggestedHccList,
      setDeletedHccList,
      setEncounterDateMatching,
      setCaptureSectionMatching,
      setMeatCriteriaList,
      patientDetailsResult,
      dispatch,
      sectionColorList,
      "",
      "",
      "",
      "",
      setDeletedMeatList
    );
  }, [patientDetailsResult]);

  useEffect(() => {
    const result = selectHyperlink?.allHeaderResult?.filter(
      (res2) =>
        res2.substring != selectHyperlink?.selectHeaderResult?.substring &&
        res2.header === selectHyperlink?.selectHeaderResult?.header
    );
    setSelectOtherHyperlink(result);
  }, [selectHyperlink]);

  useEffect(() => {
    getPatientPdfFileRadiology();
  }, [radiologyFile?.data?.response]);

  const getPatientPdfFileRadiology = async (fileId, tenId) => {
    if (radiologyFile?.data?.response) {
      setSelectFileURL(radiologyFile?.data?.response);
    }
  };

  const onchangeMeat = (code, data) => {
    var title = data.diagnosisCode + " - " + data.diseaseName;
    data.processedYear = patientDetailsResult?.data?.response?.processedYear;
    data.dateOfService = patientDetailsResult?.data?.response?.dateOfService;
    (data.actualDescription = data.diseaseName),
      (data.dbDescription = data.diseaseName),
      (data.fileId = patientDetailsResult?.data?.response?.fileId),
      setSelectDiseasesName(title);
    setSelectDisDetails(data);
  };

  const handleCloseModal = () => {
    setValidated(false);
    setIsModalOpen(false);
    setConfirmNotesModalValid(false);
    setIsAddButtonClicked(false);
    setIsMeatQueryModal(false);
    setFileLoading(false);
  };

  const addMeatQuery = (value, condition) => {
    var data = {
      diagnosisCode: value.diagnosisCode,
    };
    setQueryFormValues(data);
    setIsMeatQueryModal(true);
  };

  const showErrorMessage = () => {
    setOpens(false);
    notification.destroy();
    notification.info({ message: "Tree Not Available", duration: 1 });
  };

  const onFinishMeat = async (form) => {
    const patientId = localStorage.getItem("patientId");
    const data = {
      ...form,
      patientId: patientId,
      year: year.value,
      diagnosisCode: editData.diagnosisCode,
    };

    try {
      const res = await axios.put(
        ENDPOINTS.apiEndoint + "dbservice/patient/compute/editmeat",
        data
      );
      if (res.data?.status) {
        getResponePopup(res);
        setEditData(null);
        setMeatEdit(false);
        getpatientDetailsData(
          patientId,
          patientDetailsResult?.data?.response?.processedYear,
          patientDetailsResult?.data?.response?.dateOfService
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDisTitlePopover = (title, value, subString, result) => {
    var popOver = "";
    if (value) {
      popOver = (
        <Popover
          placement="right"
          title={title}
          overlayStyle={{ zIndex: 1000 }}
          content={
            <div style={{height:"150px", overflow:'scroll'}}>
              <div>{value}</div>
              {subString?.map((res) => {
                if (res?.header) {
                  return (
                    <div className={styles.subStringContainer}>
                      <div>
                        <span className={styles.substringHead}>
                          {res.header} (Document Word)
                          <a
                            className={styles.pageNumberHyperlink}
                            onClick={() =>
                              gotoPageNumber(res, result, subString)
                            }
                          >
                            ({res.pageNumber})
                          </a>
                        </span>
                        {res?.dateOfService &&
                          getDateOfServiceBackground({
                            value: [res.dateOfService],
                          })}
                      </div>
                      {res.substring}
                    </div>
                  );
                }
              })}
            </div>
          }
        >
          <span style={{ fontSize: "smaller" }}>{value}</span>
        </Popover>
      );
    } else {
      popOver = (
        <span className="meat-name-details text-center font-bold">-</span>
      );
    }
    return popOver;
  };

  const gotoPageNumber = (data, result, value) => {
    setSelectHyperlink({ allHeaderResult: value, selectHeaderResult: data });
    var splitSpace = data?.substring
      ?.replace(/\s{2,}/g, " ")
      .replace(/['"]+/g, "");
    setSearch({
      value: splitSpace,
      page: data?.pageNumber,
      headers: true,
      headerContent: data?.header,
    });
    setIsModalOpen(true);
    setSelectMeatResult(result);
    var headerName = patientDetailsResult
      ? patientDetailsResult?.data?.response?.patientId +
        " / " +
        patientDetailsResult?.data?.response?.patientName +
        " / " +
        result.diagnosisCode +
        " - (" +
        result?.diseaseName +
        ")" +
        " / (" +
        data?.header +
        ")"
      : "";
    setFileModalHeader(headerName);
  };

  const onFinishFailed = (form) => {};

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
      <MeatCard
        list={meatCriteriaList}
        captureSectionMatching={captureSectionMatching}
        encounterDateMatching={encounterDateMatching}
        okText="OK"
        cancelText="Cancel"
        popConfirmTitle="Do you want to move to Delete?"
        setSearch={setSearch}
        setFileLoading={setFileLoading}
        setFileModalHeader={setFileModalHeader}
        onchangeMeat={onchangeMeat}
        setIsModalOpen={setIsModalOpen}
        isAddComboCode={false}
        setConfirmNotesModalValid={setConfirmNotesModalValid}
        setIsValidAction={setIsValidAction}
        patientDocumentResult={patientDocumentResult}
        setSelectMeatResult={setSelectMeatResult}
        activeMeatTitle={activeMeatTitle}
        setIsModalOpenLab={setIsModalOpenLab}
        setIsModalOpenRadiology={setIsModalOpenRadiology}
        setSelectHyperlink={setSelectHyperlink}
        setEditData={setEditData}
        setMeatEdit={setMeatEdit}
        addMeatQuery={addMeatQuery}
        getDisTitlePopover={getDisTitlePopover}
        cardTitle="VALID_MEAT"
      />

      {deletedMeatList?.length != 0 && (
        <>
          <div className="invalid-combo">
            <span>Deleted MeatCriteria</span>
          </div>
          <MeatCard
            list={deletedMeatList}
            captureSectionMatching={captureSectionMatching}
            encounterDateMatching={encounterDateMatching}
            okText="OK"
            cancelText="Cancel"
            popConfirmTitle="You want move to valid?"
            setSearch={setSearch}
            setFileLoading={setFileLoading}
            setFileModalHeader={setFileModalHeader}
            onchangeMeat={onchangeMeat}
            setIsModalOpen={setIsModalOpen}
            isAddComboCode={false}
            setConfirmNotesModalValid={setConfirmNotesModalValid}
            setIsValidAction={setIsValidAction}
            patientDocumentResult={patientDocumentResult}
            setSelectMeatResult={setSelectMeatResult}
            activeMeatTitle={activeMeatTitle}
            setIsModalOpenLab={setIsModalOpenLab}
            setIsModalOpenRadiology={setIsModalOpenRadiology}
            setSelectHyperlink={setSelectHyperlink}
            setEditData={setEditData}
            setMeatEdit={setMeatEdit}
            addMeatQuery={addMeatQuery}
            getDisTitlePopover={getDisTitlePopover}
            cardTitle="DELETED_MEAT"
          />
        </>
      )}

      {isModalOpen && (
        <Modal
          title={[
            <div className={styles.selectHyperheader}>
              {fileModalHeader}
              {selectOtherHyperlink?.length != 0 && (
                <div className={styles.stillIssueContainer}>
                  <Popover
                    placement="bottom"
                    title="Secondary"
                    overlayStyle={{ zIndex: 1000 }}
                    content={getCaptureSectionBackgroundMeatNew(
                      selectOtherHyperlink,
                      captureSectionMatching,
                      "hcc",
                      setSearch,
                      setFileLoading,
                      setIsModalOpenLab,
                      setIsModalOpenRadiology,
                      setIsModalOpen,
                      setFileModalHeader,
                      patientDocumentResult,
                      fileInitialPage,
                      setFileInitialPage,
                      selectMeatResult.diagnosisCode,
                      setSelectMeatResult,
                      selectMeatResult
                    )}
                  >
                    <Button type="primary">Still Hyperlink Issue</Button>
                  </Popover>
                </div>
              )}
            </div>,
          ]}
          // title="Pdf Test"
          centered
          open={isModalOpen}
          // style={{ top: 5 }}
          onOk={handleCloseModal}
          onCancel={handleCloseModal}
          width="97%"
          footer={false}
          // height={400}
        >
          <div className="section-container">
            <div className="row">
              <div className="col-xl-4">
                <div style={{ height: "90%", overflowY: "scroll" }}>
                  <div
                    className={
                      selectMeatResult?.isMeatCriteriaPresent === true
                        ? `${visitStyles.meat_details_card2}`
                        : `${visitStyles.meat_details_card_false_1}`
                    }
                  >
                    <div className={visitStyles.meat_title_card2_meat}>
                      <div className="row">
                        <div className="col-xl-6">
                          <label>Codes</label>
                        </div>
                        <div className="col-xl-6">
                          <label>Description</label>
                        </div>
                      </div>
                    </div>

                    <div className="row p-2">
                      <div className="col-xl-6 d-grid">
                        <span className="font-bold">
                          {selectMeatResult?.diagnosisCode}
                        </span>
                        {selectMeatResult?.category == "Valid" ? (
                          <Badge
                            className="valid-meat badge-circle mt-2"
                            bg={` badge-circle mt-2 bg-validmeat`}
                          >
                            {selectMeatResult?.category}
                          </Badge>
                        ) : (
                          <Badge
                            className="valid-meat badge-circle mt-2"
                            bg={` badge-circle mt-2 bg-validUnmatch`}
                          >
                            {selectMeatResult?.category}
                          </Badge>
                        )}
                      </div>
                      <div className="col-xl-6 d-grid">
                        <Popover
                          placement="topLeft"
                          title="Description"
                          content={selectMeatResult?.diseaseName}
                          overlayStyle={{ zIndex: 1000 }}
                        >
                          <span className="meat-name-details2">
                            {selectMeatResult?.diseaseName}
                          </span>
                        </Popover>
                      </div>
                      <div
                        className={`${visitStyles.encounterAndSectionHeader}`}
                      >
                        {getProviderNameList({
                          data: selectMeatResult?.providerName,
                          captureSectionMatching: captureSectionMatching,
                        })}
                      </div>
                      <div
                        className={`${visitStyles.encounterAndSectionHeader}`}
                      >
                        {getEncounterDateBackground({
                          value: selectMeatResult?.encounterDateSplit,
                          encounterDateMatching: encounterDateMatching,
                          fileDosPageNumberList: fileDosPageNumberList,
                          setIsModalOpenValidCodes: setIsModalOpen
                            ? setIsModalOpen
                            : null,
                          setSearch: setSearch,
                          setFileModalHeader: setFileModalHeader,
                          patientDocumentResult: patientDocumentResult,
                        })}
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      selectMeatResult?.isMeatCriteriaPresent === true
                        ? `${visitStyles.meat_details_card2}`
                        : `${visitStyles.meat_details_card_false_1}`
                    }
                  >
                    <div className="row p-2">
                      <div className="col-10 d-grid">
                        {getDisTitlePopover(
                          "Monitor",
                          selectMeatResult?.monitorAspect,
                          selectMeatResult.monitorHyperLink,
                          selectMeatResult
                        )}
                        <div>
                          {getCaptureSectionBackgroundMeatNew(
                            selectMeatResult.monitorHyperLink,
                            captureSectionMatching,
                            "hcc",
                            setSearch,
                            setFileLoading,
                            setIsModalOpenLab,
                            setIsModalOpenRadiology,
                            setIsModalOpen,
                            setFileModalHeader,
                            patientDocumentResult,
                            fileInitialPage,
                            setFileInitialPage,
                            selectMeatResult.diagnosisCode,
                            setSelectMeatResult,
                            selectMeatResult,
                            setSelectHyperlink
                          )}
                        </div>
                      </div>
                      <div style={{ width: "auto" }}>
                        <div className={`${visitStyles.meat_title_card2_meat}`}>
                          <span
                            className={`text-center ${
                              selectMeatResult?.isMeatCriteriaPresent === true
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            M
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      selectMeatResult?.isMeatCriteriaPresent === true
                        ? `${visitStyles.meat_details_card2}`
                        : `${visitStyles.meat_details_card_false_1}`
                    }
                  >
                    <div className="row p-2">
                      <div className="col-10 d-grid">
                        {getDisTitlePopover(
                          "Evaluate",
                          selectMeatResult?.evaluateAspect,
                          selectMeatResult.evaluateHyperLink,
                          selectMeatResult
                        )}
                        <div>
                          {getCaptureSectionBackgroundMeatNew(
                            selectMeatResult.evaluateHyperLink,
                            captureSectionMatching,
                            "hcc",
                            setSearch,
                            setFileLoading,
                            setIsModalOpenLab,
                            setIsModalOpenRadiology,
                            setIsModalOpen,
                            setFileModalHeader,
                            patientDocumentResult,
                            fileInitialPage,
                            setFileInitialPage,
                            selectMeatResult.diagnosisCode,
                            setSelectMeatResult,
                            selectMeatResult,
                            setSelectHyperlink
                          )}
                        </div>
                      </div>
                      <div style={{ width: "auto" }}>
                        <div className={visitStyles.meat_title_card2_meat}>
                          <span
                            className={`text-center ${
                              selectMeatResult?.isMeatCriteriaPresent === true
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            E
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      selectMeatResult?.isMeatCriteriaPresent === true
                        ? `${visitStyles.meat_details_card2}`
                        : `${visitStyles.meat_details_card_false_1}`
                    }
                  >
                    <div className="row p-2">
                      <div className="col-10 d-grid">
                        {getDisTitlePopover(
                          "Assesssment",
                          selectMeatResult?.assessmentAspect,
                          selectMeatResult.assessmentHyperLink,
                          selectMeatResult
                        )}
                        <div>
                          {getCaptureSectionBackgroundMeatNew(
                            selectMeatResult.assessmentHyperLink,
                            captureSectionMatching,
                            "hcc",
                            setSearch,
                            setFileLoading,
                            setIsModalOpenLab,
                            setIsModalOpenRadiology,
                            setIsModalOpen,
                            setFileModalHeader,
                            patientDocumentResult,
                            fileInitialPage,
                            setFileInitialPage,
                            selectMeatResult.diagnosisCode,
                            setSelectMeatResult,
                            selectMeatResult,
                            setSelectHyperlink
                          )}
                        </div>
                      </div>
                      <div style={{ width: "auto" }}>
                        <div className={visitStyles.meat_title_card2_meat}>
                          <span
                            className={`text-center ${
                              selectMeatResult?.isMeatCriteriaPresent === true
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            A
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      selectMeatResult?.isMeatCriteriaPresent === true
                        ? `${visitStyles.meat_details_card2}`
                        : `${visitStyles.meat_details_card_false_1}`
                    }
                  >
                    <div className="row p-2">
                      <div className="col-10 d-grid">
                        {getDisTitlePopover(
                          "Treatment",
                          selectMeatResult?.treatmentAspect,
                          selectMeatResult.treatmentHyperLink,
                          selectMeatResult
                        )}
                        <div>
                          {getCaptureSectionBackgroundMeatNew(
                            selectMeatResult.treatmentHyperLink,
                            captureSectionMatching,
                            "hcc",
                            setSearch,
                            setFileLoading,
                            setIsModalOpenLab,
                            setIsModalOpenRadiology,
                            setIsModalOpen,
                            setFileModalHeader,
                            patientDocumentResult,
                            fileInitialPage,
                            setFileInitialPage,
                            selectMeatResult.diagnosisCode,
                            setSelectMeatResult,
                            selectMeatResult,
                            setSelectHyperlink
                          )}
                        </div>
                      </div>
                      <div style={{ width: "auto" }}>
                        <div className={visitStyles.meat_title_card2_meat}>
                          <span
                            className={`text-center ${
                              selectMeatResult?.isMeatCriteriaPresent === true
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            T
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-8">
                <>
                  {selectFileURL && (
                    <PdfViewer
                      src={selectFileURL}
                      searchQuery={search?.value ? search?.value : ""}
                      pageNumber={search?.page ? search?.page : 1}
                      headers={search?.headers}
                      headerContent={search?.headerContent}
                    />
                  )}
                </>
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
          <CamboTree tree={combiTree} />
        </Modal>
      ) : (
        opens && showErrorMessage()
      )}
      {/* 
      <Offcanvas
        onHide={() => setMeatEdit(false)}
        show={meatEdit}
        className="offcanvas-end"
        placement="end"
      >
        <div className="p-4" style={{ overflowY: "scroll" }}>
          <ManuallyAdd
            handleCloseModal={() => setMeatEdit(false)}
            setIsFileFormShow={setMeatEdit}
            year={year}
            isEditMeat={true}
            isEditMeatValue={editData}
          />
        </div>
      </Offcanvas> */}
      <Drawer
        title=""
        onClose={() => setMeatEdit(false)}
        closeIcon={false}
        open={meatEdit}
        width={"80vw"}
      >
        <div className="row p-4" style={{ overflow: "hidden", height: "100%" }}>
          <div className="col-8">
            {hccFileDetails?.loading != true ? (
              <>
                {selectFileURL && (
                  <PdfViewer
                    src={selectFileURL}
                    searchQuery={search?.value ? search?.value : ""}
                    pageNumber={search?.page ? search?.page : 1}
                    headers={search?.headers}
                    height="100vh"
                    heightFrame="900"
                  />
                )}
              </>
            ) : null}
          </div>
          <div className="col-4">
            <div
              className="px-4"
              style={{ height: "90vh", overflowY: "scroll" }}
            >
              <ManuallyAdd
                handleCloseModal={() => setMeatEdit(false)}
                setIsFileFormShow={setMeatEdit}
                year={year}
                isEditMeat={true}
                isEditMeatValue={editData}
              />
            </div>
          </div>
        </div>
      </Drawer>
      <AddMeatQuery
        queryFormValues={queryFormValues}
        handleCloseModal={handleCloseModal}
        isMeatQueryModal={isMeatQueryModal}
        setIsMeatQueryModal={setIsMeatQueryModal}
      />
      <ModelIndex
        title={selectDiseasesName}
        openState={confirmNotesModalValid}
        setFileLoading={setFileLoading}
        handleCloseModal={handleCloseModal}
        setConfirmNotesModalValid={setConfirmNotesModalValid}
        isValidAction={isValidAction}
        selectDisDetails={selectDisDetails}
      />
    </>
  );
};

const enhancer = connect(
  (state) => ({
    patientDetailsResult:state?.patientDetails?.details?.radiologyResult,
    hccFileDetails: state?.patientDetails?.details?.hccFileResult,
    fileDosPageNumberList: state?.patientDetails?.details?.dosPageNumberResult,
    radiologyFile: state?.patientDetails?.details?.radiologyFileResult,

  }),
  {
    getpatientDetailsData: detailsActions.patientDetailsAction,
  }
);
export default enhancer(Meat);



