import React, { useEffect, useState } from "react";
import TableStyle from "../../table.module.css";
import { Empty, Progress, Steps, Tooltip } from "antd";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  completedReport,
  getPatientsList,
} from "../../../../store/actions/adminAction/fileProcessingActions";
import ENDPOINTS from "../../../../utility/enpoints";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import SpinnerDots from "../../../spinner";
import dayjs from "dayjs";
import { flightRouterStateSchema } from "next/dist/server/app-render/types";

export const eventStreming = (
  ENDPOINTS,
  setParsedData,
  pageNo,
  pageSize,
  getPatients,
  dispatch,
  computedStartDate,
  computedEndDate,
  selectedOption,
  search,
  completedStartDate,
  completedEndDate,
  selAllocatedTo,
  selAllocatedBy,
  selCreatedBy
) => {
  const id = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const sse = new EventSource(
    `${ENDPOINTS?.apiEndoint}communication/file-processing/stages/${id}?token=${token}`
  );

  const fileStatusEventListener = (event) => {
    const data = JSON.parse(event.data);
    if (data?.length != 0) {
      const item = data[0];
      if (item?.processStageChart === "FINISHED") {
        setParsedData(data);
        dispatch(
          getPatients(
            pageNo,
            computedStartDate,
            computedEndDate,
            selectedOption,
            search,
            completedStartDate,
            completedEndDate,
            selAllocatedTo,
            selAllocatedBy,
            selCreatedBy
          )
        );
        sse.close();
      }
    }
  };

  sse.addEventListener("file-status-event", fileStatusEventListener);

  sse.onerror = () => {
    sse.close();
  };

  return () => {
    sse.removeEventListener("file-status-event", fileStatusEventListener);
    sse.close();
  };
};

const stageChartMap2 = {
  FILE_UPLOAD: "File Upload",
  OCR: "OCR",
  SECTIONS_FILTER: "Sections Filter",
  DISEASE_FOUND: "Disease",
  VALID_DISEASE_SEPARATION: "Valid disease",
  COMBINATION_CODES_FOUND: "Combination codes",
  MEAT_FOUND: "Meat",
  RAF_SCORE_FOUND: "RAF Score",
  QUERY_CONDITIONS_FOUND: "Query Conditions",
  FINISHED: "Finished",
  DISEASE_FOUND_FAILED: "DISEASE_FOUND_FAILED",
  OCR_FAILED: "OCR_FAILED",
  SECTIONS_FILTER_FAILED: "SECTIONS_FILTER_FAILED",
  VALID_DISEASE_SEPARATION_FAILED: "VALID_DISEASE_SEPARATION_FAILED",
  COMBINATION_CODES_FOUND_FAILED: "COMBINATION_CODES_FOUND_FAILED",
  MEAT_FOUND_FAILED: "MEAT_FOUND_FAILED",
  RAF_SCORE_FOUND_FAILED: "RAF_SCORE_FOUND_FAILED",
  STORED_FAILED: "STORED_FAILED",
  QUERY_CONDITIONS_FOUND_FAILED: "QUERY_CONDITIONS_FOUND_FAILED",
};

