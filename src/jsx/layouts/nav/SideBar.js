/// Menu
import React, { useState, useEffect } from "react";

/// Link
import Link from "next/link";
import { useRouter } from "next/router";
import { SVGICON } from "../../constant/theme";
import { MenuList, PhysicanMenuList, L2AuditMenuList } from "./Menu";

export default function SideBar() {
  const router = useRouter();
  const [stateActive, setStateActive] = useState(router.pathname);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const item = getStorage("userRole");
    setUserRole(item);
  }, []);

  return (
    <div className="deznav show">
      <div className="deznav-scroll">
        <div
          className="nav-control"
          onClick={() => {
            handleToogle();
          }}
        >
          <div className={`hamburger `}>
            <span className="line">{SVGICON.NavHeaderIcon}</span>
          </div>
        </div>
        {userRole === "admin" ? (
          <ul className="metismenu" id="menu">
            {MenuList.map((data, index) => {
              return (
                <li
                  className={` ${stateActive === data.to ? "mm-active" : ""}`}
                  key={index}
                >
                  <Link href={data.to}>
                    <div className="menu-icon">{data.iconStyle}</div>{" "}
                    <span
                      className={`nav-text text-white`}
                    >
                      {data.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : userRole === "Coder-L2" ? (
          <ul className="metismenu" id="menu">
            {L2AuditMenuList.map((data, index) => {
              return (
                <li
                  className={` ${stateActive === data.to ? "mm-active" : ""}`}
                  key={index}
                >
                  <Link href={data.to}>
                    <div className="menu-icon">{data.iconStyle}</div>{" "}
                    <span
                      className={`nav-text text-white `}
                    >
                      {data.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className="metismenu" id="menu">
            {PhysicanMenuList.map((data, index) => {
              return (
                <li
                  className={` ${stateActive === data.to ? "mm-active" : ""}`}
                  key={index}
                >
                  <Link href={data.to}>
                    <div className="menu-icon">{data.iconStyle}</div>{" "}
                    <span
                      className={`nav-text text-white`}
                    >
                      {data.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
