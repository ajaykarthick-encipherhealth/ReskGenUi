import React from "react";
import Style from "./style.module.css";

const RegularButton = ({
  type,
  name,
  onClick,
  width,
  method,
  loading,
  disabled,
  htmlType,
  id,
  padding,
  
}) => {
  return (
    <button
      id={id}
      className={`btn mx-1 ${
        type === "outline" ? Style.outer : Style.btnColor
      }`}
      name={name}
      onClick={!htmlType && onClick}
      style={{ width: width, padding: padding }}
      type={
        method == "reset" ? "reset" : method == "button" ? "button" : "submit"
      }
      disabled={disabled}
      htmlType={htmlType}
    >
      {loading ? "LOADING..." : name}
    </button>
  );
};

export default RegularButton;
