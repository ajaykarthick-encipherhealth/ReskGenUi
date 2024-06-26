import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import styles from "../../../../components/imageUploading/styles.module.css";
// import { preSendURl } from "../../store/actions/AuthActions";
// import upload from "../../images/fihr/upload.png";

const UploadFile = ({ filelList, setFileList }) => {
  const fileInputRef = useRef(null);
  const fileHandleChange = (e) => {
    if (e.target.files) {
      const files = e.target.files;
      const validFiles = [];
      const maxSize = 40 * 1024 * 1024;
      for (let i = 0; i < files?.length; i++) {
        if (files[i].size < maxSize) {
          validFiles?.push(files[i]);
        }
      }
      console.log(validFiles);
      setFileList(validFiles);
    }
  };

  return (
    <div className={`${styles.cover} `}>
      <label className="cr-pointer">
        <input
          className="input"
          name="file"
          type="file"
          multiple
          onChange={fileHandleChange}
          ref={fileInputRef}
          accept=".pdf"
        />

        <div className={styles.videoflex}>
          {filelList?.map(
            (item, index) =>
              `${item?.name} ${filelList?.length === index + 1 ? "" : ", "}`
          )}
          {/* <Image src={upload} alt="Image" /> */}
          Upload
        </div>
      </label>
    </div>
  );
};

export default UploadFile;
