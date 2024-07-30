import React, { use, useEffect, useState } from "react";
import Style from "./../style.module.css";
import Epic from "../../../../images/svg/settingsIcons/icons/epic.png";
import Athena from "../../../../images/svg/settingsIcons/icons/athena.png";
import Cerner from "../../../../images/svg/settingsIcons/icons/cerner.png";
import EClinical from "../../../../images/svg/settingsIcons/icons/eclinicalworks.png";
import Image from "next/image";
import { notification, Tag } from "antd";
import { getFihrList } from "../../../../store/actions/tanantAdminAction/FihrActions";
import { connect, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getDateAndTime } from "../../../../components/headerFilters/functions";
import axios from "axios";
import ENDPOINTS from "../../../../utility/enpoints";
import { Modal, Form, Select, Button } from "antd";
import Notes from "./notes";
import RegularButton from "../../../../components/button";
import ButtonStyles from "../../../../components/button/style.module.css";
import ConnectStep from "./connectStep";
import { actions as settingActions } from "../../../../stores/tenantAdmin/settings";
import { getResponePopup } from "../../../../utils/reusable";

const EmrFhir = ({
  data,
  getFhirInstructionDetails,
  getFhirConnectDetails,
  connectStatus,
  fhirAllList,
  getFhirList,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [emrUrl, setEmrUrl] = useState("");
  const [isConnectNext, setIsConnectNext] = useState(false);
  const [isSelectEMR, setIsSelectEMR] = useState();
  const [inputValues, setInputValues] = useState(null);
  const [connectBtn, setConnectBtn] = useState("NEXT");

  // const FihrList = useSelector(
  //   (state) => state?.tanantAdmin?.fihr_list?.fihr_list
  // );

  const FihrList = [
    {
      emr: "EPIC",
      status: fhirAllList?.data?.response?.find(
        (item) => item?.emrType === "EPIC"
      )?.isConnected,
    },
    {
      emr: "ATHENAHEALTH",
      status: fhirAllList?.data?.response?.find(
        (item) => item?.emrType === "ATHENAHEALTH"
      )?.isConnected,
    },
    {
      emr: "ECW",
      status: fhirAllList?.data?.response?.find(
        (item) => item?.emrType === "ECW"
      )?.isConnected,
    },
    {
      emr: "CERNER",
      status: fhirAllList?.data?.response?.find(
        (item) => item?.emrType === "CERNER"
      )?.isConnected,
    },
  ];

  const appType = [
    {
      label: "BACKEND",
      value: "BACKEND",
    },
  ];

  const accessType = [
    {
      label: "ONLINE",
      value: "ONLINE",
    },
    {
      label: "OFFLINE",
      value: "OFFLINE",
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
    if (isSelectEMR) {
      setConnectBtn("Loading...");
      var data = {
        appType: appType[0].value?.toUpperCase(),
        emrType: isSelectEMR.toUpperCase(),
        accessType: values?.accessType
          ? values?.accessType?.toUpperCase()
          : accessType[0].value?.toUpperCase(),
      };
      setInputValues(data);
      getFhirConnectDetails(
        appType[0].value.toUpperCase(),
        isSelectEMR.toUpperCase(),
        values?.accessType
          ? values?.accessType?.toUpperCase()
          : accessType[0].value?.toUpperCase()
      );
    } else {
      // if(!isSelectEMR){
      //   notification.warning({
      //     description: "Please select one fhir",
      //     duration: 1,
      //   });
      // }else if(!values?.appType){
      //   notification.warning({
      //     description: "Please select app type",
      //     duration: 1,
      //   });
      // }
    }
  };

  const fhirListOnclick = (value) => {
    setIsSelectEMR(value);
  };

  useEffect(() => {
    getFhirList();
    getFhirInstructionDetails();
    dispatch(getFihrList(router));
  }, []);

  useEffect(() => {
    setConnectBtn("NEXT");
    if (connectStatus?.data?.status == "SUCCESS") {
      notification.success({
        description: connectStatus?.data?.message,
        duration: 1,
      });
      setIsConnectNext(true);
    }
  }, [connectStatus]);

  // useEffect(() => {
  //   console.log(fhirAllList?.data?.response)
  //   fhirAllList?.data?.response.map((res, index) => {
  //     var foundItem = FihrList?.find(
  //       (x) => x.emr == res.emrType
  //     );
  //     if (foundItem) {
  //       foundItem.status = "connected";
  //     }

  //   });
  // }, [fhirAllList]);
  const selectedItem = fhirAllList?.data?.response?.find(
    (item) => item?.emrType === isSelectEMR
  );
  useEffect(() => {
    form.setFieldsValue({
      accessType: selectedItem?.access || null,
    });
  }, [selectedItem, form]);
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
                  item.status
                    ? `p-1 px-3 d-inline-block m-2 rounded-3 cr-pointer ${Style.borderStyleConnect}`
                    : `p-1 px-3 d-inline-block m-2 rounded-3 cr-pointer ${Style.borderStyleDisConnect}`
                }
                onClick={() => {
                  fhirListOnclick(item.emr);
                }}
                style={{
                  background: `${
                    item.status || isSelectEMR == item.emr ? "#efefef" : ""
                  }`,
                  cursor: `${item.status ? "no-drop" : ""}`,
                }}
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
                    {item.emr == "EPIC" ? (
                      <Image src={Epic} width={100} alt="epic" />
                    ) : item.emr == "ATHENAHEALTH" ? (
                      <Image src={Athena} width={100} alt="Athena" />
                    ) : item.emr == "ECW" ? (
                      <Image src={EClinical} width={100} alt="EClinical" />
                    ) : item.emr == "CERNER" ? (
                      <Image src={Cerner} width={100} alt="Cerner" />
                    ) : null}
                  </div>
                  <div className="my-1">
                    <span
                      className={Style.flagDot}
                      style={{
                        backgroundColor: `${
                          !item.status ? "#C70000" : "#389e0d"
                        }`,
                      }}
                    ></span>
                    <span>
                      {isSelectEMR == item.emr
                        ? "selected "
                        : item.status === true
                        ? "connected"
                        : "disconnected"}
                    </span>
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
              <div className="p-3" style={{ height: "180px" }}>
                <div className="d-flex justify-content-between mt-4">
                  <div>
                    <div className={Style.heading}>App Type</div>
                    <span>
                      An app type refers to the category or function of a web
                      application
                    </span>
                  </div>
                  <div>
                    <Form.Item name={"appType"}>
                      <Select
                        placeholder="App Type"
                        options={appType}
                        className={Style.selector}
                        defaultValue={appType[0]}
                        allowClear
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <div>
                    <div className={Style.heading}>Access Type</div>
                    <span>
                      An access type refers to the category or function of a web
                      application
                    </span>
                  </div>
                  {/* <div> */}
                  <Form.Item name="accessType">
                    <Select
                      placeholder="Access Type"
                      options={accessType}
                      className={Style.selector}
                      allowClear
                    />
                  </Form.Item>
                  {/* </div> */}
                </div>
              </div>
              <div className="d-flex justify-content-center p-3">
                <Form.Item>
                  <Button
                    htmlType="submit"
                    type="primary"
                    className={ButtonStyles?.btnColor}
                    style={{ height: "45px", width: "100px" }}
                    // onClick={handleSubmit}
                  >
                    {connectBtn}
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
          <Notes />
        </>
      ) : (
        <ConnectStep
          setIsConnectNext={setIsConnectNext}
          filedInputValues={inputValues}
        />
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

const enhancer = connect(
  (state) => ({
    data: state?.tenantAdmin?.settings?.fhirInstructions,
    connectStatus: state?.tenantAdmin?.settings?.fhirConnectStatus,
    fhirAllList: state?.tenantAdmin?.settings?.fhirList,
  }),
  {
    getFhirInstructionDetails: settingActions.fhirInstructionsAction,
    getFhirConnectDetails: settingActions.fhirConnectAction,
    getFhirList: settingActions.fhirListAction,
  }
);
export default enhancer(EmrFhir);
