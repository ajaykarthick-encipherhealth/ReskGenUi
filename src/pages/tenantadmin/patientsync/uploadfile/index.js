import React, { useRef, useState } from "react";
import styles from "../../../../components/imageUploading/styles.module.css";
import Image from "next/image";
import { Progress } from "antd";
import progressStyles from "../../../../pages/tenantadmin/patientsync/fhir.module.css";
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
  setUploadAction,
  uploadAction,
  singleUpload,
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const fileHandleChange = (e) => {
    if (e.target.files) {
      const files = e.target.files;
      const fileArray = Array.from(files);
      if (singleUpload && fileArray.length > 1) {
        alert("Only one file can be uploaded at a time.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (uploadAction === "uploadFolder" || uploadAction === "uploadMultipleFiles") {
        // Check if all files are PDFs
        const invalidFiles = fileArray?.filter(
          (file) => !file.name.endsWith(".pdf")
        );

        if (invalidFiles.length > 0) {
          alert(
            `Only .pdf files are allowed. Invalid files detected:\n${invalidFiles
              .map((f) => f.name)
              .join("\n")}`
          );
          event.target.value = ""; // Reset file input
          return;
        }
      }
      const maxFilesAllowed =
        openUpload?.data?.totalFileCount -
          openUpload?.data?.totalSuccessCount || Infinity;
      if (fileArray?.length > maxFilesAllowed) {
        alert(`This batch can allow only ${maxFilesAllowed} files.`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        event.target.value = "";
        return;
      }
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
        const handleFileChange = (event) => {
          console.log(event.target.files); // Logs the selected files
        };

        fileInputRef.current.addEventListener("change", handleFileChange);

        return () => {
          fileInputRef.current?.removeEventListener("change", handleFileChange);
        };
      }
    }
  }, [openUpload]);

  return uploadAction || singleUpload ? (
    <div className={` ant-badge ${styles.cover} `}>
      <label className="ant-badge cr-pointer">
        <input
          id="upload"
          name="upload"
          key={openUpload?.status ? "open" : "closed"}
          className="input"
          type="file"
          webkitdirectory={uploadAction === "uploadFolder" ? "true" : undefined}
          directory=""
          multiple={uploadAction === "uploadMultipleFiles" ? true : false}
          ref={fileInputRef}
          onChange={fileHandleChange}
          disabled={filesList?.length > 0 ? true : false}
          accept={uploadAction !== "uploadFolder" && ".pdf"}
        />
        <div
          className={`ant-badge ${styles.videoflex}`}
          style={{ overflowY: "scroll", height: "110px", padding: "15px" }}
        >
          {uploaderImg ? (
            <div>
              <div className={styles.uploadContainer}>
                <Image src={uploaderImg} alt="noImage" />
              </div>
              <div className={styles.subText}>{subText}</div>
            </div>
          ) : singleUpload ? (
            "Upload File"
          ) : uploadAction === "uploadFolder" ? (
            "Upload Folder"
          ) : (
            "Upload Multiple Files"
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
                    uploadProgress !== 100
                      ? getColors("PENDING")?.strokeColor
                      : getColors("COMPLETED")?.strokeColor
                  }
                  className={`w-100 ${progressStyles.progreddBr}`}
                />
              </div>
            </>
          ))}
        </>
      )}
    </div>
  ) : (
    <div className="col-xl-12 mb-3 d-flex justify-content-center ">
      <button
        type="submit"
        style={{ backgroundColor: "#04306f" }}
        className="border-0 px-4 py-2 text-white rounded-1"
        onClick={() => {
          !singleUpload && setUploadAction("uploadFolder");
        }}
      >
        Upload Folder
      </button>
      <button
        type="submit"
        style={{ backgroundColor: "#04306f" }}
        className="border-0 px-4 py-2 text-white rounded-1 mx-2"
        onClick={() => {
          !singleUpload && setUploadAction("uploadMultipleFiles");
        }}
      >
        Upload Multiple Files
      </button>
    </div>
  );
};

export default UploadFile;
