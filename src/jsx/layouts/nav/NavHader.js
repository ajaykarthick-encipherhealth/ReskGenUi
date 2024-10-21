import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";
import { SVGICON } from "../../constant/theme";


const NavHader = () => {
  const { openMenuToggle } = useContext(ThemeContext);
  return (
    <div className="nav-header">
      <Link to="/dashboard" className="brand-logo">
        {SVGICON.MainLogo}
      </Link>

      <div
        className="nav-control"
        onClick={() => {
          openMenuToggle();
          handleToogle();
        }}
      >
        <div className={`hamburger `}>
          <span className="line">{SVGICON.NavHeaderIcon}</span>
        </div>
      </div>
    </div>
  );
};

export default NavHader;
