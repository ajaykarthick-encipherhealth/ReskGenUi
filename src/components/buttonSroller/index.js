import React from "react";
import styles from "./styles.module.css";

const Buttonscroller = ({
  Buttons,
  activeButton,
  handleButtonClick,
  activeColor,
  inActiveColor,
  activeBg,
  inActiveBg,
  containerBg,
}) => {
  return (
    <div
      className={styles.btnContainer}
      style={{
        backgroundColor: containerBg,
      }}
    >
      {Buttons?.map((btn, index) => {
        return (
          <label
            key={index}
            className={`${
              activeButton === index ? styles.btnActive : styles.btnInactive
            }`}
            style={{
              backgroundColor: activeButton === index ? activeBg : inActiveBg,
              color: activeButton === index ? activeColor : inActiveColor,
              borderRadius: activeButton === index && "16px",
            }}
            onClick={() => handleButtonClick(index, btn?.title)}
          >
            {btn.title}
          </label>
        );
      })}
    </div>
  );
};

export default Buttonscroller;
