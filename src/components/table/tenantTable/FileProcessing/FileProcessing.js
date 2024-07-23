import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import dayjs from "dayjs";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Empty, Progress, Steps, Tooltip } from "antd";
import TableStyle from "../../table.module.css";
import { getPatientsList } from "../../../../store/actions/adminAction/fileProcessingActions";
import ENDPOINTS from "../../../../utility/enpoints";
import SpinnerDots from "../../../spinner";
import { actions as tenantAdminAction } from "../../../../stores/tenantAdmin/tracking";
import { fileProcessingSkeleton } from "../../admin/FileProcessing/FileProcessing";

// export const eventStreming = (
//   ENDPOINTS,
//   setParsedData,
//   pageNo,
//   getPatients,
//   dispatch,
//   computedStartDate,
//   computedEndDate,
//   selectedOption,
//   search,
//   completedStartDate,
//   completedEndDate,
//   selAllocatedTo,
//   selAllocatedBy,
//   selCreatedBy
// ) => {
//   const id = localStorage.getItem("userId");
//   const token = localStorage.getItem("token");
//   const orgId = localStorage.getItem("orgId");
//   const sse = new EventSource(
//     `${ENDPOINTS?.apiEndoint}communication/file-processing/stages/${id}?token=${token}&organizationId=`
//   );

//   const fileStatusEventListener = (event) => {
//     const data = JSON.parse(event.data);
//     if (data?.length != 0) {
//       const item = data[0];
//       if (item?.processStageChart === "FINISHED") {
//         setParsedData(data);
//         dispatch(
//           getPatients(
//             pageNo,
//             computedStartDate,
//             computedEndDate,
//             selectedOption,
//             search,
//             completedStartDate,
//             completedEndDate,
//             selAllocatedTo,
//             selAllocatedBy,
//             selCreatedBy
//           )
//         );
//         sse.close();
//       }
//     }
//   };

//   sse.addEventListener("file-status-event", fileStatusEventListener);

//   sse.onerror = () => {
//     sse.close();
//   };

//   return () => {
//     sse.removeEventListener("file-status-event", fileStatusEventListener);
//     sse.close();
//   };
// };

const stageChartMap2 = {
  FILE_UPLOAD: "File Upload",
  OCR: "OCR",
  SECTIONS_FILTER: "Sections Filter",
  DISEASE_FOUND: "Disease",
  HEALTH_METRICS_CALCULATED: "Health Metrics Found",
  VALID_DISEASE_SEPARATION: "Valid disease",
  MEAT_FOUND: "Meat",
  COMBINATION_CODES_FOUND: "Combination codes",
  RAF_SCORE_FOUND: "RAF Score",
  // QUERY_CONDITIONS_FOUND: "Query Conditions",
  FINISHED: "Finished",
  DISEASE_FOUND_FAILED: "DISEASE_FOUND_FAILED",
  OCR_FAILED: "OCR_FAILED",
  SECTIONS_FILTER_FAILED: "SECTIONS_FILTER_FAILED",
  VALID_DISEASE_SEPARATION_FAILED: "VALID_DISEASE_SEPARATION_FAILED",
  COMBINATION_CODES_FOUND_FAILED: "COMBINATION_CODES_FOUND_FAILED",
  MEAT_FOUND_FAILED: "MEAT_FOUND_FAILED",
  RAF_SCORE_FOUND_FAILED: "RAF_SCORE_FOUND_FAILED",
  // STORED_FAILED: "STORED_FAILED",
  // QUERY_CONDITIONS_FOUND_FAILED: "QUERY_CONDITIONS_FOUND_FAILED",
  HEALTH_METRICS_CALCULATION_FAILED: "HEALTH_METRICS_CALCULATION_FAILED",
};

