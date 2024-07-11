import React, { useEffect } from "react";
import { connect } from "react-redux";
import fileIcon from "../../../../../images/tenantAdmin/file.svg";
import dosIcon from "../../../../../images/tenantAdmin/dos.svg";
import pageIcon from "../../../../../images/tenantAdmin/page.svg";
import Image from "next/image";
import styles from "../../styles.module.css";
import { FilesCount } from "../../../../../stores/tenantAdmin/dashboard/default/action.js";
import { Skeleton, Spin } from "antd";

const index = ({
  getAllFilesCount,
  getAllFiles,
  dateRange,
  selectedOrganization,
  loaderButton,
  totalCountsLoader,
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
      selectedOrganization
    );
  }, [dateRange, selectedOrganization]);

  return (
    <div
      className="d-flex justify-content-between w-100"
      style={{ width: "100%" }}
    >
      {cardData?.map((item, index) => (
        <div
          className="rounded-lg "
          style={{
            backgroundColor:
              index === 0 ? "#FDF1F2" : index === 1 ? "#FDF8F2" : "#F0FFF7",
            width: "32%",
            height: "250px",
            display: "flex",
          }}
        >
          <div
            style={{ width: "90%", height: "100%", margin: "10px 0 0 10px" }}
          >
            {loaderButton && totalCountsLoader ? (
              <Skeleton.Input active size="default" className="mt-2" />
            ) : (
              <div>
                <div className="d-flex justify-content-start align-items-start gap-1" style={{height:"50px"}}> 
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: item?.iconBg,
                      borderRadius: "10px",
                      margin: "0 5px 0 0",
                      display: "flex",
                      justifyContent: "center",
                      textAlign: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image src={item?.icon} />
                  </div>
                  <div style={{ fontSize: "16px" }}  className="align-self-center">{item?.title}</div>
                </div>
               
              </div>
            )}

            {loaderButton && totalCountsLoader ? (
              <Skeleton.Input active size="default" className="mt-2" />
            ) : totalCountsLoader ? (
              <div className="d-flex justify-content-center align-items-center mt-2">
                {" "}
                <Spin size="large" />
              </div>
            ) : (
              <div className={`${styles.count}  h-50 d-flex align-items-center justify-content-center`}>{item?.count}</div>
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
