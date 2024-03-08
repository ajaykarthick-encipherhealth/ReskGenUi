import React, { useEffect, useState } from "react";
import { OrganizationChart } from "primereact/organizationchart";
import Style from "./style.module.css";
import { Popover, Tag, Tooltip } from "antd";
import Tree from "./data.json";
import Header from "../../../../../../jsx/layouts/nav/Header";
import { Card } from "react-bootstrap";
// import visitStyles from "../../../styles/visitdata.module.css";
import ENDPOINTS from "../../../../../../utility/enpoints";
import axios from "../../../../../../utility/axiosConfig";
import { CalendarOutlined } from "@ant-design/icons";
import moment from "moment";
import visitStyles from "../../../../../../styles/visitdata.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

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

const CamboTree = ({ tree }) => {
  const [background, setBackground] = useState([]);
  const [trees, setTrees] = useState(Tree);
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

  const getProviderNameList = (data) => {
    var dublicateCaptureDelete = removeDuplicates(data);
    return dublicateCaptureDelete.map((res, index) => {
      const result = background.filter((res2) => res2.sectionName == res);
      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;
      if (index < 2) {
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
                      {moment(res).format("MMM DD")}
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

  useEffect(() => {
    getBackgroundColor();
  }, []);

  useEffect(() => {
    setTrees(tree);
  }, [tree]);

  const nodeTemplate = (node) => {
    return (
      <div className={Style.cards}>
        <div className={Style.code}>
          {node.diagnosisCodeCombo
            ? node.diagnosisCodeCombo
            : node.diagnosisCode}
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
          {getProviderNameList(node?.providerName)}
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

  return (
    <div style={{ backgroundColor: "#fbfdff" }}>
      <div className={`overflow-x-auto ${Style.chart}`}>
        <OrganizationChart
          value={trees}
          // selectionMode="multiple"
          // selection={selection}
          // onSelectionChange={(e) => setSelection(e.data)}
          nodeTemplate={nodeTemplate}
        />
        {/* <div className="d-flex mx-5">
          <div className={`p-2 ${Style.subCard}`}>
            <div className={Style.code}>
              Add On Codesfasdfasdfasdfasdfads fadfa
            </div>
            <div className={`d-flex ${Style.code}`}>
              {["tete", "test"].map((item) => (
                <Tag color="blue">{item}</Tag>
              ))}
            </div>
            <div className="text-start">{"testing"}</div>
          </div>
        </div> */}
      </div>
    </div>
  );
};
export default CamboTree;
