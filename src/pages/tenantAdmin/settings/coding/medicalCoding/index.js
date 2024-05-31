import React from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import { Switch } from "antd";

const MedicalCoding = () => {
  const data = [
    {
      id: 1,
      title: "Do you need an OIG code",
      status: "Enable",
    },
    {
      id: 2,
      title: "Do you need an RAF Calculation",
      status: "Disable",
    },
    {
      id: 3,
      title: "Do you need an Capture History Codes",
      status: "Enable",
    },
    {
      id: 4,
      title: "Do you need an Capture History Codes as ICD Codes",
      status: "Disable",
    },
    {
      id: 5,
      title: "Do you need an Slash Conditions Need to Capture",
      status: "Enable",
    },
    {
      id: 6,
      title: "Do you need an Calculate Combo Including Past Medical History",
      status: "Disable",
    },
    {
      id: 7,
      title: "Do you need an Capture Critical Conditions for Out patient",
      status: "Enable",
    },
    {
      id: 8,
      title: "Do you need an Down Code Conversion",
      status: "Disable",
    },
    {
      id: 9,
      title: "Do you need an Capture Insulin Medication as ICD Codes",
      status: "Enable",
    },
  ];
  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
  };
  return (
    <>
      <div className="p-3" style={{ height: "80vh" }}>
        <div className="d-flex justify-content-between">
          <div className={Style.title}>Medical Coding</div>
        </div>
        <div className="mt-4">
          {data?.map((item) => (
            <div className="d-flex justify-content-between mt-4">
              <div>{item?.title}</div>
              <div className="d-flex justify-content-between">
                <Switch
                  defaultChecked={item.status === "Enable" ? true : false}
                  className="switch"
                  onChange={onChange}
                />
                <div
                  className={`mx-2 text-${
                    item.status === "Enable" ? "info" : "danger"
                  }`}
                >
                  {item?.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-end p-3">
        <RegularButton
          type={"outline"}
          name={"Restore Changes"}
          onClick={() => console.log("Restore Changes")}
        />
        <RegularButton
          name={"Save Changes"}
          onClick={() => console.log("Save Changes")}
        />
      </div>
    </>
  );
};

export default MedicalCoding;
