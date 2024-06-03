import React from "react";
import Image from "next/image";
function MiniCards({ backgroundColor, icon, title, charts, styles }) {
  return (
    // <Col
    //   span={5}
    //   style={{
    //     backgroundColor,
    //     height: "80px",
    //   }}
    //   className={styles.colData}
    // >
    //   <div
    //     className={` d-flex align-items-center justify-content-center ${styles.header}`}
    //   >
    //     <Image src={icon} className={`m-1 ${styles.Img}`} />
    //     <div className={`m-1 text-center ${styles.heading}`}>{title}</div>
    //   </div>

    //   <h4 style={{ textAlign: "center" }}>{charts ? charts : "0"}</h4>
    // </Col>

    <div className={`col-3`}>
      <div
        style={{
          backgroundColor: backgroundColor,
        }}
        className={styles.reportDiv}
      >
        <div className="d-flex">
          <Image src={icon} className={styles.Img} />
          <div className="px-2">{title}</div>
        </div>

        <div>
          <h4>{charts ? charts : "0"}</h4>
        </div>
      </div>
    </div>
  );
}

export default MiniCards;
