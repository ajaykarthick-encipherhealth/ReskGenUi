import dayjs from "dayjs";
import { Empty, Avatar } from "antd";
import TableStyle from "../../../../components/table/table.module.css";
import classnames from "classnames";
import { SVGICON } from "../../../../jsx/constant/theme";
import { useRouter } from "next/router";

export const priorityStatus = (value, iconsOnly) => {
  switch (value) {
    case "URGENT":
      return (
        <>
          <i>{SVGICON.alert}</i>{" "}
          {!iconsOnly && (
            <span style={{ fontSize: "13px", color: "red" }}>Urgent</span>
          )}
        </>
      );
    case "HIGH":
      return (
        <>
          <i className={TableStyle.highFlag}>{SVGICON.alert}</i>
          {!iconsOnly && (
            <span style={{ fontSize: "13px", color: "#cf940a" }}>High</span>
          )}
        </>
      );
    case "NORMAL":
      return (
        <>
          <i className={TableStyle.normalFlag}>{SVGICON.alert}</i>
          {!iconsOnly && (
            <span style={{ fontSize: "13px", color: "#4466ff " }}>Normal</span>
          )}
        </>
      );
    case "LOW":
      return (
        <>
          <i className={TableStyle.lowFlag}>{SVGICON.alert}</i>{" "}
          {!iconsOnly && (
            <span style={{ fontSize: "13px", color: "#87909e" }}>Low</span>
          )}
        </>
      );
    default:
      break;
  }
};

function PatientTable({ patinetListAll }) {
  const currentDate = dayjs();
  const router = useRouter();

  const handleRoute = (id) => {
    const encodedParams = btoa(
      JSON.stringify({
       id:id
      })
    );
    router.push(`/physician/comparison?id=${encodedParams}`);
  };

  const renderRows = () => {
    return patinetListAll?.length === 0 ? (
      <Empty />
    ) : (
      patinetListAll?.map((data, index) => {
        const formattedDate = dayjs(data.date).format("YYYY-MM-DD");
        const isPastDate = dayjs(data.date).isBefore(currentDate, "day");
        const tdClass = classnames({
          [TableStyle.grayedOut]: isPastDate,
        });
        return (
          <tr key={index}>
            <td
              className={classnames(TableStyle.firstTdBorder, tdClass)}
              onClick={() => handleRoute(data?.id)}
            >
              {data.mrnNumber ? data.mrnNumber : "---"}
            </td>
            <td
              className={classnames(TableStyle.childBorder, tdClass)}
              style={{ paddingLeft: "50px" }}
              onClick={() => handleRoute(data?.id)}
            >
              {data.patientName || data?.profilePictureUrl ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ marginRight: "10px" }}>
                    <Avatar src={data?.profilePictureUrl} />
                  </span>
                  <span>{data.patientName}</span>
                </div>
              ) : (
                <div style={{}}>---</div>
              )}
            </td>
            <td
              className={classnames(TableStyle.childBorder, tdClass)}
              onClick={() => handleRoute(data?.id)}
            >
              {data?.rafScore ? data?.rafScore : "---"}
            </td>
            <td
              className={classnames(TableStyle.childBorder, tdClass)}
              style={{ paddingLeft: "40px" }}
              onClick={() => handleRoute(data?.id)}
            >
              {data?.date ? formattedDate : "---"} &nbsp; &nbsp;
              {data?.time ? data?.time : "---"}
            </td>
            <td
              className={classnames(TableStyle.childBorder, tdClass)}
              style={{ width: "200px" }}
            >
              {data?.priority ? priorityStatus(data?.priority) : "---"}
            </td>
          </tr>
        );
      })
    );
  };

  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>MRN NUMBER</th>
            <th className={TableStyle.rowStyle2}>PATIENT NAME</th>
            <th className={TableStyle.rowStyle2}>RAF SCORE</th>
            <th className={TableStyle.rowStyle2}> DATE & TIME</th>
            <th style={{ paddingLeft: "30px" }}>PRIORITY</th>
          </tr>
        </thead>
        <tbody>
          {patinetListAll?.length <= 0 ? (
            <tr>
              <td colSpan="10">
                <Empty />
              </td>
            </tr>
          ) : (
            renderRows()
          )}
        </tbody>
      </table>
      <div></div>
    </div>
  );
}

export default PatientTable;
