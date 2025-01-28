import React from "react";
import { Empty, Tree } from "antd";
import { Spin } from "antd";
import { useRef } from "react";
import { connect } from "react-redux";
import CardSkeleton from "../../../components/skeleton/card";
import TableSkeleton from "../../../components/skeleton/table";

const Codes = ({
  data,
  loading,
  onSelect,
  onExpand,
  expandedKeys,
  codesLoader,
}) => {
  return (
    <div>
      {codesLoader ? (
        <TableSkeleton  width={1000} />
      ) : (
        <div className="mt-1 antdstyle">
          <Tree
            showLine={true}
            treeData={data}
            showIcon={true}
            expandedKeys={expandedKeys}
            onSelect={onSelect}
            onExpand={onExpand}
          />
        </div>
      )}
    </div>
  );
};

const enhancer = connect((state) => ({
  codesLoader: state.codify.codify.codifyLoader,
}));

export default enhancer(Codes);
