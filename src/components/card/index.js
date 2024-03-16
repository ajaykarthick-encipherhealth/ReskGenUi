import React from "react";
import styles from "./style.module.css";
const Card = ({
  children,
  Bgcolor = "#fff",
  padding,
  borderRadius,
  width,
  height,
  bg,
  display,
  placeItems,
}) => {
  const cardStyle = {
    // backgroundColor: Bgcolor,
    background: bg ? bg : Bgcolor,
    padding: padding ? padding : "5px",
    borderRadius: borderRadius ? borderRadius : "16px",
    width: width && width,
    height: height && height,
    display: display && display,
    placeItems: placeItems && placeItems,
  };
  return (
    <div className={styles.card} style={cardStyle}>
      {children}
    </div>
  );
};

export default Card;
