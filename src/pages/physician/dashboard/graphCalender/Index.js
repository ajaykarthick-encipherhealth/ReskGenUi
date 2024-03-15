import React from 'react'
import styles from './styles.module.css'
import Graph from './Graph'
import Calender from './Calender'

const Index = () => {
  return (
    <div className={styles.wrapper}>
        <div className={styles.graph}><Graph/></div>
        <div className={styles.calender}><Calender/></div>
    </div>
  )
}

export default Index