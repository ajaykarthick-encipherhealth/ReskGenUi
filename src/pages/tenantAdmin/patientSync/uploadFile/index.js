import React, { useRef, useState } from "react";
import styles from "../../../../components/imageUploading/styles.module.css";
import Image from "next/image";
import { Progress } from "antd";
import { getColors } from "../../../../components/table/tenantTable/pdfTable/detailPdfTable";
import progressStyles from "../../../../pages/tenantAdmin/patientSync/fhir.module.css";
const UploadFile = ({ filesList, setFilesList, subText, uploaderImg }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
      if (validFiles?.length > 0) {
        uploadFiles(validFiles);
        setFilesList(validFiles);
      }
    }
  };
  const uploadFiles = async (files) => {
    setIsLoading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 200);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setUploadProgress(100);
  };

  const getColors = (status) => {
    switch (status) {
      case "PENDING":
        return { strokeColor: "#ffa500", progressTextClass: "pending-text" };
      case "COMPLETED":
        return { strokeColor: "#4caf50", progressTextClass: "completed-text" };
      default:
        return { strokeColor: "#000", progressTextClass: "default-text" };
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
          ) : (
            "Upload"
          )}
        </div>
      </label>
      {filesList?.length > 0 && (
        <>
          {filesList?.map((item, index) => (
            <>
              <div>{item.name}</div>
              <div className="w-100">
                <Progress
                  percent={uploadProgress}
                  strokeColor={
                    isLoading
                      ? getColors("PENDING")?.strokeColor
                      : getColors("COMPLETED")?.strokeColor
                  }
                  className={`w-100 ${progressStyles.progreddBr} ${
                    isLoading
                      ? getColors("PENDING")?.progressTextClass
                      : getColors("COMPLETED")?.progressTextClass
                  }`}
                />
              </div>
            </>
          ))}
        </>
      )}
    </div>
  );
};

export default UploadFile;
