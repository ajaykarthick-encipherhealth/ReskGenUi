import React,{useState, useContext, useEffect} from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

import LogoutPage from './Logout';
import { IMAGES, SVGICON } from "../../constant/theme";
import { ThemeContext } from "../../../context/ThemeContext";


const Header = ({ onNote }) => {
	const [headerFix, setheaderFix] = useState(false);
	useEffect(() => {
		window.addEventListener("scroll", () => {
			setheaderFix(window.scrollY > 50);
		});
	}, []); 
	
	const {background, changeBackground } = useContext(ThemeContext);
	const handleThemeMode = () => {
		if(background.value === 'dark'){
			changeBackground({ value: "light", label: "Light" });
		}else{
			changeBackground({ value: "dark", label: "Dark" });
		}
	}
  
  return ( 
    <div className={`header ${headerFix ? "is-fixed" : ""}`}>
      <div className="header-content">
        <nav className="navbar navbar-expand">
          	<div className="collapse navbar-collapse justify-content-between">
				<div className="header-left">					
				</div>
				<div className="header-right d-flex align-items-center">				
					<ul className="navbar-nav ">			
						<li className="nav-item ps-3">
							<Dropdown className="header-profile2">
								<Dropdown.Toggle className="nav-link i-false" as="div">
									<div className="header-info2 d-flex align-items-center">
										<div className="header-media d-flex">
											<img src={IMAGES.profileImage} alt="" />
											{/* <h6 className="text-white">Admin</h6> */}
										</div>										
									</div>
								</Dropdown.Toggle>
								<Dropdown.Menu align="end">
									<div className="card border-0 mb-0">
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
											<Link to={"/app-profile"} className="dropdown-item ai-icon ">
												{SVGICON.UserSvg}{" "}
												<span className="ms-2">Profile </span>
											</Link>
											<LogoutPage />
										</div>
									</div>
									
								</Dropdown.Menu>
							</Dropdown>
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
