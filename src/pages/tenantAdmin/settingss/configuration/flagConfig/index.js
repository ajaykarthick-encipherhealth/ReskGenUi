import React from 'react'
import Style from "./../../style.module.css";
import RegularButton from "../../../../../components/button";


const FlagConfig = () => {
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
    <>
     <div className="p-3" style={{height:"80vh"}}>
        <div className="d-flex justify-content-between">
          <div className={Style.title}>Flag Configuration</div>
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
            <RegularButton name={"Save"} onClick={() => console.log("Save")} />
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
  )
}

export default FlagConfig