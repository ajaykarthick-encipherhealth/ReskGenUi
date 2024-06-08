import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowsAlt,
  faSitemap,
} from "@fortawesome/free-solid-svg-icons";
import { Popconfirm, Divider, Popover, Menu, DatePicker, Dropdown } from "antd";
import { IMAGES, SVGICON } from "../../../../../jsx/constant/theme";
import { Modal } from "antd";
import CamboTree from "../../hcc/org";

const Combo = ({radiologyDetailsResult}) => {
  const [comboDiseaseCodesList, setComboDiseaseCodesList] = useState([]);
  const [invalidComboDiseaseCodesList, setInvalidComboDiseaseCodesList] =
    useState([]);

  const [selectDiseasesName, setSelectDiseasesName] = useState("");
  const [selectCode, setSelectCode] = useState("");
  const [combiTree, setCombiTree] = useState({});
  const [opens, setOpens] = useState(false);
  const [fileModalHeader, setFileModalHeader] = useState("");
  const [comboDiseaseCodesListRadiology, setComboDiseaseCodesListRadiology] =
    useState([]);

    useEffect(() => {
      setComboDiseaseCodesListRadiology([]);
      getPatientDetailsRadiologyYear();
    }, [radiologyDetailsResult]);

  const getPatientDetailsRadiologyYear = async () => {
    if (radiologyDetailsResult?.data?.response) {
      var result = radiologyDetailsResult?.data?.response;
      if (result.validDisease != null) {
        var comboDis = "";
        var dosYearArr = [];
        for (var key in result.validDisease) {
          dosYearArr.push({ value: key, label: key });
        }
        var dateofService = dosYearArr[0].value;
        if (result.comboDisease != null) {
          comboDis = result.comboDisease[dateofService];
        }
        setComboDiseaseCodesListRadiology(comboDis);
      } 
    }
  };

  const confirmComboInvalid = () =>
    new Promise((resolve) => {
      comboMoveInvalidConfirm();
      setTimeout(() => resolve(null), 1000);
    });

  const confirmComboValid = () =>
    new Promise((resolve) => {
      comboMoveValidConfirm();
      setTimeout(() => resolve(null), 1000);
    });

  const onchangeCombo = (data, code) => {
    setSelectDiseasesName(data);
    setSelectCode(code);
  };

  const comboMoveInvalidConfirm = () => {
    const result = comboDiseaseCodesList.filter(
      (res) => res.diseaseName != selectDiseasesName
    );
    const result2 = comboDiseaseCodesList.filter(
      (res) => res.diseaseName == selectDiseasesName
    );
    setComboDiseaseCodesList(result);
    var namePush = [];
    namePush.push({ name: selectCode + " - " + selectDiseasesName });
    var newArray = [];
    newArray = [...invalidComboDiseaseCodesList, ...result2];
    setInvalidComboDiseaseCodesList(newArray);
  };

  const comboMoveValidConfirm = () => {
    const result = invalidComboDiseaseCodesList.filter(
      (res) => res.diseaseName != selectDiseasesName
    );
    setInvalidComboDiseaseCodesList(result);
    const result2 = invalidComboDiseaseCodesList.filter(
      (res) => res.diseaseName == selectDiseasesName
    );
    var newArray = [];
    newArray = [...comboDiseaseCodesList, ...result2];
    setComboDiseaseCodesList(newArray);
  };

  const addValidDiseases = () => {
    setIsModalOpenValid(true);
    // setValidated(true);
  };

  const showErrorMessage = () => {
    setOpens(false);
    notification.destroy();
    notification.info({ message: "Tree Not Available", duration: 1 });
  };
  return (
    <>
      <div className={`${visitStyles.comboContainer}`}>
        <div className={`row ${visitStyles.comboContainer2}`}>
          <div className="col-xl-6">
            <div className={`${visitStyles.comboTitle}`}>
              <span>VALID CODES </span>
            </div>
            <div className={`my-post-content  ${visitStyles.comboContainer3}`}>
              <div className={visitStyles.combo_head_card}>
                <div className="row">
                  <div className="col-xl-3">
                    <label>Combo Codes</label>
                  </div>
                  <div className="col-xl-3">
                    <label>Additional Codes</label>
                  </div>
                  <div className="col-xl-5">
                    <label>Description</label>
                  </div>
                  <div className="col-xl-1">
                    <div className="d-flex justify-content-center">
                      <button
                        onClick={() => addValidDiseases()}
                        className={visitStyles.combo_add_btn}
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{
                            color: "#fff",
                            size: 12,
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {comboDiseaseCodesListRadiology.length != 0 ? (
                <div className={visitStyles.container}>
                  <div className={visitStyles.hccStickey_head}>
                    {comboDiseaseCodesListRadiology?.map((item) => {
                      return (
                        <div className={visitStyles.combo_details_card}>
                          <div className="row">
                            <div className="col-xl-3">
                              <span className="font-bold">
                                {item.diagnosisCodeCombo}
                              </span>
                            </div>
                            <div className="col-xl-3">
                              <span className="font-bold">
                                {item.addOnCode}
                              </span>
                            </div>
                            <div className="col-xl-5 cr-pointer">
                              <span>{item.diseaseName}</span>
                            </div>
                            <div className="col-xl-1 ">
                              <div>
                                <Popconfirm
                                  title="You want move to Invalid?"
                                  description={item.diseaseName}
                                  onConfirm={confirmComboInvalid}
                                  placement="leftTop"
                                  okText="Yes"
                                  cancelText="No"
                                  onOpenChange={() =>
                                    onchangeCombo(
                                      item.diseaseName,
                                      item.addOnCode
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
                              <div
                                className={visitStyles.close_icon}
                                style={{ background: "#c7f3c6" }}
                                onClick={() => {
                                  setOpens(true);
                                  setCombiTree([{ ...item, expanded: true }]);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faSitemap}
                                  style={{
                                    size: 8,
                                    color: "#088f39",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {comboDiseaseCodesListRadiology.length == 0 ? (
                <div>
                  <span className="no-patient-data">No Combination Codes</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="col-xl-6">
            <div className={`${visitStyles.comboTitle}`}>
              <span>DELETED COMBO CODES </span>
            </div>
            <div className={`my-post-content  ${visitStyles.comboContainer3}`}>
              <div className={visitStyles.combo_head_card}>
                <div className="row">
                  <div className="col-xl-3">
                    <label>Combo Codes</label>
                  </div>
                  <div className="col-xl-3">
                    <label>Additional Codes</label>
                  </div>
                  <div className="col-xl-5">
                    <label>Description</label>
                  </div>
                </div>
              </div>
              {invalidComboDiseaseCodesList.length != 0 ? (
                <>
                  <div className={visitStyles.container}>
                    <div className={visitStyles.hccStickey_head}>
                      {invalidComboDiseaseCodesList?.map((item) => {
                        return (
                          <div className={visitStyles.combo_details_card}>
                            <div className="row">
                              <div className="col-xl-3">
                                <span className="font-bold">
                                  {item.diagnosisCodeCombo}
                                </span>
                              </div>
                              <div className="col-xl-3">
                                <span className="font-bold">
                                  {item.addOnCode}
                                </span>
                              </div>
                              <div className="col-xl-5 cr-pointer">
                                <span>{item.diseaseName}</span>
                              </div>
                              <div className="col-xl-1 comboclose">
                                <Popconfirm
                                  title="You want move to Valid?"
                                  description={item.diseaseName}
                                  onConfirm={confirmComboValid}
                                  placement="leftTop"
                                  okText="Yes"
                                  cancelText="No"
                                  onOpenChange={() =>
                                    onchangeCombo(
                                      item.diseaseName,
                                      item.addOnCode
                                    )
                                  }
                                >
                                  <div className={visitStyles.tick_icon}>
                                    {SVGICON.tickIcon}
                                  </div>
                                </Popconfirm>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {opens && combiTree[0]?.children?.length > 0 ? (
        <Modal
          title={fileModalHeader}
          width="90%"
          centered
          open={opens}
          onOk={() => setOpens(false)}
          onCancel={() => setOpens(false)}
          footer={null}
        >
          <CamboTree tree={combiTree} />
        </Modal>
      ) : (
        opens && showErrorMessage()
      )}
    </>
  );
};

const enhancer = connect(
  (state) => ({
    radiologyDetailsResult :state?.patientDetails?.details?.radiologyResult,
    radiologyFile :state?.patientDetails?.details?.radiologyFileResult,
  }),
);
export default enhancer(Combo);