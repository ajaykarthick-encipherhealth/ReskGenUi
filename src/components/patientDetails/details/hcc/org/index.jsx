import React, { useEffect, useState } from "react";
import { OrganizationChart } from "primereact/organizationchart";
import Style from "./style.module.css";
import { Badge, Popconfirm, Popover, notification, Tag, Tooltip } from "antd";
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
import {
  faCircleUser,
  faArrowsAlt,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import SpinnerDots from "../../../../../components/spinner";
import ModelIndex from "../../components/model/Index";
import {
  handleSubmitValidNotes,
  moveToAnotherAction,
  stringToColour,
} from "../../components/function/ReusableFunctions";
import { connect } from "react-redux";
import { getProviderNameTagList } from "../../components/function/ProviderHyperlinks";
import { getDateOfServiceBackground } from "../../components/function/DateOfServices";
import { getSectionHeaderBackground } from "../../components/function/SectionHeader";
import { getStateIndicators } from "../../components/function/GetData";
import { actions as detailsActions } from "../../../../../stores/patient/details";

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

const CamboTree = ({
  tree,
  setOpens,
  setCombiTree,
  patientDetailsResult,
  getPatientDetailsReload,
  getpatientDetailsData,
  isDosSelected,
  setFileLoading
}) => {
  const [background, setBackground] = useState([]);
  const [trees, setTrees] = useState(Tree);
  const [isLoading, setLoading] = useState(tree);
  const [zoom, setZoom] = useState({ width: 350, height: 185 });
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [confirmNotesModalValid, setConfirmNotesModalValid] = useState(false);
  const [isValidAction, setIsValidAction] = useState({
    name: "Move to Deleted",
    title: "",
  });
  const [selectDisDetails, setSelectDisDetails] = useState(false);

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
  useEffect(() => {
    if (selectDisDetails && selectDisDetails.diseaseSource) {
      const title =
        selectDisDetails.diseaseSource === "HCC_DISEASES"
          ? "HCC"
          : selectDisDetails.diseaseSource === "SUGGESTED_HCC_DISEASES"
          ? "SUGGESTED"
          : selectDisDetails.diseaseSource === "NON_HCC_DISEASES"
          ? "NON_HCC_DISEASES"
          : "HCC";

      setIsValidAction((prev) => {
        if (prev.title !== title) {
          return { ...prev, title: title };
        }
        return prev;
      });
    }
  }, [selectDisDetails]);
  const handleDeleteDisease = async () => {
    handleSubmitValidNotes({
      setFileLoading,
      setConfirmNotesModalValid,
      getPatientDetailsReload,
      isValidAction,
      selectDisDetails,
      getpatientDetailsData,
      patientDetailsResult,
      handleCloseModal,
    });
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

  const getEncounterDateBackground = (value) => {
    return value?.map((res, index) => {
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
      } else if (value.length - 1 === index) {
        var backColor = "encounterDateTag1";
        var sectionMapArr = (
          <Popover
            content={
              <>
                {value?.map((item, i) =>
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
            trigger={["hover"]}
            placement="bottom"
          >
            <span
              // onClick={() => getEncounterDetails(res)}
              className={`mt-2 text-start cr-pointer ${visitStyles.encounterDate} ${backColor}`}
            >
              <i>
                <CalendarOutlined className={visitStyles.calenderIcon} />
              </i>
              {value.length - 2}+
            </span>
          </Popover>
        );

        return sectionMapArr;
      }
      // const result = encounterDateMatching.filter((res2) => res2.name == res);
      // var backColor = result[0]?.colors;
    });
  };

  useEffect(() => {
    setTrees(tree);
  }, [tree]);

  const isMost = (most) => {
    if (most.includes("MOST_SPECIFIC")) {
      return (
        <Badge className={`mt-2 text-start  ${visitStyles.manuallyAdded}`}>
          Most Specific
        </Badge>
      );
    }
  };

  const nodeTemplate = (node) => {
    return (
      <div
        className={Style.cards}
        style={{
          width: zoom.width,
          height: zoom.width < 300 ? "auto" : Style.cards,
        }}
      >
        <div className={Style.code}>
          <div>
            {node.diagnosisCodeCombo
              ? node.diagnosisCodeCombo
              : node.diagnosisCode}
          </div>
          {trees?.diagnosisCodeCombo == node.diagnosisCodeCombo && isDosSelected && (
            <div>
              <Popconfirm
                title="Do you want to move to Delete?"
                description={node.diseaseName}
                onConfirm={handleDeleteDisease}
                placement="leftTop"
                okText="Yes"
                cancelText="No"
                // onOk={() =>
                //   handleSubmitValidNotes({
                //     setFileLoading,
                //     setConfirmNotesModalValid,
                //     getPatientDetailsReload,
                //     isValidAction,
                //     selectDisDetails,
                //     getpatientDetailsData,
                //     patientDetailsResult,
                //     getLabDetails,
                //     getRadiologyDetails,
                //     handleCloseModal,
                //   })
                // }
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
                    icon={faXmark}
                    style={{
                      size: 8,
                      color: "#a80404",
                    }}
                  />
                </div>
              </Popconfirm>
            </div>
          )}
        </div>
        <Tooltip
          title={node.diseaseName ? node.diseaseName : node.actualDescription}
        >
          <div className={Style.codeAlign}>
            {node.diseaseName ? node.diseaseName : node.actualDescription}
          </div>
        </Tooltip>
        <div className="text-start">
          {node.addOnCodes?.map(
            (addCombo, index) =>
              addCombo && (
                <span className="font-bold">
                  <Tag color={addOnCodeColor[index]}>{addCombo}</Tag>
                </span>
              )
          )}
        </div>
        <div className="d-flex justify-content-between">
          <div className="text-start">
            {getProviderNameTagList({
              data: node.providerNames ? node.providerNames : node.providerName,
            })}
          </div>
          <div className="">
            {node.stateIndicators?.length > 0
              ? isMost(node.stateIndicators)
              : ""}
          </div>
        </div>

        <div className="text-start">
          {getEncounterDateBackground(node?.dateOfServices)}
        </div>
        <div className="text-start">
          {getSectionHeaderBackground({
            value: node?.capturedSections,
          })}
        </div>
        <div className="text-start d-flex justify-content-end">
          {getStateIndicators(node.stateIndicators, "INDIRECT_LESS_SPECIFIC") &&
            getSectionHeaderBackground({
              value: ["INDIRECT LESS SPECIFIC"],
            })}
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
      {/* <ModelIndex
        title={selectDiseasesName}
        // openState={confirmNotesModalValid}
        setFileLoading={setFileLoading}
        handleCloseModal={handleCloseModal}
        setConfirmNotesModalValid={setConfirmNotesModalValid}
        isValidAction={isValidAction}
        selectDisDetails={selectDisDetails}
      /> */}
    </>
  );
};

const enhancer = connect(
  (state) => ({
    patientDetailsResult: state?.patientDetails?.details?.patientResult,
    isDosSelected: state.patientDetails.details?.getSelectedDosDetails,
  }),
  {
    getpatientDetailsData: detailsActions.patientDetailsAction,
    getRadiologyDetails: detailsActions.radiologyDetailsAction,
    getLabDetails: detailsActions.labDetailsAction,
  }
);
export default enhancer(CamboTree);
