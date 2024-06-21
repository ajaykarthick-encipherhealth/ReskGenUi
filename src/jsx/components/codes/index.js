import React from "react";
import { Empty, Tree } from "antd";
import { Spin } from "antd";
import { useRef } from "react";
import { useSelector } from "react-redux";

const Codes = ({
  data,
  loading,
  onSelect,
  onExpand,
  expandedKeys,
  currentButton,
 
}) => {
  const topRef = useRef(null);
  const { loading:codifyDataLoading} = useSelector((state) =>state.codify.codify.codify)

  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: "smooth", top: 25 });
  };
 
  return (
    <div>
      <div className="d-flex justify-content-center">
          {codifyDataLoading && <Spin size="large" />}
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
