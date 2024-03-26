import React from "react";
import styles from "./styles.module.css";

const Legends = ({ bullets, display, padding }) => {
  return (
    <div className={styles.container} style={{ display: display }}>
      {bullets?.map((item) => (
        <>
          {item.title && <span className={styles.header}>{item?.title}</span>}
          {item?.option ? (
            item?.option?.map((info) => (
              <div className={styles.bulletsData} style={{ padding: padding }}>
                <div
                  className={styles.bgColor}
                  style={{
                    backgroundColor: info.color,
                  }}
                ></div>
                {info.name}
              </div>
            ))
          ) : (
            <div className={styles.bulletsData} style={{ padding: padding }}>
              <div
                className={styles.bgColor}
                style={{
                  backgroundColor: item.color,
                }}
              ></div>
              {item.name}
            </div>
          )}
        </>
      ))}
    </div>
  );
};

export default Legends;
