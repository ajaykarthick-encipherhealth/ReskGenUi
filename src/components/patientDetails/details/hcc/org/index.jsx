import React, { useEffect, useState } from "react";
import { OrganizationChart } from "primereact/organizationchart";
import Style from "./style.module.css";
import { Popconfirm, Popover, Tag, Tooltip } from "antd";
import Tree from "./data.json";
import Header from "../../../../../jsx/layouts/nav/Header";
import { Card } from "react-bootstrap";
// import visitStyles from "../../../styles/visitdata.module.css";
import ENDPOINTS from "../../../../../utility/enpoints";
import axios from "../../../../../utility/axiosConfig";
import { CalendarOutlined } from "@ant-design/icons";
import moment from "moment";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faArrowsAlt } from "@fortawesome/free-solid-svg-icons";
import SpinnerDots from "../../../../../components/spinner";
import ModelIndex from "../../components/model/Index";
import { moveToAnotherAction } from "../../components/function/ReusableFunctions";
import { connect } from "react-redux";

const addOnCodeColor = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];

const CamboTree = ({ tree, setOpens, setCombiTree, patientDetailsResult }) => {
  const [background, setBackground] = useState([]);
  const [trees, setTrees] = useState(Tree);
  const [isLoading, setLoading] = useState(tree);
  const [zoom, setZoom] = useState({ width: 350, height: 185 });
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [confirmNotesModalValid, setConfirmNotesModalValid] = useState(false);
  const [isValidAction, setIsValidAction] = useState("");
  const [selectDisDetails, setSelectDisDetails] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);

  const getBackgroundColor = async () => {
    try {
      const response = await axios.get(
        ENDPOINTS.apiEndoint + `dbservice/section/color/getallsections`
      );
      setBackground(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  function removeDuplicates(array) {
    let output = [];
    if (array) {
      for (let item of array) {
        if (!output.includes(item)) output.push(item);
      }
    }

    return output;
  }

  const zoomIn = () => {
    if (zoom.width < 500 && zoom.width > 200) {
      setZoom((prev) => {
        return { width: prev.width - 30, height: prev.height - 10 };
      });
    }
    // setZoom((prev) => ({ width: prev.width - 30, height: prev.height - 10 }));
  };

  const zoomOut = () => {
    if (zoom.width <= 350) {
      setZoom((prev) => ({ width: prev.width + 30, height: prev.height + 10 }));
    }
  };

  const getProviderNameList = (data) => {
    var dublicateCaptureDelete = removeDuplicates(data);
    return dublicateCaptureDelete.map((res, index) => {
      const result = background.filter((res2) => res2.sectionName == res);
      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
      if (index < 1) {
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
        );
        return sectionMapArr;
      } else if (dublicateCaptureDelete.length - 1 == index) {
        var sectionMapArr = (
          <Popover
            content={
              <>
                {dublicateCaptureDelete?.map((item, i) =>
                  i > 0 ? (
                    <span
                      style={{ backgroundColor: backColor, color: textColor }}
                      className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
                    >
                      <i style={{ padding: "0 5px" }}>
                        <FontAwesomeIcon
                          icon={faCircleUser}
                          style={{
                            size: 10,
                            color: textColor,
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
              style={{ backgroundColor: backColor, color: textColor }}
              className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
            >
              {dublicateCaptureDelete.length - 1}+
            </span>
          </Popover>
        );

        return sectionMapArr;
      }
    });
  };

  const getEncounterDateBackground = (value) => {
    return value?.split(",")?.map((res, index) => {
      if (index < 2) {
        var backColor = "encounterDateTag1";
        var sectionMapArr = (
          <span
            // onClick={() => getEncounterDetails(res)}
            className={`mt-2 text-start cr-pointer ${visitStyles.encounterDate} ${backColor}`}
          >
            <i>
              <CalendarOutlined className={visitStyles.calenderIcon} />
            </i>
            {moment(res).format("MMM DD")}
          </span>
        );
        return sectionMapArr;
      } else if (value?.split(",").length - 1 === index) {
        var backColor = "encounterDateTag1";
        var sectionMapArr = (
          <Popover
            content={
              <>
                {value?.split(",")?.map((item, i) =>
                  i > 1 ? (
                    <span
                      // onClick={() => getEncounterDetails(res)}
                      className={`mt-2 text-start cr-pointer ${visitStyles.encounterDate} ${backColor}`}
                    >
                      <i>
                        <CalendarOutlined
                          className={visitStyles.calenderIcon}
                        />
                      </i>
                      {moment(item).format("MMM DD")}
                    </span>
                  ) : null
                )}
              </>
            }
            trigger={["click"]}
            placement="bottom"
          >
            <span
              // onClick={() => getEncounterDetails(res)}
              className={`mt-2 text-start cr-pointer ${visitStyles.encounterDate} ${backColor}`}
            >
              <i>
                <CalendarOutlined className={visitStyles.calenderIcon} />
              </i>
              {value?.split(",").length - 2}+
            </span>
          </Popover>
        );

        return sectionMapArr;
      }
      // const result = encounterDateMatching.filter((res2) => res2.name == res);
      // var backColor = result[0]?.colors;
    });
  };

  const getCaptureSectionBackground = (value) => {
    var dublicateCaptureDelete = removeDuplicates(value);
    return dublicateCaptureDelete.map((res, index) => {
      const result = background.filter((res2) => res2.sectionName == res);
      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
      if (index < 2) {
        var sectionMapArr = (
          <span
            style={{ backgroundColor: backColor, color: textColor }}
            className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
          >
            {res}
          </span>
        );
        return sectionMapArr;
      } else if (dublicateCaptureDelete.length - 1 == index) {
        var sectionMapArr = (
          <Popover
            content={
              <>
                {dublicateCaptureDelete?.map((item, i) =>
                  i > 1 ? (
                    <span
                      style={{ backgroundColor: backColor, color: textColor }}
                      className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
                    >
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
              style={{ backgroundColor: backColor, color: textColor }}
              className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
            >
              {dublicateCaptureDelete.length - 2}+
            </span>
          </Popover>
        );
        return sectionMapArr;
      }
    });
  };

  const confirmComboDelete = () => {
    moveToAnotherAction(
      setConfirmNotesModalValid,
      setIsValidAction,
      "Move to Deleted",
      selectDisDetails.diseaseSource == "HCC_DISEASES"
        ? "HCC"
        : selectDisDetails.diseaseSource == "SUGGESTED_HCC_DISEASES"
        ? "SUGGESTED"
        : "COMBO"
    );
  };
  const onchangeCombo = (data, code, diseaseSource) => {
    var title =
      code + " - " + data.actualDescription
        ? data.actualDescription
        : data.diseaseName;
    data.dateOfService = patientDetailsResult?.data?.response?.dateOfService;
    data.processedYear = patientDetailsResult?.data?.response?.processedYear;
    data.dbDescription = data.actualDescription
      ? data.actualDescription
      : data.diseaseName;
    (data.fileId = patientDetailsResult?.data?.response?.fileId),
      setSelectDiseasesName(title);
    setSelectDisDetails(data);
  };

  const handleCloseModal = () => {
    setConfirmNotesModalValid(false);
    setOpens(false);
    setCombiTree([]);
  };

  useEffect(() => {
    getBackgroundColor();
  }, []);

  useEffect(() => {
    setTrees(tree);
  }, [tree]);

  const nodeTemplate = (node) => {
    const provider = () => {
      if (node?.providers) {
        return node?.providers?.map((res) => res.providerName);
      } else {
        return node?.provider?.map((res) => res.providerName);
      }
    };
    return (
      <div
        className={Style.cards}
        style={{ width: zoom.width, height: zoom.width < 300 ? "auto" : 185 }}
      >
        <div className={Style.code}>
          <div>
            {node.diagnosisCodeCombo
              ? node.diagnosisCodeCombo
              : node.diagnosisCode}
          </div>
          <div>
            <Popconfirm
              title="You want move to Delete?"
              description={node.diseaseName}
              onConfirm={confirmComboDelete}
              placement="leftTop"
              okText="Yes"
              cancelText="No"
              onOpenChange={() =>
                onchangeCombo(
                  node,
                  node.diagnosisCodeCombo
                    ? node.diagnosisCodeCombo
                    : node.diagnosisCode,
                  node.diseaseSource
                )
              }
            >
              <div className={visitStyles.close_icon}>
                <FontAwesomeIcon
                  icon={faArrowsAlt}
                  style={{
                    size: 8,
                    color: "#a80404",
                  }}
                />
              </div>
            </Popconfirm>
          </div>
        </div>
        <Tooltip
          title={node.diseaseName ? node.diseaseName : node.actualDescription}
        >
          <div className={Style.codeAlign}>
            {node.diseaseName ? node.diseaseName : node.actualDescription}
          </div>
        </Tooltip>
        <div className="text-start">
          {[node.addOnCode, node.addOnCodeTwo, node.addOnCodeThree]?.map(
            (addCombo, index) =>
              addCombo && (
                <span className="font-bold">
                  <Tag color={addOnCodeColor[index]}>{addCombo}</Tag>
                </span>
              )
          )}
        </div>
        <div className="text-start">
          {getProviderNameList(
            node.providerName ? node.providerName : provider()
          )}
        </div>
        <div className="text-start">
          {getEncounterDateBackground(node?.encounterDate)}
        </div>
        <div className="text-start">
          {getCaptureSectionBackground(node?.capturedSections)}
        </div>
      </div>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      <div style={{ backgroundColor: "#fbfdff" }}>
        <button className="btns-primary btn-app-primary mx-1" onClick={zoomOut}>
          zoom-in
        </button>
        <button
          className="btns-primary btn-app-outline-primary"
          onClick={zoomIn}
        >
          zoom-out
        </button>
        <div className={`overflow-x-auto ${Style.chart}`}>
          {isLoading ? (
            <SpinnerDots />
          ) : (
            <OrganizationChart value={trees} nodeTemplate={nodeTemplate} />
          )}
        </div>
      </div>
      <ModelIndex
        title={selectDiseasesName}
        openState={confirmNotesModalValid}
        setFileLoading={setFileLoading}
        handleCloseModal={handleCloseModal}
        setConfirmNotesModalValid={setConfirmNotesModalValid}
        isValidAction={isValidAction}
        selectDisDetails={selectDisDetails}
      />
    </>
  );
};
const enhancer = connect((state) => ({
  patientDetailsResult: state?.patientDetails?.details?.patientResult,
}));
export default enhancer(CamboTree);
