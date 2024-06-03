import React from "react";
import Style from "./style.module.css";

const RegularButton = ({ type, name, onClick, width, method,loading, disabled,htmlType }) => {
  console.log(htmlType)
  return (
    <button
      className={`btn mx-1 ${
        type === "outline" ? Style.outer : Style.btnColor
      }`}
      name={name?.toLowerCase()}
      onClick={!htmlType && onClick}
      style={{ width: width }}
      type={method == "reset" ? "reset" : "submit"}
      disabled={disabled}
      htmlType={htmlType && htmlType}
    >
      {loading?"Loading...":name}
    </button>
  );
};

export default RegularButton;
