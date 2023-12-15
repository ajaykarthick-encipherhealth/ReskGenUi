// import React from "react";

// const Footer = () => {
// 	var d = new Date();
// 	return (
// 		<div >
// 			<div className="footer out-footer" style={{display:"flex", alignItems:"center", justifyContent:"center", backgroundColor:"#f0f6fe"}}>
// 			<div className="copyright" style={{display:"flex", alignItems:"center"}}>
// 				<p>Copyright ©
// 					{" "}Developed by{" "}
// 					<a href="http://innoura.com/" target="_blank"  rel="noreferrer">
// 					Encipherhealth
// 					</a>{" "}
// 					{d.getFullYear()}
// 				<ul style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
//                        <li>
//                            <a href="#">Terms</a>
//                        </li>
//                        <li>
//                            <a href="#">Privacy</a>
//                        </li>
//                        <li>
//                            <a href="#">Security</a>
//                        </li>
//                        <li>
//                            <a href="#">Status</a>
//                        </li>
//                        <li>
//                            <a href="#">Docs</a>
//                        </li>
//                        <li>
//                            <a href="#">Contact</a>
//                        </li>
//                    </ul>
// 				</p>

// 			</div>

// 		</div>
// 		</div>

// 	);
// };

// export default Footer;
// // import React from "react";

// // const Footer = () => {
// //     const currentYear = new Date().getFullYear();

// //     return (
// //         <div className="footer">
// //             <div className="footer-content">
// //                 <div className="footer-section">
// //                     <h3>Footer navigation</h3>
// //                     <ul>
// //                         <li>
// //                             <a href="#">Terms</a>
// //                         </li>
// //                         <li>
// //                             <a href="#">Privacy</a>
// //                         </li>
// //                         <li>
// //                             <a href="#">Security</a>
// //                         </li>
// //                         <li>
// //                             <a href="#">Status</a>
// //                         </li>
// //                         <li>
// //                             <a href="#">Docs</a>
// //                         </li>
// //                         <li>
// //                             <a href="#">Contact</a>
// //                         </li>
// //                     </ul>
// //                 </div>

// //                 <div className="footer-section">
// //                     <h3>Legal</h3>
// //                     <ul>
// //                         <li>
// //                             <a href="#">Manage cookies</a>
// //                         </li>
// //                         <li>
// //                             <a href="#">Do not share my personal information</a>
// //                         </li>
// //                     </ul>
// //                 </div>
// //             </div>

// //             <div className="footer-bottom">
// //                 <p>© {currentYear} GitHub, Inc.</p>
// //             </div>
// //         </div>
// //     );
// // };

// // export default Footer;

import React from "react";
import { IMAGES, SVGICON } from "../constant/theme";
import Image from "next/image";


const Footer = () => {
 const currentYear = new Date().getFullYear();
 const handleEncipherhealthClick = () => {
   // You can use window.location.href or any router navigation method
   window.location.href = "https://encipherhealth.com/";
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