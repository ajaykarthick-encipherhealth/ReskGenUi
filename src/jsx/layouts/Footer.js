import React from "react";
import { IMAGES, SVGICON } from "../constant/theme";
import Hcc_LOGO from "../../images/dashboard/EncipherLogo1.png";

import Image from "next/image";
import { useRouter } from "next/router";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const handleEncipherhealthClick = () => {
    window.open("https://encipherhealth.com/", "_blank");
  };
  const currentPath = router?.pathname;
  console.log(currentPath);
  return (
    <footer className="text-center">
      <div
        className={
          currentPath === "/physician/patients/details"
            ? `d-flex background-white`
            : `d-flex`
        }
      >
        <div
          className=" d-flex flex-column align-items-center justify-content-center"
          style={{ margin: "0 auto" }}
        >
          <div className="d-flex align-items-center mb-3">
            <Image src={Hcc_LOGO} style={{ height: "84px", width: "95px" }} />
            <p
              className="mb-0 hovered-text"
              onClick={handleEncipherhealthClick}
              style={{
                fontSize: "14px",
                cursor: "pointer",
                position: "relative",
                bottom: 0,
                left: -40,
                fontSize: "14px",
                cursor: "pointer",
                padding: "5px",
              }}
            >
              &copy; {currentYear} Encipher Health Inc.
            </p>
            &nbsp; &nbsp;
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
