import { CalendarOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, Tooltip } from "antd";
import moment from "moment";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { stringToColour, truncateString } from "./ReusableFunctions";
export const getProviderNameTag = ({
  providerNames,
  hyperlinks,
  setSearch,
  diagnosisCode,
  diseaseName,
  setIsModalOpen,
  setFileModalHeader,
  patientDocumentResult,
  setIsMulitpleHeader,
  isMulitpleHeader,
  setIsMulitpleHeadeCode,
  isMulitpleHeaderCode,
  setSelectMeatResult,
  meatresult,
  getSelectedDosPageNumber,
  getRadiologyPDF,
  getLabPDF,
  getCurrentDiseaseType,
  setLabData
}) => {
  
  return providerNames?.map((res, index) => {
    const normalizedRes = res.toLowerCase().trim();
    const headerResult = hyperlinks?.filter(
      (res2) => res2?.header?.toLowerCase()?.trim() === normalizedRes
    );
  
    if (index < 2) {
      if (headerResult?.length === 1) {
        const sectionMapArr = (
          <span
            onClick={() => {
              const patientId = localStorage.getItem("patientId");
              const selectedMeatData = hyperlinks?.find(
                (item) => item?.header?.toLowerCase() === normalizedRes
              );
              if (selectedMeatData?.stateIndicator) {
                getCurrentDiseaseType && getCurrentDiseaseType(false);
                setLabData && setLabData(selectedMeatData?.fileId);
                selectedMeatData?.stateIndicator === "LAB"
                  ? getLabPDF &&
                    getLabPDF({
                      fileId: selectedMeatData?.fileId,
                    })
                  : getRadiologyPDF(
                      patientId,
                      "",
                      selectedMeatData?.dateOfService,
                      "",
                      selectedMeatData?.diagnosticTestName
                    );
              } else {
                getCurrentDiseaseType && getCurrentDiseaseType(true);
              }
              findProviderNameDocument({
                data: headerResult[0],
                diagnosisCode: diagnosisCode,
                diseaseName: diseaseName,
                setSearch: setSearch,
                setIsModalOpen: setIsModalOpen,
                setFileModalHeader: setFileModalHeader,
                patientDocumentResult: patientDocumentResult,
                setSelectMeatResult: setSelectMeatResult,
                meatresult: meatresult,
                getSelectedDosPageNumber: getSelectedDosPageNumber,
                setLabData: setLabData
              });
            }}
            className={`mt-2 text-start ${visitStyles.provider_name} truncate-text`}
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
            <Tooltip title={res}> {truncateString(res, 30)}</Tooltip>
          </span>
        );
        if (res !== "") {
          return sectionMapArr;
        }
      } else {
        const sectionMapArr = (
          <Popover
            placement="bottom"
            overlayStyle={{zIndex:1000}}
            content={
              <>
                {getProviderPopoverHyperlink({
                  value: headerResult,
                  diagnosisCode: diagnosisCode,
                  diseaseName: diseaseName,
                  setSearch: setSearch,
                  setIsModalOpen: setIsModalOpen,
                  setFileModalHeader: setFileModalHeader,
                  patientDocumentResult: patientDocumentResult,
                  setSelectMeatResult: setSelectMeatResult,
                  meatresult: meatresult,
                  getSelectedDosPageNumber: getSelectedDosPageNumber,
                  getRadiologyPDF,
                  getLabPDF,
                  getCurrentDiseaseType,
                  setLabData
                })}
              </>
            }
          >
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
          </Popover>
        );
        if (res !== "") {
          return sectionMapArr;
        }
      }
    } else if (providerNames.length - 1 === index) {
      if (headerResult?.length === 1) {
        const sectionMapArr = (
          <>
            {providerNames?.map((item, i) =>
              i > 1 ? (
                <>
                  {isMulitpleHeader &&
                    diagnosisCode === isMulitpleHeaderCode && (
                      <span
                        onClick={() => {
                          const patientId = localStorage.getItem("patientId");
                          const selectedMeatData = hyperlinks?.find(
                            (item) => item?.header === res
                          );
  
                          if (selectedMeatData?.stateIndicator) {
                            selectedMeatData?.stateIndicator === "LAB"
                              ? getLabPDF(
                                  patientId,
                                  "",
                                  selectedMeatData?.dateOfService,
                                  "",
                                  selectedMeatData?.diagnosticTestName
                                )
                              : getRadiologyPDF(
                                  patientId,
                                  "",
                                  selectedMeatData?.dateOfService,
                                  "",
                                  selectedMeatData?.diagnosticTestName
                                );
                          } else {
                            getCurrentDiseaseType(false);
                          }
                          findProviderNameDocument({
                            data: findSectionHyperlink(hyperlinks, item.toLowerCase())[0],
                            diagnosisCode: diagnosisCode,
                            diseaseName: diseaseName,
                            setSearch: setSearch,
                            setIsModalOpen: setIsModalOpen,
                            setFileModalHeader: setFileModalHeader,
                            patientDocumentResult: patientDocumentResult,
                            setSelectMeatResult: setSelectMeatResult,
                            meatresult: meatresult,
                            getSelectedDosPageNumber: getSelectedDosPageNumber,
                          });
                        }}
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
                        {res}
                      </span>
                    )}
                </>
              ) : null
            )}
  
            <span
              style={{
                backgroundColor:
                  isMulitpleHeader && diagnosisCode === isMulitpleHeaderCode
                    ? "#f35f5f"
                    : "#b3b3ec",
                color: "#fff",
              }}
              className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
              onClick={() => {
                setIsMulitpleHeader(
                  isMulitpleHeader && diagnosisCode === isMulitpleHeaderCode
                    ? false
                    : true
                );
                setIsMulitpleHeadeCode(diagnosisCode);
              }}
            >
              {isMulitpleHeader && diagnosisCode === isMulitpleHeaderCode ? (
                "X"
              ) : (
                <>{providerNames.length - 2}+</>
              )}
            </span>
          </>
        );
        return sectionMapArr;
      } else {
        const sectionMapArr = (
          <>
            {providerNames?.map((item, i) =>
              i > 1 ? (
                <Popover
                  placement="bottom"
                  content={getProviderPopoverHyperlink({
                    value: findSectionHyperlink(hyperlinks, item),
                    diagnosisCode: diagnosisCode,
                    diseaseName: diseaseName,
                    setSearch: setSearch,
                    setIsModalOpen: setIsModalOpen,
                    setFileModalHeader: setFileModalHeader,
                    patientDocumentResult: patientDocumentResult,
                    setSelectMeatResult: setSelectMeatResult,
                    meatresult: meatresult,
                    getSelectedDosPageNumber: getSelectedDosPageNumber,
                    getRadiologyPDF,
                    getLabPDF,
                  })}
                >
                  {isMulitpleHeader &&
                    diagnosisCode === isMulitpleHeaderCode && (
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
                    )}
                </Popover>
              ) : null
            )}
  
            <span
              style={{
                backgroundColor:
                  isMulitpleHeader && diagnosisCode === isMulitpleHeaderCode
                    ? "#f35f5f"
                    : "#b3b3ec",
                color: "#fff",
              }}
              className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
              onClick={() => {
                setIsMulitpleHeader(
                  isMulitpleHeader && diagnosisCode === isMulitpleHeaderCode
                    ? false
                    : true
                );
                setIsMulitpleHeadeCode(diagnosisCode);
              }}
            >
              {isMulitpleHeader && diagnosisCode === isMulitpleHeaderCode ? (
                "X"
              ) : (
                <>{providerNames.length - 2}+</>
              )}
            </span>
          </>
        );
        return sectionMapArr;
      }
    }
  });
  
};

