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
import dayjs from "dayjs";

function FileProcessingTable({ patinetListAll }) {
  const [detailsContent, setDetailsContent] = useState(patinetListAll);
  const [stepperVisible, setStepperVisible] = useState(
    Array(patinetListAll?.length).fill(false)
  );
  const [parsedData, setParsedData] = useState([]);

  const dispatch = useDispatch();

  const selectedRowDetails = useSelector(
    (state) => state.adminPatient.selectedFile
  );
  const response = useSelector((state) => state.adminList.patients);

  const filterDetails = response?.content?.filter(
    (item) => item?.patientId === selectedRowDetails?.patientId
  );
  const selectedRowTime = useSelector(
    (state) => state.adminPatient.patientsList
  );

  const details = filterDetails?.map((item) => ({
    patientId: item?.patientId,
    processStageId: item?.processStageId,
  }));
  // console.log(details);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const sse = new EventSource(
      `${ENDPOINTS?.apiEndoint}communication/file-processing/stages/${id}?token=${token}`
    );
    sse.addEventListener("file-status-event", (event) => {
      const data = JSON.parse(event.data);
      setParsedData(data);
    });
    sse.onerror = () => {
      sse.close();
    };
    return () => {
      sse.close();
    };
  }, [ENDPOINTS]);

  useEffect(() => {
    parsedData?.filter((data, index) => {
      // if (data?.processStageChart === "FINISHED") {
      //   dispatch(completedReport(data));
        dispatch(getPatientsList(data?.patientId, data?.processStageId));
      
    });
  }, [parsedData]);

  const handleToggleStepper = (index, data) => {
    const updatedVisibility = stepperVisible?.map((value, i) =>
      i === index ? !value : false
    );
    setStepperVisible(updatedVisibility);
    // if (data?.processStageChart) {
    //   dispatch(getPatientsList(data?.patientId, data?.processStageId));
    // }
  };

  const stageChartMap2 = {
    FILE_UPLOAD: "File Upload",
    OCR: "OCR",
    OCR_FAILED: "OCR_Failed",
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
  };

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

    const currentIndex = stageChartMap[data?.processStageChart];
    return (
      <div style={{ display: "flex" }}>
        <div style={{ width: "98%" }}>
          <div style={{ display: "flex" }}>
            <Tooltip
              title={data?.processStageChart.toLowerCase()?.split("_").join(" ")}
            >
              <Progress
                percent={uploadStatus}
                status="active"
                style={{ height: "20px", color: "red" }}
              />
            </Tooltip>
          </div>
          <div
            style={{ display: "flex", justifyContent: "end" }}
          >{`${uploadStatus}% Complete`}</div>
          {stepperVisible[index] && (
            <>
              <div style={{ display: "flex", width: "100%" }}>
                {selectedRowTime?.map((item) => (
                  <div style={{ display: "flex", width: "10%" }}>
                    {dayjs(item?.lastModifiedDate).format("hh:mm:ss")}
                  </div>
                ))}
              </div>
              <div
                style={{
                  position: "relative",
                  marginTop: stepperVisible ? "10px" : "0",
                  marginLeft: "-40px",
                }}
              >
                {/* {stepperVisible[index] && ( */}
                <Steps
                  current={currentIndex}
                  labelPlacement="vertical"
                  items={[
                    {
                      title: "",
                      description: "File Upload",
                      status:
                        stageChartMap[data?.processStageChart] <=
                        stageChartMap[currentIndex]
                          ? "finish"
                          : undefined,
                    },
                    {
                      title: "",
                      description: "OCR",
                      status:
                        // stageChartMap2[data?.processStageChart] === "OCR_FAILED"
                        //   ? "error"
                        //   : stageChartMap2[data?.processStageChart] === "OCR"
                        //   ? "finish"
                        //   : undefined,
                        stageChartMap[data?.processStageChart] <=
                        stageChartMap[currentIndex]
                          ? "finish"
                          : stageChartMap2[data?.processStageChart] ===
                            "OCR_FAILED"
                          ? "error"
                          : undefined,
                    },
                    {
                      title: "",
                      description: "Sections Filter",
                      status:
                        // stageChartMap2[data?.processStageChart] ===
                        // "SECTIONS_FILTER_FAILED"
                        //   ? "error"
                        //   : stageChartMap2[data?.processStageChart] ===
                        //     "SECTIONS_FILTER"
                        //   ? "finish"
                        //   : undefined,
                        stageChartMap[data?.processStageChart] <=
                        stageChartMap[currentIndex]
                          ? "finish"
                          : stageChartMap2[data?.processStageChart] ===
                            "SECTIONS_FILTER_FAILED"
                          ? "error"
                          : undefined,
                    },
                    {
                      title: "",
                      description: "Disease",
                      status:
                        // stageChartMap2[data?.processStageChart] ===
                        // "DISEASE_FOUND_FAILED"
                        //   ? "error"
                        //   : stageChartMap2[data?.processStageChart] ===
                        //     "DISEASE_FOUND"
                        //   ? "finish"
                        //   : undefined,
                        stageChartMap[data?.processStageChart] <=
                        stageChartMap[currentIndex]
                          ? "finish"
                          : stageChartMap2[data?.processStageChart] ===
                            "DISEASE_FOUND_FAILED"
                          ? "error"
                          : undefined,
                    },
                    {
                      title: "",
                      description: "Valid disease",
                      status:
                        // stageChartMap2[data?.processStageChart] ===
                        // "VALID_DISEASE_SEPARATION_FAILED"
                        //   ? "error"
                        //   : stageChartMap2[data?.processStageChart] ===
                        //     "VALID_DISEASE_SEPARATION"
                        //   ? "finish"
                        //   : undefined,
                        stageChartMap[data?.processStageChart] <=
                        stageChartMap[currentIndex]
                          ? "finish"
                          : stageChartMap2[data?.processStageChart] ===
                            "VALID_DISEASE_SEPARATION_FAILED"
                          ? "error"
                          : undefined,
                    },
                    {
                      title: "",
                      description: "Combination codes",
                      status:
                        // stageChartMap2[data?.processStageChart] ===
                        // "COMBINATION_CODES_FOUND_FAILED"
                        //   ? "error"
                        //   : stageChartMap2[data?.processStageChart] ===
                        //     "COMBINATION_CODES_FOUND"
                        //   ? "finish"
                        //   : undefined,
                        stageChartMap[data?.processStageChart] <=
                        stageChartMap[currentIndex]
                          ? "finish"
                          : stageChartMap2[data?.processStageChart] ===
                            "COMBINATION_CODES_FOUND_FAILED"
                          ? "error"
                          : undefined,
                    },
                    {
                      title: "",
                      description: "Meat",
                      status:
                        // stageChartMap2[data?.processStageChart] ===
                        // "MEAT_FOUND_FAILED"
                        //   ? "error"
                        //   : stageChartMap2[data?.processStageChart] ===
                        //     "MEAT_FOUND"
                        //   ? "finish"
                        //   : undefined,
                        stageChartMap[data?.processStageChart] <=
                        stageChartMap[currentIndex]
                          ? "finish"
                          : stageChartMap2[data?.processStageChart] ===
                            "MEAT_FOUND_FAILED"
                          ? "error"
                          : undefined,
                    },
                    {
                      title: "",
                      description: "RAF Score",
                      status:
                        // stageChartMap2[data?.processStageChart] ===
                        // "RAF_SCORE_FOUND_FAILED"
                        //   ? "error"
                        //   : stageChartMap2[data?.processStageChart] ===
                        //     "RAF_SCORE_FOUND"
                        //   ? "finish"
                        //   : undefined,
                        stageChartMap[data?.processStageChart] <=
                        stageChartMap[currentIndex]
                          ? "finish"
                          : stageChartMap2[data?.processStageChart] ===
                            "RAF_SCORE_FOUND_FAILED"
                          ? "error"
                          : undefined,
                    },
                    {
                      title: "",
                      description: "Query Conditions",
                      status:
                        // stageChartMap2[data?.processStageChart] ===
                        // "QUERY_CONDITIONS_FOUND_FAILED"
                        //   ? "error"
                        //   : stageChartMap2[data?.processStageChart] ===
                        //     "QUERY_CONDITIONS_FOUND"
                        //   ? "finish"
                        //   : undefined,
                        stageChartMap[data?.processStageChart] <=
                        stageChartMap[currentIndex]
                          ? "finish"
                          : stageChartMap2[data?.processStageChart] ===
                            "QUERY_CONDITIONS_FOUND_FAILED"
                          ? "error"
                          : undefined,
                    },
                    {
                      title: "",
                      description: "Finished",
                      status:
                        // stageChartMap2[data?.processStageChart] ===
                        // "STORED_FAILED"
                        //   ? "error"
                        //   : stageChartMap2[data?.processStageChart] === "STORED"
                        //   ? "finish"
                        //   : stageChartMap[data?.processStageChart] === "FINISHED"
                        //   ? "finish"
                        //   : undefined,
                        stageChartMap[data?.processStageChart] <=
                        stageChartMap[currentIndex]
                          ? "finish"
                          : stageChartMap2[data?.processStageChart] ===
                            "STORED_FAILED"
                          ? "error"
                          : undefined,
                    },
                  ]}
                />

                {/* )} */}
              </div>
            </>
          )}
        </div>
        <div style={{ width: "2%", marginTop: "6px" }}>
          <div onClick={() => handleToggleStepper(index, data)}>
            {stepperVisible[index] ? (
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
        <td className={TableStyle.firstTdBorder}>{data.patientId}</td>
        <td className={TableStyle.childBorder}>
          {data.patientName ? data.patientName : "---"}
        </td>
        <td className={TableStyle.lastBorder} style={{ width: "75%" }}>
          {renderUploadStatus(data, index)}
        </td>
      </tr>
    ));
  };

  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>PATIENT ID</th>
            <th>PATIENT NAME</th>
            <th>UPLOAD STATUS</th>
          </tr>
        </thead>

        <tbody>
          {detailsContent?.length <= 0 ? (
            <tr>
              <td colSpan="3">
                <Empty />
              </td>
            </tr>
          ) : (
            renderRows()
          )}
        </tbody>
      </table>
      <div></div>
    </div>
  );
}

export default FileProcessingTable;
