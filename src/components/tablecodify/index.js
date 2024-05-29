import React from 'react'
import {  Table } from 'antd';


const Tables = (props) => {
   const {data,columns}=props
  return (
    <div>
      <Table columns={columns} dataSource={data} size="middle" />
    </div>
  )
}

export default Tables