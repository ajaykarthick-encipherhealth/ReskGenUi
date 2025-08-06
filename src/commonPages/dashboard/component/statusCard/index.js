import React from "react";
import allocatedbg from "../../../../images/dashboard/allocatedbg.webp";
import pendingbg from "../../../../images/dashboard/pendingbg.webp";
import completedbg from "../../../../images/dashboard/completedbg.webp";
import reassignedBg from "../../../../images/dashboard/declinedbg.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faClockRotateLeft, faUsers } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles.module.css";
import allocated from "../../../../images/dashboard/patientCount.png";
import pending from "../../../../images/dashboard/dosCount.png";
import completed from "../../../../images/dashboard/pages.png"
import reassignedPending from "../../../../images/dashboard/completedContainer.png";
import queryCompleted from "../../../../images/dashboard/failedContainer.png";
import reassignedCompleted from "../../../../images/dashboard/processingContainer.png";
import { statusFormate } from "../../../../utils/reusable";

const statusConfig = {
  Allocated: {
    icon: <FontAwesomeIcon icon={faUsers} />,
    bgColor: allocated,
  },
  Completed: {
    icon: <FontAwesomeIcon icon={faCircleCheck} />,
    bgColor: completed,
  },
  InProgress: { //pending status
    icon: <FontAwesomeIcon icon={faClockRotateLeft} />,
    bgColor: pending,
  },
  ReassignedPending: {  //reassign pending
    icon: <FontAwesomeIcon icon={faClockRotateLeft} />,
    bgColor: reassignedPending,
  },
  ReassignedCompleted: {
    bgColor: reassignedCompleted,
  },
  QueryPending: {
    bgColor: completed,
  },
  QueryApproved: {
    bgColor: queryCompleted
  },
  QueryCompleted: {
    bgColor: queryCompleted
  }
};

const StatusCard = ({
  coderName = "CODER_1",
  status = "Allocated",
  value = 0,
  label = "Charts",
  subtitle = "Last 3 days",
  col
}) => {
  const { icon, bgColor } = statusConfig[status] || {};
  return (
    <div
      style={{
        backgroundImage: `url(${bgColor?.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        border: '2px solid #B3B3B3',
        height: '120px',
        padding: '16px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',

      }}
    >
      <div className={`${styles.headerFont}`}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* {icon} */}
          <div>
            {/* <strong>{coderName}</strong> */}
            <div>{statusFormate(status)}</div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "left" }} className="mt-2">
        <div className={styles.labelFont}>
          {value} {label}
        </div>
      </div>

      <div style={{ color: "#ffff" }} className={`${styles.subtitleFont} mt-2`}>
        {/* {subtitle} */}
      </div>
    </div>
  );
};

export default StatusCard;
