import React from "react";
import styles from "../report.module.css";
import upload from "../../../../images/fihr/upload.png";
import Image from "next/image";

function UploadFile({ title }) {
  return (
    <div>
      {" "}
      <div className={styles.videoflex}>
        <div className=" text-center" typeof="file">
          <Image src={upload} alt="Image" />
          <label>
            <input
              className="input"
              type="file"
              //   onChange={handleChange}
              // ref={fileInputRef}
              accept=".png,.jpg,.jpeg"
            />
            {title}
          </label>
        </div>
      </div>
    </div>
  );
}

export default UploadFile;
