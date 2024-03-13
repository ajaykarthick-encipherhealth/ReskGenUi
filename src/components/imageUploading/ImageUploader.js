import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import styles from "./styles.module.css";
import { preSendURl } from "../../store/actions/AuthActions";

const ImageUploader = ({ setOpenUploader, setOpenContent }) => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const file = event.target.files[0];
    const type = file?.name?.split(".").pop();
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = 600;
          canvas.height = 600;
          ctx.drawImage(img, 0, 0, 600, 600);
          canvas.toBlob((blob) => {
            const croppedFile = new File([blob], `cropped.${type}`, {
              type: file.type,
            });
            dispatch(preSendURl(type, croppedFile));
            setOpenUploader(false);
          }, file.type);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setOpenContent(true);
  }, []);

  return (
    <div className={styles.videoflex}>
      <label className={styles.videoflex}>
        <input
          className="input"
          type="file"
          onChange={handleChange}
          ref={fileInputRef}
          accept=".png,.jpg,.jpeg"
        />
        Upload Profile
      </label>
    </div>
  );
};

export default ImageUploader;
