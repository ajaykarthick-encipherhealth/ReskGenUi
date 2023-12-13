import React from "react";
import styles from "./style.module.css";
const Card = ({
  children,
  Bgcolor = "#fff",
  padding,
  borderRadius
}) => {
  const cardStyle = {
    backgroundColor: Bgcolor,
    padding: padding ? padding : "5px",
    borderRadius: borderRadius ? borderRadius : "16px",
  };
  return (
    <div className={styles.card} style={cardStyle}>
      {children}
    </div>
  );
};

export default Card;
