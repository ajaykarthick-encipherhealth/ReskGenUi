import React from "react";
import styles from "./styles.module.css";
import Card from "../../../../components/card";
import Image from "next/image";

const TopCards = ({CardData,width}) => {
  return (
    <div className={width?styles.RowCon1:styles.RowCon}>
      {CardData?.map((info) => (
        <Card
          bg={info?.bg}
          borderRadius="10px"
          width={width?width:"24%"}
          height="300px"
          placeItems="center"
          display="flex"
        >
          <div className={styles.innerdiv}>
            <div className={styles.IconDIv}>
              <Image src={info?.icon} alt="noimg" />
            </div>
            <span className={styles.title}>{info?.title}</span>
            <span className={styles.count}>{info.cotunt}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TopCards;
