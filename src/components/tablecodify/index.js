import React from 'react'
import {  Table } from 'antd';


const Tables = (props) => {
   const {data,columns}=props
  return (
    <div>
      <Table  className ={style.table}columns={columns} dataSource={data} size="middle" />
    </div>
  )
}

export default Tables