const errStages = {
  DISEASE_FOUND_FAILED: "DISEASE_FOUND_FAILED",
  OCR_FAILED: "OCR_FAILED",
  SECTIONS_FILTER_FAILED: "SECTIONS_FILTER_FAILED",
  VALID_DISEASE_SEPARATION_FAILED: "VALID_DISEASE_SEPARATION_FAILED",
  COMBINATION_CODES_FOUND_FAILED: "COMBINATION_CODES_FOUND_FAILED",
  MEAT_FOUND_FAILED: "MEAT_FOUND_FAILED",
  RAF_SCORE_FOUND_FAILED: "RAF_SCORE_FOUND_FAILED",
  STORED_FAILED: "STORED_FAILED",
  QUERY_CONDITIONS_FOUND_FAILED: "QUERY_CONDITIONS_FOUND_FAILED",
};
const stageChartMap = {
  FILE_UPLOAD: 0,
  OCR: 1,
  OCR_FAILED: 1,
  SECTIONS_FILTER: 2,
  SECTIONS_FILTER_FAILED: 2,
  DISEASE_FOUND: 3,
  DISEASE_FOUND_FAILED: 3,
  VALID_DISEASE_SEPARATION: 4,
  VALID_DISEASE_SEPARATION_FAILED: 4,
  COMBINATION_CODES_FOUND: 5,
  COMBINATION_CODES_FOUND_FAILED: 5,
  MEAT_FOUND_FAILED: 6,
  MEAT_FOUND: 6,
  RAF_SCORE_FOUND: 7,
  RAF_SCORE_FOUND_FAILED: 7,
  STORED: 8,
  STORED_FAILED: 8,
  QUERY_CONDITIONS_FOUND: 8,
  QUERY_CONDITIONS_FOUND_FAILED: 8,
  FINISHED: 9,
};
function FileProcessingTable({ patinetListAll }) {
  const dispatch = useDispatch();
  const [stepperVisible, setStepperVisible] = useState(
    Array(patinetListAll?.length).fill(false)
  );
  const [count, setCount] = useState(0);
  const [parsedData, setParsedData] = useState([]);
  const [activeId, setActiveId] = useState();
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(patinetListAll);
  const [failedList, setFiledList] = useState();
  const [finished, setIsFInished] = useState(false);
  const selectedRowTime = useSelector(
    (state) => state?.adminPatient?.patientsList
  );

  const handleToggleStepper = (index, data) => {
    setIsFInished(true);
    setToggle((prevToggle) => ({
      ...Object.fromEntries(Object.keys(prevToggle).map((key) => [key, false])), // Close all other items
      [data?.patientId]: !prevToggle[data.patientId],
    }));
    setActiveId(data?.patientId);

    const updatedVisibility =
      stepperVisible?.length > 0 &&
      stepperVisible?.map((value, i) => (i === index ? !value : false));
    setStepperVisible(updatedVisibility);
    const failed = errStages[data?.processStageChart];
    setFiledList(failed);
  };

  useEffect(() => {
    const id = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    let isFinished = false; // State variable to track if FINISHED status received
    const sse = new EventSource(
      `${ENDPOINTS?.apiEndoint}communication/file-processing/stages/${id}?token=${token}`
    );

    const fileStatusEventListener = (event) => {
      setLoading(true);
      const data = JSON.parse(event.data);
      if (data) {
        setParsedData(data);
        setLoading(false);
      }
      const patient = data?.find((item) => item?.patientId === activeId);
      if (
        errStages[patient?.processStageChart] ||
        patient?.processStageChart === "FINISHED"
      ) {
        isFinished = true;
        setIsFInished(true);
        sse.close();
        setLoading(false);
      }
    };

    // if (!finished) {
    sse.addEventListener("file-status-event", fileStatusEventListener);
    // } else {
    //   sse.close();
    //   setLoading(false);
    // }

    sse.onerror = () => {
      if (!isFinished) {
        sse.close();
        setLoading(false);
      }
    };

    return () => {
      sse.removeEventListener("file-status-event", fileStatusEventListener);
      sse.close();
      setLoading(false);
    };
  }, [activeId]);

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
      case "OCR_FAILED":
        uploadStatus = 10;
        break;
      case "SECTIONS_FILTER":
      case "SECTIONS_FILTER_FAILED":
        uploadStatus = 20;
        break;
      case "DISEASE_FOUND":
      case "DISEASE_FOUND_FAILED":
        uploadStatus = 30;
        break;
      case "VALID_DISEASE_SEPARATION":
      case "VALID_DISEASE_SEPARATION_FAILED":
        uploadStatus = 40;
        break;

      case "COMBINATION_CODES_FOUND":
      case "COMBINATION_CODES_FOUND_FAILED":
        uploadStatus = 50;
        break;
      case "MEAT_FOUND":
      case "MEAT_FOUND_FAILED":
        uploadStatus = 60;
        break;
      case "RAF_SCORE_FOUND":
      case "RAF_SCORE_FOUND_FAILED":
        uploadStatus = 70;
        break;
      case "STORED":
      case "STORED_FAILED":
        uploadStatus = 80;
        break;
      case "QUERY_CONDITIONS_FOUND":
      case "QUERY_CONDITIONS_FOUND_FAILED":
        uploadStatus = 90;
        break;
      case "FINISHED":
        uploadStatus = 100;
        break;
      default:
        uploadStatus = 0;
        break;
    }

    const currentIndex = stageChartMap[data?.processStageChart];

    const stepsItemBase = [
      {
        title: "",
        description: "File Upload",
        status:
          stageChartMap[data?.processStageChart] <= stageChartMap[currentIndex]
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
            : undefined,
        info: "OCR",
      },
      {
        title: "",
        description: "Sections Filter",
        status:
          stageChartMap[data?.processStageChart] <= stageChartMap[currentIndex]
            ? "finish"
            : stageChartMap2[data?.processStageChart] ===
              "SECTIONS_FILTER_FAILED"
            ? "error"
            : undefined,
        info: "SECTIONS_FILTER",
      },
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

      const queryConditionsStep = {
        title: "",
        description: "Query Conditions",
        status:
          stageChartMap[data?.processStageChart] <= stageChartMap[currentIndex]
            ? "finish"
            : stageChartMap2[data?.processStageChart] ===
              "QUERY_CONDITIONS_FOUND_FAILED"
            ? "error"
            : undefined,
        info: "QUERY_CONDITIONS_FOUND",
      };

      if (foundIndex !== -1) {
        stepsItem.splice(foundIndex, 0, queryConditionsStep);
      } else {
        stepsItem.push(queryConditionsStep);
      }
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
        <div style={{ width: "98%" }}>
          <div style={{ display: "flex" }}>
            <Tooltip
              title={data?.processStageChart
                ?.toLowerCase()
                ?.split("_")
                .join(" ")}
            >
              <Progress
                percent={uploadStatus}
                status="active"
                style={{
                  height: "20px",
                }}
                strokeColor={
                  stageChartMap2[data?.processStageChart] === "Finished"
                    ? "green"
                    : errStages[data?.processStageChart]
                    ? "red"
                    : "#1677ff"
                }
              />
            </Tooltip>
          </div>

          {toggle[data?.patientId] && (
            <>
              <div
                className={TableStyle.fileprocessing}
                style={{ height: "30px" }}
              >
                {mappedSteps?.map((step, index) => {
                  const findData =
                    selectedRowTime?.data &&
                    selectedRowTime?.data?.find(
                      (item) => item?.processStageChart === step?.info
                    );

                  return (
                    <div key={index} className={TableStyle.innerProcessingDiv}>
                      {finished
                        ? "Loading..."
                        : selectedRowTime?.data?.length > 0 &&
                          (findData ? (
                            <span>
                              {findData?.createdDate &&
                                dayjs(findData?.createdDate).format(
                                  "hh:mm:ss A"
                                )}
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
              >
                <Steps
                  current={currentIndex + 1}
                  labelPlacement="vertical"
                  items={mappedSteps}
                  percent={failedList ? 0 : count}
                  finishIconBorderColor="#000"
                />
              </div>
            </>
          )}
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
          >{`${uploadStatus}% Complete`}</div>
        </div>
        <div style={{ width: "2%", marginTop: "6px" }}>
          <div onClick={() => handleToggleStepper(index, data)}>
            {toggle[data?.patientId] ? (
              <UpOutlined style={{ width: "40px", height: "20px" }} />
            ) : (
              <DownOutlined style={{ width: "40px", height: "20px" }} />
            )}
          </div>
        </div>
      </div>
    );
  };
  const renderRows = () => {
    return parsedData?.map((data, index) => (
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
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SpinnerDots />
        </div>
      ) : (
        <table className={TableStyle.classTable}>
          <thead className={TableStyle.classThead}>
            <tr>
              <th>PATIENT ID</th>
              <th>PATIENT NAME</th>
              <th>UPLOAD STATUS</th>
            </tr>
          </thead>

          <tbody>
            {parsedData?.length === 0 ? (
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
}

export default FileProcessingTable;
