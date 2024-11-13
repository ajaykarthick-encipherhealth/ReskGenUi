import React from "react";
import RegularButton from "../../../../../components/button";
import { Row, Col, Card } from "react-bootstrap";
import { Tooltip } from "antd";


const QueryTemplateConfig = () => {
    const data = [
      {
        id: 1,
        title: "ACTIVE_HEADERS",
        description: "Diagnosis listed under Assessment/problem list/PMH/Radiology/Lab, whereas there is no supporting documentation found. Please evaluate and update the condition......",
      },
      {
        id: 2,
        title: "ANGINA",
        description: "Diagnosis listed under Assessment/problem list/PMH/Radiology/Lab, whereas there is no supporting documentation found. Please evaluate and update the condition......",
      },
      {
        id: 3,
        title: "BMI",
        description: "Diagnosis listed under Assessment/problem list/PMH/Radiology/Lab, whereas there is no supporting documentation found. Please evaluate and update the condition......",
      },
      {
        id: 4,
        title: "ACTIVE_HEADERS",
        description: "Diagnosis listed under Assessment/problem list/PMH/Radiology/Lab, whereas there is no supporting documentation found. Please evaluate and update the condition......",
      },
      {
        id: 5,
        title: "ANGINA",
        description: "Diagnosis listed under Assessment/problem list/PMH/Radiology/Lab, whereas there is no supporting documentation found. Please evaluate and update the condition......",
      },
      {
        id: 6,
        title: "BMI",
        description: "Diagnosis listed under Assessment/problem list/PMH/Radiology/Lab, whereas there is no supporting documentation found. Please evaluate and update the condition......",
      },
      {
        id: 7,
        title: "ACTIVE_HEADERS",
        description: "Diagnosis listed under Assessment/problem list/PMH/Radiology/Lab, whereas there is no supporting documentation found. Please evaluate and update the condition......",
      },
      {
        id: 8,
        title: "ANGINA",
        description: "Diagnosis listed under Assessment/problem list/PMH/Radiology/Lab, whereas there is no supporting documentation found. Please evaluate and update the condition......",
      },
      {
        id: 9,
        title: "BMI",
        description: "Diagnosis listed under Assessment/problem list/PMH/Radiology/Lab, whereas there is no supporting documentation found. Please evaluate and update the condition......",
      },
    ];

  return (
    <div className="p-3">
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <h3>Query Template Configuration</h3>
        </div>
        <div>
          <RegularButton
            type={"outline"}
            name={"View Query Headers"}
            onClick={() => console.log("Restore Changes")}
          />
          <RegularButton
            type={"outline"}
            name={"Add Query"}
            onClick={() => console.log("Restore Changes")}
          />
        </div>
      </div>
      <div>
        <Row>
          {data.map((item, index) => (
            <Col key={index} md={4} className="mb-3">
              <div className="custom-card">
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title>{item.title}</Card.Title>
                    <div>
                      <b style={{ color: "#04306F" }}>Message</b>
                    </div>
                    <Tooltip title={item.description}>
                      <Card.Text>{item.description}</Card.Text>
                    </Tooltip>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      </div>
      <div className="d-flex justify-content-end">
        <RegularButton
          type={"outline"}
          name={"Save"}
          onClick={() => console.log("Restore Changes")}
        />
      </div>
    </div>
  );

};

export default QueryTemplateConfig;
