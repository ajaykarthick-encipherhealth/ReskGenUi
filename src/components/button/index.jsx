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
  height,
  icon, 
  iconPosition = "left", 
}) => {
  return (
    <button
      id={id}
      className={`btn mx-1 ${
        type === "outline" ? Style.outer : Style.btnColor
      } d-flex align-items-center justify-content-center`}
      name={name}
      onClick={!htmlType && onClick}
      style={{ width, padding, height }}
      type={
        method === "reset" ? "reset" : method === "button" ? "button" : "submit"
      }
      disabled={disabled}
    >
      {loading ? (
        "LOADING..."
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="me-2">{icon}</span>
          )}
          <span>{name}</span>
          {icon && iconPosition === "right" && (
            <span className="ms-2">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

export default RegularButton;
