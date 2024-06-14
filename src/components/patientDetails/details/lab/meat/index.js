import React, { useState, useEffect } from "react";
import { Badge } from "react-bootstrap";
import { useSelector, connect } from "react-redux";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsAlt } from "@fortawesome/free-solid-svg-icons";
import { Popconfirm, Popover } from "antd";
import { Modal } from "antd";
import PdfViewer from "../../PdfViewerComponent";
import { getPatientLabDetails } from "../../components/function/GetDataLab";

const Meat = ({ labDetailsResult, labFile }) => {
  const sectionColorList = useSelector(
    (state) => state?.ReviewerReducers?.sectionColorList
  );
  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [meatCriteriaList, setMeatCriteriaList] = useState([]);
  const [invalidMeatCriteriaList, setInvalidMeatCriteriaList] = useState([]);
  const [selectMeatName, setSelectMeatName] = useState("");
  const [isModalOpenLabMeat, setIsModalOpenLabMeat] = useState(false);
  const [labReportMeatList, setLabReportMeatList] = useState([]);
  const [labReportFile, setLabReportFile] = useState([]);
  const [labReportValidList, setLabReportValidList] = useState([]);
  const [captureSectionMatching, setCaptureSectionMatching] = useState([]);
  const [encounterDateMatching, setEncounterDateMatching] = useState([]);
  const [selectMeatResult, setSelectMeatResult] = useState(null);
  const [search, setSearch] = useState();

  useEffect(() => {
    getPatientLabDetails(
      labDetailsResult,
      setLabReportValidList,
      sectionColorList,
      "",
      "",
      "",
      setCaptureSectionMatching,
      setEncounterDateMatching,
      "",
      "",
      "",
      setLabReportMeatList,
      ""
    );
  }, [labDetailsResult]);

  useEffect(() => {
    setLabReportFile([]);
    getLabReportFiles();
  }, [labFile?.data?.response]);

  const getLabReportFiles = async (fileId, tenId) => {
    if (
      labFile?.data?.response &&
      labDetailsResult?.data?.response?.patientId
    ) {
      setLabReportFile(labFile?.data?.response);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpenLabMeat(false);
  };

  const getCaptureSectionBackgroundMeat = (
    value,
    dis,
    radiology,
    meatresult
  ) => {
    if (value) {
      const result = captureSectionMatching.filter(
        (res2) => res2.sectionName == value
      );
      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
      var disCode = result[0]?.diagnosisCode;
      var headerNames = result[0]?.sectionName;

      var sectionMapArr = (
        <span
          onClick={() => handleOpenModalLab(value, dis, radiology, meatresult)}
          style={{ backgroundColor: backColor, color: textColor }}
          className={`mt-2 text-start cr-pointer ${visitStyles.captureheaderMeat}`}
        >
          {value}
        </span>
      );
      return sectionMapArr;
    }
  };

  const confirmInvalidMeat = () =>
    new Promise((resolve) => {
      meatMoveInvalidConfirm();
      setTimeout(() => resolve(null), 1000);
    });

  const meatMoveInvalidConfirm = () => {
    const result = meatCriteriaList.filter(
      (res) => res.diseaseName != selectDiseasesName
    );
    const result2 = meatCriteriaList.filter(
      (res) => res.diseaseName == selectDiseasesName
    );
    setMeatCriteriaList(result);
    var newArray = [];
    newArray = [...invalidMeatCriteriaList, ...result2];
    setInvalidMeatCriteriaList(newArray);
  };

  const onchangeMeat = (data, code) => {
    setSelectDiseasesName(data);
  };

  const handleOpenModalLab = (
    value,
    disDescription,
    radiologyCheck,
    meatresult
  ) => {
    setSelectMeatResult(meatresult);
    var splitPoint = disDescription.substring(" ", 40);
    var dataset = value + " - (" + disDescription + ")";
    setSelectMeatName(dataset);
    setSearch({
      value: splitPoint,
      headers: false,
      headerContent: value,
    });
    setIsModalOpenLabMeat(true);
  };

  return (
    <>
      <div className="my-post-content pt-3">
        <div className={visitStyles.meat_head_card}>
          <div className="row">
            <div className="col-xl-1">
              <label>Codes</label>
            </div>
            <div className="col-xl-2">
              <label>Description</label>
            </div>
            <div className="col-xl-2">
              <label>Monitor</label>
            </div>
            <div className="col-xl-2">
              <label>Evaluation</label>
            </div>
            <div className="col-xl-2">
              <label>Assessment</label>
            </div>
            <div className="col-xl-2">
              <label>Treatment</label>
            </div>
            <div className="col-xl-1">
              <label></label>
            </div>
          </div>
        </div>
        {labReportMeatList.length != 0 ? (
          <div className={visitStyles.hccStickey_head}>
            {labReportMeatList?.map((item) => {
              return (
                <div
                  className={
                    item.isMeatCriteriaPresent === true
                      ? `${visitStyles.meat_details_card}`
                      : `${visitStyles.meat_details_card_false}`
                  }
                >
                  <div className="row">
                    <div className="col-xl-1 d-grid">
                      <span className="font-bold meat-name-details">
                        {item.diagnosisCode}
                      </span>
                      {item.category == "Valid" ? (
                        <Badge
                          className="valid-meat badge-circle mt-2"
                          bg={` badge-circle mt-2 bg-validmeat`}
                        >
                          {item.category}
                        </Badge>
                      ) : (
                        <Badge
                          className="valid-meat badge-circle mt-2"
                          bg={` badge-circle mt-2 bg-validUnmatch`}
                        >
                          {item.category}
                        </Badge>
                      )}
                    </div>
                    <div className="col-xl-2">
                      <Popover
                        placement="topLeft"
                        title="Description"
                        content={item.diseaseName}
                        overlayStyle={{ zIndex: 1000 }}
                      >
                        <span className="meat-name-details">
                          {item.diseaseName}
                        </span>
                      </Popover>
                    </div>
                    <div className="col-xl-2 d-grid">
                      {item.monitor != "" && item.monitor != null ? (
                        <Popover
                          placement="topLeft"
                          title="Monitor"
                          content={item.monitor}
                          overlayStyle={{ zIndex: 1000 }}
                        >
                          <span className="meat-name-details">
                            {item.monitor}
                          </span>
                        </Popover>
                      ) : (
                        <span className="meat-name-details text-center font-bold">
                          -
                        </span>
                      )}
                      <div>
                        {getCaptureSectionBackgroundMeat(
                          item.monitorCapturedFromHeader,
                          item.monitor,
                          item.radiology,
                          item
                        )}
                      </div>
                    </div>
                    <div className="col-xl-2 d-grid">
                      {item.evaluate != "" && item.evaluate != null ? (
                        <Popover
                          placement="topLeft"
                          title="Evaluation"
                          content={item.evaluate}
                          overlayStyle={{ zIndex: 1000 }}
                        >
                          <span className="meat-name-details">
                            {item.evaluate}
                          </span>
                        </Popover>
                      ) : (
                        <span className="meat-name-details text-center font-bold">
                          -
                        </span>
                      )}
                      <div>
                        {getCaptureSectionBackgroundMeat(
                          item.evaluateCapturedFromHeader,
                          item.evaluate,
                          item.radiology,
                          item
                        )}
                      </div>
                    </div>
                    <div className="col-xl-2 d-grid">
                      {item.assessment != "" ? (
                        <Popover
                          placement="topLeft"
                          title="Assessment"
                          content={item.assessment}
                          overlayStyle={{ zIndex: 1000 }}
                        >
                          <span className="meat-name-details">
                            {item.assessment}
                          </span>
                        </Popover>
                      ) : (
                        <span className="meat-name-details text-center font-bold">
                          -
                        </span>
                      )}
                      <div>
                        {getCaptureSectionBackgroundMeat(
                          item.assessmentCapturedFromHeader,
                          item.assessment,
                          item.radiology,
                          item
                        )}
                      </div>
                    </div>
                    <div className="col-xl-2 d-grid">
                      {item.treatment != "" && item.treatment != null ? (
                        <Popover
                          placement="topLeft"
                          title="Treatment"
                          content={item.treatment}
                          overlayStyle={{ zIndex: 1000 }}
                        >
                          <span className="meat-name-details">
                            {item.treatment}
                          </span>
                        </Popover>
                      ) : (
                        <span className="meat-name-details text-center font-bold">
                          -
                        </span>
                      )}
                      <div>
                        {getCaptureSectionBackgroundMeat(
                          item.treatmentCapturedFromHeader,
                          item.treatment,
                          item.radiology,
                          item
                        )}
                      </div>
                    </div>
                    <div className="col-xl-1 meatclose">
                      <Popconfirm
                        title="You want move to Invalid?"
                        description={item.diseaseName}
                        onConfirm={confirmInvalidMeat}
                        placement="leftTop"
                        okText="Yes"
                        cancelText="No"
                        onOpenChange={() =>
                          onchangeMeat(item.diseaseName, item.diagnosisCode)
                        }
                      >
                        <div className={visitStyles.close_icon}>
                          <FontAwesomeIcon
                            icon={faArrowsAlt}
                            style={{ size: 8, color: "#a80404" }}
                          />
                        </div>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              );
            })}

            {labReportMeatList.length == 0 ? (
              <div className="card combo-card">
                <div className="col-xl-12">
                  <div>
                    <span className="no-patient-data">NO DATA</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <Modal
        title={selectMeatName}
        centered
        open={isModalOpenLabMeat}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
        width="90%"
        footer={false}
      >
        <div className="section-container">
          <div className="my-post-content pt-3">
            <div className="row">
              <div className="col-xl-4">
                <div className={visitStyles.meat_title_card2}>
                  <div className="row">
                    <div className="col-xl-6">
                      <label>Codes</label>
                    </div>
                    <div className="col-xl-6">
                      <label>Description</label>
                    </div>
                  </div>
                </div>

                <div
                  className={
                    selectMeatResult?.isMeatCriteriaPresent === true
                      ? `${visitStyles.meat_details_card2}`
                      : `${visitStyles.meat_details_card_false}`
                  }
                >
                  <div className="row">
                    <div className="col-xl-6 d-grid">
                      <span className="font-bold">
                        {selectMeatResult?.diagnosisCode}
                      </span>
                      {selectMeatResult?.category == "Valid" ? (
                        <Badge
                          className="valid-meat badge-circle mt-2"
                          bg={` badge-circle mt-2 bg-validmeat`}
                        >
                          {selectMeatResult?.category}
                        </Badge>
                      ) : (
                        <Badge
                          className="valid-meat badge-circle mt-2"
                          bg={` badge-circle mt-2 bg-validUnmatch`}
                        >
                          {selectMeatResult?.category}
                        </Badge>
                      )}
                    </div>
                    <div className="col-xl-6 d-grid">
                      <Popover
                        placement="topLeft"
                        title="Description"
                        content={selectMeatResult?.diseaseName}
                        overlayStyle={{ zIndex: 1000 }}
                      >
                        <span className="meat-name-details2">
                          {selectMeatResult?.diseaseName}
                        </span>
                      </Popover>
                    </div>
                  </div>
                </div>
                <div className={visitStyles.meat_title_card2}>
                  <div className="row">
                    <div className="col-xl-12">
                      <label>Monitor</label>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    selectMeatResult?.isMeatCriteriaPresent === true
                      ? `${visitStyles.meat_details_card2}`
                      : `${visitStyles.meat_details_card_false}`
                  }
                >
                  <div className="row">
                    <div className="col-xl-12 d-grid">
                      {selectMeatResult?.monitor != "" ? (
                        <Popover
                          placement="topLeft"
                          title="Monitor"
                          content={selectMeatResult?.monitor}
                          overlayStyle={{ zIndex: 1000 }}
                        >
                          <span className="meat-name-details2">
                            {selectMeatResult?.monitor}
                          </span>
                        </Popover>
                      ) : (
                        <span className="meat-name-details2 text-center font-bold">
                          -
                        </span>
                      )}
                      <div>
                        {getCaptureSectionBackgroundMeat(
                          selectMeatResult?.monitorCapturedFromHeader,
                          selectMeatResult?.monitor,
                          selectMeatResult?.radiology,
                          selectMeatResult
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={visitStyles.meat_title_card2}>
                  <div className="row">
                    <div className="col-xl-12">
                      <label>Evaluation</label>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    selectMeatResult?.isMeatCriteriaPresent === true
                      ? `${visitStyles.meat_details_card2}`
                      : `${visitStyles.meat_details_card_false}`
                  }
                >
                  <div className="row">
                    <div className="col-xl-12 d-grid">
                      {selectMeatResult?.evaluate != "" ? (
                        <Popover
                          placement="topLeft"
                          title="Evaluation"
                          content={selectMeatResult?.evaluate}
                          overlayStyle={{ zIndex: 1000 }}
                        >
                          <span className="meat-name-details2">
                            {selectMeatResult?.evaluate}
                          </span>
                        </Popover>
                      ) : (
                        <span className="meat-name-details2 text-center font-bold">
                          -
                        </span>
                      )}
                      <div>
                        {getCaptureSectionBackgroundMeat(
                          selectMeatResult?.evaluateCapturedFromHeader,
                          selectMeatResult?.evaluate,
                          selectMeatResult?.radiology,
                          selectMeatResult
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={visitStyles.meat_title_card2}>
                  <div className="row">
                    <div className="col-xl-12">
                      <label>Assessment</label>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    selectMeatResult?.isMeatCriteriaPresent === true
                      ? `${visitStyles.meat_details_card2}`
                      : `${visitStyles.meat_details_card_false}`
                  }
                >
                  <div className="row">
                    <div className="col-xl-12 d-grid">
                      {selectMeatResult?.assessment != "" ? (
                        <Popover
                          placement="topLeft"
                          title="Assessment"
                          content={selectMeatResult?.assessment}
                          overlayStyle={{ zIndex: 1000 }}
                        >
                          <span className="meat-name-details2">
                            {selectMeatResult?.assessment}
                          </span>
                        </Popover>
                      ) : (
                        <span className="meat-name-details2 text-center font-bold">
                          -
                        </span>
                      )}

                      <div>
                        {getCaptureSectionBackgroundMeat(
                          selectMeatResult?.assessmentCapturedFromHeader,
                          selectMeatResult?.assessment,
                          selectMeatResult?.radiology,
                          selectMeatResult
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={visitStyles.meat_title_card2}>
                  <div className="row">
                    <div className="col-xl-12">
                      <label>Treatment</label>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    selectMeatResult?.isMeatCriteriaPresent === true
                      ? `${visitStyles.meat_details_card2}`
                      : `${visitStyles.meat_details_card_false}`
                  }
                >
                  <div className="row">
                    <div className="col-xl-12 d-grid">
                      {selectMeatResult?.treatment != "" ? (
                        <Popover
                          placement="topLeft"
                          title="Treatment"
                          content={selectMeatResult?.treatment}
                          overlayStyle={{ zIndex: 1000 }}
                        >
                          <span className="meat-name-details2">
                            {selectMeatResult?.treatment}
                          </span>
                        </Popover>
                      ) : (
                        <span className="meat-name-details2 text-center font-bold">
                          -
                        </span>
                      )}
                      <div>
                        {getCaptureSectionBackgroundMeat(
                          selectMeatResult?.treatmentCapturedFromHeader,
                          selectMeatResult?.treatment,
                          selectMeatResult?.radiology,
                          selectMeatResult
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-8">
                <div className="card-body p-0 z-index-low">
                  {labReportFile && (
                    <PdfViewer
                      src={labReportFile}
                      searchQuery={search?.value ? search?.value : ""}
                      pageNumber={search?.page ? search?.page : 1}
                      headers={search?.headers}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

const enhancer = connect((state) => ({
  labDetailsResult: state?.patientDetails?.details?.labResult,
  labFile: state?.patientDetails?.details?.labFileResult,
}));
export default enhancer(Meat);
