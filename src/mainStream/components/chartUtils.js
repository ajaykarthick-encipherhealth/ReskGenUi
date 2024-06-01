import { extractLatestData } from "../../pages/supervisor/auditing";
import AuditedTrack from "../../../src/images/trackingImages/AuditedTrack.png";
import NotAudited from "../../../src/images/trackingImages/NotAuditedTrack.png";
import AuditHold from "../../../src/images/trackingImages/AuditHoldTrack.png";
import ReAudit from "../../../src/images/trackingImages/reAuditTrack.png";
import AuditPending from "../../../src/images/trackingImages/AuditPending.png";
import Hold from "../../../src/images/trackingImages/HoldTrack.png";
import Pending from "../../../src/images/trackingImages/PendingTrack.png";
import Completed from "../../../src/images/trackingImages/CompletedTrack.png";
import Declined from "../../../src/images/trackingImages/DeclineTrack.png";
import AuditedDeclineTrack from "../../../src/images/trackingImages/AuditDeclined.png";
import Abort from "../../../src/images/trackingImages/Abort.png";
import Image from "next/image";
import { Popover } from "antd";
import styles from "../reports/report.module.css"

export const colors = {
  A: "#8A2BE2",
  B: "#5F9EA0",
  C: "#8EE5EE",
  D: "#42426F",
  E: "#00BFFF",
  F: "#EEB4B4",
  G: "#FF4040",
  H: "#D2691E",
  I: "#4A766E",
  J: "#FF7F00",
  K: "#F08080",
  L: "#FF7256",
  M: "#FFA500",
  N: "#FF2400",
  O: "#FFB5C5",
  P: "#CD919E",
  Q: "#FF6347",
  R: "#B9FF66",
  S: "#E066FF",
  T: "#EAADEA",
  U: "#FFB90F",
  V: "#EEE9BF",
  W: "#EEEE00",
  X: "#CD0000",
  Y: "#CD8500",
  Z: "#607B8B",
};

export const getChartOption = (details) => {
  const excelCount =
    details?.sentReportCountByTypeDTOList?.find((item) => item._id === "EXCEL")
      ?.count || 0;
  const csvCount =
    details?.sentReportCountByTypeDTOList?.find((item) => item._id === "CSV")
      ?.count || 0;

  return {
    tooltip: {
      trigger: "item",
    },
    legend: {
      show: false,
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "60%"],
        label: {
          show: false,
          position: "inside",
          formatter: "{b}: {c}",
        },
        data: [
          {
            value: excelCount,
            name: "Excel",
            itemStyle: {
              color: "#B35CE1",
            },
          },
          {
            value: csvCount,
            name: "Csv",
            itemStyle: {
              color: "#0A9FFF",
            },
          },
        ],
      },
      {
        type: "pie",
        radius: ["0%", "30%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "center",
          formatter: `{b|${excelCount + csvCount}}`,
          backgroundColor: "transparent",
          rich: {
            a: {
              fontSize: 12,
            },
            b: {
              fontSize: 18,
            },
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: excelCount + csvCount,
            name: "Total",
            itemStyle: {
              color: "#fff",
            },
          },
        ],
      },
    ],
  };
};

export const getRandomColor = (letter) =>
  colors[letter.toUpperCase()] || "#B35CE1";

export const getChartUserOption = (details) => {
  const data =
    details?.sentReportUserWiseCountDtoByRole?.sentReportUserWiseCountListForSupervisor?.map(
      (item) => ({
        value: item.userCount,
        name: `${item.userNameDTO?.firstName} ${item.userNameDTO?.lastName}`,
      })
    );

  const nameColors = {};

  data?.forEach((item) => {
    const firstLetter = item.name[0];
    if (!nameColors[item.name]) {
      nameColors[item.name] = getRandomColor(firstLetter);
    }
  });

  const pieData = data?.map((item) => ({
    value: item?.value,
    name: item?.name,
    itemStyle: {
      color: nameColors[item?.name],
    },
  }));

  return {
    tooltip: {
      trigger: "item",
    },
    legend: {
      show: false,
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "60%"],
        label: {
          show: false,
          position: "inside",
          formatter: "{b}: {c}",
        },
        data: pieData,
      },
      {
        type: "pie",
        radius: ["0%", "30%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "center",
          formatter: `{b|${data?.reduce((acc, curr) => acc + curr.value, 0)}}`,
          backgroundColor: "transparent",
          rich: {
            a: {
              fontSize: 12,
            },
            b: {
              fontSize: 18,
            },
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: data?.reduce((acc, curr) => acc + curr.value, 0),
            name: "Total",
            itemStyle: {
              color: "#fff",
            },
          },
        ],
      },
    ],
  };
};

