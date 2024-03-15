import React from "react";
import Header from "../../../jsx/layouts/nav/Header";
import { Row } from "antd";
import styles from './styles.module.css'

const index = () => {
  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      <Header />
      <div className={styles.maincontainer}>
        <div className={styles.rowCOntainer}>
          <Row className={styles.RowCon}>inn</Row>
        </div>
      </div>
    </div>
  );
};

export default index;
