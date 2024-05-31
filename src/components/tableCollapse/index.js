import React from "react";
import { Divider, Table } from "antd";

const TableCollapse = (props) => {
  const { data, columns } = props;
  return (
    <div>
      <Table columns={columns} dataSource={data} size="middle" />
    </div>
  );
};

export default TableCollapse;
