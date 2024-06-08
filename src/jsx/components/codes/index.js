import React  from "react";
import { Empty, Tree } from "antd";
import { Spin } from "antd";

const Codes = ({ data, loading,onSelect,onExpand ,expandedKeys}) => {
 

  return (
    <>
      <div className="d-flex justify-content-center">
        {loading && <Spin size="large" />}
      </div>
      <div className="mt-3 antdstyle"> 
          <Tree
            showLine={true} 
            defaultExpandedKeys={[name]}
            treeData={data}
            showIcon={true}
            onSelect={(value)=>{onSelect(value)}}
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            
          />
      </div>
    </>
  );
};

export default Codes;
