import React, { use, useEffect } from "react";
import Style from "./../style.module.css";
import Epic from "../../../../images/svg/settingsIcons/icons/epic.png";
import Athena from "../../../../images/svg/settingsIcons/icons/athena.png";
import Cerner from "../../../../images/svg/settingsIcons/icons/cerner.png";
import EClinical from "../../../../images/svg/settingsIcons/icons/eclinicalworks.png";
import Image from "next/image";
import { Tag } from "antd";
import { getFihrList } from "../../../../store/actions/tanantAdminAction/FihrActions";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getDateAndTime } from "../../../../components/headerFilters/functions";

const EmrFhir = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const FihrList = useSelector(
    (state) => state?.tanantAdmin?.fihr_list?.fihr_list
  );
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

  useEffect(() => {
    dispatch(getFihrList(router));
  }, []);

  return (
    <div>
      <div className="p-3">
        <div className={Style.title}>FHIR Integration</div>
      </div>
      <div>
        {FihrList?.map((item) => (
          <div
            className={`p-1 px-3 d-inline-block m-2 border rounded-3`}
            style={{
              background: `${
                item.status.toLowerCase() !== "connected" ? "#efefef" : ""
              }`,
              cursor: `${
                item.status.toLowerCase() !== "connected" ? "no-drop" : ""
              }`,
            }}
          >
            <div className="p-2 text-center">
              <div
                className="d-flex justify-content-center"
                style={{ height: "80px", alignItems: "center" }}
              >
                {item.emr == "Epic" ? (
                  <Image src={Epic} width={100} alt="epic" />
                ) : item.emr == "Athena" ? (
                  <Image src={Athena} width={100} alt="Athena" />
                ) : item.emr == "EClinical" ? (
                  <Image src={EClinical} width={100} alt="EClinical" />
                ) : item.emr == "Cerner" ? (
                  <Image src={Cerner} width={100} alt="Cerner" />
                ) : null}
              </div>
              <div className="my-1">
                <span>{item.status}</span>
                <span
                  className={Style.flagDot}
                  style={{
                    backgroundColor: `${
                      item.status.toLowerCase() != "connected"
                        ? "#C70000"
                        : "#389e0d"
                    }`,
                  }}
                ></span>
              </div>
              <div className="my-2">
                {item.updatedDate ? getDateAndTime(item.updatedDate) : "---"}
              </div>
              <div className={`my-2`}>
                {item.status.toLowerCase() == "not_initiated" ? (
                  <Tag>Connect</Tag>
                ) : (
                  <Tag
                    color={
                      item.status.toLowerCase() == "connected" ? "red" : "green"
                    }
                    style={{
                      cursor: `${
                        item.status.toLowerCase() !== "connected"
                          ? "no-drop"
                          : "pointer"
                      }`,
                    }}
                  >
                    {item.status.toLowerCase() == "connected"
                      ? "Disconnect"
                      : "Connect"}
                  </Tag>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmrFhir;
