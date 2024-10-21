import React, { useState } from "react";
import RegularButton from "../../components/button";
import CryptoJS from "crypto-js";
import { salt } from "../../utils/config";

const Encryption = () => {
  const [data, setData] = useState("");
  const [encryptData, setEncryptData] = useState("");

  function decryptData(encryptedData, key) {
    try {
      encryptedData = CryptoJS.enc.Base64.parse(encryptedData.replace(/\s/g, "")); // Decode from Base64
      const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
      const ivUtf8 = CryptoJS.enc.Utf8.parse("Ne8ZXeHhilLBuAcW");
  
      const dec111 = CryptoJS.AES.decrypt(
        { ciphertext: encryptedData },
        keyUtf8,
        {
          iv: ivUtf8,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );
      const decryptedText = dec111.toString(CryptoJS.enc.Utf8);
      return decryptedText.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Decryption error:", error);
      return null;
    }
  }

  const handleClick = () => {
    if (data) {
      const res = decryptData(data, salt);
      return res && setEncryptData(JSON.parse(res));
    }
  };
  
  return (
    <div
      className="d-flex justify-content-between w-100"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-25 p-3" style={{ minHeight: "100%" }}>
        <div>
          <textarea
            className="w-100 rounded"
            style={{ minHeight: "200px" }}
            value={data}
            onChange={(e) => setData(e.target.value)}
          ></textarea>
        </div>
        <div>
          <RegularButton name={"Submit"} onClick={handleClick} />
          <RegularButton
            name={"Reset"}
            type={"outline"}
            onClick={() => {
              setData("");
              setEncryptData("");
            }}
          />
        </div>
      </div>
      <div className="card w-75">
        <div className="p-3" style={{ minHeight: "90vh", maxHeight: "98vh", overflow: "scroll" }}>
         <pre style={{maxHeight: "90%"}}>{JSON.stringify(encryptData, null, 4)}
         </pre>
        </div>
      </div>
    </div>
  );
};

export default Encryption;
