import { CalendarOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip, notification } from "antd";
import moment from "moment";
import {
  faArrowsAlt,
  faSitemap,
  faCircleUser,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import visitStyles from "../../../../../../styles/visitdata.module.css";
import styles from "../HCC/styles.module.css";
import axios from "../../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../../utility/enpoints";
import { useSelector } from "react-redux";

export const getEncounterDateBackground = ({
  value,
  encounterDateMatching,
  getEncounterDetails,
}) => {
  return value?.map((res) => {
    const result = encounterDateMatching.filter((res2) => res2.name == res);
    var backColor = result[0]?.colors;
    var sectionMapArr = res ? (
      <span
        onClick={() => getEncounterDetails(res)}
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
) => {
  var dublicateCaptureDelete = removeDuplicates(value);
  return dublicateCaptureDelete.map((res) => {
    const result = captureSectionMatching.filter(
      (res2) => res2.sectionName == res
    );
    var backColor = result[0]?.backgroundColor;
    var textColor = result[0]?.sectionColor;
    var disCode = result[0]?.diagnosisCode;
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
            setFileModalHeader,fileId,
            patientDocumentResult,
          
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
  event,
  setFileLoading,
  setConfirmNotesModalValid,
  getPatientDetailsReload,
  setValidated,
}) => {
  setFileLoading(true);
  const form = event.currentTarget;
  event.preventDefault();
  if (form.checkValidity() === true) {
    setFileLoading(true);
    setConfirmNotesModalValid(false);
    var apiURL = "";
    // validMoveConfirm();
    if (isValidAction == "validToSuggested") {
      apiURL = "dbservice/update/move/validtosuggested";
    }
    if (isValidAction == "validToDeleted") {
      apiURL = "dbservice/update/move/validtodeleted";
    }
    if (isValidAction == "suggestedToDeleted") {
      apiURL = "dbservice/update/move/suggestedtodeleted";
    }
    if (isValidAction == "suggestedToValid") {
      apiURL = "dbservice/update/move/suggestedtovalid";
    }
    if (isValidAction == "deletedToSuggested") {
      apiURL = "dbservice/update/move/deletedtoSuggested";
    }
    if (isValidAction == "deletedToValid") {
      apiURL = "dbservice/update/move/deletedtovalid";
    }
    try {
      var dataFormatSuggested = {
        userId: localUserId,
        patientId: localPatientId,
        diagnosisCode: selectInvalidDetails.diagnosisCode,
        actualDescription: selectInvalidDetails.actualDescription,
        dbDescription: selectInvalidDetails.dbDescription,
        notes: inputValue.notes,
        dos: selectedDosValue,
        encounterDate: selectInvalidDetails.encounterDate,
        capturedSections: selectInvalidDetails.capturedSections,
      };
      const response = await axios.put(
        ENDPOINTS.apiEndoint + url,
        dataFormatSuggested
      );
      var result = response.data;
      if (result.status == "SUCCESS") {
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
        getPatientDetailsReload(localPatientId, localOrgId, localTenantId);
      } else {
        notification.error({
          message: result.response,
          placement: "top",
          duration: 1,
        });
        setFileLoading(false);
      }
    } catch (err) {
      notification.error({
        message: err?.response?.data?.response,
      });
      setFileLoading(false);
    }
  }
  setValidated(true);
};

const findValueDocuments = async (
  headerNames,
  encounterDate,
  actualDescription,
  setFileLoading
) => {
  setFileLoading(true);
  var fileId = patientFileDTO.fileId;
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
    var result = response.data.response;
    if (response?.data?.status == "SUCCESS") {
      pageNumber = result?.second[0] ? result?.second[0] : null;
      if (result?.first == false) {
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
      // setFileInitialPage(pageNumber);
    } else {
      setSearch({
        value: splitPoint,
        page: "",
        headers:true,
      });
      // splitPoint = headerNames;
      // setFileInitialPage(null);
    }
    // setTargetPages(
    //   (targetPage) =>
    //     targetPage.pageIndex === pageNumber ||
    //     targetPage.pageIndex === pageNumber + 1 ||
    //     targetPage.pageIndex === pageNumber + 2
    // );
    // setFindFileKeyword(splitPoint);
    // if (findFileKeyword == splitPoint) {
    //   setFileLoading(false);
    // }
  } catch (error) {
    setSearch({
      value: headerNames,
      headers: true,
    });
    setFileLoading(false)
    // splitPoint = headerNames;
    // if (findFileKeyword == headerNames) {
    //   setFileLoading(false);
    // }
    // setFindFileKeyword(splitPoint);
    // setFileInitialPage(null);
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
}) => {
  setFileLoading(true);
 
  const encounterDatesValue = encounterDate.split(",");
  var splitPoint;
  var pageNumber = null;
  var data = {
    fileId: fileId?.result?.fileDetailDTO,
    header: headerNames,
    dos: encounterDatesValue,
    stringFileWord: actualDescription.substring(" ", 20),
    diagnosisCode: diagnosisCode,
  };
  var headerName = patientDocumentResult?
    patientDocumentResult.patientId +
    " / " +
    patientDocumentResult.patientName +
    " / " +
    diagnosisCode +
    " - (" +
    headerNames +
    ")":"";
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
     if(patientDocumentResult){
       setIsModalOpenValidCodes(true);
     }
      const response = await axios.post(
        ENDPOINTS.apiEndoint + `dbservice/pageNumber/latest`,
        data
      );
      var result = response.data.response;
      console.log(response)
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
      } else {
        setSearch({
          value: headerNames,
          page: "",
          headers: true,
        });
      }
    }
  } catch (error) {
    // splitPoint = headerNames;
    // if (findFileKeyword == headerNames) {
    setSearch({
      value: headerNames,
      page: "",
      headers: true,
    });
    setFileLoading(false);
    // }
  }
};