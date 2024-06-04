import React, { useEffect, useState, useRef } from "react";
import style from "./style.module.css";
import { Empty, Tree } from "antd";
import { Spin } from "antd";

const Codes = ({ data, loading }) => {
  const topRef = useRef(null);
  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: "smooth", top:25 });
  };
  const handleExpand = (expandedKeys, { node }) => {
   
    const nodeElement = document.querySelector(`[title="${node.title}"]`);
    if (nodeElement) {
      const parentElement = treeRef.current;
     
      const offsetTop = nodeElement.offsetTop;
    
      parentElement.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  }

  return (
    <>
      <div className="d-flex justify-content-center">
        {loading && <Spin size="large" />}
      </div>
      <div className="mt-3 antdstyle" ref={topRef} > 
        <Tree
        // onSelect={scrollToTop}
        // onClick={scrollToTop}
          showLine={true}
          onExpand={handleExpand}
          defaultExpandedKeys={["0-0-0"]}
          treeData={data}
          showIcon={true}
        />
      </div>
    </>
  );
};

export default Codes;
