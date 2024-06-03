import React, { useEffect, useState, useRef } from "react";
import style from "./style.module.css";
import { Empty, Tree } from "antd";
import { Spin } from "antd";

const Codes = ({ data, loading }) => {
  const topRef = useRef(null);
  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: "smooth", bottom:0 });
  };

  return (
    <>
      <div ref={topRef} />
      <div className="d-flex justify-content-center">
        {loading && <Spin size="large" />}
      </div>
      <div className="mt-3 antdstyle" > 
        <Tree
        onClick={scrollToTop}
          showLine={true}
          defaultExpandedKeys={["0-0-0"]}
          treeData={data}
          showIcon={true}
        />
      </div>
    </>
  );
};

export default Codes;
