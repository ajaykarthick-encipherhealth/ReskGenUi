import React from "react";
import fileIcon from "../../../../images/tenantAdmin/file.svg";
import dosIcon from "../../../../images/tenantAdmin/dos.svg";
import pageIcon from "../../../../images/tenantAdmin/page.svg";
import Image from "next/image";
import styles from '../styles.module.css'

const index = () => {
  const cardData = [
    {
      id: 1,
      title: "File Count",
      count: "12434",
      icon: fileIcon,
    },
    {
      id: 2,
      title: "DOS Count",
      count: "62345",
      icon: dosIcon,
    },
    {
      id: 2,
      title: "Pages",
      count: "646788",
      icon: pageIcon,
    },
  ];
  return (
    <div className="d-flex justify-content-between w-100" style={{width:"100%"}} >
      {cardData?.map((item,index) => (
        <div className='rounded-lg w-30'style={{backgroundColor:index===0?"#FDF1F2":index===1?"#FDF8F2":"#F0FFF7",width:"30%",
            height:'200px',display:"flex",justifyContent:"center",
            textAlign:"center",alignItems:"center"
        }}>
           <div>
           <div className="d-flex justify-content-center">
                <Image src={item?.icon}/> &nbsp;
                {item?.title}
            </div>
            <div className={styles.count}>{item?.count}</div>
            </div>
        </div>
      ))}
    </div>
  );
};

export default index;
