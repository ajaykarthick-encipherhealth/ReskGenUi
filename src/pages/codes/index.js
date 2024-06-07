import React  from "react";
import { Empty, Tree } from "antd";
import { Spin } from "antd";

const Codes = ({ data, loading,onSelect }) => {
 

  return (
    <>
      <div className="d-flex justify-content-center">
        {loading && <Spin size="large" />}
      </div>
      <div className="mt-3 antdstyle"> 
        <Tree
          showLine={true} 
          defaultExpandedKeys={["0-0-0"]}
          treeData={data}
          showIcon={true}
          onSelect={(value)=>{onSelect(value)}}
        />
      </div>
    </>
  );
};

export default Codes;
