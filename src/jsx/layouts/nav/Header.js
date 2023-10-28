import React,{useState, useContext, useEffect} from "react";
import { Dropdown } from "react-bootstrap";
import Link from 'next/link';

import { IMAGES, SVGICON } from "../../constant/theme";
import { ThemeContext } from "../../../context/ThemeContext";
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Logout } from "../../../store/actions/AuthActions";
import Swal from 'sweetalert2'



const Header = ({ onNote }) => {
	const [headerFix, setheaderFix] = useState(false);
	const [userName, setUserName] = useState('');
	const router = useRouter();

	useEffect(() => {
		var loginCheck = localStorage.getItem("loginCheck");
		var userName = localStorage.getItem("userName");
		setUserName(userName);
		if(loginCheck !=  "true"){			
			Swal.fire({
				title: 'Error!',
				text: 'Access Denied',
				icon: 'error',
				confirmButtonText: 'Logout',
				confirmButtonColor: "#DD6B55",
				closeOnConfirm: false
			  }).then((result) => { 
				if (result.isConfirmed) {
				   window.location = "/userlogin"
				  } 
			  })
		}
		console.log(loginCheck)
		window.addEventListener("scroll", () => {
			setheaderFix(window.scrollY > 50);
		});
	}, []); 
	
	const logoutFunction = () => {
		Swal.fire({
			title: 'Warning!',
			text: 'Do you want Logout!',
			icon: 'warning',
			confirmButtonText: 'Logout',
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			closeOnConfirm: false
		  }).then((result) => { 
			if (result.isConfirmed) {
				localStorage.clear();
				localStorage.removeItem("loginCheck");
			   window.location = "/userlogin"
			  } 
		  })
	}
  
  return ( 
    <div className={`header ${headerFix ? "is-fixed" : ""}`}>
      <div className="header-content">
        <nav className="navbar navbar-expand">
          	<div className="collapse navbar-collapse justify-content-between">
				<div className="header-logo">	
				<Image src={IMAGES.hccWhiteLogo}/>				
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
											<span className="text-dark-50 ms-2 text-white header-name font-weight-bolder font-size-base d-flex mr-3">{userName}</span>
											<span  onClick={logoutFunction} className="ms-2 d-flex mt-1">
												{SVGICON.Logout}{" "}
												<h6 className="logout-name">Logout </h6>
											</span>
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
