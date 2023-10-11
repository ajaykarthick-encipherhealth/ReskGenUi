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
	
	// const {background, changeBackground } = useContext('');
	// const handleThemeMode = () => {
	// 	if(background.value === 'dark'){
	// 		changeBackground({ value: "light", label: "Light" });
	// 	}else{
	// 		changeBackground({ value: "dark", label: "Dark" });
	// 	}
	// }
  
  return ( 
    <div className={`header ${headerFix ? "is-fixed" : ""}`}>
      <div className="header-content">
        <nav className="navbar navbar-expand">
          	<div className="collapse navbar-collapse justify-content-between">
				<div className="header-logo">	
				  <h3 className="text-white">Logo</h3>				
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
											<Link href="/login" className="ms-2 d-flex">
												{SVGICON.Logout}{" "}
												<h6 className="ms-2">Logout </h6>
											</Link>
											</div>

										</div>										
									</div>
								</div>
								{/* <Dropdown.Menu align="end">
									<div className="card border-0 mb-0 box-shadow-none">
										<div className="card-header py-2">
											<div className="products">
												<img src={IMAGES.profileImage} className="avatar avatar-md" alt="" />
												<div>
													<h6>Admin</h6>
													<span>Medical</span>	
												</div>	
											</div>
										</div>
										<div className="card-body px-0 py-2">
											<Link href="/app-profile" className="dropdown-item ai-icon ">
												{SVGICON.UserSvg}{" "}
												<span className="ms-2">Profile </span>
											</Link>
										</div>
									</div>
									
								</Dropdown.Menu> */}
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
