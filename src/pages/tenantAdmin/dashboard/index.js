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
import WorkFlowFiles from "./workFlow/files";
import Accuracy from "./workFlow/accuracy";
import Notifications from "./workFlow/notifications";
import PieChartInfo from "./components/pieChart";
import HeadTitle from "../../../components/headtitle";
import OrgPieChartInfo from "./components/OrgPieChart";

const Index = () => {
  const [activeBtn, setActiveBtn] = useState("workflow");
  const allocatedData=[
    { value: 1048, name: "Allocated",itemStyle:{color:"#3276CD"} },
    { value: 735, name: "Not Allocated",itemStyle:{color:"#AF47D2"} },

  ]
  const reviewerData=[
    { value: 1048, name: "Completed",itemStyle:{color:"#00BC13"} },
    { value: 735, name: "Pending",itemStyle:{color:"#2EA4FF"} },
    { value: 735, name: "Hold",itemStyle:{color:"#3C0AD2"} },
    { value: 735, name: "Declined",itemStyle:{color:"#EB5252"} },
  ]
  const auditorData=[
    { value: 1048, name: "Audit Completed",itemStyle:{color:"#4AA1AB"} },
    { value: 735, name: "Audit Pending",itemStyle:{color:"#BD3A79"} },
    { value: 735, name: "Audit Hold",itemStyle:{color:"#EBAE00"} },
    { value: 735, name: "Audit Declined",itemStyle:{color:"#C21807"} },
  ]
  const usersData=[
    { value: 1048, name: "Reviewer",itemStyle:{color:"#2196F3"} },
    { value: 735, name: "Supervisor",itemStyle:{color:"#805DCA"} },
    { value: 735, name: "Admin",itemStyle:{color:"#4361EE"} },
  ]
  const orgData=[
    { value: 1048, name: "Organization 1",itemStyle:{color:"#757FEF"} },
    { value: 735, name: "Organization 2",itemStyle:{color:"#805DCA"} },
    { value: 735, name: "Organization 3",itemStyle:{color:"#4361EE"} },
  ]
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
                  <HeadTitle header="Organizations" fontSize="16px" />
                  <OrgPieChartInfo data={orgData} header="Allocated" />
                  </Card>
                </div>
                <div className={`col-lg-9`}>
                  <Card padding="10px" borderRadius={"10px"}>
                  <HeadTitle header="Files" fontSize="16px" />
                    <WorkFlowFiles />
                  </Card>
                </div>
              </div>
              {/* total codes */}
              <div className={`row ${styles.box}`}>
                <div className={`col-lg-3`}>
                  <Card padding="10px" borderRadius={"10px"}  height="auto">
                    <HeadTitle header="Allocated Status" fontSize="16px" />
                    <PieChartInfo data={allocatedData} header="Allocated" />
                  </Card>
                </div>
                <div className={`col-lg-3`}>
                  <Card padding="10px" borderRadius={"10px"}  height="auto">
                    <HeadTitle header="Reviewer Status" fontSize="16px" />
                    <PieChartInfo  data={reviewerData}  header="Reviewer"/>
                  </Card>
                </div>
                <div className={`col-lg-3`}>
                  <Card padding="10px" borderRadius={"10px"} height="auto">
                    <HeadTitle header="Auditor Status" fontSize="16px" />
                    <PieChartInfo  data={auditorData}  header="Auditor"/>
                  </Card>
                </div>
                <div className={`col-lg-3`}>
                  <Card padding="10px" borderRadius={"10px"}  height="auto">
                    <HeadTitle header="Users" fontSize="16px" />
                    <PieChartInfo  data={usersData} header="Users"/>
                  </Card>
                </div>
              </div>
              {/* hcc */}
              <div className={`row`}>
                <div className={`col ${styles.box}`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <Accuracy />
                  </Card>
                </div>
                <div className={`col-lg-3 ${styles.box}`}>
                  <Card padding="10px" borderRadius={"10px"}>
                    <Notifications />
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
