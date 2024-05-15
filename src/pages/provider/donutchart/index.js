import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Card from "../../../components/card";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";

const Donutchart = () => {
  const sdk = new ChartsEmbedSDK({
    baseUrl: "https://charts.mongodb.com/charts-project-1-hubxull",
    showAttribution: false,
  });
  const donutchart = sdk.createChart({
    chartId: "663b2626-195f-4db4-88ac-5908239efbb7",
  });

  useEffect(() => {
    donutchart.render(document.getElementById("donutchart"));
  }, []);

  return (
    <>
      <div className={styles.card6}>
        <Card borderRadius="30px" padding="0px">
          <div className={styles.buttonDiv}>
            <div className={styles.select}></div>
            <div
              id="donutchart"
              className="mt-3 p-4"
              style={{
                height: 350,
                width: 430,
              }}
            ></div>
            <div className={styles.header}></div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Donutchart;
