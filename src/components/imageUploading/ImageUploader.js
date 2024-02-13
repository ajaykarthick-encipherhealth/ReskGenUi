import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import styles from "./styles.module.css";
import { preSendURl } from "../../store/actions/AuthActions";

const ImageUploader = ({ setOpenUploader,setOpenContent }) => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const file = event.target.files[0];
    const type = file?.name?.split(".").pop();
    if (file) {
      dispatch(preSendURl(type, file));
      setOpenUploader(false);
    }
  };

  useEffect(()=>{
    setOpenContent(true)
  },[])

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
