import React, { useEffect } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { DashbaoudContent } from "../../../services/physicianService/DashbaordServices";
import patients from "../../../images/physician/patients.svg";
import completed from "../../../images/physician/completed.svg";
import upcoming from "../../../images/physician/upcoming.svg";
import disease from "../../../images/physician/disease.svg";
import raf from "../../../images/physician/raf.svg";
import cont1 from "../../../images/physician/cont1.svg";
import cont2 from "../../../images/physician/cont2.svg";
import cont3 from "../../../images/physician/cont3.svg";
import cont4 from "../../../images/physician/cont4.svg";
import cont5 from "../../../images/physician/cont5.svg";
import cont6 from "../../../images/physician/cont6.svg";
import GraphCalender from "./graphCalender/Index";
import TopCards from "./topcards/Index";
import DataCards from "./dataCards/DataCards";

export function formatCount(count) {
  if (count >= 1000) {
    const roundedCount = count / 1000 + "K";
    return roundedCount;
  }

  return count;
}
const Index = () => {
  const dispatch = useDispatch();
  const cardInfo = useSelector((state) => state?.physicianDashbaord?.data);
  useEffect(() => {
    dispatch(DashbaoudContent());
  }, []);
  const CardData = [
    {
      id: 1,
      icon: patients,
      title: "Patient visit today",
      cotunt: formatCount(cardInfo?.data?.response?.patientVisitToday),
      bg: "linear-gradient(to right, rgba(34, 211, 238, 1), rgba(152, 227, 240, 1))",
    },
    {
      id: 2,
      icon: completed,
      title: "Total completed patients",
      cotunt: formatCount(cardInfo?.data?.response?.totalCompletedPatients),
      bg: "linear-gradient(to right, rgba(167, 139, 250, 1), rgba(211, 206, 228, 1))",
    },
    {
      id: 3,
      icon: upcoming,
      title: "Upcoming patients count",
      cotunt: formatCount(cardInfo?.data?.response?.upcomingPatientsCount),
      bg: "linear-gradient(to right, rgba(93, 135, 255, 1), rgba(199, 208, 235, 1))",
    },
    {
      id: 4,
      icon: raf,
      title: "Highest RAF score",
      cotunt: formatCount(cardInfo?.data?.response?.HighestRafScore),
      bg: "linear-gradient(to right, rgba(255, 174, 31, 1), rgba(242, 207, 146, 1))",
    },
    {
      id: 5,
      icon: disease,
      title: "Total disease found",
      cotunt: formatCount(cardInfo?.data?.response?.totalDiseaseFound),
      bg: "linear-gradient(to right, rgba(232, 121, 249, 1), rgba(211, 176, 217, 1))",
    },
  ];

  const allotIcon = (index) => {
    switch (index + 2) {
      case 2: {
        return cont2;
      }
      case 3: {
        return cont3;
      }
      case 4: {
        return cont4;
      }
      case 5: {
        return cont5;
      }
      case 6: {
        return cont6;
      }
      default:
        break;
    }
  };

  const top5Conditions = cardInfo?.data?.response?.top5Conditions ?? [];

  const totalCount =
    top5Conditions.length > 0
      ? top5Conditions.reduce((sum, item) => {
          return sum + parseInt(item?.count?.replace(/,/g, ""), 10);
        }, 0)
      : 0;

  const finalData = [
    {
      id: 1,
      title: "Top 5 Condition",
      subTitle: "",
      count: formatCount(totalCount),
      icon: cont1,
    },
    ...(top5Conditions.length > 0
      ? top5Conditions.map((item, index) => ({
          id: index + 2,
          title: item?.title,
          subTitle: item?.description,
          count: item?.count && formatCount(item?.count?.replace(/,/g, "")),
          icon: allotIcon(index),
        }))
      : []),
  ];

  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      <Header />
      <div className={styles.maincontainer}>
        <TopCards
          CardData={CardData?.slice(0, 4)}
          loading={cardInfo?.loading}
        />
        <DataCards
          cardDataInfo={CardData.slice(-1)}
          loading={cardInfo?.loading}
          DivData={finalData}
        />
        <GraphCalender />
      </div>
    </div>
  );
};

export default Index;
