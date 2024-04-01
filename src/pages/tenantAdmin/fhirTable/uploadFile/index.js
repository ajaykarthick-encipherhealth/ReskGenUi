import React from "react";
import Image from "next/image";
import styles from "../fhir.module.css";
import upload from "../../../../images/fihr/upload.png";

function UploadFile({ title }) {
  return (
    <div>

      <div className={styles.videoflex}>
        <div className=" text-center" typeof="file">
          <Image src={upload} alt="Image" />
          <label>
            <input
              className="input"
              type="file"
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
