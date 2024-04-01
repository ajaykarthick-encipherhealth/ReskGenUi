import React from "react";
import Image from "next/image";
import { Spin } from "antd";
import styles from "./styles.module.css";
import spinSTYles from "../../../../styles/auth.module.css";
import Card from "../../../../components/card";

const TopCards = ({ CardData, width, loading }) => {
  return (
    <div className={width ? styles.RowCon1 : styles.RowCon}>
      {CardData?.map((info) => (
        <Card
          bg={info?.bg}
          borderRadius="10px"
          width={width ? width : "24%"}
          height="300px"
          placeItems="center"
          display="flex"
        >
          {loading && !info ? (
            <div className={spinSTYles.spinStyle}>
              <Spin loading={loading} />
            </div>
          ) : (
            <div className={styles.innerdiv}>
              <div className={styles.IconDIv}>
                <Image src={info?.icon} alt="noimg" />
              </div>
              <span className={styles.title}>{info?.title}</span>
              <span className={styles.count}>{info?.cotunt}</span>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default TopCards;
