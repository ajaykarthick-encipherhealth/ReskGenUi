import moment from "moment";
import Style from "./table.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  InfoCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Empty,
  Image,
  Popover,
  Select,
  Spin,
  Switch,
  Tooltip,
} from "antd";
import {
  auditStatusTemplate,
  processstatusBodyTemplate,
  renderUserProfile,
  renderUserProfileDisable,
  reusableEllipses,
  tableSkeleton,
  createIdGen,
} from "../../utils/reusable";
import { priorityOptions, priorityStatus } from "../headerFilters/functions";
import Legends from "../legends";
import { bullets } from "../../pages/reviewer/patients";
import { auditBullets } from "../../pages/supervisor/auditing";
import { CircularProgressbar } from "react-circular-progressbar";
import EditButton from "../../images/adminUsers/EditButton";
import EditButtonDisbled from "../../images/adminUsersDisabled/EditButtonDisabled";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { batchBullets } from "../../pages/tenantadmin/patients";
import { useRouter } from "next/router";
import { Paginator } from "primereact/paginator";

const AppTable = ({
  switchStates,
  data,
  column,
  status,
  setAction,
  count = 18,
  onSwitchToggle,
  totalLength,
  loader,
  onRowClick,
  handleRowCheckboxChange,
  checkBoxLoader,
  handleUpload,
  disableUser,
  rowHighlight = false,
  activeItem,
  setActiveItem,
  handleReportIcon,
  setTriggeredBatch,
  setOpenUpload,
  openUpload,
  handleBatchTrigger,
  tableHeight,
  isReportPage,
  triggeredId,
  isNullable,
  setSelectedRows,
  selectedRows,
  onPageChange,
  sort,
  setSort,
  handlePriorityChange,
  setRowData,
  setPopoverVisible,
  setSelectedRoles,
  optionsUser,
  setSelectedManager,
  getContent,
  popoverVisible,
  isMultiple,
  actionBodyTemplate,
  statusBodyTemplate,
  getRetregger,
  id,
  infoIcon = true,
  tableId,
  renderFlagCell,
  first,
  totalRecords,
  row,
}) => {
  const router = useRouter();
  const columnsArr = Array.from({ length: column?.length || 5 });
  return (
    <div className="customTable">
      <div
        id={
          tableId
            ? createIdGen("table " + tableId)
            :createIdGen(
              "row " + router.pathname.replaceAll("/", " ")
            )
        }
        className={`${
          tableHeight ? Style.pageContainer1 : Style.pageContainer
        }`}
      >
        <div className={Style.pageContent}>
          <table className={Style.classTable}>
            <thead
              className={`${Style.classThead} ${
                isReportPage && Style.scrollIssue
              }`}
            >
              <tr>
                {column?.map((item, index) => (
                  <TableHeadItem
                    infoIcon={infoIcon}
                    item={item}
                    sort={sort}
                    setSort={setSort}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {loader ? (
                [...Array.from({ length: 15 })]?.map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {columnsArr?.map((_, colIndex) => (
                      <td  className="mx-1"  key={colIndex}>
                        {tableSkeleton({ rows: 1, columns: 1 })}
                      </td>
                    ))}
                  </tr>
                ))
              ) : data?.length > 0 ? (
                data?.map((item, index) => (
                  <TableRow
                    colIndex={index}
                    item={item}
                    column={column}
                    status={status}
                    setAction={setAction}
                    count={count}
                    switchStates={switchStates}
                    onSwitchToggle={onSwitchToggle}
                    onRowClick={onRowClick}
                    handleRowCheckboxChange={handleRowCheckboxChange}
                    checkBoxLoader={checkBoxLoader}
                    handleUpload={handleUpload}
                    disableUser={disableUser}
                    rowHighlight={rowHighlight}
                    activeItem={activeItem}
                    setActiveItem={setActiveItem}
                    handleReportIcon={handleReportIcon}
                    setTriggeredBatch={setTriggeredBatch}
                    setOpenUpload={setOpenUpload}
                    openUpload={openUpload}
                    handleBatchTrigger={handleBatchTrigger}
                    btnOnClick={(rowData) => handleAllocateClick(rowData)}
                    triggeredId={triggeredId}
                    isNullable={isNullable}
                    setSelectedRows={setSelectedRows}
                    selectedRows={selectedRows}
                    handlePriorityChange={handlePriorityChange}
                    setRowData={setRowData}
                    setPopoverVisible={setPopoverVisible}
                    setSelectedRoles={setSelectedRoles}
                    optionsUser={optionsUser}
                    setSelectedManager={setSelectedManager}
                    getContent={getContent}
                    popoverVisible={popoverVisible}
                    isMultiple={isMultiple}
                    actionBodyTemplate={actionBodyTemplate}
                    statusBodyTemplate={statusBodyTemplate}
                    getRetregger={getRetregger}
                    infoIcon={infoIcon}
                    tableId={tableId}
                    renderFlagCell={renderFlagCell}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={columnsArr?.length}>
                    <div className="d-flex align-items-center justify-content-center">
                      <Empty />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="pagination-container">
            <Paginator
              id="pagination"
              name="pagination"
              first={first}
              rows={row ? row : 15}
              totalRecords={totalRecords}
              onPageChange={onPageChange}
            />
            <div className="total-pages">
              Total count: {totalRecords ? totalRecords : "0"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TableHeadItem = ({ item, sort, setSort }) => {
  if (item.sortable) {
    return (
      <th className="text-start text-truncate font2">
        {item.name.toUpperCase()}{" "}
        {sort?.[item.value]?.sortDir === "ASC" ? (
          <ArrowUpOutlined
            onClick={() => {
              if (setSort) {
                setSort((prev) => ({
                  ...prev,
                  [item.value]: {
                    sortField: item?.value,
                    sortDir: "DESC",
                  },
                  sortField: item?.value,
                  sortDir: "DESC",
                }));
              }
            }}
          />
        ) : (
          <ArrowDownOutlined
            onClick={() => {
              if (setSort) {
                setSort((prev) => ({
                  ...prev,
                  [item.value]: {
                    sortField: item?.value,
                    sortDir: "ASC",
                  },
                  sortField: item?.value,
                  sortDir: "ASC",
                }));
              }
            }}
          />
        )}
      </th>
    );
  }
  if (item.status || item?.auditedStatus || item?.batchStatus) {
    return (
      <th className="text-center text-truncate  ">
        {item.name.toUpperCase()}
        <>
          {item?.infoIcon ? (
            <Popover
              content={
                <>
                  <Legends
                    bullets={
                      item.auditedStatus
                        ? auditBullets
                        : item?.batchStatus
                        ? batchBullets
                        : bullets
                    }
                    display="block"
                    padding="0 0px 10px 0"
                  />
                </>
              }
              trigger={["click"]}
              placement="bottom"
            >
              <InfoCircleFilled className={`font2 ${Style.infoIcon}`} />
            </Popover>
          ) : (
            ""
          )}
        </>
      </th>
    );
  }
  if (item.isTooltip ) {
    return (
      <th className="text-center text-truncate cr-pointer">
        <Tooltip
          title={
            item.name == "RC"
              ? "REVIEWER CHANGES"
              : "REVIEWER CHANGES REJECTION"
          }
          placement="bottom"
        >
          {item.name.toUpperCase()}
        </Tooltip>

        <></>
      </th>
    );
  }
  return (
    <th className="text-start text-truncate   font2">
      {typeof item?.name === "string" ? item?.name?.toUpperCase() : item?.name}
    </th>
  );
};
const TableRow = ({
  item,
  column,
  setAction,
  count,
  onRowClick,
  handleRowCheckboxChange,
  setSelectedRowsId,
  checkBoxLoader,
  selectedRowsId,
  disableUser,
  rowBackground,
  setSelectedRows,
  activeItem,
  selectedRows,
  isNullable,
  handlePriorityChange,
  onSwitchToggle,
  setRowData,
  setPopoverVisible,
  setSelectedRoles,
  optionsUser,
  setSelectedManager,
  getContent,
  popoverVisible,
  isMultiple,
  actionBodyTemplate,
  statusBodyTemplate,
  getRetregger,
  switchStates,
  tableId,
  colIndex,
  renderFlagCell,
}) => {
  const router = useRouter();
  return (
    <tr
      id={
        tableId
          ? createIdGen("row " + tableId + colIndex)
          : createIdGen(
              "row " + router.pathname.replaceAll("/", " ") + colIndex
            )
      }
      onClick={(e) => {
        e.stopPropagation();
        onRowClick && onRowClick(item);
      }}
      className={`${disableUser && !item?.accountStatus && Style.disableUser} ${
        Style.tbodyRow
      } ${activeItem?.id === item?.id ? Style.activeRow : ""} text-start`}
      style={{ backgroundColor: rowBackground, height: "35px" }}
    >
      {column?.map((columnItem, index) => {
        if (columnItem.name == "Priority") {
          return (
            <td
              style={{ cursor: "not-allowed" }}
              className={`font2 ${
                index == 0
                  ? Style.firstTdBorder
                  : column.length - 1 == index
                  ? Style.lastBorder
                  : Style.childBorder
              }`}
            >
              <span className="text-secondary">
                {" "}
                {item?.priority
                  ? priorityStatus(item?.priority)
                  : "Set Priority"}
              </span>
            </td>
          );
        }
        if (columnItem.name == "priority") {
          return (
            <td
              className={`font2 ${
                disableUser && !item?.accountStatus && Style.disableUser
              } ${
                index == 0
                  ? Style.firstTdBorder
                  : column.length - 1 === index
                  ? Style.lastBorder
                  : Style.childBorder
              }`}
            >
              <span
                id={
                  tableId
                    ? createIdGen("selectpriority " + tableId + colIndex)
                    : createIdGen(
                        "selectpriority " +
                          router.pathname.replaceAll("/", " ") +
                          colIndex
                      )
                }
                className="text-secondary"
              >
                <Select
                  options={priorityOptions}
                  placeholder="Set priority"
                  className={`custom-ant-select ${Style.customAntSelect}`}
                  showSearch={false}
                  value={
                    item?.priority
                      ? item?.priority
                      : priority?.patientId === item?.patientId
                      ? priority?.selectedValue
                      : "Set Priority"
                  }
                  onClick={(e) => e.stopPropagation()}
                  onChange={(value) =>
                    handlePriorityChange(item?.patientId, value)
                  }
                  style={{ width: "100%" }}
                />
              </span>
            </td>
          );
        }

        if (columnItem.isImage) {
          return (
            <td
              style={{
                backgroundColor:
                  item.accountStatus === false ? "#0000001a" : "",
              }}
              className={`font2 ${
                index == 0
                  ? Style.firstTdBorder
                  : column.length - 1 == index
                  ? Style.lastBorder
                  : Style.childBorder
              } `}
            >
              {item.accountStatus === false ? (
                <span
                  style={{
                    color: item.accountStatus === false ? "gray" : "",
                  }}
                >
                  {item[columnItem?.fromObject] === "SYSTEM" ? (
                    <div>{item[columnItem?.fromObject]}</div>
                  ) : (
                    renderUserProfileDisable(item, columnItem)
                  )}
                </span>
              ) : (
                <span
                  style={{
                    color: item.accountStatus === false ? "gray" : "",
                  }}
                >
                  {item[columnItem?.fromObject] === "SYSTEM" ? (
                    <div>{item[columnItem?.fromObject]}</div>
                  ) : (
                    renderUserProfile(item, columnItem)
                  )}
                </span>
              )}
            </td>
          );
        }

      if (columnItem.isComma) {
        return (
          <td
            style={{
              backgroundColor: item.accountStatus === false ? "#0000001a" : "",
            }}
            className={
              index === 0
                ? Style.firstTdBorder
                : column.length - 1 === index
                ? Style.lastBorder
                : Style.childBorder
            }
            key={index}
          >
            <span
              style={{
                color: item.accountStatus === false ? "gray" : "",
              }}
            >
              {item[columnItem.value]
                ? item[columnItem.value]
                    .map((val) => val.replace(/_/g, " "))
                    .join(", ")
                : "---"}
            </span>
          </td>
        );
      }

        if (columnItem.isBoolean) {
          return (
            <td
              className={
                index === 0
                  ? Style.firstTdBorder
                  : column.length - 1 === index
                  ? Style.lastBorder
                  : Style.childBorder
              }
              style={{
                backgroundColor:
                  item.accountStatus === false ? "#0000001a" : "",
              }}
              key={index}
            >
              <span
                style={{
                  color: item.accountStatus === false ? "gray" : "",
                }}
              >
                {item[columnItem.value] === false
                  ? columnItem.falseValue
                  : columnItem.truthValue}
              </span>
            </td>
          );
        }
        if (columnItem.objValue) {
          return (
            <td
              style={{
                backgroundColor:
                  item.accountStatus === false ? "#0000001a" : "",
              }}
              className={
                index === 0
                  ? Style.firstTdBorder
                  : column.length - 1 === index
                  ? Style.lastBorder
                  : Style.childBorder
              }
              key={index}
            >
              <span
                style={{
                  color: item.accountStatus === false ? "gray" : "",
                }}
              >
                {item[columnItem.value.firstValue] &&
                item[columnItem.value.firstValue][columnItem.value.secondValue]
                  ? item[columnItem.value.firstValue][
                      columnItem.value.secondValue
                    ]
                  : "---"}
              </span>
            </td>
          );
        }
        if (columnItem?.isAction) {
          return item.accountStatus === true ? (
            <td
              className={Style.childBorder}
              style={{
                backgroundColor:
                  item.accountStatus === false ? "#0000001a" : "",
              }}
            >
              <Popover
                id="antd-popover"
                name="antd-popover"
                content={() => getContent(item)}
                trigger="click"
                open={popoverVisible === item?.id}
              >
                <div
                  style={{
                    backgroundColor:
                      item.accountStatus === false ? "#0000001a" : "",
                  }}
                  id={
                    tableId
                      ? createIdGen("edit " + tableId + colIndex)
                      : createIdGen(
                          "edit " +
                            router.pathname.replaceAll("/", " ") +
                            colIndex
                        )
                  }
                  onClick={() => {
                    setRowData(item);
                    setPopoverVisible(item?.id);
                    setSelectedRoles(item?.role);

                    const manager = optionsUser?.find(
                      (data) => data.value === item.managerId
                    );
                    setSelectedManager(manager?.value);
                  }}
                >
                  <EditButton />
                </div>
              </Popover>
            </td>
          ) : (
            <td
              className={Style.childBorder}
              style={{
                backgroundColor:
                  item.accountStatus === false ? "#0000001a" : "",
              }}
            >
              <div
                id={
                  tableId
                    ? createIdGen("editDisabled " + tableId + colIndex)
                    : createIdGen(
                        "editDisabled " +
                          router.pathname.replaceAll("/", " ") +
                          colIndex
                      )
                }
              >
                <EditButtonDisbled />
              </div>
            </td>
          );
        }

        if (columnItem.isDate || columnItem.isDateAndTime) {
          return (
            <td
              className={
                index == 0
                  ? Style.firstTdBorder
                  : column.length - 1 == index
                  ? Style.lastBorder
                  : Style.childBorder
              }
              style={{
                backgroundColor:
                  item.accountStatus === false ? "#0000001a" : "",
              }}
            >
              <span
                style={{ color: item.accountStatus === false ? "gray" : "" }}
              >
                {item[`${columnItem.value}`] ? (
                  columnItem.isDateAndTime ? (
                    moment(item[`${columnItem.value}`]).format(
                      "MM-DD-YYYY hh:mm A"
                    )
                  ) : (
                    moment(item[`${columnItem.value}`]).format("MM-DD-YYYY")
                  )
                ) : (
                  <div className="d-flex px-4">---</div>
                )}
              </span>
            </td>
          );
        }
        if (columnItem.isSwitchStatus) {
          return (
            <td
              className={
                index === 0
                  ? Style.firstTdBorder
                  : column.length - 1 === index
                  ? Style.lastBorder
                  : Style.childBorder
              }
              style={{
                backgroundColor:
                  item.accountStatus === false ? "#0000001a" : "",
              }}
              key={index}
            >
              <div
                id={
                  tableId
                    ? createIdGen("switch " + tableId + colIndex)
                    : createIdGen(
                        "switch " +
                          router.pathname.replaceAll("/", " ") +
                          colIndex
                      )
                }
              >
                <Switch
                  className="user-switch"
                  checked={switchStates[item.email]}
                  onChange={(checked) => onSwitchToggle(item, checked)}
                />
              </div>
            </td>
          );
        }
        if (columnItem.status) {
          return (
            <td
              className={`${
                index == 0
                  ? Style.firstTdBorder
                  : column.length - 1 == index
                  ? Style.lastBorder
                  : Style.childBorder
              } `}
            >
              <div
                id={
                  tableId
                    ? createIdGen("processstatus " + tableId + colIndex)
                    : createIdGen(
                        "processstatus " +
                          router.pathname.replaceAll("/", " ") +
                          colIndex
                      )
                }
                className="d-flex justify-content-center"
              >
                {processstatusBodyTemplate(
                  item[`${columnItem.value}`],
                  columnItem.isIcon
                )}
              </div>
            </td>
          );
        }
        if (columnItem.batchStatus) {
          return (
            <td style={{ marginLeft: "10px" }} className={Style.childBorder}>
              {statusBodyTemplate(item)}
            </td>
          );
        }
        if (columnItem.isTrigger) {
          return (
            <td className={Style.lastBorder} style={{ textAlign: "center" }}>
              {item?.isRequestForRetry && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    getRetregger(item);
                  }}
                  id={
                    tableId
                      ? createIdGen("trigger " + tableId + colIndex)
                      : createIdGen(
                          "trigger " +
                            router.pathname.replaceAll("/", " ") +
                            colIndex
                        )
                  }
                  className="d-flex align-items-center"
                >
                  <FontAwesomeIcon
                    icon={faArrowsRotate}
                    style={{ fontSize: "large", color: "#df3a3a" }}
                  />
                </div>
              )}
            </td>
          );
        }
        if (columnItem.auditedStatus) {
          return (
            <td
              className={`${
                index == 0
                  ? Style.firstTdBorder
                  : column.length - 1 == index
                  ? Style.lastBorder
                  : Style.childBorder
              } `}
            >
              <div
                id={
                  tableId
                    ? createIdGen("auditstatus " + tableId + colIndex)
                    : createIdGen(
                        "auditstatus " +
                          router.pathname.replaceAll("/", " ") +
                          colIndex
                      )
                }
                className="d-flex  justify-content-center"
              >
                {auditStatusTemplate(
                  item[`${columnItem.value}`],
                  columnItem.isIcon
                )}
              </div>
            </td>
          );
        }
        if (columnItem.progressBar) {
          return (
            <td
              className={`${
                index == 0
                  ? Style.firstTdBorder
                  : column.length - 1 == index
                  ? Style.lastBorder
                  : Style.childBorder
              } `}
            >
              <div className="d-flex  justify-content-start">
                <Tooltip title={` Quality : ${Math.round(item?.accuracy)}%`}>
                  <div className="notificationIcon">
                    <div style={{ width: 40, height: 40 }}>
                      <CircularProgressbar
                        value={Math.round(item?.accuracy)}
                        text={`${Math.round(item?.accuracy)}%`}
                      />
                    </div>
                  </div>
                </Tooltip>
              </div>
            </td>
          );
        }
        if (columnItem.clumpseTwoFields) {
          return (
            <td
              className={`font2 ${
                index === 0
                  ? Style.firstTdBorder
                  : column.length - 1 === index
                  ? Style.lastBorder
                  : Style.childBorder
              }`}
            >
              {item[columnItem?.fromObject] === "SYSTEM" ? (
                <div>{item[columnItem?.fromObject]}</div>
              ) : (
                renderUserProfile(item, columnItem)
              )}
              {/* <div className="d-flex align-items-center justify-content-center mx-5">
                {columnItem?.value && item[columnItem.value]
                  ? moment(item[columnItem.value]).format("MM-DD-YYYY")
                  : "---"}
              </div> */}
               {columnItem?.value && item[columnItem.value] ? (
                 <div className="d-flex align-items-start justify-content-start mx-5">
                  {moment(item[columnItem.value]).format("MM-DD-YYYY")}
                 </div>
               ) : <div className="d-flex align-items-center justify-content-center mx-5">---</div>}
            </td>
          );
        }

        if (columnItem?.isCheckbox) {
          return (
            <td
              className={
                index === 0
                  ? Style.firstTdBorder
                  : column.length - 1 === index
                  ? Style.lastBorder
                  : Style.childBorder
              }
            >
              <div
                id={
                  tableId
                    ? createIdGen("checkbox " + tableId + colIndex)
                    : createIdGen(
                        "checkbox " +
                          router.pathname.replaceAll("/", " ") +
                          colIndex
                      )
                }
                className={`${Style.checkBoxDiv} d-flex justify-content-center align-items-center`}
              >
                {checkBoxLoader ? (
                  <Spin
                    indicator={<LoadingOutlined className="font2" />}
                    className={Style.spinnerStyle}
                  />
                ) : item.processedStatus === "FAILED" ? (
                  "---"
                ) : (
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      e.stopPropagation();
                      handleRowCheckboxChange({
                        e,
                        row: item,
                        singleCheck: true,
                      });
                    }}
                    checked={selectedRows?.some(
                      (row) => row === item[columnItem.value]
                    )}
                    id={
                      tableId
                        ? createIdGen("checkBox " + tableId + colIndex)
                        : createIdGen(
                            "checkbox " +
                              router.pathname.replaceAll("/", " ") +
                              colIndex
                          )
                    }
                    className={`${Style.checkBoxBg} ${Style.customChecked}`}
                  />
                )}
              </div>
            </td>
          );
        }

        if (columnItem?.statusButton) {
          return (
            <td
              className={Style.lastBorder}
              style={{ textAlign: "center" }}
              onClick={(e) => e.stopPropagation()}
            >
              {actionBodyTemplate(item)}
            </td>
          );
        }
        if (columnItem?.isFlag) {
          return (
            <td className={`ant-badge-count ${Style.firstTdBorder}`}>
              {renderFlagCell(item)}
            </td>
          );
        }

        return (
          <td
            className={
              index == 0
                ? Style.firstTdBorder
                : column.length - 1 == index
                ? Style.lastBorder
                : Style.childBorder
            }
            style={{
              backgroundColor: item.accountStatus === false ? "#0000001a" : "",
            }}
          >
            <span
              style={{
                color: item.accountStatus === false ? " gray" : "",
              }}
            >
              {typeof item[columnItem.value] === "boolean" ? (
                <div className="d-flex px-4">
                  {item[columnItem.value] ? "True" : "False"}
                </div>
              ) : item[columnItem.value] || item[columnItem.value] === 0 ? (
                <Tooltip title={item[columnItem.value]}>
                  {reusableEllipses({
                    str: item[columnItem.value].toString(),
                    count: count || 20,
                  })}
                </Tooltip>
              ) : (
                <div>---</div>
              )}
            </span>
          </td>
        );
      })}
    </tr>
  );
};

export default AppTable;
