import React, { useRef, useState } from "react";
import styles from "../../../../components/imageUploading/styles.module.css";
import Image from "next/image";
import { Progress } from "antd";
import progressStyles from "../../../../pages/tenantAdmin/patientSync/fhir.module.css";
import { useEffect } from "react";
const UploadFile = ({
  filesList,
  setFilesList,
  subText,
  uploaderImg,
  isLoading,
  setIsLoading,
  uploadFolder,
  openUpload,
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef(null);
  const fileHandleChange = (e) => {
    if (e.target.files) {
      const files = e.target.files;
      const fileArray = Array.from(files);
      const validFiles = [];
      fileArray.forEach((file) => {
        validFiles.push(file);
      });

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
  useEffect(() => {
    if (openUpload?.status) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [openUpload]);
  return (
    <div className={`${styles.cover} `}>
      <label className="cr-pointer">
        {/* <input
          className="input"
          name="file"
          type="file"
          // multiple
          onChange={fileHandleChange}
          ref={fileInputRef}
          accept=".pdf"
          webkitdirectory
          mozdirectory
        /> */}
        <input
          key={openUpload?.status ? "open" : "closed"}
          className="input"
          type="file"
          webkitdirectory={uploadFolder ? "true" : "false"}
          directory=""
          ref={fileInputRef}
          onChange={fileHandleChange}
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
            "Upload A Folder"
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
