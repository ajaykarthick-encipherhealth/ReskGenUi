import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import styles from "./styles.module.css";
import upload from "../../images/fihr/upload.png";
import { preSendURl } from "../../stores/authflow/actions";

const ImageUploader = ({ setOpenUploader, setOpenContent }) => {
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
            dispatch(preSendURl(type, croppedFile));
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
      <label>
        <input
          className="input"
          type="file"
          onChange={handleChange}
          ref={fileInputRef}
          accept=".png,.jpg,.jpeg"
        />

        <div className={styles.videoflex}>
          <Image src={upload} alt="Image" />
          Upload Profile
        </div>
      </label>
    </div>
  );
};

export default ImageUploader;
