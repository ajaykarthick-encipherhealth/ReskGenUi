import React from "react";
import { Empty, Tree } from "antd";
import { Spin } from "antd";
import { useRef } from "react";
import { connect, useSelector } from "react-redux";

const Codes = ({
  data,
  loading,
  onSelect,
  onExpand,
  expandedKeys,
  codifyDataLoading,
}) => {
  const topRef = useRef(null);

  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: "smooth", top: 25 });
  };

  return (
    <div>
      <div className="d-flex justify-content-center">
        {codifyDataLoading && <Spin size="large" />}
      </div>
      <div className="mt-1  antdstyle" ref={topRef}>
        <Tree
          ref={topRef}
          showLine={true}
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

const enhancer = connect((state) => ({
  codifyDataLoading:state.codify.codify.codifyLoader
}));

export default enhancer(Codes);
