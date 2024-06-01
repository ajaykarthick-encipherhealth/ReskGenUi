import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import { Empty, Tree } from "antd";
import { Spin } from "antd";

const Codes = ({ data, loading}) => {
  const onSelect = (selectedKeys, info) => {}; //Future use

  return (
    <>
      <div className="d-flex gap-1 mt-3"></div>
      <div className="d-flex justify-content-center">
        {loading && <Spin size="large" />}
      </div>
      <div className="mt-3 antdstyle">
        <Tree
          showLine={true}
          defaultExpandedKeys={["0-0-0"]}
          onSelect={onSelect}
          treeData={data}
          showIcon={true}
        />
      </div>
    </>
  );
};

export default Codes;