export const getProviderPopoverHyperlink = ({
  value,
  diagnosisCode,
  diseaseName,
  setSearch,
  setIsModalOpen,
  setFileModalHeader,
  patientDocumentResult,
  setSelectMeatResult,
  meatresult,
  getSelectedDosPageNumber,
  getRadiologyPDF,
  getLabPDF,
  getCurrentDiseaseType,
  setLabData
}) => {
  return value?.map((res) => {
    var sectionMapArr = res ? (
      <span
        onClick={() => {
          const patientId = localStorage.getItem("patientId");
          const selectedMeatData = value?.find(
            (item) => item?.dateOfService === res.dateOfService
          );
          if (selectedMeatData?.stateIndicator) {
            getCurrentDiseaseType(false);
            setLabData &&  setLabData(selectedMeatData?.fileId)
            selectedMeatData?.stateIndicator === "LAB"
              ? getLabPDF &&
              getLabPDF({
                fileId: selectedMeatData?.fileId,
              })
              : getRadiologyPDF(
                  patientId,
                  "",
                  selectedMeatData?.dateOfService,
                  "",
                  selectedMeatData?.diagnosticTestName
                );
          } else {
            getCurrentDiseaseType && getCurrentDiseaseType(true);
          }
          findProviderNameDocument({
            data: res,
            diagnosisCode: diagnosisCode,
            diseaseName: diseaseName,
            setSearch: setSearch,
            setIsModalOpen: setIsModalOpen,
            setFileModalHeader: setFileModalHeader,
            patientDocumentResult: patientDocumentResult,
            setSelectMeatResult: setSelectMeatResult,
            meatresult: meatresult,
            getSelectedDosPageNumber: getSelectedDosPageNumber,
          });
        }}
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
const findProviderNameDocument = ({
  data,
  diagnosisCode,
  diseaseName,
  setSearch,
  setIsModalOpen,
  setFileModalHeader,
  patientDocumentResult,
  setSelectMeatResult,
  meatresult,
  getSelectedDosPageNumber,
  setLabData
}) => {
  setSelectMeatResult && setSelectMeatResult(meatresult);
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
  var splitSpace = data?.substring
    ?.replace(/\s{2,}/g, " ")
    .replace(/['"]+/g, "");
  setSearch({
    value: splitSpace,
    page: data?.pageNumber,
    headers: true,
    headerContent: data?.header,
  });
  getSelectedDosPageNumber(null);
  if (patientDocumentResult && setIsModalOpen) {
    setIsModalOpen(true);
  }
};

const findSectionHyperlink = (hyperlinks, header) => {
  const headerResult = hyperlinks?.filter((res2) => res2.header === header);
  return headerResult;
};

export const getProviderNameTagList = ({ data }) => {
  return data.map((res, index) => {
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
          trigger={["hover"]}
          placement="bottom"
          overlayStyle={{ zIndex: 9999 }}
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

const ProviderHyperlinks = () => {
  return <></>;
};

export default ProviderHyperlinks;
