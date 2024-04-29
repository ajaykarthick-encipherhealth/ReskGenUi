import React from "react";
import Style from "./style.module.css";

const RegularButton = ({ type, name, onClick, width, method,loading }) => {
  return (
    <button
      className={`btn mx-1 ${
        type === "outline" ? Style.outer : Style.btnColor
      }`}
      
      onClick={onClick}
      style={{ width: width }}
      type={method == "reset" ? "reset" : "submit"}
    >
      {loading?"loading":name}
    </button>
  );
};

export default RegularButton;
