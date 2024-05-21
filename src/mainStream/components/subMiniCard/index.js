import React from "react";

const OverallReportsSection = ({ totalReports, styles }) => {
  return (
    <div className={`col-xl-3 ${styles.sentSubCard}`}>
      <div>
        <div>Overall Reports Sent</div>
        <h4>{totalReports}</h4>
      </div>
    </div>
  );
};

const OverallUsersSection = ({ totalUsers, styles }) => {
  return (
    <div className={`col-xl-3 ${styles.sentSubCard}`}>
      <div>
        <div>Overall Users</div>
        <h4>{totalUsers}</h4>
      </div>
    </div>
  );
};

const AccessCountSection = ({ data, styles }) => {
  return (
    <>
      {data?.map((item, index) => (
        <React.Fragment key={index}>
          {item._id === "READ" && (
            <div className={`col-xl-3 ${styles.readSubCard}`}>
              <div>
                <div>No of Read</div>
                <h4>{item.roleCount}</h4>
              </div>
            </div>
          )}
          {item._id === "DOWNLOAD" && (
            <div className={`col-xl-3 ${styles.downloadSubCard}`}>
              <div>
                <div>No of Download</div>
                <h4>{item.roleCount}</h4>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export { OverallReportsSection, OverallUsersSection, AccessCountSection };
