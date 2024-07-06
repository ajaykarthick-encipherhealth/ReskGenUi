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
            background: "#06439D",
            borderColor: "#06439D",
            color: "white",
            height: "47px",
          }}
        >
          Upload a File
        </Button>
      </Upload>
      <div style={{ fontSize: "12px" }}>{props.allowedFormat}</div>
    </div>
  );
};

export default FileUpload;
