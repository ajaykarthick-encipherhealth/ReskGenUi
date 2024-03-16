import React from "react";
import Header from "../../../jsx/layouts/nav/Header";
import styles from "./styles.module.css";
import TopCards from "./topcards/Index";
import DataCards from "./dataCards/DataCards";
import patients from "../../../images/physician/patients.svg";
import completed from "../../../images/physician/completed.svg";
import upcoming from "../../../images/physician/upcoming.svg";
import raf from "../../../images/physician/raf.svg";
import GraphCalender from "./graphCalender/Index";

const CardData = [
  {
    id: 1,
    icon: patients,
    title: "Patient visit today",
    cotunt: "200",
    bg: "linear-gradient(to right, rgba(34, 211, 238, 1), rgba(152, 227, 240, 1))",
  },
  {
    id: 2,
    icon: completed,
    title: "Total completed patients",
    cotunt: "150",
    bg: "linear-gradient(to right, rgba(167, 139, 250, 1), rgba(211, 206, 228, 1))",
  },
  {
    id: 3,
    icon: upcoming,
    title: "Upcoming patients count",
    cotunt: "40",
    bg: "linear-gradient(to right, rgba(93, 135, 255, 1), rgba(199, 208, 235, 1))",
  },
  {
    id: 4,
    icon: raf,
    title: "Highest RAF score",
    cotunt: "1.76",
    bg: "linear-gradient(to right, rgba(255, 174, 31, 1), rgba(242, 207, 146, 1))",
  },
];

const index = () => {
  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      <Header />
      <div className={styles.maincontainer}>
        <TopCards CardData={CardData} />
        <DataCards />
        <GraphCalender/>
      </div>
    </div>
  );
};

export default index;
