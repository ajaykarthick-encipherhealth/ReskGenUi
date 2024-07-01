import React from "react";
import styles from "../styles.module.css";
import CodesGraph from "../components/codeGraph";

const index = () => {
  const cardData = [
    {
      id: 1,
      title: "Radiology",
      count: "12434",
      color: "#F8D3E9",
    },
    {
      id: 2,
      title: "lab",
      count: "62345",
      color: "#D0E0FB",
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-between">
        <div className={styles.header} style={{ width: "50%" }}>
          <div
            className="d-flex justify-content-between"
            style={{ width: "100%" }}
          >
            {cardData?.map((item, index) => (
              <div
                className="rounded-lg w-30"
                style={{
                  backgroundColor: item?.color,
                  width: "48%",
                  height: "100px",
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                  alignItems: "center",
                  borderRadius: "10px",
                }}
              >
                <div>
                  <div className="d-flex justify-content-center">
                    {item?.title}
                  </div>
                  <div className={styles.count}>{item?.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className={styles.header}>Overall Count</div>
          <div className={styles.price}>3000</div>
        </div>
      </div>

      <CodesGraph
        borderColor={"#B51B75"}
        borderColor2={"#0E46A3"}
        isTwoWaves={true}
      />
    </>
  );
};

export default index;
