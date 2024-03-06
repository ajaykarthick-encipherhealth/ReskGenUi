import React, { useEffect, useState } from "react";
import { OrganizationChart } from "primereact/organizationchart";
import Style from "./style.module.css";
import { Tag, Tooltip } from "antd";
import Tree from "./data.json";
import Header from "../../../../../../jsx/layouts/nav/Header";
import { Card } from "react-bootstrap";
// import visitStyles from "../../../styles/visitdata.module.css";
import ENDPOINTS from "../../../../../../utility/enpoints";
import axios from "../../../../../../utility/axiosConfig";
import { CalendarOutlined } from "@ant-design/icons";
import moment from "moment";
import visitStyles from "../../../../../../styles/visitdata.module.css";

const CamboTree = ({ tree }) => {
  const [selection, setSelection] = useState([]);
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

  const getEncounterDateBackground = (value) => {
    return value?.split(",")?.map((res) => {
      // const result = encounterDateMatching.filter((res2) => res2.name == res);
      // var backColor = result[0]?.colors;
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
    });
  };

  const getCaptureSectionBackground = (value) => {
    var dublicateCaptureDelete = removeDuplicates(value);
    return dublicateCaptureDelete.map((res) => {
      const result = background.filter((res2) => res2.sectionName == res);
      var backColor = result[0]?.backgroundColor;
      var textColor = result[0]?.sectionColor;

      var sectionMapArr = (
        <span
          style={{ backgroundColor: backColor, color: textColor }}
          className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
        >
          {res}
        </span>
      );
      return sectionMapArr;
    });
  };

  useEffect(() => {
    getBackgroundColor();
  }, []);

  useEffect(() => {
    setTrees(tree)
  }, [tree])

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
        {node?.formedCodes?.length > 0 && (
          <div className={Style.code}>Add On Codes</div>
        )}

        <div className={`d-flex ${Style.code}`}>
          {node?.formedCodes?.map((item) => (
            <Tag color="blue">{item}</Tag>
          ))}
        </div>
        <div className="text-start">{node?.ruleType?.replaceAll("_", " ")}</div>
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
      <div
        className={`overflow-x-auto ${Style.chart}`}
      >
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
