import React from "react";
import styles from './styles.module.css'

const Legends = ({ bullets }) => {
  return (
    <div className={styles.container}>
      {bullets?.map((item) => (
        <div className={styles.bulletsData}>
          <div
            className={styles.bgColor}
            style={{
              backgroundColor: item.color,
            }}
          >
          </div>
            {item.name}
        </div>
      ))}
    </div>
  );
};

export default Legends;
