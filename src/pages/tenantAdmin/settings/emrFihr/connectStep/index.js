import React, { use, useEffect, useState } from "react";
import Style from "./../../style.module.css";
import { Button, Input, notification } from "antd";
import Image from "next/image";
import CopyImage from "../../../../../images/fihr/copy.png";
import ButtonStyles from "../../../../../components/button/style.module.css";
import Pending from "../../../../../images/trackingImages/PendingTrack.png";
import Completed from "../../../../../images/trackingImages/CompletedTrack.png";
import Swal from "sweetalert2";
import { handleCopyToClipboard } from "../../../../../components/commonFunctions";

const ConnectStep = ({setIsConnectNext}) => {
  const [inputValue, setInputValue] = useState("");
  const [inputValueOrg, setInputValueOrg] = useState("");
  const [isCompleted, setIsCompleted] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleInputChangeOrg = (e) => {
    setInputValueOrg(e.target.value);
  };
  const handleSubmit = async (values) => {
    console.log(values);
    notification.success({
      message: "Success",
      placement: "topRight",
      duration:1
    });
  };
  const handleSubmitConnect = async (values) => {
    console.log(values);
    Swal.fire({
      title: "Authorized",
      icon: "success",
      timer: 1000,
      showConfirmButton: false,
    }).then((result) => {
      if (result.isConfirmed) {
        
      }
    });
    setTimeout(() => {
      setIsConnectNext(false)
    }, 1000);

  };

  const handleSubmitCancel = async (values) => {
    setIsConnectNext(false)
  };

  return (
    <div className={` p-1 px-3  m-2  ${Style.stepsContainer}`}>
      <h5 className={Style.stepsTitle}>Follow this steps to Connect EMR</h5>
      <div className={Style.stpesTextContainer}>
        <span className={Style.stepsHeading}>Step 1:</span>
        <span className={Style.stepsDes}>
          {" "}
          Login to the eClinicalWorks EMR and locate the FHIR APIs option on the
          Product Activation window by clicking the Production Activation button
          from the Admin menu
        </span>
      </div>
      <div className={Style.stpesTextContainer}>
        <span className={Style.stepsHeading}>Step 2:</span>
        <span className={Style.stepsDes}>
          {" "}
          Navigate to the FHIR APIs dashboard by clicking the Settings button on
          the Product Activation window for the FHIR APIs option
        </span>
      </div>
      <div className={Style.stpesTextContainer}>
        <span className={Style.stepsHeading}>Step 3:</span>
        <span className={Style.stepsDes}>
          {" "}
          Navigate to the Provider Centric Apps or Backend/Bulk Access Apps
          dashboard by clicking the Set up button on the FHIR APIs dashboard
        </span>
      </div>
      <div className={Style.activationContainer}>
        <span className={Style.activationHeading}>Activation Code</span>
        <div
          style={{ width: "400px", marginLeft: "40px", marginRight: "15px" }}
        >
          <Input
            placeholder={"Activation Code"}
            onChange={handleInputChange}
            value={inputValue}
            style={{ padding: "22px" }}
          />
        </div>
        <div
          className="cr-pointer"
          style={{ marginTop: "7px" }}
          onClick={() =>
            handleCopyToClipboard({
              text: "123456",
              setCopied: setCopied,
            })
          }
        >
          <Image src={CopyImage} width={20} alt="epic" />
          <span className={Style.stepsHeading} style={{ marginLeft: "5px" }}>
            Copy
          </span>
        </div>
      </div>
      <div className={Style.stpesTextContainer}>
        <span className={Style.stepsHeading}>Step 4:</span>
        <span className={Style.stepsDes}>
          {" "}
          Add the App Activation Code shared by the app developers in the text
          box displayed on the Add New App tile and click on the Add button
        </span>
      </div>
      <div className={Style.activationContainer}>
        <span className={Style.activationHeading}>Organization Name</span>
        <div
          style={{ width: "400px", marginLeft: "15px", marginRight: "15px" }}
        >
          <Input
            placeholder={"Organization Name"}
            onChange={handleInputChangeOrg}
            value={inputValueOrg}
            style={{ padding: "22px" }}
          />
        </div>
      </div>

      <div className={Style.btnContainer}>
        <Button
          htmlType="submit"
          type="primary"
          className={ButtonStyles?.btnColor}
          style={{ height: "45px", width: "100px" }}
          onClick={handleSubmit}
        >
          SUBMIT
        </Button>
      </div>
      {!isCompleted ? (
        <div className={Style.statusContainer}>
          <span style={{ padding: "5px" }}>
            Your activation code is in the process of being activated, please
            wait.Status
          </span>
          <div className={Style.statusImg}>
            <Image
              src={Pending}
              width={20}
              alt="epic"
              style={{ marginRight: "5px" }}
            />
            <span style={{ color: "#0078D4" }}>Pending</span>
          </div>
          <div style={{ marginLeft: "10px" }}>
            <Button
              htmlType="submit"
              type="primary"
              className={Style?.cancelBtn}
              style={{ height: "35px", width: "100px" }}
              onClick={handleSubmit}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className={Style.statusContainer}>
          <span style={{ padding: "5px" }}>Your activation process is </span>
          <div className={Style.statusImgCompleted}>
            <Image
              src={Completed}
              width={20}
              alt="epic"
              style={{ marginRight: "5px" }}
            />
            <span style={{ color: "#009910" }}>Completed</span>
          </div>
          <span style={{ padding: "5px" }}>
            and the code is now active. Connect to EMR
          </span>

          <div style={{ marginLeft: "10px" }}>
            <Button
              htmlType="submit"
              type="primary"
              className={ButtonStyles?.btnColor}
              style={{ height: "35px", width: "100px" }}
              onClick={handleSubmitConnect}
            >
              Connect
            </Button>
          </div>
          <div style={{ marginLeft: "10px" }}>
            <Button
              htmlType="submit"
              type="primary"
              className={Style?.cancelBtn}
              style={{ height: "35px", width: "100px" }}
              onClick={handleSubmitCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectStep;