const errStages = {
  DISEASE_FOUND_FAILED: "DISEASE_FOUND_FAILED",
  OCR_FAILED: "OCR_FAILED",
  // SECTIONS_FILTER_FAILED: "SECTIONS_FILTER_FAILED",
  VALID_DISEASE_SEPARATION_FAILED: "VALID_DISEASE_SEPARATION_FAILED",
  COMBINATION_CODES_FOUND_FAILED: "COMBINATION_CODES_FOUND_FAILED",
  MEAT_FOUND_FAILED: "MEAT_FOUND_FAILED",
  RAF_SCORE_FOUND_FAILED: "RAF_SCORE_FOUND_FAILED",
  // STORED_FAILED: "STORED_FAILED",
  // QUERY_CONDITIONS_FOUND_FAILED: "QUERY_CONDITIONS_FOUND_FAILED",
  HEALTH_METRICS_CALCULATION_FAILED: "HEALTH_METRICS_CALCULATION_FAILED",
};
const stageChartMap = {
  FILE_UPLOAD: 0,
  OCR: 1,
  OCR_FAILED: 1,
  // SECTIONS_FILTER: 1.5,
  // SECTIONS_FILTER_FAILED: 1.5,
  DISEASE_FOUND: 2,
  DISEASE_FOUND_FAILED: 2,
  HEALTH_METRICS_CALCULATED: 3,
  HEALTH_METRICS_CALCULATION_FAILED: 3,
  VALID_DISEASE_SEPARATION: 4,
  VALID_DISEASE_SEPARATION_FAILED: 4,
  MEAT_FOUND_FAILED: 5,
  MEAT_FOUND: 5,
  COMBINATION_CODES_FOUND: 6,
  COMBINATION_CODES_FOUND_FAILED: 6,
  RAF_SCORE_FOUND: 7,
  RAF_SCORE_FOUND_FAILED: 7,
  // STORED: 8,
  // STORED_FAILED: 8,
  // QUERY_CONDITIONS_FOUND: 8,
  // QUERY_CONDITIONS_FOUND_FAILED: 8,
  FINISHED: 8,
};
const FileProcessingTable = ({
  patinetListAll,
  loading,
  getAllProcessingData,
  fileProcessingData,
  webSocketData,
}) => {
  let stompClient = null;
  const dispatch = useDispatch();
  const [stepperVisible, setStepperVisible] = useState(
    Array(patinetListAll?.length).fill(false)
  );
  const [count, setCount] = useState(0);
  const [parsedData, setParsedData] = useState([]);
  const [activeId, setActiveId] = useState();
  const [fileloading, setFileLoading] = useState(true);
  const [toggle, setToggle] = useState(patinetListAll);
  const [failedList, setFiledList] = useState();
  const [finished, setIsFInished] = useState(false);
  const selectedRowTime = useSelector(
    (state) => state?.adminPatient?.patientsList
  );

  const handleToggleStepper = (index, data) => {
    setIsFInished(true);
    setToggle((prevToggle) => ({
      ...Object.fromEntries(Object.keys(prevToggle).map((key) => [key, false])),
      [data?.patientId]: !prevToggle[data.patientId],
    }));
    setActiveId(data?.patientId);

    const updatedVisibility =
      stepperVisible?.length > 0 &&
      stepperVisible?.map((value, i) => (i === index ? !value : false));
    setStepperVisible(updatedVisibility);
    const failed = errStages[data?.processStageChart];
    if (failed) {
      setFiledList(failed);
    } else {
      setFiledList();
    }
  };

  useEffect(() => {
    getAllProcessingData();
  }, []);
  useEffect(() => {
    if (fileProcessingData?.loading) {
      setFileLoading(false);
    }
  }, [fileProcessingData]);

  useEffect(() => {
    if (webSocketData && webSocketData?.webSocketType == "PROCESS_STAGE") {
      const fileData = fileProcessingData?.data?.response;
      var foundItem = fileData?.find(
        (x) => x.patientId == webSocketData.patientId
      );
      if (foundItem) {
        foundItem.processStageChart = webSocketData?.processStageChart;
        if (webSocketData?.createdDate) {
          var datePush = [
            ...foundItem.processStageEventDTOs,
            ...[webSocketData],
          ];
          foundItem.processStageEventDTOs = datePush;
        }
      }
    }
  }, [webSocketData]);

  useEffect(() => {
    if (activeId && parsedData) {
      setIsFInished(false);
      parsedData?.map((info) => {
        if (
          info?.patientId === activeId &&
          info?.processStageId !== "FINISHED"
        ) {
          dispatch(getPatientsList(info?.patientId, info?.processStageId));
        }
      });
    }
    if (parsedData) {
      const interval = setInterval(() => {
        setCount((prevCount) => (prevCount + 5) % 100);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [parsedData, activeId, finished]);

  const renderUploadStatus = (data, index) => {
    let uploadStatus = 0;
    switch (data?.processStageChart) {
      case "FILE_UPLOAD":
        uploadStatus = 5;
        break;
      case "OCR":
        uploadStatus = 20;
        break;
      case "OCR_FAILED":
        uploadStatus = 10;
        break;
      // case "SECTIONS_FILTER":
      //   uploadStatus = 30;
      //   break;
      // case "SECTIONS_FILTER_FAILED":
      //   uploadStatus = 20;
      //   break;
      case "DISEASE_FOUND":
        uploadStatus = 30;
        break;
      case "DISEASE_FOUND_FAILED":
        uploadStatus = 20;
        break;
      case "HEALTH_METRICS_CALCULATED":
        uploadStatus = 40;
        break;
      case "HEALTH_METRICS_CALCULATION_FAILED":
        uploadStatus = 30;
        break;
      case "VALID_DISEASE_SEPARATION":
        uploadStatus = 50;
        break;
      case "VALID_DISEASE_SEPARATION_FAILED":
        uploadStatus = 40;
        break;
      case "MEAT_FOUND":
        uploadStatus = 60;
        break;
      case "MEAT_FOUND_FAILED":
        uploadStatus = 50;
        break;
      case "COMBINATION_CODES_FOUND":
        uploadStatus = 70;
        break;
      case "COMBINATION_CODES_FOUND_FAILED":
        uploadStatus = 60;
        break;

      case "RAF_SCORE_FOUND":
        uploadStatus = 80;
        break;
      case "RAF_SCORE_FOUND_FAILED":
        uploadStatus = 70;
        break;
      // case "STORED":
      //   uploadStatus = 85;
      //   break;
      // case "STORED_FAILED":
      //   uploadStatus = 80;
      //   break;
      // case "QUERY_CONDITIONS_FOUND":
      //   uploadStatus = 95;
      //   break;
      // case "QUERY_CONDITIONS_FOUND_FAILED":
      //   uploadStatus = 90;
      //   break;
      case "FINISHED":
        uploadStatus = 100;
        break;
      default:
        uploadStatus = 0;
        break;
    }

    const currentIndex = stageChartMap[data?.processStageChart];
    const findPreviousStep = (currentStage) => {
      const stages = Object.keys(stageChartMap2);
      const currentIndex = stages.indexOf(currentStage);

      if (currentIndex == 0) {
        return stages[currentIndex + 1];
      }

      if (currentIndex > 0) {
        return stages[currentIndex - 1];
      }
      return null; // or some other value indicating there's no previous step
    };
    const stepsItemBase = [
      {
        title: "",
        description: "File Upload",
        status:
          stageChartMap[data?.processStageChart] <= currentIndex
            ? "finish"
            : undefined,
        info: "FILE_UPLOAD",
      },
      {
        title: "",
        description: "OCR",
        status:
          stageChartMap[data?.processStageChart] <= stageChartMap[currentIndex]
            ? "finish"
            : stageChartMap2[data?.processStageChart] === "OCR_FAILED"
            ? "error"
            : stageChartMap[data?.processStageChart] === undefined
            ? "process"
            : undefined,
        info: "OCR",
      },
      // {
      //   title: "",
      //   description: "Sections Filter",
      //   status:
      //     stageChartMap[data?.processStageChart] <= stageChartMap[currentIndex]
      //       ? "finish"
      //       : stageChartMap2[data?.processStageChart] ===
      //         "SECTIONS_FILTER_FAILED"
      //       ? "error"
      //       : undefined,
      //   info: "SECTIONS_FILTER",
      // },
      {
        title: "",
        description: "Disease",
        status:
          stageChartMap[data?.processStageChart] <= stageChartMap[currentIndex]
            ? "finish"
            : stageChartMap2[data?.processStageChart] === "DISEASE_FOUND_FAILED"
            ? "error"
            : undefined,
        info: "DISEASE_FOUND",
      },
      {
        title: "",
        description: "Health Metrics Found",
        status:
          stageChartMap[data?.processStageChart] <= stageChartMap[currentIndex]
            ? "finish"
            : stageChartMap2[data?.processStageChart] ===
              "HEALTH_METRICS_CALCULATION_FAILED"
            ? "error"
            : undefined,
        info: "HEALTH_METRICS_CALCULATED",
      },
      {
        title: "",
        description: "Valid disease",
        status:
          stageChartMap[data?.processStageChart] <= stageChartMap[currentIndex]
            ? "finish"
            : stageChartMap2[data?.processStageChart] ===
              "VALID_DISEASE_SEPARATION_FAILED"
            ? "error"
            : undefined,
        info: "VALID_DISEASE_SEPARATION",
      },
      {
        title: "",
        description: "Meat",
        status:
          stageChartMap[data?.processStageChart] <= stageChartMap[currentIndex]
            ? "finish"
            : stageChartMap2[data?.processStageChart] === "MEAT_FOUND_FAILED"
            ? "error"
            : undefined,
        info: "MEAT_FOUND",
      },
      {
        title: "",
        description: "Combination codes",
        status:
          stageChartMap[data?.processStageChart] <= stageChartMap[currentIndex]
            ? "finish"
            : stageChartMap2[data?.processStageChart] ===
              "COMBINATION_CODES_FOUND_FAILED"
            ? "error"
            : undefined,
        info: "COMBINATION_CODES_FOUND",
      },
      {
        title: "",
        description: "RAF Score",
        status:
          stageChartMap[data?.processStageChart] <= stageChartMap[currentIndex]
            ? "finish"
            : stageChartMap2[data?.processStageChart] ===
              "RAF_SCORE_FOUND_FAILED"
            ? "error"
            : undefined,
        info: "RAF_SCORE_FOUND",
      },

      {
        title: "",
        description: "Finished",
        status:
          data?.processStageChart === "FINISHED"
            ? "finish"
            : stageChartMap2[data?.processStageChart] === "STORED_FAILED" &&
              "error",
        info: "FINISHED",
        style: {
          backgroundColor:
            data?.processStageChart === "FINISHED" ? "green" : "inherit",
        },
      },
    ].map((step, index) => ({
      ...step,
      status: step.status,

      style: {
        color: step.status === "finish" ? "green" : "inherit",
      },
    }));

    let stepsItem = stepsItemBase;

    if (data?.processStageRadiology !== null) {
      const foundIndex = stepsItemBase?.findIndex(
        (step) => step?.info === "FINISHED"
      );

      // const queryConditionsStep = {
      //   title: "",
      //   description: "Query Conditions",
      //   status: stageChartMap[data?.processStageChart]
      //     ? "finish"
      //     : stageChartMap2[data?.processStageChart] ===
      //       "QUERY_CONDITIONS_FOUND_FAILED"
      //     ? "error"
      //     : stageChartMap2[data?.processStageChart] === undefined
      //     ? "processing"
      //     : undefined,
      //   info: "QUERY_CONDITIONS_FOUND",
      // };

      // if (foundIndex !== -1) {
      //   stepsItem.splice(foundIndex, 0, queryConditionsStep);
      // } else {
      //   stepsItem.push(queryConditionsStep);
      // }
    }

    const mappedSteps = stepsItem
      ? stepsItem?.map((step, index) => ({
          ...step,
          status: step.status,
          style: {
            color: step.info === "FINISHED" ? "green" : "inherit",
          },
        }))
      : stepsItemBase.map((step, index) => ({
          ...step,
          status: step.status,
          style: {
            color: step.info === "FINISHED" ? "green" : "inherit",
          },
        }));

    return (
      <div style={{ display: "flex" }}>
        <div style={{ width: "100%" }}>
          <div style={{ display: "flex" }}>
            <Tooltip
              title={data?.processStageChart
                ?.toLowerCase()
                ?.split("_")
                .join(" ")}
            >
              <Progress
                percent={
                  currentIndex
                    ? uploadStatus
                    : `${
                        stageChartMap[findPreviousStep(data?.processStageChart)]
                      }0`
                }
                status="active"
                style={{
                  height: "20px",
                }}
                className="antTextHide"
                strokeColor={
                  stageChartMap2[data?.processStageChart] === "Finished"
                    ? "green"
                    : errStages[data?.processStageChart]
                    ? "red"
                    : stageChartMap2[data?.processStageChart] === undefined
                    ? "#04306f"
                    : "#04306f"
                }
              />
            </Tooltip>
          </div>

          <>
            <div
              className={TableStyle.fileprocessing}
              style={{ height: "30px" }}
            >
              {mappedSteps?.map((step, index) => {
                const findData =
                  data?.processStageEventDTOs &&
                  data?.processStageEventDTOs?.find(
                    (item) => item?.processStageChart === step?.info
                  );

                return (
                  <div key={index} className={TableStyle.innerProcessingDiv}>
                    {finished
                      ? "Loading..."
                      : data?.processStageEventDTOs?.length > 0 &&
                        (findData ? (
                          <span>
                            {findData?.createdDate &&
                              dayjs(findData?.createdDate).format("hh:mm:ss A")}
                          </span>
                        ) : (
                          "---"
                        ))}
                  </div>
                );
              })}
            </div>

            <div
              style={{
                position: "relative",
                marginTop: stepperVisible ? "10px" : "0",
                marginLeft: "-40px",
              }}
              className={errStages[data?.processStageChart] ? "errStages" : ""}
            >
              <Steps
                current={
                  currentIndex
                    ? currentIndex + 1
                    : stageChartMap[findPreviousStep(data?.processStageChart)]
                }
                labelPlacement="vertical"
                items={mappedSteps}
                percent={
                  failedList || errStages[data?.processStageChart] ? 0 : count
                }
                finishIconBorderColor="#000"
              />
            </div>
          </>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              color: errStages[data?.processStageChart]
                ? "red"
                : stageChartMap2[data?.processStageChart] === "Finished"
                ? "green"
                : "#00000",
            }}
          >{`${
            currentIndex
              ? uploadStatus
              : `${stageChartMap[findPreviousStep(data?.processStageChart)]}0`
          }% Complete`}</div>
        </div>
      </div>
    );
  };
  const renderRows = () => {
    return fileProcessingData?.data?.response?.map((data, index) => (
      <tr key={index}>
        <td className={TableStyle.firstTdBorder}>{data?.patientId}</td>
        <td className={TableStyle.childBorder}>
          {data?.patientName ? data?.patientName : "---"}
        </td>
        <td className={TableStyle.lastBorder} style={{ width: "75%" }}>
          {renderUploadStatus(data, index)}
        </td>
      </tr>
    ));
  };

  return (
    <div className={TableStyle.classContaineer}>
      {fileProcessingData?.loading ? (
        <div>{fileProcessingSkeleton()}</div>
      ) : (
        <table className={TableStyle.classTable}>
          <thead className={TableStyle.classThead}>
            <tr>
              <th>PATIENT ID</th>
              <th>PATIENT NAME</th>
              <th style={{ paddingLeft: "27%" }}>UPLOAD STATUS</th>
            </tr>
          </thead>

          <tbody>
            {fileProcessingData?.data?.response?.length === 0 ? (
              <tr>
                <td colSpan="9">
                  <Empty />
                </td>
              </tr>
            ) : (
              renderRows()
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    fileProcessingData: state?.tenantAdmin?.tracking?.allFileProcessing,
    webSocketData: state?.tenantAdmin?.webSocket?.webSocketDetails?.data,
  }),
  {
    getAllProcessingData: tenantAdminAction.getAllFileProcessAction,
  }
);
export default enhancer(FileProcessingTable);
