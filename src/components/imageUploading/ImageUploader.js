import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import styles from "./styles.module.css";
import upload from "../../images/fihr/upload.png";
import { preSendURl } from "../../stores/authflow/actions";

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
              dispatch(preSendURl(type, croppedFile));
            }
            setOpenUploader(false);
          }, file.type);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
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
            <div className="d-flex justify-content-center">
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
