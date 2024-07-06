import { Checkbox } from "antd";
import React, { useState } from "react";
import ImageUploader from "../../../../components/imageUploading/ImageUploader";
import Image from "next/image";
import add from "../.../../../../../images/svg/add.svg";

const FileUploader = ({ setOpenModal, key }) => {
  return (
    <>
      <div className="font-bold mt-4">Year</div>
      <div className="d-flex font-semibold mt-2">
        <Checkbox />
        <div className="px-2">Can We Calculate for all Processing Year</div>
      </div>
      <div className="mt-4 d-flex justify-content-between">
        <div style={{ width: "50%" }}>
          <ImageUploader
            setOpenUploader={true}
            height="174px"
            isFolderUplaod={true}
          />
        </div>
        <div
          className="d-flex justify-content-center align-items-center rounded text-white cr-pointer"
          style={{ width: "49%", height: "174px", background: "#04306f" }}
          onClick={() => {
            setOpenModal(true);
          }}
        >
          <div>
            <div className="d-flex justify-content-center align-items-center">
              <Image
                src={add}
                alt="Centered Image"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </div>
            <div className="d-flex justify-content-center align-items-center mt-2">
              Add Manually
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUploader;
