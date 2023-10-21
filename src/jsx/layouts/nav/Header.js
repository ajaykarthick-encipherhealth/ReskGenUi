import React,{useState, useContext, useEffect} from "react";
import { Dropdown } from "react-bootstrap";
import Link from 'next/link';

import { IMAGES, SVGICON } from "../../constant/theme";
import { ThemeContext } from "../../../context/ThemeContext";
import Image from 'next/image'


const Header = ({ onNote }) => {
	const [headerFix, setheaderFix] = useState(false);
	useEffect(() => {
		window.addEventListener("scroll", () => {
			setheaderFix(window.scrollY > 50);
		});
	}, []); 
	
  
  return ( 
    <div className={`header ${headerFix ? "is-fixed" : ""}`}>
      <div className="header-content">
        <nav className="navbar navbar-expand">
          	<div className="collapse navbar-collapse justify-content-between">
				<div className="header-logo">	
				<Image src={IMAGES.hccLogo}/>				
				</div>
				<div className="header-right d-flex align-items-center">				
					<ul className="navbar-nav ">			
						<li className="nav-item ps-3">
							<div className="header-profile2 cr-pointer">
								<div className="nav-link i-false" as="div">
									<div className="header-info2 d-flex align-items-center">
										<div className="header-media d-flex">
											<Image src={IMAGES.profileImage}/>
											<div>
											<span className="text-dark-50 ms-2 text-white header-name font-weight-bolder font-size-base d-flex mr-3">Admin</span>
											<Link href="/userlogin" className="ms-2 d-flex">
												{SVGICON.Logout}{" "}
												<h6 className="logout-name">Logout </h6>
											</Link>
											</div>

										</div>										
									</div>
								</div>
							</div>
						</li>						
					</ul>
				</div>
			
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
