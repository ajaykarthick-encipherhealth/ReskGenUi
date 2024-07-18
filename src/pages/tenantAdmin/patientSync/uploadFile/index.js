import React, { useRef } from "react";
import styles from "../../../../components/imageUploading/styles.module.css";
import Image from "next/image";

const UploadFile = ({ filelList, setFileList, subText, uploaderImg }) => {
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

        <div
          className={styles.videoflex}
          style={{ overflowY: "scroll", height: "110px", padding: "15px" }}
        >
          {uploaderImg ? (
            <div>
              <div className={styles.uploadContainer}>
                <Image src={uploaderImg} alt="noImage" />
              </div>
              <div className={styles.subText}>{subText}</div>
            </div>
          ) : filelList?.length > 0 ? (
            filelList?.map(
              (item, index) =>
                `${item?.name} ${filelList?.length === index + 1 ? "" : ", "}`
            )
          ) : (
            "Upload"
          )}
        </div>
      </label>
    </div>
  );
};

export default UploadFile;
