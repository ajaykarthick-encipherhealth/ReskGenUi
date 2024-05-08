import { CalendarOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip, notification } from "antd";
import moment from "moment";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import visitStyles from "../../../../../../styles/visitdata.module.css";
import styles from "../HCC/styles.module.css";
import axios from "../../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../../utility/enpoints";
import { getPatientDetailsResult } from "../../../../../../store/actions/ReviewerAction/PatientDetailsAction";

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
  var result = fileDosPageNumberList?.result;
  var groupEncounterDate = [];
  for (var key in result?.response) {
    var optionArray = [];
    var optionPage = [];
    var pageNumbervalue = result.response[key];
    for (var key2 in pageNumbervalue) {
      var startPage = key2 == "first" ? pageNumbervalue[key2] : null;
      var keyValue = key2 == "first" ? "Start - " : "End - ";
      optionArray.push({
        label: keyValue + " " + pageNumbervalue[key2],
        value: pageNumbervalue[key2] + "," + moment(key).format("MM/DD"),
      });
      if (startPage) {
        optionPage.push({
          pageNumber: startPage,
        });
      }
    }
    groupEncounterDate.push({
      date: moment(key).format("MM/DD/YYYY"),
      startPage: optionPage,
    });
  }
  const findPageNumber = groupEncounterDate.filter((i) => i.date === date);
  if (findPageNumber.length != 0) {
    if (setIsModalOpenValidCodes) {
      setIsModalOpenValidCodes(true);
      var headerName = patientDocumentResult
        ? patientDocumentResult.patientId +
          " / " +
          patientDocumentResult.patientName +
          " / " +
          date
        : "";
      setFileModalHeader(headerName);
    }
    var date = findPageNumber[0].date;
    if (findPageNumber[0].startPage.length != 0) {
      var pageNumber = findPageNumber[0].startPage[0].pageNumber;
      var splitPoint = date.substring(" ", 5);
      setSearch({
        value: splitPoint,
        page: pageNumber,
      });
    }
  }
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
  setFileInitialPage
) => {
  var dublicateCaptureDelete = removeDuplicates(value);
  return dublicateCaptureDelete.map((res) => {
    const result = captureSectionMatching.filter(
      (res2) => res2.sectionName == res
    );
    var backColor = result[0]?.backgroundColor;
    var textColor = result[0]?.sectionColor;
    var headerNames = result[0]?.sectionName;
    var sectionMapArr = (
      <span
        onClick={() =>
          findValueDocument({
            res,
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
          })
        }
        style={{ backgroundColor: backColor, color: textColor }}
        className={`cr-pointer mt-2 text-start ${visitStyles.captureheader} ${backColor}`}
      >
        {res}
      </span>
    );
    return sectionMapArr;
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
        if (result[0]?.monitor) {
          backColor = "#15b315";
        }
        meatTitle = "Monitor";
        break;
      case "E":
        if (result[0]?.evaluate) {
          backColor = "#15b315";
        }
        meatTitle = "Evaluate";
        break;
      case "A":
        if (result[0]?.assessment) {
          backColor = "#15b315";
        }
        meatTitle = "Assessment";
        break;
      case "T":
        if (result[0]?.treatment) {
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
  dispatch,
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
      dispatch(getPatientDetailsResult(patientId));
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
        headers: result?.first,
      });
      setFileInitialPage(pageNumber);
      setFileLoading(false);
    } else {
      splitPoint = headerNames;
      setSearch({
        value: splitPoint,
        page: "",
        headers: true,
      });
      setFileLoading(false);
      setFileInitialPage(null);
    }
  } catch (error) {
    setSearch({
      value: headerNames,
      page: "",
      headers: true,
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
      });
      setFileLoading(false);
      if (documentPlace === "Lab") {
        setIsModalOpenLab(true);
      } else {
        setIsModalOpenRadiology(true);
      }
    } else {
      if (patientDocumentResult) {
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
        });
        setFileInitialPage(pageNumber);
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

const ReusableFunctions = () => {
  return <></>;
};

export default ReusableFunctions;
