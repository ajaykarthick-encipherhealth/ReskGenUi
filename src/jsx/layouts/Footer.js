
import React from "react";
import { IMAGES, SVGICON } from "../constant/theme";
import Image from "next/image";


const Footer = () => {
 const currentYear = new Date().getFullYear();
 const handleEncipherhealthClick = () => {
   window.open("https://encipherhealth.com/", "_blank");
 };
 return (
   <footer className="text-center">
     <div className="d-flex">
       <div
         className=" d-flex flex-column align-items-center justify-content-center"
         style={{ margin: "0 auto" }}
       >
         <div className="d-flex align-items-center mb-3">
           <Image
             src={IMAGES.Hcc_LOGO}
             style={{ height: "30px", width: "30px", padding: "4px" }}
           />
           <p
            className="mb-0 hovered-text"
             style={{ fontSize: "14px", cursor: "pointer" }}
             onClick={handleEncipherhealthClick}
           >
             &copy; {currentYear} Encipherhealth.Pvt.Ltd
           </p>
           &nbsp; &nbsp;
           <ul className="list-inline mb-0">
             <li className="list-inline-item">
               <span href="#" style={{ fontSize: "14px" }}>
                 Terms
               </span>
             </li>
             <li className="list-inline-item">
               <span href="#" style={{ fontSize: "14px" }}>
                 Privacy
               </span>
             </li>
             <li className="list-inline-item">
               <span href="#" style={{ fontSize: "14px" }}>
                 Security
               </span>
             </li>
             <li className="list-inline-item">
               <span href="#" style={{ fontSize: "14px" }}>
                 Status
               </span>
             </li>
             <li className="list-inline-item">
               <span href="#" style={{ fontSize: "14px" }}>
                 Docs
               </span>
             </li>
             <li className="list-inline-item">
               <span href="#" style={{ fontSize: "14px" }}>
                 Contact &nbsp;{" "}
               </span>
             </li>
           </ul>
         </div>
       </div>
     </div>
   </footer>
 );
};


export default Footer;