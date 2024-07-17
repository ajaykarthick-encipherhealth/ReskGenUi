import React from "react";
import { Button, Upload } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
const FileUpload = (props) => {
  return (
    <div>
      <Upload {...props}>
        <Button
          icon={<CloudUploadOutlined />}
          style={{
            background: "#CEE1FD",
            borderColor: "#06439D",
            // color: "white",
            height: "44px",
          }}
        >
          Upload a File
        </Button>
      </Upload>
      <div className="text-danger" style={{ fontSize: "10px" }}>{props.allowedFormat}</div>
    </div>
  );
};

export default FileUpload;
