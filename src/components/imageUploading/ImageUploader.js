import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import Image from "next/image";
import styles from "./styles.module.css";
import { getStorage } from "../../utils/storages";
import { actions as uploadImagesAction } from "../../stores/authflow/imageUpload";
import { actions as userAction } from "../../stores/supervisor/users";
import { getResponePopup } from "../../utils/reusable";
import { Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

const ImageUploader = ({
  setOpenUploader,
  height,
  isFolderUplaod,
  preSendURl,
  getUrl,
  updateImage,
  getCurrentUser,
  handleChange,
  loading,
  selectedFile,
  fileInputRef
}) => {
  return (
    <div className={styles.cover}>
      <label style={{ height: height }}>
        <input
          className="input"
          type={"file"}
          onChange={handleChange}
          ref={fileInputRef}
          name="file"
          multiple
          accept={isFolderUplaod ? ".xl,.csv" : ".png,.jpg,.jpeg"}
        />

        <div className={styles.videoflex} style={{ height: height }}>
          {loading ? (
            <Spin />
          ) : (
            <div>
              <div className="d-flex justify-content-center cursor-pointer">
                <FontAwesomeIcon icon={faUpload} />
              </div>
              {isFolderUplaod ? "Upload a File" : selectedFile?.name || "Upload Profile"}
            </div>
          )}
        </div>
      </label>
    </div>
  );
};

const enhancer = connect((state) => ({}), {
  preSendURl: uploadImagesAction.getuploadurl,
  getUrl: uploadImagesAction.getURL,
  updateImage: uploadImagesAction.updateImage,
  getCurrentUser: userAction.getCurrentUserInfo,
});

export default enhancer(ImageUploader);
