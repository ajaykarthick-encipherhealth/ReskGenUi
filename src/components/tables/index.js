import moment from "moment";
import Style from "./table.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DownloadOutlined,
  InfoCircleFilled,
  InfoCircleOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Empty,
  Image,
  Popover,
  Progress,
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
  proxyStatusBodyTemplate,
  getRoasterStatus,
  renderFlagCells,
  processStatusBodyTemplate,
  dynamicAuditStatusTemplate,
  findItemWithTrueOrFalse,
  checkWithIncludesKey,
} from "../../utils/reusable";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

import { priorityOptions, priorityStatus } from "../headerFilters/functions";
import Legends from "../legends";
import { bullets } from "../../pages/reviewer/patients";
import { auditBullets } from "../../pages/supervisor/auditing";
import { CircularProgressbar } from "react-circular-progressbar";
import EditButton from "../../images/adminUsers/EditButton";
import EditButtonDisbled from "../../images/adminUsersDisabled/EditButtonDisabled";
import { faArrowsRotate, faUpload } from "@fortawesome/free-solid-svg-icons";
import { batchBullets } from "../../commonPages/patients";
import { useRouter } from "next/router";
import { Paginator } from "primereact/paginator";
import { useState } from "react";

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
  handleRoasterBtn,
  isPagination = true,
  dateFormateAlign,
  getStatusStyles,
  renderCountDetailsPopover,
  isCheckBox,
  checkedHeader,
  isUpload,
  idKey,
  handleAction,
  isEdit,
  content,
  visiblePopoverKey,
  setVisiblePopoverKey,
  setEditingUser,
  isGenerateReport,
  isGenerateReportDownload,
  setRole,
  selectedRole,
  onCloseIconClick,
  disabled,
  handleReportDownload,
  isTrigger,
  showCancelIcon = false,
  progressCancel,
}) => {
  if (isCheckBox) {
    column.push({
      checkBox: true,
      value: idKey ? idKey : "patientId",
      header: true,
    });
  }

  if (isUpload) {
    column.push({
      statusButton: true,
      value: "patientId",
    });
  }
  if (isTrigger) {
    column.push({
      triggerButton: true,
    });
  }
  if (isEdit) {
    column.push({
      edit: true,
      value: "patientId",
    });
  }
  if (isGenerateReportDownload) {
    column?.push({
      reportDownload: true,
      value: idKey ? idKey : "patientId",
      header: false,
    });
  }
  if (isGenerateReport) {
    column?.push({
      checkBox: true,
      value: idKey ? idKey : "patientId",
      header: true,
    });
  }

  const router = useRouter();
  const columnsArr = Array.from({ length: column?.length || 5 });
  return (
    <div className="customTable">
      <div
        id={
          tableId
            ? createIdGen("table " + tableId)
            : createIdGen("row " + router.pathname.replaceAll("/", " "))
        }
        className={`${
          tableHeight ? Style.pageContainer1 : Style.pageContainer
        }`}
      >
        <div className={Style.pageContent}>
          <div style={{ overflowX: "auto" }}>
            <table className={`  ${Style.classTable}`}>
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
                      handleRowCheckboxChange={handleRowCheckboxChange}
                      checkedHeader={checkedHeader}
                      isUpload={isUpload}
                      isTrigger={isTrigger}
                      isEdit={isEdit}
                      disabled={disabled}
                      handleReportDownload={handleReportDownload}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {loader || data == null ? (
                  [...Array.from({ length: 15 })]?.map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {columnsArr?.map((_, colIndex) => (
                        <td className="mx-1" key={colIndex}>
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
                      handleRoasterBtn={handleRoasterBtn}
                      statusBodyTemplate={statusBodyTemplate}
                      getRetregger={getRetregger}
                      infoIcon={infoIcon}
                      tableId={tableId}
                      renderFlagCell={renderFlagCell}
                      dateFormateAlign={dateFormateAlign}
                      getStatusStyles={getStatusStyles}
                      renderCountDetailsPopover={renderCountDetailsPopover}
                      isUpload={isUpload}
                      isTrigger={isTrigger}
                      handleAction={handleAction}
                      isEdit={isEdit}
                      content={content}
                      visiblePopoverKey={visiblePopoverKey}
                      setVisiblePopoverKey={setVisiblePopoverKey}
                      setEditingUser={setEditingUser}
                      setRole={setRole}
                      selectedRole={selectedRole}
                      onCloseIconClick={onCloseIconClick}
                      handleReportDownload={handleReportDownload}
                      showCancelIcon={showCancelIcon}
                      progressCancel={progressCancel}
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
          </div>

          {isPagination && (
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
          )}
        </div>
      </div>
    </div>
  );
};

const TableHeadItem = ({
  item,
  sort,
  setSort,
  handleRowCheckboxChange,
  checkedHeader,
  disabled,
}) => {
  if (item.checkBox && item?.header) {
    return (
      <th>
        <input
          className={`mx-1`}
          onChange={(e) => {
            e.stopPropagation();
            handleRowCheckboxChange({
              e,
              row: item,
              singleCheck: false,
              checked: e.target.checked,
            });
          }}
          style={{
            width: "20px",
            height: "20px",
            flexShrink: "0",
            borderRadius: "4px",
            cursor:disabled?"not-allowed": "pointer",
          }}
          type="checkbox"
          id="checkall-header"
          name="checkall-header"
          checked={checkedHeader}
          disabled ={disabled}
        />
        {item.name}
      </th>
    );
  }
  if (item.statusButton) {
    return <th className="">Upload</th>;
  }
  if (item.edit) {
    const isUsersPage = window.location.pathname.includes(
      "tenantadmin/settings"
    );
    return <th className="">{isUsersPage ? "Edit" : "Action"}</th>;
  }
  if (item.triggerButton) {
    return <th className=""></th>;
  }
  if (item.reportDownload) {
    return <th className="text-center">Download</th>;
  }

  if (checkWithIncludesKey(item?.design, "SORTABLE")) {
    return (
      <th className="text-start text-truncate font2">
        {item?.headerName?.toUpperCase()}{" "}
        {sort?.sortField === item.actualField && sort?.sortDir == "ASC" ? (
          <ArrowUpOutlined
            onClick={() => {
              if (setSort) {
                setSort((prev) => ({
                  ...prev,
                  [item.actualField]: {
                    sortField: item?.actualField,
                    sortDir: "DESC",
                  },
                  sortField: item?.actualField,
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
                  [item.actualField]: {
                    sortField: item?.actualField,
                    sortDir: "ASC",
                  },
                  sortField: item?.actualField,
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
        {item?.headerName?.toUpperCase()}
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
  if (item.isTooltip) {
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
    <>
    {item?.columnActive && (
  <th className="text-start text-truncate font2">
    {typeof item?.headerName === "string"
      ? item.headerName.toUpperCase()
      : item.headerName}
  </th>
)}
</>
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
  handleRoasterBtn,
  statusBodyTemplate,
  getRetregger,
  switchStates,
  tableId,
  colIndex,
  renderFlagCell,
  dateFormateAlign,
  getStatusStyles,
  renderCountDetailsPopover,
  isUpload,
  isTrigger,
  handleAction,
  content,
  visiblePopoverKey,
  setVisiblePopoverKey,
  setEditingUser,
  setRole,
  selectedRole,
  onCloseIconClick,
  handleReportDownload,
  showCancelIcon,
  progressCancel,
  
}) => {
  const router = useRouter();

  return (
    <tr
      id={
        tableId
          ? createIdGen("row" + tableId + colIndex)
          : createIdGen(
              "row" + router.pathname.replaceAll("/", " ") + colIndex
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
        if (columnItem?.design?.includes("PRIORITY")) {
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
                    ? createIdGen("selectpriority" + tableId + colIndex)
                    : createIdGen(
                        "selectpriority" +
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
                  value={item?.priority || undefined}
                  onClick={(e) => e.stopPropagation()}
                  onChange={
                    handlePriorityChange
                      ? (value) => handlePriorityChange(item?.tinNumber, value)
                      : undefined
                  }
                  disabled={!handlePriorityChange}
                  style={{ width: "100%" }}
                />
              </span>
            </td>
          );
        }
 
        if (findItemWithTrueOrFalse(columnItem.design, "PROFILE")) {
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
              <span
                style={{
                  color: item.accountStatus === false ? "gray" : "",
                }}
              >
                {renderUserProfile(item, columnItem)}
              </span>

              {/* {item.accountStatus === false ? (
            <span
              style={{
                color: item.accountStatus === false ? "gray" : "",
              }}
            >
              {item[columnItem?.actualField] === "SYSTEM" ? (
                <div>{item[columnItem?.actualField]}</div>
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
              {item[columnItem?.actualField] === "SYSTEM" ? (
                <div>{item[columnItem?.actualField]}</div>
              ) : (
                renderUserProfile(item, columnItem)
              )}
            </span>
          )} */}
            </td>
          );
        }

        if (columnItem?.design?.includes("COMMA_SEPARATION")) {
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
                {item[columnItem.actualField]
                  ? item[columnItem.actualField]
                      .toString()
                      .replace(/_/g, " ")
                      .replace(/,\s*/g, ", ")
                  : "---"}
              </span>
            </td>
          );
        }

         if (columnItem?.design?.includes("REBUTTAL_CHANGES")) {
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
               {item?.rebuttedOn ? "YES": "NO"}
             </td>
           );
         }

        if (columnItem.countInfo) {
          return (
            <td className={Style.childBorder}>
              <div className="d-flex">
                <div style={{ width: "25px" }}>{item[columnItem.value]}</div>
                {renderCountDetailsPopover(item)}
              </div>
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
        if (columnItem.edit) {
          return item.accountStatus === true ? (
            <td
              className={Style.childBorder}
              style={{
                backgroundColor:
                  item.accountStatus === false ? "#0000001a" : "",
              }}
            >
              <div
                style={{
                  backgroundColor:
                    item.accountStatus === false ? "#0000001a" : "",
                }}
                id={
                  tableId
                    ? createIdGen("edit" + tableId + colIndex)
                    : createIdGen(
                        "edit" +
                          router.pathname.replaceAll("/", " ") +
                          colIndex
                      )
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(item);
                }}
              >
                <Popover
                  content={content}
                  title={
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Change Role</span>
                      <CloseCircleOutlined
                        className="cr-pointer"
                        onClick={onCloseIconClick}
                      />
                    </div>
                  }
                  placement="bottom"
                  trigger="click"
                  open={visiblePopoverKey === item.id}
                  onOpenChange={(visible) => {
                    if (visible) {
                      setEditingUser && setEditingUser(item);
                      setVisiblePopoverKey(item.id);
                      setRole && setRole(selectedRole);
                    }
                  }}
                >
                  <div onClick={() => handleAction(item.id)}>
                    <EditButton />
                  </div>
                </Popover>
              </div>
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
                    ? createIdGen("editDisabled" + tableId + colIndex)
                    : createIdGen(
                        "editDisabled" +
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
        if (
          columnItem?.design?.includes("DATE") ||
          columnItem?.design === "DATE_TIME"
        ) {
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
                {item[`${columnItem.actualField}`] ? (
                  columnItem.design === "DATE_TIME" ? (
                    moment(item[`${columnItem.actualField}`]).format(
                      "MM-DD-YYYY hh:mm A"
                    )
                  ) : (
                    moment(item[`${columnItem.actualField}`]).format(
                      "MM-DD-YYYY"
                    )
                  )
                ) : (
                  <div className="d-flex px-4">---</div>
                )}
              </span>
            </td>
          );
        }

        if (
          findItemWithTrueOrFalse(columnItem.design, "TOGGLE") &&
          switchStates
        ) {
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
                    ? createIdGen("switch" + tableId + colIndex)
                    : createIdGen(
                        "switch" +
                          router.pathname.replaceAll("/", " ") +
                          colIndex
                      )
                }
              >
                <Switch
                  className="user-switch"
                  checked={item?.userName ? switchStates[item?.userName] : true}
                  // checked={true}
                  onChange={(checked) => onSwitchToggle(item, checked)}
                  disabled={item.currentUser === true}
                />
              </div>
            </td>
          );
        }
        if (columnItem?.design?.includes("REVIEWER_STATUS")) {
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
                    ? createIdGen("reviewedStatus" + tableId + colIndex)
                    : createIdGen(
                        "reviewedStatus" +
                          router.pathname.replaceAll("/", " ") +
                          colIndex
                      )
                }
                className="d-flex justify-content-center"
              >
                {processStatusBodyTemplate(
                  item[`${columnItem.actualField}`],
                  columnItem.isIcon
                )}
              </div>
            </td>
          );
        }

        if (columnItem?.design?.includes("PROXY_STATUS")) {
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
                    ? createIdGen("proxcyStatus" + tableId + colIndex)
                    : createIdGen(
                        "proxcyStatus" +
                          router.pathname.replaceAll("/", " ") +
                          colIndex
                      )
                }
                className="d-flex justify-content-center"
              >
                {proxyStatusBodyTemplate(
                  item[`${columnItem.actualField}`],
                  columnItem.isIcon
                )}
              </div>
            </td>
          );
        }
        if (columnItem?.design?.includes("COMPUTATION_STATUS")) {
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
             <div  id={
                  tableId
                    ? createIdGen("computationStatus" + tableId + colIndex)
                    : createIdGen(
                        "computationStatus" +
                          router.pathname.replaceAll("/", " ") +
                          colIndex
                      )
                }>{statusBodyTemplate && statusBodyTemplate(item)}</div> 
            </td>
          );
        }
        if (columnItem?.triggerButton) {
          return (
            <td className={Style.lastBorder} style={{ textAlign: "center" }}>
              {item?.isRequestForRetry === true && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    getRetregger(item);
                  }}
                  id={
                    tableId
                      ? createIdGen("trigger" + tableId + colIndex)
                      : createIdGen(
                          "trigger" +
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

        if (columnItem?.design?.includes("RE_UPLOAD")) {
          return (
            <td className={Style.lastBorder} style={{ textAlign: "center" }}>
              {item?.roasterStatus === "FAILED" ? (
                <div
                  id={
                    tableId
                      ? createIdGen("isRoasterFailed" + tableId + colIndex)
                      : createIdGen(
                          "isRoasterFailed" +
                            router.pathname.replaceAll("/", " ") +
                            colIndex
                        )
                  }
                  className="d-flex align-items-center"
                >
                  <div className="d-flex justify-content-center gap-2 ">
                    <button
                      id="click-upload"
                      name="click-upload"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoasterBtn(item);
                      }}
                      className="btn hegiht10  sharp me-1 action-btn"
                      style={{ background: "#04306f" }}
                    >
                      <FontAwesomeIcon
                        icon={faUpload}
                        fontSize={11}
                        style={{ color: "#ffff" }}
                      />
                    </button>
                    <Popover
                      title="Reason"
                      content={
                        <div
                          style={{
                            maxWidth: 200,
                            maxHeight: 100,
                            overflow: "auto",
                          }}
                        >
                          {item?.failedReason ? item.failedReason : "---"}
                        </div>
                      }
                    >
                      <InfoCircleOutlined
                        style={{ fontSize: "20px", color: "#df3a3a" }}
                      />
                    </Popover>
                  </div>
                </div>
              ) : (
                <div className="text-start">---</div>
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
                    ? createIdGen("auditstatus" + tableId + colIndex)
                    : createIdGen(
                        "auditstatus" +
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
        if (columnItem?.design?.includes("AUDIT_STATUS")) {
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
                    ? createIdGen("auditstatus" + tableId + colIndex)
                    : createIdGen(
                        "auditstatus" +
                          router.pathname.replaceAll("/", " ") +
                          colIndex
                      )
                }
                className="d-flex  justify-content-center"
              >
                {dynamicAuditStatusTemplate(
                  item[`${columnItem.actualField}`],
                  columnItem.isIcon
                )}
              </div>
            </td>
          );
        }
        if (columnItem?.design?.includes("PROGRESS_BAR")) {
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
              <div className="d-flex  justify-content-start gap-3">
                <Progress
                  percent={item[`${columnItem.actualField}`]}
                  format={(percent) => `${percent}%`} 
                  className={` ${Style.progreddBr}`}
                />
               {showCancelIcon && <div>
                <CloseCircleOutlined  style={{fontSize:"20px"}}  className = "text-danger" onClick={progressCancel}/>
               </div>
                }
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
              {columnItem?.value && item[columnItem.value] ? (
                <div className="d-flex align-items-start justify-content-start mx-5">
                  {moment(item[columnItem.value]).format("MM-DD-YYYY")}
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-center mx-5">
                  ---
                </div>
              )}
            </td>
          );
        }

        if (columnItem?.checkBox) {
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
                    ? createIdGen("checkbox" + tableId + colIndex)
                    : createIdGen(
                        "checkbox" +
                          router.pathname.replaceAll("/", " ") +
                          colIndex
                      )
                }
                className={`${Style.checkBoxDiv} d-flex justify-content-start align-items-start`}
              >
                {checkBoxLoader ? (
                  <Spin
                    indicator={<LoadingOutlined className="font2" />}
                    className={Style.spinnerStyle}
                  />
                ) : item.status === "FAILED" ? (
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
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    checked={selectedRows?.some(
                      (row) => row === item[columnItem.value]
                    )}
                    
                    id={
                      tableId
                        ? createIdGen("checkBox" + tableId + colIndex)
                        : createIdGen(
                            "checkbox" +
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
              {actionBodyTemplate && actionBodyTemplate(item)}
            </td>
          );
        }

        if (columnItem?.design?.includes("FLAG")) {
          return (
            <td
              className={
                index == 0
                  ? Style.firstTdBorder
                  : column.length - 1 == index
                  ? Style.lastBorder
                  : Style.childBorder
              }
            >
              {renderFlagCells(item)}
            </td>
          );
        }
        if (columnItem?.arrayDataFormat) {
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
              {dateFormateAlign(item?.yearOfService)}
            </td>
          );
        }
        if (columnItem?.batchButtons) {
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
              <div>
                <div
                  style={{ width: "65%" }}
                  // className="d-flex justify-content-center align-items-center"
                >
                  {item?.batchUploadStatus && (
                    <div
                      style={{
                        width: "100%",
                        ...getStatusStyles({
                          status: item?.batchUploadStatus,
                          isBorder: true,
                        }),
                      }}
                      className="px-4 py-1 rounded-1 font-semibold d-flex justify-content-center align-items-center"
                    >
                      {item?.batchUploadStatus === "PROCESSING" ? (
                        <Spin
                          indicator={
                            <LoadingOutlined
                              className="ant-badge"
                              style={{
                                fontSize: 14,
                              }}
                              spin
                            />
                          }
                          className="ant-badge mx-2"
                          style={{
                            color: "#FF7D2A",
                          }}
                        />
                      ) : item?.batchUploadStatus === "FAILED" ? (
                        <FontAwesomeIcon
                          className="mx-1"
                          icon={faCircleXmark}
                          style={getStatusStyles({
                            status: item?.batchUploadStatus,
                          })}
                        />
                      ) : (
                        <FontAwesomeIcon
                          className="mx-1"
                          icon={faCircleCheck}
                          style={getStatusStyles({
                            status: item?.batchUploadStatus,
                          })}
                        />
                      )}

                      {item?.batchUploadStatus.charAt(0).toUpperCase() +
                        item?.batchUploadStatus.slice(1).toLowerCase()}
                    </div>
                  )}
                  {!item?.batchUploadStatus && (
                    <div className="w-100 d-flex justify-content-center align-items-center">
                      <button
                        id="status-btn"
                        name="status-btn"
                        className={`w-100 px-4 py-1  ${
                          item?.source === "CogentUpload"
                            ? Style.uploadButton
                            : Style.triggerButton
                        } d-flex justify-content-center align-items-center`}
                        onClick={(e) => {
                          e.stopPropagation();

                          setTriggeredBatch({
                            status: true,
                            id: item?.batchID,
                          });
                          if (item?.source === "CogentUpload") {
                            setOpenUpload({
                              status: !openUpload?.status,
                              data: item,
                            });
                          }
                          if (
                            item?.batchUploadStatus == null &&
                            item?.source !== "CogentUpload"
                          ) {
                            handleBatchTrigger(item);
                          }
                        }}
                      >
                        {item?.source === "CogentUpload" ? "Upload" : "Trigger"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </td>
          );
        }

        if (columnItem.reportDownload) {
          return (
            <td  className={`${Style.lastBorder}`} >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                id={
                  tableId
                    ? createIdGen("reportDownload" + tableId + colIndex)
                    : createIdGen(
                        "reportDownload" +
                          router.pathname.replaceAll("/", " ") +
                          colIndex
                      )
                }
                className="d-flex align-items-center justify-content-center"
              >
                <DownloadOutlined  onClick = {handleReportDownload}style={{ fontSize: "16px" }} />
              </div>
            </td>
          );
        }

        return (
          <>
            {columnItem?.columnActive && (
              <td
                className={
                  index === 0
                    ? Style.firstTdBorder
                    : column.length - 1 === index
                    ? Style.lastBorder
                    : Style.childBorder
                }
                style={{
                  backgroundColor: item.accountStatus === false ? "#0000001a" : "",
                }}
              >
                <span
                  style={{
                    color: item.accountStatus === false ? "gray" : "",
                  }}
                >
                  {typeof item[columnItem.value] === "boolean" ? (
                    <div className="d-flex px-4">
                      {item[columnItem.value] ? "True" : "False"}
                    </div>
                  ) : item[columnItem.actualField] || item[columnItem.actualField] === 0 ? (
                    <Tooltip title={item[columnItem.value]}>
                      {reusableEllipses({
                        str: item[columnItem.actualField],
                          // .toString()
                          // .replace(/_/g, " ")
                          // .replace(/,\s*/g, ", "),
                        count: count || 20,
                      })}
                    </Tooltip>
                  ) : (
                    <div>---</div>
                  )}
                </span>
              </td>
            )}
          </>
        );
        
      })}
    </tr>
  );
};

export default AppTable;
