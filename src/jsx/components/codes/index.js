import React from "react";
import { Empty, Tree } from "antd";
import { Spin } from "antd";
import { useRef } from "react";

const Codes = ({ data, loading, onSelect, onExpand, expandedKeys }) => {
  const topRef = useRef(null);

  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: "smooth", top: 25 });
  };
console.log(loading,"loading")
  return (
    <>
      <div className="d-flex justify-content-center">
        {loading && <Spin size="large" />}
      </div>
      <div className="mt-3 antdstyle" ref={topRef}>
        <Tree
          ref={topRef}
          showLine={true}
          defaultExpandedKeys={[name]}
          treeData={data}
          showIcon={true}
          onSelect={(value) => {
            onSelect(value);
          }}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          onClick={scrollToTop}
        />
      </div>
    </>
  );
};

export default Codes;
