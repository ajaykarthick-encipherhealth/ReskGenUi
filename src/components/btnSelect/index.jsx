import React from "react";
import Style from "./style.module.css";

const SelectButton = ({ select, setSelect, completed }) => {
  const list = ["M", "E", "A", "T"];

  return (
    <div className="d-flex my-2">
      <span className={`d-inline-block ${Style.containerBtn}`}>
        {list.map((i) => (
          <div
            key={i}
            className={`d-inline-block p-2 px-4 ${Style.btns} ${
              completed.includes(i)
                ? ` ${Style.textColor} `
                : select === i
                ? `${Style.btnColor} ${Style.active}`
                : ""
            }`}
            onClick={() => setSelect(i)}
          >
            {i}
          </div>
        ))}
      </span>
    </div>
  );
};

export default SelectButton;
