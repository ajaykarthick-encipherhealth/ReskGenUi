import React, { useState } from "react";
import Header from "../../../jsx/layouts/nav/Header";
import styles from "./styles.module.css";
import Card from "../../../components/card";
import HeaderFilters from "./components/headerFilters";
import TotalCounts from "./default/totalcounts";
import RafAndRevenue from "./default/rafAndRevenue";
import HccCodes from "./default/hcc";
import CaregapCodes from "./default/caregaps";
import TotalCodes from "./default/totalcodes";
import RadiolodyAndLab from "./default/radiologyAndLab";
import Files from "./workFlow/files";
import Top10Diseases from "./default/top10Diseases";
import TopOIGCodes from "./default/topOIGCodes";
import WorkFlowFiles from './workFlow/files'
import Accuracy from "./workFlow/accuracy";

const Index = () => {
  const [activeBtn, setActiveBtn] = useState("default");
  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      <Header />
      <div className={styles.maincontainer}>
        <div className={styles.rowCOntainer}>
          <HeaderFilters activeBtn={activeBtn} setActiveBtn={setActiveBtn} />
          {activeBtn === "default" ? (
            <>
              <div className={`row ${styles.box}`}>
                <div className={`col-lg-4`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <TotalCounts />
                  </Card>
                </div>
                <div className={`col`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <RafAndRevenue />
                  </Card>
                </div>
              </div>
              {/* total codes */}
              <div className={`row`}>
                <div className={`col ${styles.box}`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <TotalCodes />
                  </Card>
                </div>
              </div>
              {/* hcc */}
              <div className={`row`}>
                <div className={`col ${styles.box}`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <HccCodes />
                  </Card>
                </div>
              </div>
              {/* car gaps */}
              <div className={`row`}>
                <div className={`col ${styles.box}`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <CaregapCodes />
                  </Card>
                </div>
              </div>
              {/* radiology */}
              <div className={`row ${styles.box}`}>
                <div className={`col-lg-4`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <RadiolodyAndLab />
                  </Card>
                </div>
                <div className={`col-lg-8`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <Files />
                  </Card>
                </div>
              </div>
              {/* top 10 diseases */}
              <div className={`row ${styles.box}`}>
                <div className={`col`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <Top10Diseases />
                  </Card>
                </div>
                <div className={`col`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <TopOIGCodes />
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={`row ${styles.box}`}>
                <div className={`col-lg-3`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    card1
                  </Card>
                </div>
                <div className={`col-lg-9`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <WorkFlowFiles/>
                  </Card>
                </div>
              </div>
              {/* total codes */}
              <div className={`row ${styles.box}`}>
                <div className={`col-lg-3`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    card3
                  </Card>
                </div>
                <div className={`col-lg-3`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    card3
                  </Card>
                </div>
                <div className={`col-lg-3`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    card3
                  </Card>
                </div>
                <div className={`col-lg-3`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    card3
                  </Card>
                </div>
              </div>
              {/* hcc */}
              <div className={`row`}>
                <div className={`col ${styles.box}`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <Accuracy/>
                  </Card>
                </div>
                <div className={`col-lg-3 ${styles.box}`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    card1
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
