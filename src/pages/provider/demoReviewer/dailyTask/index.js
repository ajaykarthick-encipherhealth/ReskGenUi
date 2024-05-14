import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Card from "../../../components/card";

import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import SupervisiorProducitivity from "../../provider/demoSupervisior/productivityStatus";


const DailyTask = () => {
 

  const sdk = new ChartsEmbedSDK({
    baseUrl: "https://charts.mongodb.com/charts-project-1-hubxull",
    showAttribution: false,
  });
  const dailyChart = sdk.createChart({
    chartId: "6638bab1-1e6e-4d79-8427-7066d94dbbc2",
  });

  useEffect(() => {
    dailyChart.render(document.getElementById("daily-chart"));
  }, []);

  return (
    <>
     <h4 className="mt-2">Daily Task  </h4>
      <div className={styles.card6}>
        <Card borderRadius="30px" padding="0px">
          <div className={styles.buttonDiv}>
            <div className={styles.select}>
           
            </div>
            <div
              id="daily-chart"
              className="mt-3 p-4"
              style={{
                height: 350,
                width: 430,
              }}
            ></div>
            <div className={styles.header}>
             </div>
          </div>
        </Card>
      </div>
     
    </>
  );
};

export default DailyTask;
