import React, { useContext, useState } from "react";
import { useDispatch , useSelector } from 'react-redux';
/// React router dom
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";
import { SVGICON } from "../../constant/theme";
import { navtoggle } from "../../../store/actions/AuthActions";


const NavHader = () => {
  
  const {  openMenuToggle } = useContext(
    ThemeContext
  );

  const dispatch = useDispatch();
  const sideMenu = useSelector(state => state.sideMenu);
  const handleToogle = () => {
    dispatch(navtoggle());
  };
  return (
    <div className="nav-header">
      <Link to="/dashboard" className="brand-logo"> 
          {SVGICON.MainLogo}
				  {/* {SVGICON.logotitle} */}
      </Link>

      <div
        className="nav-control"
        onClick={() => {          
          openMenuToggle();
          handleToogle()
        }}
      >
        <div className={`hamburger ${sideMenu ? "is-active" : ""}`}
          
        >
          <span className="line">
						{SVGICON.NavHeaderIcon}
					</span>        
        </div>
      </div>
    </div>
  );
};

export default NavHader;
