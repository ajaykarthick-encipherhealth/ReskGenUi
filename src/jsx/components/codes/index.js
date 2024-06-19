import React from "react";
import { Empty, Tree } from "antd";
import { Spin } from "antd";
import { useRef } from "react";

const Codes = ({
  data,
  loading,
  onSelect,
  onExpand,
  expandedKeys,
  currentButton,
 
}) => {
  const topRef = useRef(null);

  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: "smooth", top: 25 });
  };
 
  return (
    <div>
      <div className="d-flex justify-content-center">
        {loading && <Spin size="large" />}
      </div>
      <div className="mt-1 p-3 antdstyle" ref={topRef}>
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
    </div>
  );
};

export default Codes;
