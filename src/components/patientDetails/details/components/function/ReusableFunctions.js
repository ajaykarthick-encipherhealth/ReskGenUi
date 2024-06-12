import { CalendarOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip, notification, Popover } from "antd";
import moment from "moment";
import {
  faCircleUser,
  faCircle,
  faTrashCan,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import visitStyles from "../../../../../styles/visitdata.module.css";
import styles from "../HCC/styles.module.css";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";

export const getEncounterDateBackground = ({
  value,
  encounterDateMatching,
  fileDosPageNumberList,
  setIsModalOpenValidCodes,
  setSearch,
  setFileModalHeader,
  patientDocumentResult,
  selectMeatResult,
  datas,
}) => {
  return value?.map((res, index) => {
    const result = encounterDateMatching.filter((res2) => res2.name == res);
    var backColor = result[0]?.colors;
    if (index < 2) {
      var sectionMapArr = res ? (
        <span
          onClick={() =>
            getEncounterDetails(
              res,
              fileDosPageNumberList,
              setIsModalOpenValidCodes,
              setSearch,
              setFileModalHeader,
              patientDocumentResult,
              selectMeatResult,
              datas,
              patientDocumentResult
            )
          }
          style={{
            borderColor: stringToColour(res) + 33,
            color: stringToColour(res),
            border: "1px solid",
          }}
          className={`cr-pointer mt-2 text-start ${visitStyles.encounterDate}`}
        >
          <i>
            <CalendarOutlined
              className={visitStyles.calenderIconNew}
              style={{
                size: 10,
                color: stringToColour(res),
              }}
            />
          </i>
          {moment(res).format("MMM DD")}
        </span>
      ) : (
        ""
      );
      return sectionMapArr;
    } else if (value.length - 1 == index) {
      var sectionMapArr = (
        <Popover
          content={
            <>
              {value?.map((item, i) =>
                i > 1 ? (
                  <span
                    onClick={() =>
                      getEncounterDetails(
                        item,
                        fileDosPageNumberList,
                        setIsModalOpenValidCodes,
                        setSearch,
                        setFileModalHeader,
                        patientDocumentResult,
                        selectMeatResult,
                        datas,
                        patientDocumentResult
                      )
                    }
                    style={{
                      borderColor: stringToColour(item) + 33,
                      color: stringToColour(item),
                      border: "1px solid",
                    }}
                    className={`cr-pointer mt-2 text-start ${visitStyles.encounterDate}`}
                  >
                    <i>
                      <CalendarOutlined
                        className={visitStyles.calenderIconNew}
                        style={{
                          size: 10,
                          color: stringToColour(item),
                        }}
                      />
                    </i>
                    {moment(item).format("MMM DD")}
                  </span>
                ) : null
              )}
            </>
          }
          trigger={["hover"]}
          placement="bottom"
        >
          <span
            style={{
              background: "#a0b1a0",
              color: "#fff",
            }}
            className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
          >
            {value.length - 2}+
          </span>
        </Popover>
      );

      return sectionMapArr;
    }
  });
};

const getEncounterDetails = async (
  date,
  fileDosPageNumberList,
  setIsModalOpenValidCodes,
  setSearch,
  setFileModalHeader,
  patientDocumentResult,
  selectMeatResult,
  datas
) => {
  selectMeatResult ? selectMeatResult(datas) : "";
  const findPageNumber = fileDosPageNumberList?.data?.response?.filter(
    (i) =>
      moment(i.dos).format("MM-DD-YYYY") === moment(date).format("MM-DD-YYYY")
  );
  if (findPageNumber.length != 0) {
    if (setIsModalOpenValidCodes) {
      setIsModalOpenValidCodes(true);
      var headerName = patientDocumentResult
        ? patientDocumentResult.patientId +
          " / " +
          patientDocumentResult.patientName +
          " / " +
          moment(date).format("MM-DD-YYYY")
        : "";
      setFileModalHeader(headerName);
    }
    setSearch({
      value: moment(findPageNumber[0]?.dos).format("MM/DD/YYYY"),
      page: findPageNumber[0]?.startPageNumber,
    });
  }
};

export const getHeaderHyperlink = (
  value,
  encounterDateMatching,
  documentPlace,
  setSearch,
  setFileLoading,
  setIsModalOpenLab,
  setIsModalOpenRadiology,
  setIsModalOpenValidCodes,
  setFileModalHeader,
  patientDocumentResult,
  fileInitialPage,
  setFileInitialPage,
  diagnosisCode,
  setSelectMeatResult,
  meatresult,
  diseaseName
) => {
  return value?.map((res) => {
    const result = encounterDateMatching.filter(
      (res2) => res2.name == res?.dateOfService
    );
    var backColor = result[0]?.colors;
    var sectionMapArr = res ? (
      <span
        onClick={() =>
          newFindValueDocument(
            res,
            documentPlace,
            setSearch,
            setFileLoading,
            setIsModalOpenLab,
            setIsModalOpenRadiology,
            setIsModalOpenValidCodes,
            setFileModalHeader,
            patientDocumentResult,
            fileInitialPage,
            setFileInitialPage,
            diagnosisCode,
            setSelectMeatResult,
            meatresult,
            "",
            "",
            diseaseName
          )
        }
        style={{
          borderColor: stringToColour(res?.dateOfService) + 33,
          color: stringToColour(res?.dateOfService),
          border: "1px solid",
        }}
        className={`cr-pointer mt-2 text-start ${visitStyles.encounterDate}`}
      >
        <i>
          <CalendarOutlined className={visitStyles.calenderIconNew} />
        </i>
        {moment(res?.dateOfService).format("MMM DD")}
      </span>
    ) : (
      ""
    );
    return sectionMapArr;
  });
};

const newFindValueDocument = (
  data,
  documentPlace,
  setSearch,
  setFileLoading,
  setIsModalOpenLab,
  setIsModalOpenRadiology,
  setIsModalOpenValidCodes,
  setFileModalHeader,
  patientDocumentResult,
  fileInitialPage,
  setFileInitialPage,
  diagnosisCode,
  setSelectMeatResult,
  meatresult,
  setSelectHyperlink,
  value,
  diseaseName
) => {
  console.log(data);
  setFileLoading(true);
  setSelectMeatResult && setSelectMeatResult(meatresult);
  setSelectHyperlink &&
    setSelectHyperlink({ allHeaderResult: value, selectHeaderResult: data });
  var disName = diseaseName ? diseaseName : meatresult?.diseaseName;
  var headerName = patientDocumentResult
    ? patientDocumentResult.patientId +
      " / " +
      patientDocumentResult.patientName +
      " / " +
      diagnosisCode +
      " - (" +
      disName +
      ")" +
      " - (" +
      data?.header +
      ")"
    : "";
  setFileModalHeader(headerName);
  if (data?.pageNumber == fileInitialPage) {
    setFileLoading(false);
    notification.warning({
      message: "This detail also same page",
      placement: "top",
      duration: 1,
    });
  }
  var splitSpace = data?.substring
    ?.replace(/\s{2,}/g, " ")
    .replace(/['"]+/g, "");
  setSearch({
    value: splitSpace,
    page: data?.pageNumber,
    headers: true,
    headerContent: data?.header,
  });
  if (documentPlace === "Lab" || documentPlace === "Radio") {
    if (documentPlace === "Lab") {
      setIsModalOpenLab(true);
    } else {
      setIsModalOpenRadiology(true);
    }
  } else {
    if (patientDocumentResult && setIsModalOpenValidCodes) {
      setIsModalOpenValidCodes(true);
    }
  }
  setFileInitialPage(data?.pageNumber);
  setFileLoading(false);
};

const truncateString = (str, num) => {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  }
  return str;
};

export const getCaptureSectionBackgroundFile = (
  value,
  encounterDate,
  actualDescription,
  diagnosisCode,
  documentPlace,
  captureSectionMatching,
  setSearch,
  setFileLoading,
  setIsModalOpenLab,
  setIsModalOpenRadiology,
  setIsModalOpenValidCodes,
  setFileModalHeader,
  fileId,
  patientDocumentResult,
  fileInitialPage,
  setFileInitialPage,
  hyperlinks,
  encounterDateMatching,
  setIsMulitpleHeader,
  isMulitpleHeader,
  setIsMulitpleHeadeCode,
  isMulitpleHeaderCode,
  diseaseName
) => {
  var dublicateCaptureDelete = removeDuplicates(value);
  return dublicateCaptureDelete.map((res, index) => {
    const result = captureSectionMatching?.filter(
      (res2) => res2.sectionName === res
    );
    const headerResult = hyperlinks?.filter(
      (res2) => res2.header === result[0]?.sectionName
    );
    var backColor = result[0]?.backgroundColor;
    var textColor = result[0]?.sectionColor;
    var headerNames = result[0]?.sectionName;
    if (index < 2) {
      if (headerResult?.length == 1) {
        var sectionMapArr = (
          <span
            onClick={() =>
              newFindValueDocument(
                headerResult[0],
                documentPlace,
                setSearch,
                setFileLoading,
                setIsModalOpenLab,
                setIsModalOpenRadiology,
                setIsModalOpenValidCodes,
                setFileModalHeader,
                patientDocumentResult,
                fileInitialPage,
                setFileInitialPage,
                diagnosisCode,
                "",
                "",
                "",
                "",
                diseaseName
              )
            }
            style={{ backgroundColor: backColor, color: textColor }}
            className={`cr-pointer mt-2 text-start ${visitStyles.captureheader} ${backColor} truncate-text`}
          >
            {truncateString(res, 30)}
          </span>
        );
        if (res != "") {
          return sectionMapArr;
        }
      } else {
        var sectionMapArr = (
          <Popover
            placement="bottom"
            content={
              <>
                {res?.length > 30 && <div>{res}</div>}
                {getHeaderHyperlink(
                  headerResult,
                  encounterDateMatching,
                  documentPlace,
                  setSearch,
                  setFileLoading,
                  setIsModalOpenLab,
                  setIsModalOpenRadiology,
                  setIsModalOpenValidCodes,
                  setFileModalHeader,
                  patientDocumentResult,
                  fileInitialPage,
                  setFileInitialPage,
                  diagnosisCode,
                  "",
                  "",
                  diseaseName
                )}
              </>
            }
          >
            <span
              style={{ backgroundColor: backColor, color: textColor }}
              className={`cr-pointer mt-2 text-start ${visitStyles.captureheader} ${backColor} truncate-text`}
            >
              {truncateString(res, 30)}
            </span>
          </Popover>
        );
        if (res != "") {
          return sectionMapArr;
        }
      }
    } else if (dublicateCaptureDelete.length - 1 == index) {
      if (headerResult?.length == 1) {
        var sectionMapArr = (
          <>
            {dublicateCaptureDelete?.map((item, i) =>
              i > 1 ? (
                <>
                  {isMulitpleHeader &&
                    diagnosisCode == isMulitpleHeaderCode && (
                      <span
                        onClick={() =>
                          newFindValueDocument(
                            findSectionHyperlink(hyperlinks, item)[0],
                            documentPlace,
                            setSearch,
                            setFileLoading,
                            setIsModalOpenLab,
                            setIsModalOpenRadiology,
                            setIsModalOpenValidCodes,
                            setFileModalHeader,
                            patientDocumentResult,
                            fileInitialPage,
                            setFileInitialPage,
                            diagnosisCode,
                            "",
                            "",
                            "",
                            "",
                            diseaseName
                          )
                        }
                        style={{
                          background: stringToColour(item) + 33,
                          color: stringToColour(item),
                        }}
                        className={`cr-pointer mt-2 text-start ${visitStyles.captureheader} ${backColor}`}
                      >
                        {item}
                      </span>
                    )}
                </>
              ) : null
            )}

            <span
              style={{
                backgroundColor:
                  isMulitpleHeader && diagnosisCode == isMulitpleHeaderCode
                    ? "#f35f5f"
                    : "#b3b3ec",
                color: "#fff",
              }}
              className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
              onClick={() => {
                setIsMulitpleHeader(
                  isMulitpleHeader && diagnosisCode == isMulitpleHeaderCode
                    ? false
                    : true
                ),
                  setIsMulitpleHeadeCode(diagnosisCode);
              }}
            >
              {isMulitpleHeader && diagnosisCode == isMulitpleHeaderCode ? (
                "X"
              ) : (
                <>{dublicateCaptureDelete.length - 2}+</>
              )}
            </span>
          </>
        );
        return sectionMapArr;
      } else {
        var sectionMapArr = (
          <>
            {dublicateCaptureDelete?.map((item, i) =>
              i > 1 ? (
                <Popover
                  placement="bottom"
                  content={getHeaderHyperlink(
                    findSectionHyperlink(hyperlinks, item),
                    encounterDateMatching,
                    documentPlace,
                    setSearch,
                    setFileLoading,
                    setIsModalOpenLab,
                    setIsModalOpenRadiology,
                    setIsModalOpenValidCodes,
                    setFileModalHeader,
                    patientDocumentResult,
                    fileInitialPage,
                    setFileInitialPage,
                    diagnosisCode
                  )}
                >
                  {isMulitpleHeader &&
                    diagnosisCode == isMulitpleHeaderCode && (
                      <span
                        style={{
                          background: stringToColour(item) + 33,
                          color: stringToColour(item),
                        }}
                        className={`cr-pointer mt-2 text-start ${visitStyles.captureheader} ${backColor}`}
                      >
                        {item}
                      </span>
                    )}
                </Popover>
              ) : null
            )}

            <span
              style={{
                backgroundColor:
                  isMulitpleHeader && diagnosisCode == isMulitpleHeaderCode
                    ? "#f35f5f"
                    : "#b3b3ec",
                color: "#fff",
              }}
              className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
              onClick={() => {
                setIsMulitpleHeader(
                  isMulitpleHeader && diagnosisCode == isMulitpleHeaderCode
                    ? false
                    : true
                ),
                  setIsMulitpleHeadeCode(diagnosisCode);
              }}
            >
              {isMulitpleHeader && diagnosisCode == isMulitpleHeaderCode ? (
                "X"
              ) : (
                <>{dublicateCaptureDelete.length - 2}+</>
              )}
            </span>
          </>
        );
        return sectionMapArr;
      }
    }
  });
};

export const getMeatFound = (code, data, value) => {
  const result = data?.filter(
    (res2) => res2?.diagnosisCode?.replace(".", "") == code?.replace(".", "")
  );
  var backColor = "#f93d3d";
  var meatTitle = "MEAT";
  if (result?.length != 0) {
    switch (value) {
      case "M":
        if (result[0]?.monitorAspect) {
          backColor = "#15b315";
        }
        meatTitle = "Monitor";
        break;
      case "E":
        if (result[0]?.evaluateAspect) {
          backColor = "#15b315";
        }
        meatTitle = "Evaluate";
        break;
      case "A":
        if (result[0]?.assessmentAspect) {
          backColor = "#15b315";
        }
        meatTitle = "Assessment";
        break;
      case "T":
        if (result[0]?.treatmentAspect) {
          backColor = "#15b315";
        }
        meatTitle = "Treatment";
        break;
      default:
        null;
    }
  }

  return (
    <Tooltip title={meatTitle} placement="bottom">
      <span
        style={{ backgroundColor: backColor, color: "white" }}
        className={`mt-2 ${styles.badgeMeat}`}
      >
        {value}
      </span>
    </Tooltip>
  );
};

export function removeDuplicates(array) {
  let output = [];
  if (array) {
    for (let item of array) {
      if (!output.includes(item)) output.push(item);
    }
  }

  return output;
}

export const getProviderNameManually = ({ data }) => {
  return data.map((res, index) => {
    // if (index < 2) {
    var sectionMapArr = (
      <span
        className={`mt-2 text-start ${visitStyles.provider_name_manually}`}
        style={{
          backgroundColor: stringToColour(res?.providerName) + 33,
          color: stringToColour(res?.providerName),
          fontSize: "16px",
        }}
      >
        <i>
          {" "}
          <FontAwesomeIcon
            icon={faCircleUser}
            style={{
              size: 20,
              color: stringToColour(res?.providerName),
            }}
          />
        </i>
        {res?.providerName}
      </span>
    );
    return sectionMapArr;
  });
};

export const getSectionNameManually = ({
  data,
  sectionDelete,
  sectionEdit,
}) => {
  return data.map((res, index) => {
    // if (index < 2) {
    var sectionMapArr = (
      <span
        className={`mt-2 text-start ${visitStyles.provider_name_manually} cr-pointer`}
        style={{
          backgroundColor: stringToColour(res?.section) + 33,
          color: stringToColour(res?.section),
          fontSize: "16px",
        }}
      >
        <Popover
          trigger="click"
          content={
            <>
              {res?.hyperlinks?.map((list) => (
                <span className="p-2 border rounded mx-2">
                  {list.dateOfService}
                </span>
              ))}
            </>
          }
        >
          {res?.section}{" "}
        </Popover>
        {/* <label
          className="cr-pointer px-4 pe-2 pt-2"
          onClick={() => sectionEdit(res)}
        >
          <FontAwesomeIcon icon={faPen} color="#04306f" />
        </label> */}
        <label className="cr-pointer pt-2" onClick={() => sectionDelete(res)}>
          <FontAwesomeIcon icon={faTrashCan} color="#04306f" />
        </label>
      </span>
    );
    return sectionMapArr;
  });
};
export const getProviderNameList = ({ data, captureSectionMatching }) => {
  var dublicateCaptureDelete = removeDuplicates(data);
  return dublicateCaptureDelete.map((res, index) => {
    const result = captureSectionMatching.filter(
      (res2) => res2.sectionName == res
    );
    var backColor =
      result[0]?.backgroundColor == "#efeff033"
        ? "#54548d33"
        : result[0]?.backgroundColor;
    var textColor =
      result[0]?.sectionColor == "#efeff0" ? "#000" : result[0]?.sectionColor;
    if (index < 2) {
      var sectionMapArr = (
        <span
          className={`mt-2 text-start ${visitStyles.provider_name}`}
          style={{
            backgroundColor: stringToColour(res) + 33,
            color: stringToColour(res),
          }}
        >
          <i>
            {" "}
            <FontAwesomeIcon
              icon={faCircleUser}
              style={{
                size: 10,
                color: stringToColour(res),
              }}
            />
          </i>
          {res}
        </span>
      );
      return sectionMapArr;
    } else if (data.length - 1 == index) {
      var sectionMapArr = (
        <Popover
          content={
            <>
              {data?.map((item, i) =>
                i > 1 ? (
                  <span
                    className={`mt-2 text-start ${visitStyles.provider_name}`}
                    style={{
                      backgroundColor: stringToColour(item) + 33,
                      color: stringToColour(item),
                    }}
                  >
                    <i>
                      {" "}
                      <FontAwesomeIcon
                        icon={faCircleUser}
                        style={{
                          size: 10,
                          color: stringToColour(item),
                        }}
                      />
                    </i>
                    {item}
                  </span>
                ) : null
              )}
            </>
          }
          trigger={["click"]}
          placement="bottom"
        >
          <span
            style={{ background: "#a6cfa6", color: "#fff" }}
            className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
          >
            {data.length - 2}+
          </span>
        </Popover>
      );

      return sectionMapArr;
    }
  });
};

export const handleSubmitValidNotes = async ({
  values,
  setFileLoading,
  setConfirmNotesModalValid,
  getPatientDetailsReload,
  isValidAction,
  selectDisDetails,
  getpatientDetailsData,
  patientDetailsResult,
  handleCloseModal,
}) => {
  setFileLoading(true);
  setConfirmNotesModalValid(false);
  handleCloseModal();
  var apiURL = "";
  if (
    isValidAction.name == "Move to Suggested" &&
    isValidAction.title == "HCC"
  ) {
    apiURL = "management/disease/move/validtosuggested";
  }
  if (isValidAction.name == "Move to Deleted" && isValidAction.title == "HCC") {
    apiURL = "management/disease/move/validtodeleted";
  }
  if (
    isValidAction.name == "Move to Deleted" &&
    isValidAction.title == "SUGGESTED"
  ) {
    apiURL = "management/disease/move/suggestedtodeleted";
  }
  if (
    isValidAction.name == "Move to HCC" &&
    isValidAction.title == "SUGGESTED"
  ) {
    apiURL = "management/disease/move/suggestedtovalid";
  }
  if (
    isValidAction.name == "Move to Suggested" &&
    isValidAction.title == "DELETED"
  ) {
    apiURL = "management/disease/move/deletedtoSuggested";
  }
  if (isValidAction.name == "Move to HCC" && isValidAction.title == "DELETED") {
    apiURL = "management/disease/move/deletedtovalid";
  }
  if (isValidAction.name == "Move to Hcc" && isValidAction.title == "NONHCC") {
    apiURL = "management/disease/move/invalidtovalid";
  }
  if (
    isValidAction.name == "Move to Deleted" &&
    isValidAction.title == "COMBO"
  ) {
    apiURL = "management/disease/move/combovalidtodeleted";
  }
  if (isValidAction.name == "Move to valid" && isValidAction.title == "COMBO") {
    apiURL = "management/disease/move/combodeletedtovalid";
  }
  if (
    isValidAction.name == "Move to Deleted" &&
    isValidAction.title == "MEAT"
  ) {
    apiURL = "management/meat/move/invalidtovalid";
  }
  if (isValidAction.name == "Move to valid" && isValidAction.title == "MEAT") {
    apiURL = "management/disease/move/deletedtovalid";
  }
  try {
    var patientId = localStorage.getItem("patientId");
    var dataFormatSuggested = {
      patientId: patientId,
      diagnosisCode: selectDisDetails.diagnosisCode
        ? selectDisDetails.diagnosisCode
        : selectDisDetails.diagnosisCodeCombo,
      // description: selectDisDetails.actualDescription,
      // dbDescription: selectDisDetails.dbDescription,
      reason: values?.reason,
      processedYear: selectDisDetails.processedYear,
      dateOfServices: selectDisDetails.dateOfServices,
      chartProcessType: selectDisDetails.dateOfService
        ? "DATE_OF_SERVICE"
        : "YEAR",
    };
    const response = await axios.put(
      ENDPOINTS.apiEndoint + apiURL,
      dataFormatSuggested
    );
    var result = response.data;
    if (result.status == "SUCCESS") {
      setFileLoading(false);
      notification.success({
        message: result.response,
        placement: "top",
        duration: 1,
      });
      getpatientDetailsData(
        patientId,
        patientDetailsResult?.data?.response?.processedYear,
        patientDetailsResult?.data?.response?.dateOfService
      );
    } else {
      setFileLoading(false);
      notification.error({
        message: result.response,
        placement: "top",
        duration: 1,
      });
    }
  } catch (err) {
    setFileLoading(false);
    notification.error({
      message: err?.response?.data?.response,
    });
  }
};

const findValueDocuments = async (
  headerNames,
  encounterDate,
  actualDescription,
  setSearch,
  setFileLoading,
  fileId,
  fileInitialPage,
  setFileInitialPage
) => {
  setFileLoading(true);
  var fileId = fileId?.result?.response?.fileId;
  const encounterDatesValue = encounterDate.split(",");
  var splitPoint = actualDescription.substring(" ", 20);
  var pageNumber = null;
  var data = {
    fileId: fileId,
    header: headerNames,
    dos: encounterDatesValue,
    stringFileWord: splitPoint,
  };
  try {
    const response = await axios.post(
      ENDPOINTS.apiEndoint + `dbservice/pageNumber`,
      data
    );
    var result = response?.data?.response;
    if (response?.data?.status === "SUCCESS") {
      pageNumber = result?.second[0] ? result?.second[0] : null;
      if (!result?.first) {
        splitPoint = headerNames;
      }
      if (pageNumber == fileInitialPage) {
        setFileLoading(false);
        notification.warning({
          message: "This detail also same page",
          placement: "top",
          duration: 1,
        });
      }

      setSearch({
        value: splitPoint,
        page: pageNumber,
        headers: false,
        headerContent: headerNames,
      });
      setFileInitialPage(pageNumber);
      setFileLoading(false);
    } else {
      splitPoint = headerNames;
      setSearch({
        value: splitPoint,
        page: "",
        headers: true,
        headerContent: headerNames,
      });
      setFileLoading(false);
      setFileInitialPage(null);
    }
  } catch (error) {
    setSearch({
      value: headerNames,
      page: "",
      headers: true,
      headerContent: headerNames,
    });
    setFileLoading(false);
    setFileInitialPage(null);
  }
};

export const findValueDocument = async ({
  disDescription,
  headerNames,
  encounterDate,
  actualDescription,
  diagnosisCode,
  documentPlace,
  setSearch,
  setFileLoading,
  setIsModalOpenLab,
  setIsModalOpenRadiology,
  setIsModalOpenValidCodes,
  setFileModalHeader,
  fileId,
  patientDocumentResult,
  fileInitialPage,
  setFileInitialPage,
}) => {
  setFileLoading(true);
  const encounterDatesValue = encounterDate.split(",");
  var splitPoint;
  var pageNumber = null;
  var data = {
    fileId: fileId?.result?.response?.fileId,
    header: headerNames,
    dos: encounterDatesValue,
    stringFileWord: actualDescription.substring(" ", 20),
    diagnosisCode: diagnosisCode,
  };
  var headerName = patientDocumentResult
    ? patientDocumentResult.patientId +
      " / " +
      patientDocumentResult.patientName +
      " / " +
      diagnosisCode +
      " - (" +
      headerNames +
      ")"
    : "";
  setFileModalHeader(headerName);
  try {
    if (documentPlace === "Lab" || documentPlace === "Radio") {
      setSearch({
        value: headerNames,
        headers: true,
        headerContent: headerNames,
      });
      setFileLoading(false);
      if (documentPlace === "Lab") {
        setIsModalOpenLab(true);
      } else {
        setIsModalOpenRadiology(true);
      }
    } else {
      if (patientDocumentResult && setIsModalOpenValidCodes) {
        setIsModalOpenValidCodes(true);
      }
      const response = await axios.post(
        ENDPOINTS.apiEndoint + `dbservice/pageNumber/latest`,
        data
      );
      var result = response.data.response;
      if (response?.data?.status == "SUCCESS") {
        pageNumber = result?.pageNumber - 1 ? result?.pageNumber - 1 : null;
        splitPoint = result?.searchString;
        if (result == null) {
          return findValueDocuments(
            headerNames,
            encounterDate,
            actualDescription,
            setSearch,
            setFileLoading,
            fileId,
            fileInitialPage,
            setFileInitialPage
          );
        }
        if (pageNumber == fileInitialPage) {
          setFileLoading(false);
          notification.warning({
            message: "This detail also same page",
            placement: "top",
            duration: 1,
          });
        }
        setSearch({
          value: splitPoint,
          page: result?.pageNumber,
          headers: false,
          headerContent: headerNames,
        });
        setFileInitialPage(pageNumber);
        setFileLoading(false);
      } else {
        splitPoint = headerName;
        setFileInitialPage(null);
      }
    }
  } catch (error) {
    // setSearch({
    //   value: headerNames,
    //   page: "",
    //   headers: true,
    // });
    setFileLoading(false);
    setFileInitialPage(pageNumber);
    // }
  }
};

export const moveToAnotherAction = (
  setConfirmNotesModalValid,
  setIsValidAction,
  name,
  title
) =>
  new Promise((resolve) => {
    setTimeout(() =>
      resolve(
        setConfirmNotesModalValid(true),
        setIsValidAction({
          name: name,
          title: title,
        })
      )
    );
  });

export const moveToStrightAction = (setIsValidAction, name, title) => {
  setIsValidAction({
    name: name,
    title: title,
  });
};

export const onDragEnd = (
  result,
  allDisList,
  setSelectDiseasesName,
  setSelectDisDetails,
  setConfirmNotesModalValid,
  setIsValidAction,
  patientDetailsResult
) => {
  var textJoin =
    result?.source?.droppableId + " to " + result?.destination?.droppableId;
  var selectData = allDisList.filter(
    (i) => i.diagnosisCode === result.draggableId
  );
  var selectObject = selectData[0];
  if (selectObject) {
    var title =
      selectObject.diagnosisCode + " - " + selectObject.actualDescription;
    selectObject.processedYear =
      patientDetailsResult?.data?.response?.processedYear;
    selectObject.dateOfService =
      patientDetailsResult?.data?.response?.dateOfService;
    (selectObject.fileId = patientDetailsResult?.data?.response?.fileId),
      setSelectDiseasesName(title);
    setSelectDisDetails(selectObject);
  }
  switch (textJoin) {
    case "HCC to SUGGESTED":
      moveToAnotherAction(
        setConfirmNotesModalValid,
        setIsValidAction,
        "Move to Suggested",
        "HCC"
      );
      break;
    case "HCC to DELETED":
      moveToAnotherAction(
        setConfirmNotesModalValid,
        setIsValidAction,
        "Move to Deleted",
        "HCC"
      );
      break;
    case "SUGGESTED to HCC":
      moveToAnotherAction(
        setConfirmNotesModalValid,
        setIsValidAction,
        "Move to HCC",
        "SUGGESTED"
      );
      break;
    case "SUGGESTED to DELETED":
      moveToAnotherAction(
        setConfirmNotesModalValid,
        setIsValidAction,
        "Move to Deleted",
        "SUGGESTED"
      );
      break;
    case "DELETED to SUGGESTED":
      moveToAnotherAction(
        setConfirmNotesModalValid,
        setIsValidAction,
        "Move to Suggested",
        "DELETED"
      );
      break;
    case "DELETED to HCC":
      moveToAnotherAction(
        setConfirmNotesModalValid,
        setIsValidAction,
        "Move to HCC",
        "DELETED"
      );
      break;
    default:
      null;
  }
};

export const getCaptureSectionBackgroundMeatNew = (
  value,
  captureSectionMatching,
  documentPlace,
  setSearch,
  setFileLoading,
  setIsModalOpenLab,
  setIsModalOpenRadiology,
  setIsModalOpenValidCodes,
  setFileModalHeader,
  patientDocumentResult,
  fileInitialPage,
  setFileInitialPage,
  diagnosisCode,
  setSelectMeatResult,
  meatresult,
  setSelectHyperlink,
  meatTitle
) => {
  var dublicateCaptureRemove = removeDuplicatesArray(value);
  return dublicateCaptureRemove?.map((res) => {
    const result = captureSectionMatching?.filter(
      (res2) => res2.sectionName === res.header
    );
    var backColor = result[0]?.backgroundColor;
    var textColor = result[0]?.sectionColor;
    var headerNames = result[0]?.sectionName;
    var sectionMapArr = (
      //   <Popover
      //   placement="topLeft"
      //   title={res?.header}
      //   content={
      //     <>
      //       <div className={styles.subStringContainer}>
      //         <div>
      //           <span className={styles.substringHead}>
      //             Document Word
      //           </span>
      //         </div>
      //         {res?.substring}
      //       </div>
      //     </>
      //   }
      // >
      <span
        onClick={() =>
          newFindValueDocument(
            res,
            documentPlace,
            setSearch,
            setFileLoading,
            setIsModalOpenLab,
            setIsModalOpenRadiology,
            setIsModalOpenValidCodes,
            setFileModalHeader,
            patientDocumentResult,
            fileInitialPage,
            setFileInitialPage,
            diagnosisCode,
            setSelectMeatResult,
            meatresult,
            setSelectHyperlink,
            value
          )
        }
        style={{
          backgroundColor: stringToColour(res.header) + 33,
          color: stringToColour(res.header),
        }}
        className={`cr-pointer mt-2 text-start ${visitStyles.captureheader} ${backColor} truncate-text`}
      >
        {truncateString(res.header, 30)}
      </span>
      // </Popover>
    );
    if (res.header != "") {
      return sectionMapArr;
    }
  });
};

export function removeDuplicatesArray(arr) {
  if (arr) {
    const headers = arr.map(({ header }) => header);
    const filtered = arr.filter(
      ({ header }, index) => !headers.includes(header, index + 1)
    );
    return filtered;
  }
}

export const getSuspectTypes = (title, value) => {
  var popOver = (
    <Popover
      className="suspectContainer"
      placement="top"
      // title="Suspect Type"
      content={
        <>
          <span className={styles.suspectHeader}>SUSPECT TYPE</span>
          {value?.map((res) => {
            return (
              <div className={styles.subStringContainer}>
                <div className={styles.suspectTypeDiv}>
                  <span
                    style={{
                      backgroundColor: stringToColour(res) + 22,
                      color: stringToColour(res),
                    }}
                    className={styles.suspectCircleLable}
                  >
                    {res}
                  </span>
                </div>
              </div>
            );
          })}
        </>
      }
    >
      <div>
        <FontAwesomeIcon icon={faCircle} className={styles.suspectCircle} />
      </div>
    </Popover>
  );

  return popOver;
};

export const stringToColour = (str) => {
  let hash = 0;
  str?.split("").forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, "0");
  }
  if (str?.toLocaleLowerCase() === "plan") {
    colour = "#7e00ff";
  }
  if (str.toLocaleLowerCase() === "examination") {
    colour = "#9eb875";
  }
  return colour;
};

const findSectionHyperlink = (hyperlinks, header) => {
  const headerResult = hyperlinks?.filter((res2) => res2.header === header);
  return headerResult;
};
const ReusableFunctions = () => {
  return <></>;
};

export default ReusableFunctions;
