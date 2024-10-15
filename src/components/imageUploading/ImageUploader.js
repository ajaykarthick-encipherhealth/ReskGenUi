import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import Image from "next/image";
import styles from "./styles.module.css";
import upload from "../../images/fihr/upload.png";
import { getStorage } from "../../utils/storages";
import { actions as uploadImagesAction } from "../../stores/authflow/imageUpload";
import { actions as userAction } from "../../stores/supervisor/users";
import { getResponePopup } from "../../utils/reusable";
import { Spin } from "antd";

const ImageUploader = ({
  setOpenUploader,
  height,
  isFolderUplaod,
  preSendURl,
  getUrl,
  updateImage,
  getCurrentUser,
}) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const handleChange = (event) => {
    const file = event.target.files[0];
    const type = file?.name?.split(".").pop();
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = 600;
          canvas.height = 600;
          ctx.drawImage(img, 0, 0, 600, 600);
          canvas.toBlob((blob) => {
            const croppedFile = new File(
              [blob],
              `cropped.${file.type.split("/")[1]}`,
              {
                type: file.type,
              }
            );
            if (!isFolderUplaod) {
              preSendCall(type, croppedFile);
            }
          }, file.type);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  const preSendCall = async (type, croppedFile) => {
    try {
      setLoading(true);
      const res = await preSendURl({ type, croppedFile });
      if (res?.response) {
        getBlobImageUrl(res?.response, type, croppedFile);
      }
    } catch (error) {
      setOpenUploader(false);
      setLoading(false);
      throw error;
    }
  };
  const getBlobImageUrl = async (data, type, file) => {
    const userId = getStorage("userId");
    try {
      const res = await getUrl({ url: data, urlType: type, file });
      if (res.status == 201) {
        const user = await updateImage({ url: data });
        if (user?.response) {
          setOpenUploader(false);
          getResponePopup({
            status: "SUCCESS",
            message: "Profile Upload Successfully!",
          });
          getCurrentUser({ userId });
          setLoading(false);
        }
      }
    } catch (error) {
      setOpenUploader(false);
      setLoading(false);
      throw error;
    }
  };
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
                <Image src={upload} alt="Image" />
              </div>
              {isFolderUplaod ? "Upload a File" : "Upload Profile"}
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
