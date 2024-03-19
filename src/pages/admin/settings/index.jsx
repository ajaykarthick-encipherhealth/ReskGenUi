import React from "react";
import Header from "../../../jsx/layouts/nav/Header";
import Card from "../../../components/card";
import Style from "./style.module.css";
import { DatePicker, Input } from "antd";
import { disablePastDate } from "../../../components/headerFilters/functions";
import RegularButton from "../../../components/button";
import RegularButtonWithIcon from "../../../components/buttonWithIcon";
import ConfigIcon from "../../../images/svg/settingsIcons/config"

const Settings = () => {
  const flags = [
    { id: 1, name: "PATIENT_DOB_MISSED", color: " #B2B377 " },
    { id: 1, name: "PATIENT_DOB_MISSED", color: "#F7D392" },
    { id: 1, name: "PATIENT_DOB_MISSED", color: "#F7D392" },
    { id: 1, name: "PATIENT_DOB_MISSED", color: "#F7D392" },
    { id: 1, name: "PATIENT_DOB_MISSED", color: "#F7D392" },
    { id: 1, name: "PATIENT_DOB_MISSED", color: "#F7D392" },
    { id: 1, name: "PATIENT_DOB_MISSED", color: "#F7D392" },
    { id: 1, name: "PATIENT_DOB_MISSED", color: "#F7D392" },
    { id: 1, name: "PATIENT_DOB_MISSED", color: "#F7D392" },
    { id: 1, name: "PATIENT_DOB_MISSED", color: "#F7D392" },
  ];

  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      <Header />
      <div className={Style.headerContainer}>
        <div className={`${Style.title} mb-2`}>Settings</div>
        <Card>
          <div className="row p-4">
            <div className="col-lg-2">
              <RegularButtonWithIcon
                name={"Configuration"}
                onClick={() => console.log("Save")}
                width={250}
                icon={<ConfigIcon width/>}
              />
            </div>
            <div className="col-lg-9 border rounded-3 mx-4 border-bottom-2">
              <div className=" p-3">
                <div className={Style.title}>Batch Configuration</div>
                <div className="d-flex justify-content-between mt-4">
                  <div>
                    <div className={Style.heading}>Hold count</div>
                    <div className={Style.subHeading}>
                      Upon reaching a maximum hold count of 4, conclude the
                      current chart and seamlessly transition to the next
                    </div>
                  </div>
                  <div>
                    <Input
                      type="number"
                      size="large"
                      placeholder="Hold Count"
                      style={{ width: "150px", fontSize: "14px" }}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-4">
                  <div>
                    <div className={Style.heading}>Max allocation count</div>
                    <div className={Style.subHeading}>
                      Allocate a maximum of 1000 charts for a single day
                    </div>
                  </div>
                  <div>
                    <Input
                      type="number"
                      size="large"
                      placeholder="Max Count"
                      style={{ width: "150px", fontSize: "14px" }}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-4">
                  <div>
                    <div className={Style.heading}>Max pending count</div>
                    <div className={Style.subHeading}>
                      The maximum number of pending chart counts for a single
                      day is 20
                    </div>
                  </div>
                  <div>
                    <Input
                      type="number"
                      size="large"
                      placeholder="Max Count"
                      style={{ width: "150px", fontSize: "14px" }}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-4">
                  <div>
                    <div className={Style.heading}>
                      Prioritize chart based on
                    </div>
                    <div className={Style.subHeading}>
                      Chart priority is determined by due date or RAF score
                    </div>
                  </div>
                  <div>
                    <DatePicker
                      style={{
                        width: "150px",
                        marginLeft: "5px",
                        border: "1px solid #d2d2d2",
                        boxShadow: "none",
                      }}
                      onChange={(date, dateS) => {
                        // if (dateS) {
                        //   setAllocateDate(dateS);
                        // } else {
                        //   setAllocateDate("");
                        // }
                      }}
                      disabledDate={(current) => disablePastDate(current)}
                    />
                  </div>
                </div>
              </div>
              <hr></hr>
              <div className="p-3">
                <div className="d-flex justify-content-between">
                  <div className={Style.title}>Batch Configuration</div>
                  <div className="d-flex mb-3">
                    <div className="input-group">
                      <label
                        className="border px-2 rounded-start"
                        id="button-addon1"
                        style={{ padding: "11px 0" }}
                      >
                        <span
                          className={Style.flagDots}
                          style={{ backgroundColor: `#874242` }}
                        ></span>
                      </label>
                      <input
                        type="text"
                        className="border px-2"
                        placeholder=""
                        aria-label="Example text with button addon"
                        aria-describedby="button-addon1"
                        style={{
                          height: "45px",
                          borderRadius: 0,
                          width: "250px",
                        }}
                      />
                    </div>
                    <RegularButton
                      name={"Save"}
                      onClick={() => console.log("Save")}
                    />
                  </div>
                </div>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="inlineRadioOptions"
                      id="inlineRadio1"
                      value="option1"
                    />
                    <label className="form-check-label" for="inlineRadio1">
                      All
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="inlineRadioOptions"
                      id="inlineRadio2"
                      value="option2"
                    />
                    <label className="form-check-label" for="inlineRadio2">
                      Recently Added
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="inlineRadioOptions"
                      id="inlineRadio3"
                      value="option3"
                    />
                    <label className="form-check-label" for="inlineRadio3">
                      Deleted Flag
                    </label>
                  </div>
                </div>
                <div>
                  {flags.map((item) => (
                    <div
                      className={`p-1 px-3 d-inline-block m-2`}
                      style={{ border: `1px solid ${item.color}` }}
                    >
                      <span
                        className={Style.flagDot}
                        style={{ backgroundColor: `${item.color}` }}
                      ></span>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
                <div className="text-end mt-5">
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
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
