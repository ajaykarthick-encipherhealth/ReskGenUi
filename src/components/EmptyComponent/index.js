import React from "react";
import { SmileOutlined } from "@ant-design/icons";

const EmptyComponent = () => {
  return (
    <div
      className="d-flex justify-content-center text-center mx-2"
      style={{ height: "75vh", background: "#eff0f2" }}
    >
      <div className="mt-5">
        <SmileOutlined style={{ fontSize: 40 }} />
        <p>Data Not Found</p>
      </div>
    </div>
  );
};

export default EmptyComponent;
