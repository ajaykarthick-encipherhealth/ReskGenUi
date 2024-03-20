import React from "react";
import Style from "./../style.module.css";
import Epic from "../../../../images/svg/settingsIcons/icons/epic.png";
import Athena from "../../../../images/svg/settingsIcons/icons/athena.png";
import Cerner from "../../../../images/svg/settingsIcons/icons/Cerner.png";
import EClinical from "../../../../images/svg/settingsIcons/icons/eclinicalworks.png";
import Image from "next/image";
import { Tag } from "antd";

const EmrFhir = () => {
  const data = [
    {
      id: 1,
      status: "Disconnected",
      date: "2024-03-11T12:16:30.192Z",
      img: Epic,
      connection: "Connect",
    },
    {
      id: 1,
      status: "Connected",
      date: "2024-03-11T12:16:30.192Z",
      img: Athena,
      connection: "Connect",
    },
    {
      id: 1,
      status: "Disconnected",
      date: "2024-03-11T12:16:30.192Z",
      img: EClinical,
      connection: "Connect",
    },
    {
      id: 1,
      status: "Disconnected",
      date: "2024-03-11T12:16:30.192Z",
      img: Cerner,
      connection: "Connect",
    },
  ];

  return (
    <div>
      <div className="p-3">
        <div className={Style.title}>FHIR Integration</div>
      </div>
      <div>
        {data.map((item) => (
          <div
            className={`p-1 px-3 d-inline-block m-2 border rounded-3`}
            style={{
              background: `${
                item.status !== "Connected" ? "#efefef" : ""
              }`,
              cursor: `${item.status !== "Connected" ? "no-drop" : ""}`,
            }}
          >
            <div className="p-2 text-center">
              <div
                className="d-flex justify-content-center"
                style={{ height: "80px", alignItems: "center" }}
              >
                <Image src={item.img} width={100} alt="epic" />
              </div>
              <div className="my-1">
                <span>{item.status}</span>
                <span
                  className={Style.flagDot}
                  style={{
                    backgroundColor: `${
                      item.status != "Connected" ? "#C70000" : "#389e0d"
                    }`,
                  }}
                ></span>
              </div>
              <div className="my-2">{item.date}</div>
              <div className={`my-2`}>
                <Tag
                  color={item.status == "Connected" ? "red" : "green"}
                  style={{ cursor: `${item.status !== "Connected" ? "no-drop" : "pointer"}` }}
                >
                  {item.status == "Connected" ? "Disconnect" : "Connect"}
                </Tag>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmrFhir;
