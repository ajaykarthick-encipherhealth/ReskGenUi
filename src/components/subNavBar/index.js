import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { createIdGen, getAccessTabItems, handleCopyTextInput, reusableEllipses, tableSkeleton } from "../../utils/reusable";
import { getStorage } from "../../utils/storages";
import { getTableView } from "../../stores/tableView/network";
import { Skeleton, Tooltip } from "antd";
import { getPageId, pageIds } from "../../pages/tenantadmin/tin";
import { connect } from "react-redux";
import TableSkeleton from "../skeleton/table";
import CardSkeleton from "../skeleton/card";

const SubNavBar = ({ handleBack, hideBackArrow, pageLoad }) => {
  const role = getStorage("userRole");
  const [metaData, setMetaData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const tabs = getAccessTabItems({ page: "Tin", tabsMenu: "tabMenuList" });

  const getAllTins = async (tabOverride) => {
    const activeTab = getStorage("activeTabTin");
    const currentTab = tabOverride || activeTab;
    const pageId = getPageId(currentTab);
   const userId = getStorage("userId");
   const tin = getStorage("tinNumber");
       const projectId = getStorage("project");
     setLoading(true);
     const result = await getTableView({
       pageId,
       pageNo: 0,
       projectId: projectId,
       tin,
       patientAllocated: userId,
       isAdmin: true,
     });
    const response = result?.response || {};
    setMetaData(response.metaDataDTO || []);
    setTableData(response.pageResponse?.content || []);
    setLoading(false);
  };

  useEffect(() => {
    getAllTins();
  }, [pageLoad]);

  const activeFields = metaData?.filter((field) => field.active);

  return (
    <section className={`${styles.tabMainContainer} d-flex align-items-center`}>
      {hideBackArrow && (
        <div
          onClick={handleBack}
          className={`${styles.arrowBtn} cursor-pointer mx-3`}
          data-testid={createIdGen(`${role} tin backicon`)}
          id={createIdGen(`${role} tin backicon`)}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </div>
      )}

      <div className={`w-100 ${styles.tabContainer}`}>
        {loading ? (
          <div className="w-100">
            <CardSkeleton/>
          </div>
        ) : tableData.length === 0 ? (
          <div className="mx-3">No records found.</div>
        ) : (
          [tableData[0]].map((row, rowIndex) => (
            <section
              key={rowIndex}
              className="d-flex mx-3 gap-4 pb-2 flex-wrap border-bottom py-2"
            >
              {activeFields.map((field, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`cr-pointer px-2 ${styles.headerContent}`}
                >
                  <div className={`pb-1 fw-bold ${styles.headerTitle}`}>
                    {field.headerName.toUpperCase()}
                  </div>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    data-testid={createIdGen(`${role} tin copyicon`)}
                    id={createIdGen(`${role} tin copyicon`)}
                  >
                    <Tooltip title={row[field.actualField]}>
                      {reusableEllipses({
                        str: row[field.actualField] || "--".toString(),
                        count: 15,
                      })}
                    </Tooltip>
                    {/* <span className={styles.count}>
                      {row[field.actualField] || "--"}
                    </span> */}
                    {field.headerName === "Tin Id" &&
                      row[field.actualField] && (
                        <FontAwesomeIcon
                          icon={faCopy}
                          className="cr-pointer mx-2"
                          onClick={() =>
                            handleCopyTextInput(row[field.actualField])
                          }
                        />
                      )}
                  </div>
                </div>
              ))}
            </section>
          ))
        )}
      </div>
    </section>
  );
};

const enhancer = connect(
  (state) => ({
    activeTabName: state.tenantAdmin.tin?.activeTabRoutedData?.tinTabName,
    pageLoad: state?.tenantAdmin?.tin?.getPageRendering,
  }),
  {}
);

export default enhancer(SubNavBar);
