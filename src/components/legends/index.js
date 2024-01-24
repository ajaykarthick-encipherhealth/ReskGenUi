import React from "react";
import styles from './styles.module.css'

const Legends = ({ bullets,display,padding }) => {
  return (
    <div className={styles.container} style={{display: display && "block"}}>
      {bullets?.map((item) => (
        <div className={styles.bulletsData} style={{padding:padding}}>
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
