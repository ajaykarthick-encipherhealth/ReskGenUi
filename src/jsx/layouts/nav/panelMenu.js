import React, { useEffect, useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import Styles from "./styles.module.css";
import { getStorage, setStorage } from "../../../utils/storages";
import { useRouter } from "next/router";
import { PhysicanMenuList, ProviderMenuList } from "./Menu";

const PanelMenu = ({
  currentRole,
  setMenuList,
  panelName,
  setPanelName,
  roles,
}) => {
  const router = useRouter();
  const [index, setIndex] = useState(
    panelName.toLowerCase() === "workqueue panel" ? 1 : 0
  );
  const [panelMenuList, setPanelMenuList] = useState([]);

  const handleLeftClick = (name) => {
    const allRoles = JSON.parse(getStorage("userAllRoles"));
    let selectedRoleObj = allRoles?.find((res) => res.label === currentRole);
    setStorage("panelName", selectedRoleObj?.details?.panelList?.panel1Name);
    setPanelName(selectedRoleObj?.details?.panelList?.panel1Name);
    if (index > 0) setIndex(index - 1);
    setStorage(
      "accessMenuList",
      JSON.stringify(selectedRoleObj?.details?.panelList?.accessListForPanel1)
    );
    const firstAccess =
      selectedRoleObj?.details?.panelList?.accessListForPanel1[0];
    setMenuList(
      ProviderMenuList(selectedRoleObj?.details?.panelList?.accessListForPanel1)
    );
    const dynamicPath =
      firstAccess?.title?.toLowerCase().replace(/\s+/g, "") || "dashboard";
    let dynamicRoute = "";
    dynamicRoute = `/tenantadmin/${dynamicPath}`;
    if (router.pathname !== dynamicRoute) {
      router.push(dynamicRoute);
    } else {
      router.push(dynamicRoute).then(() => {
        window.location.reload();
      });
    }
  };

  const handleRightClick = (name) => {
    const allRoles = JSON.parse(getStorage("userAllRoles"));
    let selectedRoleObj = allRoles?.find((res) => res.label === currentRole);
    setStorage("panelName", selectedRoleObj?.details?.panelList?.panel2Name);
    setPanelName(selectedRoleObj?.details?.panelList?.panel2Name);
    if (index < panelMenuList.length - 1) setIndex(index + 1);
    setStorage(
      "accessMenuList",
      JSON.stringify(selectedRoleObj?.details?.panelList?.accessListForPanel2)
    );
    const firstAccess =
      selectedRoleObj?.details?.panelList?.accessListForPanel2[0];
    setMenuList(
      PhysicanMenuList(selectedRoleObj?.details?.panelList?.accessListForPanel2)
    );
    const dynamicPath =
      firstAccess?.title?.toLowerCase().replace(/\s+/g, "") || "dashboard";
    let dynamicRoute = "";
    dynamicRoute = `/reviewer/${dynamicPath}`;
    if (router.pathname !== dynamicRoute) {
      router.push(dynamicRoute);
    } else {
      router.push(dynamicRoute).then(() => {
        window.location.reload();
      });
    }
  };

  useEffect(() => {
    let findRoles = roles?.find(
      (res) => res.details?.proxyRole === currentRole
    );
    var key = [
      findRoles?.details?.panelList?.panel1Name,
      findRoles?.details?.panelList?.panel2Name,
    ];
    setPanelMenuList(key);
  }, []);

  useEffect(() => {
    setIndex(panelName.toLowerCase() !== "workqueue panel" ? 0 : 1);
  }, [panelName]);

  return (
    <div className={Styles.panelDiv}>
      <LeftOutlined
        style={{ fontSize: "14px" }}
        className={`cr-pointer ${index === 0 ? Styles.disabled : ""}`}
        onClick={() => handleLeftClick("Owner Panel")}
      />
      <div className={Styles.panleLable}>
        {panelName ? panelName : "Owner Panel"}
      </div>
      <RightOutlined
        style={{ fontSize: "14px" }}
        className={`cr-pointer ${
          index === panelMenuList.length - 1 ? Styles.disabled : ""
        }`}
        onClick={() => handleRightClick("Workqueue Panel")}
      />
    </div>
  );
};

export default PanelMenu;
