import React from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";

const CriticalConditions = () => {
  return (
    <>
      <div className="p-3" style={{ height: "80vh" }}>
        <div className="d-flex justify-content-between">
          <div className={Style.title}>Critical Conditions</div>
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

export default CriticalConditions;
