import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { createIdGen, getAccessTabItems, handleCopyTextInput, tableSkeleton } from "../../utils/reusable";
import { getStorage } from "../../utils/storages";
import { getTableView } from "../../stores/tableView/network";
import { Skeleton } from "antd";
import { getPageId, pageIds } from "../../pages/tenantadmin/tin";
import { connect } from "react-redux";

const SubNavBar = ({
  handleBack,
  hideBackArrow,
  activeTabName,
}) => {
  const role = getStorage("userRole");
  const [metaData, setMetaData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const tabs = getAccessTabItems({ page: "Tin", tabsMenu: "tabMenuList" });
  const activeTab = activeTabName || tabs?.[0] || "Active";
    const pageIds =
    activeTab === "Active"
      ? "2d7cb7f7-6dad-41fb-970b-d805fb3f195f"
      : activeTab === "InActive"
      ? "6579b31a-aa46-42bf-abbb-c1e17e987a3a"
      : activeTab === "Providers"
      ? "32e9eea6-095c-4bd3-abee-17835ea53cdc"
      : "";
  // const getAllTins = async () => {
  //   setLoading(true);
  //   const pageId = getPageId(activeTab);
  //   const userId = getStorage("userId");
  //   const tin = getStorage("tinNumber");

  //   const result = await getTableView({
  //     pageId,
  //     pageNo: 0,
  //     projectId: "test",
  //     tin,
  //     patientAllocated: userId,
  //     isAdmin: true,
  //   });

  //   const response = result?.response || {};
  //   setMetaData(response.metaDataDTO || []);
  //   setTableData(response.pageResponse?.content || []);
  //   setLoading(false);
  // };
  const getAllTins = async (tabOverride) => {
    const currentTab = tabOverride || activeTab;
    const pageId = getPageId(currentTab);
    console.log(pageId, "pageId");
   const userId = getStorage("userId");
   const tin = getStorage("tinNumber");
     setLoading(true);
     const result = 
    await getTableView({
      pageId,
      pageNo: 0,
      projectId: "test",
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
  }, []);

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

      <div className={styles.tabContainer}>
        {loading ? (
          <div className="mx-3 w-100">
            {Array.from({ length: 1 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="d-flex gap-4 flex-wrap pb-2 border-bottom py-2"
              >
                {Array.from({ length: 1 }).map((_, rowIndex) => (
                  <div key={rowIndex} style={{ width: 150 }}>
                    {tableSkeleton({ rows: 1, columns: 1 })}
                  </div>
                ))}
              </div>
            ))}
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
                    <span className={styles.count}>
                      {row[field.actualField] || "--"}
                    </span>
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
  }),
  {

  }
);

export default enhancer(SubNavBar);