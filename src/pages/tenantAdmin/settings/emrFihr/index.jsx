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
import { Modal, Form, Select, Button } from "antd";
import Notes from "./notes";
import RegularButton from "../../../../components/button";
import ButtonStyles from "../../../../components/button/style.module.css";
import ConnectStep from "./connectStep";

const EmrFhir = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [emrUrl, setEmrUrl] = useState("");
  const [isConnectNext, setIsConnectNext] = useState(false);

  // const FihrList = useSelector(
  //   (state) => state?.tanantAdmin?.fihr_list?.fihr_list
  // );

  const FihrList = [
    {
      emr: "Epic",
      status: "disconnected",
    },
    {
      emr: "Athena",
      status: "connected",
    },
    {
      emr: "EClinical",
      status: "connected",
    },
    {
      emr: "Cerner",
      status: "connected",
    },
  ];

  const appType = [
    {
      label: "Backend",
      value: "Backend",
    },
  ];

  const accessType = [
    {
      label: "Online",
      value: "Online",
    },
    {
      label: "Offline",
      value: "Offline",
    },
  ];

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

  const handleSubmit = async (values) => {
    console.log(values);
    setIsConnectNext(true)
  };

  useEffect(() => {
    dispatch(getFihrList(router));
  }, []);

  return (
    <div>
      <div className="p-3">
        <div className={Style.title}>FHIR Integration</div>
      </div>
      {isConnectNext == false ? (
        <>
          <div>
            {FihrList?.map((item) => (
              <div
                className={
                  item.status.toLowerCase() === "connected" ? 
                  `p-1 px-3 d-inline-block m-2 rounded-3 ${Style.borderStyleConnect}`:
                  `p-1 px-3 d-inline-block m-2 rounded-3 ${Style.borderStyleDisConnect}`
                }
                // style={{
                //   background: `${
                //     item.status.toLowerCase() !== "connected" ? "#efefef" : ""
                //   }`,
                //   cursor: `${
                //     item.status.toLowerCase() !== "connected" ? "no-drop" : ""
                //   }`,
                // }}
              >
                <div className="p-2 text-center">
                  <div
                    className="d-flex justify-content-center"
                    style={{
                      height: "80px",
                      alignItems: "center",
                      width: "220px",
                    }}
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
                    <span>{item.status}</span>
                  </div>
                  {/* <div className="my-2">
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
              </div> */}
                </div>
              </div>
            ))}
          </div>
          <div>
            <Form id={"chart-audit"} onFinish={handleSubmit} form={form}>
              <div className="p-3" style={{ height: "180px"}}>
                <div className="d-flex justify-content-between mt-4">
                  <div>
                    <div className={Style.heading}>App Type</div>
                    <span>An app type refers to the category or function of a web application</span>
                  </div>
                  <div>
                    <Form.Item name={"appType"}>
                      <Select
                        placeholder="App Type"
                        options={appType}
                        className={Style.selector}
                        allowClear
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <div>
                    <div className={Style.heading}>Access Type</div>
                    <span>An access type refers to the category or function of a web application</span>
                  </div>
                  <div>
                    <Form.Item name={"accessType"}>
                      <Select
                        placeholder="Access Type"
                        options={accessType}
                        className={Style.selector}
                        allowClear
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center p-3">
                <Form.Item>
                  <Button
                    htmlType="submit"
                    type="primary"
                    className={ButtonStyles?.btnColor}
                    style={{ height: "45px", width: "100px" }}
                    onClick={handleSubmit}
                  >
                    NEXT
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
          <Notes />
        </>
      ) : (
        <ConnectStep setIsConnectNext={setIsConnectNext} />
      )}
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
