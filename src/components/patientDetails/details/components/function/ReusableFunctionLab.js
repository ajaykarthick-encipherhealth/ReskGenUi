import { CalendarOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip, notification } from "antd";
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
  captureSectionMatching,
  setSearch,
  setIsModalOpenRadiology,
  setFileModalHeader
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
            setSearch,
            setFileModalHeader,
            setIsModalOpenRadiology
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
  getLabDetails,
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

  if (
    isValidAction.name == "Move to Suggested" &&
    isValidAction.title == "RADIOLOGY_HCC"
  ) {
    // apiURL = "dbservice/update/move/deletedtoSuggested";
  }
  if (
    isValidAction.name == "Move to Deleted" &&
    isValidAction.title == "RADIOLOGY_HCC"
  ) {
    apiURL = "dbservice/update/move/radiologyvalidtodeleted";
  }
  if (
    isValidAction.name == "Move to HCC" &&
    isValidAction.title == "RADILOGY_DELETED"
  ) {
    apiURL = "dbservice/update/move/radiologydeletedtovalid";
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
        getLabDetails(patientId);
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

export const findValueDocument = async ({
  res,
  headerNames,
  encounterDate,
  actualDescription,
  diagnosisCode,
  setSearch,
  setFileModalHeader,
  setIsModalOpenRadiology
}) => {
    if(setIsModalOpenRadiology){
        setIsModalOpenRadiology(true)
    }
  var headerName = diagnosisCode + " - (" + headerNames + ")";
  setFileModalHeader(headerName);
  setSearch({
    value: res,
    headers: false,
    headerContent: res,
  });
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
    if (selectObject.dosYear) {
      selectObject.dos = selectObject.dosYear;
    } else {
      selectObject.dos = patientDetailsResult?.result?.response?.dos;
    }
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
    case "HCC to NON_HCC":
      moveToAnotherAction(
        setConfirmNotesModalValid,
        setIsValidAction,
        "Move to Suggested",
        "RADIOLOGY_HCC"
      );
      break;
    case "HCC to RADILOGY_DELETED":
      moveToAnotherAction(
        setConfirmNotesModalValid,
        setIsValidAction,
        "Move to Deleted",
        "RADIOLOGY_HCC"
      );
      break;
    case "RADILOGY_DELETED to HCC":
      moveToAnotherAction(
        setConfirmNotesModalValid,
        setIsValidAction,
        "Move to HCC",
        "RADILOGY_DELETED"
      );
      break;
    default:
      null;
  }
};

const ReusableFunctionsLab = () => {
  return <></>;
};

export default ReusableFunctionsLab;
