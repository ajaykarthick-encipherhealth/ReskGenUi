import React from "react";
import fileIcon from "../../../../images/tenantAdmin/file.svg";
import dosIcon from "../../../../images/tenantAdmin/dos.svg";
import pageIcon from "../../../../images/tenantAdmin/page.svg";
import Image from "next/image";
import styles from "../styles.module.css";

const index = () => {
  const cardData = [
    {
      id: 1,
      title: "File/Patients Count",
      count: "12434",
      icon: fileIcon,
      iconBg: "#F9D2D4",
    },
    {
      id: 2,
      title: "DOS Count",
      count: "62345",
      icon: dosIcon,
      iconBg: "#F8E9D3",
    },
    {
      id: 2,
      title: "Pages",
      count: "646788",
      icon: pageIcon,
      iconBg: "#CCFFE5",
    },
  ];
  return (
    <div
      className="d-flex justify-content-between w-100"
      style={{ width: "100%" }}
    >
      {cardData?.map((item, index) => (
        <div
          className="rounded-lg"
          style={{
            backgroundColor:
              index === 0 ? "#FDF1F2" : index === 1 ? "#FDF8F2" : "#F0FFF7",
            width: "32%",
            height: "250px",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <div style={{ width: "90%" }}>
            <div className="d-flex justify-content-center">
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: item?.iconBg,
                  borderRadius: "10px",
                  margin: "0 5px 0 0",
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <Image src={item?.icon} />
              </div>
              <div style={{ fontSize: "16px"}}>
              {item?.title}
              </div>
            </div>
            <div className={styles.count}>{item?.count}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default index;
