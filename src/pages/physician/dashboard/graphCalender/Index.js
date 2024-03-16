import React from 'react'
import styles from './styles.module.css'
import GraphData from './GraphData'
import Calender from './Calender'

const GraphCalender = () => {
  return (
    <div className={styles.wrapper}>
        <div className={styles.graph}><GraphData/></div>
        <div className={styles.calender}><Calender/></div>
    </div>
  )
}

export default GraphCalender