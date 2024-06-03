import React, { useEffect, useState,useRef } from "react";
import style from "./style.module.css";
import { Empty, Tree } from "antd";
import { Spin } from "antd";

const Codes = ({ data, loading }) => {

  const topOfPageRef = useRef(null);

  const scrollToTop = () => {
    if (topOfPageRef.current) {
      topOfPageRef.current.scrollIntoView({  top: 0,
        left: 0,behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToTop(); 
  }, [data]);
  return (
    <>
      <div ref={topOfPageRef} />
      <div className="d-flex justify-content-center">
        {loading && <Spin size="large" />}
      </div>
      <div className="mt-3 antdstyle">
      {data.length > 0 ? (
          <Tree
            showLine={true}
            defaultExpandedKeys={["0-0-0"]}
            treeData={data}
            showIcon={true}
          />
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
};

export default Codes;
