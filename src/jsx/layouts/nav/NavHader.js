import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";
import { SVGICON } from "../../constant/theme";
import { navtoggle } from "../../../stores/authflow/actions";


const NavHader = () => {
  const { openMenuToggle } = useContext(ThemeContext);

  const dispatch = useDispatch();
  const sideMenu = useSelector((state) => state.sideMenu);
  const handleToogle = () => {
    dispatch(navtoggle());
  };
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
        <div className={`hamburger ${sideMenu ? "is-active" : ""}`}>
          <span className="line">{SVGICON.NavHeaderIcon}</span>
        </div>
      </div>
    </div>
  );
};

export default NavHader;
