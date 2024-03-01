import React, { useState } from "react";
import { OrganizationChart } from "primereact/organizationchart";
import Style from "./style.module.css";
import { Tag, Tooltip } from "antd";
import Tree from "./data.json";
import Header from "../../../jsx/layouts/nav/Header";
import { Card } from "react-bootstrap";

const SelectionDemo = () => {
  const [selection, setSelection] = useState([]);

  console.log(Tree);

  const re = (data) => {
    console.log(data, "tree");
    if (data.length > 0) {
      const d = data.map((t) => ({
        expanded: true,
        type: "person",
        className: `${Style.orgCard}`,
        style: {
          borderRadius: "7px",
          padding: "10px",
          border: "2px solid success",
        },
        data: t,
        children: t.formedTree?.length > 0 ? re(t.formedTree) : [],
      }));
      console.log(d, "tree");
    } else {
      return {
        expanded: true,
        type: "person",
        className: `${Style.orgCard}`,
        style: {
          borderRadius: "7px",
          padding: "10px",
          border: "2px solid success",
        },
        data: data,
        children: data.formedTree?.length > 0 ? re(data.formedTree) : [],
      };
    }
  };

  const dat = Tree.map((tree) => ({
    expanded: true,
    type: "person",
    className: `${Style.orgCard}`,
    style: {
      borderRadius: "7px",
      padding: "10px",
      border: "2px solid success",
    },
    data: {
      ...tree,
    },
    children: tree.formedTree?.length > 0 ? re(tree.formedTree) : [],
  }));

  console.log(Tree, "tree");

  const [data] = useState([
    {
      expanded: true,
      type: "person",
      className: `${Style.orgCard}`,
      style: {
        borderRadius: "7px",
        padding: "10px",
        border: "2px solid success",
      },
      data: {
        name: "Amy Elsner",
        title: "HTN Heart and CKD With HF and Stage 5 or ESRD",
        codes: ["I5021", "I120"],
        type: "Most Specific Code",
      },
      children: [
        {
          expanded: false,
          type: "person",
          className: `${Style.orgCard}`,
          style: { borderRadius: "7px", padding: "10px", padding: "10px" },
          data: {
            image:
              "https://primefaces.org/cdn/primereact/images/avatar/annafali.png",
            name: "Anna Fali",
            title: "CMO",
            codes: ["N186", "I5021", "I120"],
            type: "Most Specific Code",
          },
          children: [
            {
              type: "person",
              className: `${Style.orgCard}`,
              style: { borderRadius: "7px", padding: "10px" },
              data: {
                image:
                  "https://primefaces.org/cdn/primereact/images/avatar/annafali.png",
                name: "Anna Fali",
                title: "CMO",
                codes: ["N186", "I5021", "I120"],
                type: "Most Specific Code",
              },
            },
            {
              type: "person",
              className: `${Style.orgCard}`,
              style: { borderRadius: "7px", padding: "10px" },
              data: {
                image:
                  "https://primefaces.org/cdn/primereact/images/avatar/annafali.png",
                name: "Anna Fali",
                title: "CMO",
                codes: ["N186", "I5021", "I120"],
                type: "Most Specific Code",
              },
            },
          ],
        },
        {
          expanded: true,
          type: "person",
          className: `${Style.orgCard}`,
          style: { borderRadius: "7px", padding: "10px" },
          data: {
            image:
              "https://primefaces.org/cdn/primereact/images/avatar/stephenshaw.png",
            name: "Stephen Shaw",
            title: "CTO",
            type: "Most Specific Code",
            codes: ["N186", "I5021", "I120"],
          },
          children: [
            {
              expanded: true,
              type: "person",
              className: `${Style.orgCard}`,
              style: { borderRadius: "7px", padding: "10px" },
              data: {
                image:
                  "https://primefaces.org/cdn/primereact/images/avatar/annafali.png",
                name: "Anna Fali",
                title: "CMO",
                codes: ["N186", "I5021", "I120"],
                type: "Most Specific Code",
              },
            },
            {
              expanded: true,
              type: "person",
              className: `${Style.orgCard}`,
              style: { borderRadius: "7px", padding: "10px" },
              data: {
                image:
                  "https://primefaces.org/cdn/primereact/images/avatar/annafali.png",
                name: "Anna Fali",
                title: "CMO",
                codes: ["N186", "I5021", "I120"],
                type: "Most Specific Code",
              },
            },
          ],
        },
      ],
    },
  ]);

  const nodeTemplate = (node) => {
    console.log(node, "node");
    return (
      <div className={Style.cards}>
        <div className="">
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

          <div className={Style.code}>Add On Codes</div>
          <div className={`d-flex ${Style.code}`}>
            {node?.formedCodes?.map((item) => (
              <Tag color="blue">{item}</Tag>
            ))}
          </div>
          <div className="text-start">{node?.ruleType}</div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      <Header />
      <div
        className={`card border border-primary overflow-x-auto ${Style.chart}`}
      >
        <OrganizationChart
          value={Tree}
          selectionMode="multiple"
          // selection={selection}
          // onSelectionChange={(e) => setSelection(e.data)}
          nodeTemplate={nodeTemplate}
        />
        <div className="d-flex mx-5">
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
        </div>
      </div>
    </div>
  );
};
export default SelectionDemo;
