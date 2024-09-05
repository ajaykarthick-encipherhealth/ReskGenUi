import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import styles from "./styles.module.css";
import upload from "../../images/fihr/upload.png";
import { getCurrentUser, getUrl, preSendURl, updateImage } from "../../stores/authflow/actions";

const ImageUploader = ({ setOpenUploader, setOpenContent,height, isFolderUplaod }) => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

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
              preSendCall(type,croppedFile)
              
            }
            setOpenUploader(false);
          }, file.type);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  const preSendCall = async (type, croppedFile) => {
    try {
      const res = await dispatch(preSendURl(type, croppedFile));
      if (res?.data?.response) {
        getBlobImageUrl(res?.data?.response, type, croppedFile)
      }
    } catch (error) {
      throw error;
    }
  };
  const getBlobImageUrl = async (data, type, file) => {
    const userId = localStorage.getItem("userId");
    try {
      const res = await dispatch(getUrl(data,type,file));
      if (res.status == 201) {
        const user = await dispatch(updateImage(data));
        if (user.data?.response) {
          dispatch(getCurrentUser(userId));
        }
      }
    } catch (error) {
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
          accept={isFolderUplaod?".xl,.csv":".png,.jpg,.jpeg"}
        />

        <div className={styles.videoflex} style={{ height: height }}>
          <div>
            <div className="d-flex justify-content-center cursor-pointer">
              <Image src={upload} alt="Image" />
            </div>
            {isFolderUplaod?"Upload a File":"Upload Profile"}
          </div>
        </div>
      </label>
    </div>
  );
};

export default ImageUploader;
