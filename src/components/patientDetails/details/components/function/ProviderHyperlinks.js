import { CalendarOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, Tooltip } from "antd";
import moment from "moment";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { stringToColour, truncateString } from "./ReusableFunctions";
export const getProviderNameTag = (
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
  meatresult
) => {
  return providerNames.map((res, index) => {
    const headerResult = hyperlinks?.filter((res2) => res2.header === res);
    if (index < 2) {
      if (headerResult?.length == 1) {
        var sectionMapArr = (
          <span
            onClick={() =>
              findProviderNameDocument(
                headerResult[0],
                diagnosisCode,
                diseaseName,
                setSearch,
                setIsModalOpen,
                setFileModalHeader,
                patientDocumentResult,
                setSelectMeatResult,
                meatresult
              )
            }
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
        if (res != "") {
          return sectionMapArr;
        }
      } else {
        var sectionMapArr = (
          <Popover
            placement="bottom"
            content={
              <>
                {getProviderPopoverHyperlink(
                  headerResult,
                  diagnosisCode,
                  diseaseName,
                  setSearch,
                  setIsModalOpen,
                  setFileModalHeader,
                  patientDocumentResult,
                  setSelectMeatResult,
                  meatresult
                )}
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
        if (res != "") {
          return sectionMapArr;
        }
      }
    } else if (providerNames.length - 1 == index) {
      if (headerResult?.length == 1) {
        var sectionMapArr = (
          <>
            {providerNames?.map((item, i) =>
              i > 1 ? (
                <>
                  {isMulitpleHeader &&
                    diagnosisCode == isMulitpleHeaderCode && (
                      <span
                        onClick={() =>
                          findProviderNameDocument(
                            findSectionHyperlink(hyperlinks, item)[0],
                            diagnosisCode,
                            diseaseName,
                            setSearch,
                            setIsModalOpen,
                            setFileModalHeader,
                            patientDocumentResult,
                            setSelectMeatResult,
                            meatresult
                          )
                        }
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
                <>{providerNames.length - 2}+</>
              )}
            </span>
          </>
        );
        return sectionMapArr;
      } else {
        var sectionMapArr = (
          <>
            {providerNames?.map((item, i) =>
              i > 1 ? (
                <Popover
                  placement="bottom"
                  content={getProviderPopoverHyperlink(
                    findSectionHyperlink(hyperlinks, item),
                    diagnosisCode,
                    diseaseName,
                    setSearch,
                    setIsModalOpen,
                    setFileModalHeader,
                    patientDocumentResult,
                    setSelectMeatResult,
                    meatresult
                  )}
                >
                  {isMulitpleHeader &&
                    diagnosisCode == isMulitpleHeaderCode && (
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

export const getProviderPopoverHyperlink = (
  value,
  diagnosisCode,
  diseaseName,
  setSearch,
  setIsModalOpen,
  setFileModalHeader,
  patientDocumentResult,
  setSelectMeatResult,
  meatresult
) => {
  return value?.map((res) => {
    var sectionMapArr = res ? (
      <span
        onClick={() =>
          findProviderNameDocument(
            res,
            diagnosisCode,
            diseaseName,
            setSearch,
            setIsModalOpen,
            setFileModalHeader,
            patientDocumentResult,
            setSelectMeatResult,
            meatresult
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
const findProviderNameDocument = (
  data,
  diagnosisCode,
  diseaseName,
  setSearch,
  setIsModalOpen,
  setFileModalHeader,
  patientDocumentResult,
  setSelectMeatResult,
  meatresult
) => {
  console.log(data);
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
