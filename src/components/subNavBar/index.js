import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {
  createIdGen,
  getAccessTabItems,
  handleCopyTextInput,
  reusableEllipses,
} from "../../utils/reusable";
import { getStorage } from "../../utils/storages";
import { getTableView } from "../../stores/tableView/network";
import { Tooltip } from "antd";
import { getPageId } from "../../pages/tenantadmin/tin";
import { connect } from "react-redux";
import CardSkeleton from "../skeleton/card";
import { activeTinPageId } from '../../utils/pageIds'
import { actions as tableAction } from '../../stores/tableView'

const SubNavBar = ({ handleBack, hideBackArrow, pageLoad ,getTableData}) => {
  const role = getStorage("userRole");
  const [metaData, setMetaData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllTins = async (tabOverride) => {
    const activeTab = getStorage("activeTabTin");
    const currentTab = tabOverride || activeTab;
    const pageId = getPageId(currentTab);
    const userId = getStorage("userId");
    const tin = getStorage("tinNumber");
    const projectId = getStorage("project");
    setLoading(true);
    const result = await getTableData({
      pageId:activeTinPageId,
      pageNo: 0,
      projectId: projectId,
      tin,
      patientAllocated: userId,
      isAdmin: true,
    });
    const response = result?.response || {};
    setLoading(false);
    setMetaData(response.metaDataDTO || []);
    setTableData(response.pageResponse?.content || []);
  };

  useEffect(() => {
    getAllTins();
  }, [pageLoad]);

  const activeFields = metaData?.filter((field) => field.active);
  return (
    <div className={`${styles.tabMainContainer} d-flex align-items-center`}>
      {hideBackArrow && (
        <div
          onClick={handleBack}
          className={`${styles.arrowBtn} cursor-pointer mx-3`}
          data-testid={createIdGen(`${role} tin backicon`)}
          id={createIdGen(`${role} tin backicon`)}
        >
          <div className={styles.filterBtn}>
          <FontAwesomeIcon icon={faArrowLeft} /></div>
        </div>
      )}

      <div className={`w-100 ${styles.tabContainer}`}>
        {loading ? (
          <div className="w-100">
            <CardSkeleton height={60} />
          </div>
        ) : tableData.length === 0 ? (
          <div className="mx-3">No records found.</div>
        ) : (
          tableData.map((row, rowIndex) => (
            <section
              key={rowIndex}
              className="d-flex mx-3 gap-4 pb-2 flex-wrap  py-2"
            >
              {activeFields.map((field, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`cr-pointer px-2 ${styles.headerContent}`}
                >
                  <div className={`pb-1 fw-bold ${styles.headerTitle}`}>
                    {field?.headerName?.toUpperCase()}
                  </div>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    data-testid={createIdGen(`${role} tin copyicon`)}
                    id={createIdGen(`${role} tin copyicon`)}
                  >
                    <Tooltip title={row[field.actualField]}>
                      <div className= {styles.subText}>
                      {reusableEllipses({
                        str: row[field.actualField] || "--".toString(),
                        count: 15,
                      })}
                      </div>
                     
                    </Tooltip>
                    {field.headerName === "TIN Name" &&
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
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    activeTabName: state.tenantAdmin.tin?.activeTabRoutedData?.tinTabName,
    pageLoad: state?.tenantAdmin?.tin?.getPageRendering,
    tableLoader: state?.tableView?.tableViewLoading,
  }),
  {
     getTableData: tableAction.tinData,
  }
);

export default enhancer(SubNavBar);
