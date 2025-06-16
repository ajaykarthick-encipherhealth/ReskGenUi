import styles from "../fileDetails/styles.module.css";
import TableStyle from "../../../../../components/table/table.module.css";
import { Badge, Popover, Tooltip } from "antd";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import SvgFlag from "../svg/svg";
import { SVGICON } from "../../../../../jsx/constant/theme";
import PieChart from "./chart";
import Styles from "./styles.module.css"

const Flag = ({
  patienIdDetails,
  patientDetails,
  flagsDetailsResult,
  getFlagCounts,
}) => {
  const sortedFlags =
    flagsDetailsResult?.response?.length > 0
      ? [...flagsDetailsResult.response].sort(
          (a, b) => a.flagDetails?.priority - b.flagDetails?.priority
        )
      : [];

  const highestPriorityFlag = sortedFlags[0];

  return (
    <>
      <div className="w-100 d-flex justify-content-between">
        <div className={` mx-2`}>
          {/* <h5 className={`font-weight-bold`}>Flag</h5> */}
          {/* <div className="mt-3">
            {sortedFlags.length > 0 ? (
              <div className="d-flex align-items-center justify-content-center cr-pointer">
                <Popover
                  content={
                    <div style={{ height: "auto", overflowY: "scroll" }}>
                      <strong>Flag details</strong>
                      {sortedFlags.map((flag, index) => (
                        <div key={index} className="p-1">
                          <SvgFlag fillColor={flag?.flagDetails?.flagColour} />
                          <span className="ml-2">
                            {flag?.flagDetails?.flagName.replaceAll("_", " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  }
                  placement="right"
                >
                  <Badge
                    count={sortedFlags.length}
                    offset={[5, -3]}
                    size="small"
                    style={{ right: "3px", background: "#04306f" }}
                  >
                    <span>
                      <SvgFlag
                        fillColor={highestPriorityFlag?.flagDetails?.flagColour}
                        height="25px"
                        width="25px"
                      />
                    </span>
                  </Badge>
                </Popover>
              </div>
            ) : (
              "---"
            )}
          </div> */}
          <PieChart getFlagCounts={getFlagCounts} />
        </div>
        <div
          className={`${styles.flagHccCard2}  ${styles.rafscoreheader} p-2 mx-2`}
        >
          <h5 className={visitStyles.flagTitle}>Priority</h5>
          <div className="">
            <div className={`${visitStyles.priorityStatus} p-0`}>
              {patienIdDetails?.priority == "URGENT" ? (
                <div className={visitStyles.priorityStatusIcon}>
                  <i>{SVGICON.alert}</i>
                  <span className={`${Styles.priorityText} ${Styles.urgent}`}>
                    Urgent
                  </span>
                </div>
              ) : patienIdDetails?.priority == "HIGH" ? (
                <div className={visitStyles.priorityStatusIcon}>
                  <i className={Styles.highFlag}>{SVGICON.alert}</i>
                  <span className={`${Styles.priorityText} ${Styles.high}`}>
                    High
                  </span>
                </div>
              ) : patienIdDetails?.priority == "NORMAL" ? (
                <div className={visitStyles.priorityStatusIcon}>
                  <i className={Styles.normalFlag}>{SVGICON.alert}</i>
                  <span className={`${Styles.priorityText} ${Styles.normal}`}>
                    Normal
                  </span>
                </div>
              ) : patienIdDetails?.priority == "LOW" ? (
                <div className={visitStyles.priorityStatusIcon}>
                  <i className={Styles.lowFlag}>{SVGICON.alert}</i>
                  <span className={`${Styles.priorityText} ${Styles.low}`}>
                    Low
                  </span>
                </div>
              ) : (
                <div className={visitStyles.priorityStatusIcon}>
                  <i className={Styles.lowFlag}>{SVGICON.alert}</i>
                  <span className={`${Styles.priorityText} ${Styles.yetToSet}`}>
                    Yet To Set
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className={`${styles.flagHccCard3} ${styles.rafscoreheader} p-2 mx-2`}
        >
          <h5 className={visitStyles.flagTitle}>RAF</h5>
          <div>
            {patientDetails?.rafScore?.rafVersionDTO?.overAllScore != null ? (
              <h5 className={`pt-3 ${visitStyles.flagTitle}`}>
                {patientDetails?.rafScore?.rafVersionDTO?.overAllScore?.toFixed(
                  3
                )}
              </h5>
            ) : (
              <h5
                className={`pt-3 ${visitStyles.flagTitle}`}
                style={{ fontWeight: 400 }}
              >
                0.00
              </h5>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Flag;
