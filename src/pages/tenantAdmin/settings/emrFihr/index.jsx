import React, { use, useEffect, useState } from "react";
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
import axios from "axios";
import ENDPOINTS from "../../../../utility/enpoints";
import { Modal } from "antd";

const EmrFhir = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [emrUrl, setEmrUrl] = useState("");
  const FihrList = useSelector(
    (state) => state?.tanantAdmin?.fihr_list?.fihr_list
  );

  const handleConnection = async (emr) => {
    try {
      const res = await axios.get(
        ENDPOINTS?.apiLocal + `emr/fhir/getAuthorization?emr=${emr}`
      );
      setEmrUrl(res.data.urlToRedirect);
      setOpen(true);
      // window.open(res.data.urlToRedirect, "_blank");
    } catch (error) {}
  };

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
                    onClick={() => handleConnection(item.emr.toLowerCase())}
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
      <Modal
        title={""}
        width="90%"
        // height="90vh"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <iframe
          style={{ width: "100%", marginTop: "20px", height: "90vh" }}
          src={emrUrl}
          title="W3Schools Free Online Web Tutorials"
        ></iframe>
      </Modal>
    </div>
  );
};

export default EmrFhir;
