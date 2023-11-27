import React from "react";
import styles from "./style.module.css";

const Buttonscroller = ({ Buttons, activeButton, handleButtonClick }) => {
  return (
    <div className={styles.buttonContainter}>
      {Buttons?.map((btn, index) => {
        return (
          <label
            key={index}
            className={`${
              activeButton === index ? styles.btnActive : styles.btnInactive
            }`}
            onClick={() => handleButtonClick(index,btn?.title)}
          >
            {btn.title}
          </label>
        );
      })}
    </div>
  );
};

export default Buttonscroller;
