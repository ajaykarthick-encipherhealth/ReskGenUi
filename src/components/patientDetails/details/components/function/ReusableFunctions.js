import { CalendarOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip, notification, Popover } from "antd";
import moment from "moment";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
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
  return value?.map((res) => {
    const result = encounterDateMatching.filter((res2) => res2.name == res);
    var backColor = result[0]?.colors;
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
        className={`cr-pointer mt-2 text-start ${visitStyles.encounterDate} ${backColor}`}
      >
        <i>
          <CalendarOutlined className={visitStyles.calenderIcon} />
        </i>
        {moment(res).format("MMM DD")}
      </span>
    ) : (
      ""
    );
    return sectionMapArr;
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
  meatresult
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
            meatresult
          )
        }
        className={`cr-pointer mt-2 text-start ${visitStyles.encounterDate} ${backColor}`}
      >
        <i>
          <CalendarOutlined className={visitStyles.calenderIcon} />
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
  meatresult
) => {
  console.log(data);
  setFileLoading(true);
  setSelectMeatResult && setSelectMeatResult(meatresult);
  var headerName = patientDocumentResult
    ? patientDocumentResult.patientId +
      " / " +
      patientDocumentResult.patientName +
      " / " +
      diagnosisCode +
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
  var splitSpace=data?.substring?.replace(/\s{2,}/g,' ').replace(/['"]+/g, '');
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
  encounterDateMatching
) => {
  var dublicateCaptureDelete = removeDuplicates(value);
  return dublicateCaptureDelete.map((res) => {
    const result = captureSectionMatching?.filter(
      (res2) => res2.sectionName === res
    );
    const headerResult = hyperlinks?.filter(
      (res2) => res2.header === result[0]?.sectionName
    );
    var backColor = result[0]?.backgroundColor;
    var textColor = result[0]?.sectionColor;
    var headerNames = result[0]?.sectionName;
    var sectionMapArr = (
      <Popover
        placement="bottom"
        content={getHeaderHyperlink(
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
          diagnosisCode
        )}
      >
        <span
          style={{ backgroundColor: backColor, color: textColor }}
          className={`cr-pointer mt-2 text-start ${visitStyles.captureheader} ${backColor}`}
        >
          {res}
        </span>
      </Popover>
      // <span
      //   onClick={() =>
      //     findValueDocument({
      //       res,
      //       headerNames,
      //       encounterDate,
      //       actualDescription,
      //       diagnosisCode,
      //       documentPlace,
      //       setSearch,
      //       setFileLoading,
      //       setIsModalOpenLab,
      //       setIsModalOpenRadiology,
      //       setIsModalOpenValidCodes,
      //       setFileModalHeader,
      //       fileId,
      //       patientDocumentResult,
      //       fileInitialPage,
      //       setFileInitialPage,
      //     })
      //   }
      //   style={{ backgroundColor: backColor, color: textColor }}
      //   className={`cr-pointer mt-2 text-start ${visitStyles.captureheader} ${backColor}`}
      // >
      //   {res}
      // </span>
    );
    if (res != "") {
      return sectionMapArr;
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

export const getProviderNameList = ({ data, captureSectionMatching }) => {
  var dublicateCaptureDelete = removeDuplicates(data);
  return dublicateCaptureDelete.map((res) => {
    const result = captureSectionMatching.filter(
      (res2) => res2.sectionName == res
    );
    var backColor =
      result[0]?.backgroundColor == "#efeff033"
        ? "#54548d33"
        : result[0]?.backgroundColor;
    var textColor =
      result[0]?.sectionColor == "#efeff0" ? "#000" : result[0]?.sectionColor;
    var sectionMapArr = (
      <span
        className={`mt-2 text-start ${visitStyles.provider_name}`}
        style={{ backgroundColor: backColor, color: textColor }}
      >
        <i>
          {" "}
          <FontAwesomeIcon
            icon={faCircleUser}
            style={{
              size: 10,
              color: textColor,
            }}
          />
        </i>
        {res}
      </span>
      // </Popover>
    );
    return sectionMapArr;
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
  patientDetailsResult
}) => {
  setFileLoading(true);
  setConfirmNotesModalValid(false);
  var apiURL = "";
  if (
    isValidAction.name == "Move to Suggested" &&
    isValidAction.title == "HCC"
  ) {
    apiURL = "dbservice/update/move/validtosuggested";
  }
  if (isValidAction.name == "Move to Deleted" && isValidAction.title == "HCC") {
    apiURL = "dbservice/update/move/validtodeleted";
  }
  if (
    isValidAction.name == "Move to Deleted" &&
    isValidAction.title == "SUGGESTED"
  ) {
    apiURL = "dbservice/update/move/suggestedtodeleted";
  }
  if (
    isValidAction.name == "Move to HCC" &&
    isValidAction.title == "SUGGESTED"
  ) {
    apiURL = "dbservice/update/move/suggestedtovalid";
  }
  if (
    isValidAction.name == "Move to Suggested" &&
    isValidAction.title == "DELETED"
  ) {
    apiURL = "dbservice/update/move/deletedtoSuggested";
  }
  if (isValidAction.name == "Move to HCC" && isValidAction.title == "DELETED") {
    apiURL = "dbservice/update/move/deletedtovalid";
  }
  if (isValidAction.name == "Move to Hcc" && isValidAction.title == "NONHCC") {
    apiURL = "dbservice/update/move/invalidtovalid";
  }
  try {
    var patientId = localStorage.getItem("patientId");
    var userId = localStorage.getItem("userId");
    var dataFormatSuggested = {
      userId: userId,
      patientId: patientId,
      diagnosisCode: selectDisDetails.diagnosisCode,
      actualDescription: selectDisDetails.actualDescription,
      dbDescription: selectDisDetails.dbDescription,
      notes: values.reason,
      dos: selectDisDetails.dos,
      encounterDate: selectDisDetails.encounterDate,
      capturedSections: selectDisDetails.capturedSections,
    };
    const response = await axios.put(
      ENDPOINTS.apiEndoint + apiURL,
      dataFormatSuggested
    );
    var result = response.data;
    if (result.status == "SUCCESS") {
      setFileLoading(false);
      notification.success({
        message: result.message,
        placement: "top",
        duration: 1,
      });
      getpatientDetailsData(patientId,patientDetailsResult?.data?.response?.processedYear,patientDetailsResult?.data?.response?.dateOfService);    } else {
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
    selectObject.dos = patientDetailsResult?.result?.response?.dos;
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
  meatresult
) => {
  return value?.map((res) => {
    const result = captureSectionMatching?.filter(
      (res2) => res2.sectionName === res.header
    );
    var backColor = result[0]?.backgroundColor;
    var textColor = result[0]?.sectionColor;
    var headerNames = result[0]?.sectionName;
    var sectionMapArr = (
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
            meatresult
          )
        }
        style={{ backgroundColor: backColor, color: textColor }}
        className={`cr-pointer mt-2 text-start ${visitStyles.captureheader} ${backColor}`}
      >
        {res.header}
      </span>
    );
    if (res.header != "") {
      return sectionMapArr;
    }
  });
};

const ReusableFunctions = () => {
  return <></>;
};

export default ReusableFunctions;
