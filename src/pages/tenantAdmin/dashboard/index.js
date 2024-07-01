import React from "react";
import Header from "../../../jsx/layouts/nav/Header";
import styles from "./styles.module.css";
import Card from "../../../components/card";
import HeaderFilters from './headerFilters'
import TotalCounts from './totalcounts'
import RafAndRevenue from './rafAndRevenue'

const Index = () => {
  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      <Header />
      <div className={styles.maincontainer}>
        <div className={styles.rowCOntainer}>
           <HeaderFilters/>
          <div className={`row`}>
            <div className={`col-lg-4 ${styles.box}`}>
              <Card padding="10px"borderRadius={"10px"}>
                <TotalCounts/>
              </Card>
            </div>
            <div className={`col ${styles.box}`}>
              <Card padding="10px"borderRadius={"10px"}>
                <RafAndRevenue/>
              </Card>
            </div>
          </div>
          {/* total codes */}
          <div className={`row`}>
            <div className={`col ${styles.box}`}>
                <Card padding="10px" borderRadius={"10px"}>card1</Card>
            </div>
          </div>
          {/* hcc */}
          <div className={`row`}>
            <div className={`col ${styles.box}`}>
                <Card padding="10px"borderRadius={"10px"}>card1</Card>
            </div>
          </div>
          {/* car gaps */}
          <div className={`row`}>
            <div className={`col ${styles.box}`}>
                <Card padding="10px"borderRadius={"10px"}>card1</Card>
            </div>
          </div>
          {/* radiology */}
          <div className={`row`}>
            <div className={`col ${styles.box}`}>
                <Card padding="10px"borderRadius={"10px"}>card1</Card>
            </div>
            <div className={`col ${styles.box}`}>
                <Card padding="10px"borderRadius={"10px"}>card1</Card>
            </div>
          </div>
          {/* top 10 diseases */}
          <div className={`row`}>
            <div className={`col ${styles.box}`}>
                <Card padding="10px"borderRadius={"10px"}>card1</Card>
            </div>
            <div className={`col ${styles.box}`}>
                <Card padding="10px"borderRadius={"10px"}>card1</Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