export const getChartAdminOption = (details) => {
  const data =
    details?.sentReportUserWiseCountDtoByRole?.sentReportUserWiseCountListForAdmin?.map(
      (item) => ({
        value: item?.userCount,
        name: `${item?.userNameDTO?.firstName} ${item?.userNameDTO?.lastName}`,
      })
    );

  const nameColors = {};

  data?.forEach((item) => {
    const firstLetter = item.name[0];
    if (!nameColors[item.name]) {
      nameColors[item.name] = getRandomColor(firstLetter);
    }
  });

  const pieData = data?.map((item) => ({
    value: item.value,
    name: item.name,
    itemStyle: {
      color: nameColors[item.name],
    },
  }));

  return {
    tooltip: {
      trigger: "item",
    },
    legend: {
      show: false,
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "60%"],
        label: {
          show: false,
          position: "inside",
          formatter: "{b}: {c}",
        },
        data: pieData,
      },
      {
        type: "pie",
        radius: ["0%", "30%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "center",
          formatter: `{b|${data?.reduce((acc, curr) => acc + curr.value, 0)}}`,
          backgroundColor: "transparent",
          rich: {
            a: {
              fontSize: 12,
            },
            b: {
              fontSize: 18,
            },
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: data?.reduce((acc, curr) => acc + curr.value, 0),
            name: "Total",
            itemStyle: {
              color: "#fff",
            },
          },
        ],
      },
    ],
  };
};
export const auditstatusBodyTemplate = (rowData) => {
  const declinedDataFromAudit = extractLatestData(rowData?.auditDeclinedNotes);
  const declinedDataFromDeclined = extractLatestData(
    rowData?.auditDeclinedNotes
  );

  const declinedData = declinedDataFromAudit || declinedDataFromDeclined;
  switch (rowData.auditedStatus) {
    case "AUDIT_PENDING":
      return (
        <Popover placement="bottom" title="Status: AUDIT PENDING">
          <span className="patient-status">
            <Image src={AuditPending} className={styles.imgSize} />
          </span>
        </Popover>
      );

    case "AUDITHOLD":
      return (
        <Popover placement="bottom" title=" Status: AUDIT HOLD">
          <span className="patient-status">
            <Image src={AuditHold} className={styles.imgSize} />
          </span>
        </Popover>
      );
    case "REAUDIT":
      return (
        <Popover placement="bottom" title=" Status: REAUDIT">
          <span className="patient-status">
            <Image src={ReAudit} className={styles.imgSize} />
          </span>
        </Popover>
      );
    case "AUDITED":
      return (
        <Popover placement="bottom" title=" Status: AUDITED">
          <span className="patient-status">
            <Image src={AuditedTrack} className={styles.imgSize} />
          </span>
        </Popover>
      );
    case "AUDITED":
      return (
        <span className="patient-status">
          <Image src={AuditedTrack} className={styles.imgSize} />
        </span>
      );

    case "NOT_AUDIT":
      return (
        <Popover placement="bottom" title=" Status: NOT AUDIT">
          <span className="patient-status">
            <Image src={NotAudited} className={styles.imgSize} />
          </span>
        </Popover>
      );
    case "AUDIT_DECLINED":
      return (
        <Popover
          placement="bottom"
          title=" Status: AUDIT DECLINED"
          content={`Reason: ${declinedData ? declinedData : "---"}`}
        >
          <span className="patient-status">
            <Image src={AuditedDeclineTrack} className={styles.imgSize} />
          </span>
        </Popover>
      );
    case null:
      return <span className="patient-status">---</span>;
  }
};
export const processstatusBodyTemplate = (rowData) => {
  const declinedDataFromAudit = extractLatestData(rowData?.auditDeclinedNotes);

  const declinedDataFromDeclined = extractLatestData(rowData?.declinedNotes);

  const declinedData = declinedDataFromAudit || declinedDataFromDeclined;
  if (!rowData?.processedStatus) {
    return null;
  }
  switch (rowData?.processedStatus) {
    case "COMPLETED":
      return (
        <Popover placement="bottom" title="Status: COMPLETED">
          <span className={`patient-status ${styles.textCenter}`}>
            <Image src={Completed} className={styles.imgSize} />
          </span>
        </Popover>
      );

    case "PENDING":
      return (
        <Popover placement="bottom" title="Status: PENDING">
          <span className={`patient-status ${styles.textCenter}`}>
            <Image src={Pending} className={styles.imgSize} />
          </span>
        </Popover>
      );

    case "DECLINED":
      return (
        <Popover
          placement="bottom"
          title="Status: DECLINED"
          content={`Reason: ${declinedData ? declinedData : "---"}`}
        >
          <span className={`patient-status ${styles.textCenter}`}>
            <Image src={Declined} className={styles.imgSize} />
          </span>
        </Popover>
      );

    case "NOTCOMPUTED":
      return (
        <Popover placement="bottom" title="Status: NOT COMPUTED">
          <span className={`patient-status ${styles.textCenter}`}>
            <Image src={Pending} className={styles.imgSize} />
          </span>
        </Popover>
      );
    case "COMPUTED":
      return (
        <Popover placement="bottom" title="Status: PENDING">
          <span className={`patient-status ${styles.textCenter}`}>
            <Image src={Pending} className={styles.imgSize} />
          </span>
        </Popover>
      );
    case "HOLD":
      return (
        <Popover placement="bottom" title="Status: HOLD">
          <span className={`patient-status ${styles.textCenter}`}>
            <Image src={Hold} className={styles.imgSize} />
          </span>
        </Popover>
      );
    case "ABORTED_BY_CRON":
      return (
        <Popover placement="bottom" title="Status: ABORTED BY CRON">
          <span className={`patient-status ${styles.textCenter}`}>
            <Image src={Abort} className={styles.imgSize} />
          </span>
        </Popover>
      );
    case null:
      return (
        <Popover placement="bottom" title="Status: PENDING">
          <span className={`patient-status ${styles.textCenter}`}>
            <Image src={Pending} className={styles.imgSize} />
          </span>
        </Popover>
      );
  }
};
