import React from 'react';
import Header from "../../../jsx/layouts/nav/Header";
import styles from "./styles.module.css";


const Dashbaord = () => {
  return (
    <>
    <Header/>
    <div className={styles.container}>
    <div className={styles.header}>Dashbaord</div>
   </div>
    </>
  )
}

export default Dashbaord