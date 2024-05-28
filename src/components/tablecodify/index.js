import React from 'react'
import { Divider, Table } from 'antd';
import style from './style.module.css'

const Tables = (props) => {
   const {data,columns}=props
  return (
    <div>
      <Table  className ={style.table}columns={columns} dataSource={data} size="middle" />
    </div>
  )
}

export default Tables