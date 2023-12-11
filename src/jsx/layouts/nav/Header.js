import React,{useState, useContext, useEffect} from "react";
import { Dropdown } from "react-bootstrap";
import Link from 'next/link';

import { IMAGES, SVGICON } from "../../constant/theme";
import { ThemeContext } from "../../../context/ThemeContext";
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Logout } from "../../../store/actions/AuthActions";
import Swal from 'sweetalert2'
import { MenuList, PhysicanMenuList ,L2AuditMenuList} from "./Menu";
import ENDPOINTS from '../../../utility/enpoints';
import axios from "../../../utility/axiosConfig";


const Header = ({ onNote }) => {
	const [headerFix, setheaderFix] = useState(false);
	const [userName, setUserName] = useState('');
	const router = useRouter();
	const [stateActive, setStateActive] = useState(router.pathname);
	const [userRole, setUserRole] = useState("");
	const [menuList, setMenuList] = useState([]);
	const [userIdDetails, setUserIdDetails] = useState([]);



	useEffect(() => {
		console.log(ENDPOINTS)

	


		console.log(stateActive)
		var loginCheck = localStorage.getItem("loginCheck");
		var userName = localStorage.getItem("userName");
		const userRoleLocal = localStorage.getItem("userRole");
		const userId = localStorage.getItem("userId");
		getUserIdDetails(userId);

		setUserRole(userRoleLocal);
		setUserName(userName);
		if(userRoleLocal == "Coder-L2"){
			setMenuList(L2AuditMenuList)
		}else{
			setMenuList(PhysicanMenuList)
		}
		if(loginCheck !=  "true"){			
			Swal.fire({
				title: 'Error!',
				text: 'Session Expired',
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

		// let url = ENDPOINTS.apiEndoint + "communication/push-notifications/" + "watson@encipherhealth.onmicrosoft.com" + "?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSIsImtpZCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSJ9.eyJhdWQiOiJhcGk6Ly9mOTJkZGIwNS1iNzVjLTQ0NTktOTEwZi03M2M1OGQ3NWY1ZjUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9iNGQzNGU0Mi03OWE2LTQ3OGUtYjNhZi0xMmNlNzMxMWZhMDkvIiwiaWF0IjoxNzAxMDg2MTIxLCJuYmYiOjE3MDEwODYxMjEsImV4cCI6MTcwMTA5MTQ0NywiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhWQUFBQU01cjQwRjlaUVRvLzE3NG5pbENBOUNvQlg4OW5GQzllNTNtUWgvVERYR0ZpSWYxU1ZpWkVTTTBITE5hd0FFMlIiLCJhbXIiOlsicHdkIl0sImFwcGlkIjoiZjkyZGRiMDUtYjc1Yy00NDU5LTkxMGYtNzNjNThkNzVmNWY1IiwiYXBwaWRhY3IiOiIxIiwiaXBhZGRyIjoiMjAuNzIuMTMyLjE5NCIsIm5hbWUiOiJhaml0aCIsIm9pZCI6Ijg2M2M2NmJlLTk3OTItNDY5Ny1hZDA2LTdlZWExMGFjZDAzYyIsInJoIjoiMC5BYmNBUWs3VHRLWjVqa2V6cnhMT2N4SDZDUVhiTGZsY3QxbEVrUTl6eFkxMTlmWEpBT0kuIiwicm9sZXMiOlsiQURNSU4iXSwic2NwIjoiZW5jaXBoZXJoZWFsdGgtbXVsdGl0ZW5hbnQuc2NvcGUiLCJzdWIiOiJCM1dkVmtJX191RkM2UlpsNWhVSy1uaUFtWmVRTjlpTzQxS1c5b0s1WmlnIiwidGlkIjoiYjRkMzRlNDItNzlhNi00NzhlLWIzYWYtMTJjZTczMTFmYTA5IiwidW5pcXVlX25hbWUiOiJhaml0aDAxQGVuY2lwaGVyaGVhbHRoLm9ubWljcm9zb2Z0LmNvbSIsInVwbiI6ImFqaXRoMDFAZW5jaXBoZXJoZWFsdGgub25taWNyb3NvZnQuY29tIiwidXRpIjoiZlBpcmtmTDcxa3VlQ3FhMzZ3cEpBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il19.dzoJvDUUDYyhUQGSJb8n6KSjbbg3Oe2VEam5CqEr47VyQpeR8BAhKQFn6m9WYJiy6vNTcDZ17Hu0BqkKInY9GbIQGj4kUP7rybDF-GN8lNRetRj_lJLkpVTdZ7BYcXbprt_2CRWtxJamROyh4aALFZOynnLfK9iPny3fX6AAmyqO-dF7-A2fEG4_CVIODgrRa2AuWXMkrzZBgSBJSTHXgsFxC6zNaBkfdaqkNVz-fOTOqtmFTRA68lsiNY68cUljGrKJlxo5fyEJjlaGMd5WLl_W6quhj5EtlnTtqN_5uJtS7Dj1lXinSy-LtgyslFbUt0BmmMqBsqjLCtzNoNI-Ew";
		// const sse = new EventSource(url, { headers: { 'X-Tenant': 'default' } });
	
		// sse.addEventListener("user-list-event", (event) => {
		//   const data = JSON.parse(event.data);
		//   console.log(data)
		// });
	
		// sse.onerror = () => {
		//   sse.close();
		// };
		// return () => {
		//   sse.close();
		// };
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

	const getUserIdDetails = async (userId) => {
		const response = await axios.get(
		  ENDPOINTS.apiEndoint +
		  `dbservice/user/get?userName=${userId}`
		);
		setUserIdDetails(response.data)
	  }
	
  
  return ( 
    <div className={`header ${headerFix ? "is-fixed" : ""}`}>
      <div className="header-content">
        <nav className="navbar navbar-expand">
          	<div className="collapse navbar-collapse justify-content-between">
				<div className="header-logo">	
				<Image src={IMAGES.Hcc_LOGO}/>				
				</div>
				{ stateActive != "/physician/home" ? 
				<div>
				<ul className="metismenu header-menu d-flex" id="menu">
            {menuList.map((data, index) => {
              return (
                <li   className={` ${stateActive === data.to || stateActive === data.childRoute ? "header-active" : ""}`}
                  
                  key={index}
                >
                  <Link href={data.to} className="d-flex">
                    <div className="menu-icon">{data.iconStyle}</div>{" "}
                    <span className={`nav-text header-nav-text`}>
                      {data.title}
                    </span>
					<span></span>
                  </Link>
                </li>
              );
            })}
          </ul>
				</div>:null}
				<div className="header-right d-flex align-items-center">				
					<ul className="navbar-nav ">			
						<li className="nav-item ps-3">
							<div className="header-profile2 cr-pointer">
								<div className="nav-link i-false" as="div">
									<div className="header-info2 d-flex align-items-center">
									   <div className="notificationIcon">
									   {SVGICON.notificationIcon}
									   </div>
										<div className="header-media d-flex">
											<Image src={IMAGES.profileImage}/>
											<div>
											<span className="text-dark-50 ms-2 header-name font-weight-bolder font-size-base d-flex mr-3">{userName}</span>
											<span  onClick={logoutFunction} className="ms-2 d-flex mt-1">
												{/* {SVGICON.Logout}{" "} */}
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
