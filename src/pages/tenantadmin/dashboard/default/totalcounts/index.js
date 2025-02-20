import React, { useEffect } from "react";
import { connect } from "react-redux";
import fileIcon from "../../../../../images/tenantAdmin/file.svg";
import dosIcon from "../../../../../images/tenantAdmin/dos.svg";
import pageIcon from "../../../../../images/tenantAdmin/page.svg";
import Image from "next/image";
import styles from "../../styles.module.css";
import { FilesCount } from "../../../../../stores/tenantAdmin/dashboard/default/action.js";
import { Skeleton, Tooltip } from "antd";
import { formatNumber } from "../../../../../utils/reusable.js";

const index = ({
  getAllFilesCount,
  getAllFiles,
  dateRange,
  selectedOrganization,
  totalCountsLoader,
  selectDos
}) => {
  const cardData = [
    {
      id: 1,
      title: "File/Patients Count",
      count: getAllFiles?.totalFiles,
      icon: fileIcon,
      iconBg: "#F9D2D4",
    },
    {
      id: 2,
      title: "DOS Count",
      count: getAllFiles?.totalDosCount,
      icon: dosIcon,
      iconBg: "#F8E9D3",
    },
    {
      id: 2,
      title: "Pages",
      count: getAllFiles?.totalPages,
      icon: pageIcon,
      iconBg: "#CCFFE5",
    },
  ];

  useEffect(() => {
    getAllFilesCount(
      dateRange.startDate,
      dateRange.endDate,
      selectedOrganization,
      selectDos
    );
  }, [dateRange, selectedOrganization,selectDos]);
  return (
    <div
      className="d-flex justify-content-between w-100 gap-2"
      
    >
      {cardData?.map((item, index) => (
        <div
          className="rounded-lg "
          style={{
            backgroundColor:
              index === 0 ? "#FDF1F2" : index === 1 ? "#FDF8F2" : "#F0FFF7",
            width: "35%",
            height: "250px",
            display: "flex",
          }}
        >
          <div
            style={{ width: "90%", height: "100%", margin: "10px 0 0 4px" }}
          >
            {totalCountsLoader ? (
              <Skeleton.Input active size="small" className="mt-2" />
            ) : (
              <div>
                <div
                  className="d-flex justify-content-start align-items-center gap-2 m-auto"
                  style={{ height: "50px" ,width:"95%"}}
                >
                  <div
                    style={{
                      width: "30%",
                      height: "40px",
                      backgroundColor: item?.iconBg,
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "center",
                      textAlign: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image src={item?.icon} />
                  </div>
                  <div
            
                    className="tenant_count align-self-center font-medium"
                  >
                    {item?.title}
                  </div>
                </div>
              </div>
            )}

            {totalCountsLoader ? (
              <Skeleton.Input active size="small" className="mt-2" />
            ) : (
              <div
                className={`${styles.count}  h-50 d-flex align-items-center justify-content-center`}
              >
                 <Tooltip
                  title={
                    item?.count &&
                    item?.count
                  }
                >
                  {item?.count
                    ? formatNumber(item?.count)
                    : 0}
                </Tooltip>
                {/* {item?.count} */}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    getAllFiles:
      state?.tenantAdmin?.dashboard?.default?.allFilesCounts?.data?.response,
    totalCountsLoader:
      state?.tenantAdmin?.dashboard?.default?.totalCountsLoader,
  }),
  {
    getAllFilesCount: FilesCount,
  }
);
export default enhancer(index);
