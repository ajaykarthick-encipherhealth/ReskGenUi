import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "../../styles.module.css";

const Index = ({ title, minimize, setMinimize }) => {
  return (
    <>
      <section
        className="d-flex justify-content-between align-items-center"
        style={{ width: "97%", margin: "auto" }}
      >
        <div className={`${styles.header}`}>{title}</div>
        <div id={title} name={title}
          className={`cursor-pointer ${styles.toggleButton}`}
          onClick={() => {
            setMinimize(!minimize);
          }}
        >
          {minimize ? (
            <FontAwesomeIcon icon={faAngleUp} />
          ) : (
            <FontAwesomeIcon icon={faAngleDown} />
          )}
        </div>
      </section>
      {!minimize && <hr className="mt-2"/>}
    </>
  );
};

export default Index;
