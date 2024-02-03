import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Empty, Popover, Select, Switch } from "antd";
import dayjs from "dayjs";
import TableStyle from "../../table.module.css";
import styles from "../../../../styles/auth.module.css";
import EditButton from "../../../../images/adminUsers/EditButton";
import {
  capitalizeFirstLetter,
  dateFormate,
  renderUserPrfoile,
  renderUserPrfoileAvatar,
  sortFunction,
} from "../../../headerFilters/functions";
import { enableUser } from "../../../../services/adminServices/usersService";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import SpinnerDots from "../../../spinner";
import { useSelector } from "react-redux";

const items = [
  { value: "ADMIN", label: "Admin", role: "admin" },
  { value: "L1AUDITOR", label: "L1auditor", role: "l1auditor" },
  { value: "L2AUDITOR", label: "L2auditor", role: "l2auditor" },
];

const AdminList = ({ userList, sortOrder, setSortOrder, setSort }) => {
  const usersData = useSelector((state) => state.adminUsers.usersData);

  const dispatch = useDispatch();
  const [checkedd, setChecked] = useState();
  const [rowData, setRowData] = useState();
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isMultiple, setIsMultiple] = useState(false);
  const [open, setOpen] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(true);
  const onChange = (item, checked) => {
    setRowData(item);
    setChecked(checked?"yes":"no");
  };

  const handleRows = (value) => {
    const updatedValue = Array.isArray(value) ? value : [value];
    setSelectedRoles(updatedValue);
    setOpen(false);
  };
  const getContent = (data) => {
    return (
      <div style={{ height: "250px" }}>
        <div style={{ height: "200px" }}>
          <div style={{ width: "100%", display: "flex" }}>
            <button
              className={styles.sendBtn}
              style={{ width: "50%", marginRight: "5px" }}
              onClick={() => {
                setIsMultiple(true);
              }}
            >
              Include Previous Roles
            </button>
            <button
              className={styles.sendBtn}
              style={{ width: "50%" }}
              onClick={() => {
                setIsMultiple(false);
              }}
            >
              Selected Role Only
            </button>
          </div>
          <Select
            style={{ width: "100%" }}
            mode={isMultiple ? "multiple" : ""}
            onChange={handleRows}
            options={items}
            placeholder={!data?.role[0] && "Select Role"}
            defaultValue={isMultiple ? data.role : data?.role}
            open={open}
            onDropdownVisibleChange={(visible) => setOpen(visible)}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "end",
          }}
        >
          <button
            className={styles.sendBtn}
            onClick={() => {
              if (selectedRoles?.length > 0) {
                dispatch(
                  enableUser(null, rowData, selectedRoles, setPopoverVisible,"addrole")
                );
                setPopoverVisible(false);
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    dispatch(enableUser(checkedd, rowData));
  }, [checkedd, rowData]);

  return (
    <div className={TableStyle.classContaineer}>
      {usersData?.loading ? (
        <SpinnerDots />
      ) : (
        <table className={TableStyle.classTable}>
          <thead className={TableStyle.classThead}>
            <tr>
              <th style={{ textAlign: "left", paddingLeft: "72px" }}>NAME</th>
              <th
                className={TableStyle.rowStyle}
                style={{ textAlign: "center" }}
              >
                EMAIL
              </th>
              <th style={{ textAlign: "center", paddingLeft: "33px" }}>ROLE</th>
              <th
                style={{ cursor: "pointer", textAlign: "center" }}
                onClick={() => {
                  sortFunction(sortOrder, setSortOrder, setSort, "createdDate");
                }}
              >
                DATE CREATED{" "}
                {sortOrder === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </th>
              <th
                className={TableStyle.rowStyle}
                style={{ textAlign: "center" }}
              >
                MFA
              </th>
              <th style={{ textAlign: "center" }}>ACTION</th>
              <th style={{ textAlign: "center" }}>USER STATUS</th>
            </tr>
          </thead>
          <tbody>
            {usersData?.data?.response?.content?.length > 0 ? (
              usersData?.data?.response?.content?.map((item, index) => (
                <tr key={index} style={{ height: "35px" }}>
                  <td
                    className={TableStyle.childBorder}
                    style={{ textAlign: "center" }}
                  >
                    {item.firstName ||
                    item.lastName ||
                    item?.profileImageUrl ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {" "}
                        <span style={{ marginRight: "10px" }}>
                          {" "}
                          {renderUserPrfoileAvatar(
                            item.firstName,
                            item.lastName,
                            item?.profileImageUrl,
                            "header"
                          )}
                        </span>
                        <span>
                          {item.firstName} {item.lastName}
                        </span>
                      </div>
                    ) : (
                      <div style={{ textAlign: "center" }}>---</div>
                    )}
                  </td>

                  <td
                    className={TableStyle.childBorder}
                    style={{ height: "40px !important", textAlign: "center" }}
                  >
                    <span>{item?.email ? item?.email : "---"}</span>
                  </td>
                  <td
                    className={TableStyle.childBorder}
                    style={{
                      height: "40px !important",
                      textAlign: "center",
                      paddingLeft: "70px",
                    }}
                  >
                    <div
                      style={{
                        margin: "0px 0px 0px 0px",
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      {item?.role?.length > 0 ? (
                        <>
                          <Popover
                            trigger="hover"
                            content={
                              item?.role?.length > 1 &&
                              item?.role?.map((data) => (
                                <div> {capitalizeFirstLetter(data)}</div>
                              ))
                            }
                          >
                            <span>{capitalizeFirstLetter(item?.role[0])}</span>
                          </Popover>
                        </>
                      ) : (
                        "---"
                      )}
                    </div>
                  </td>

                  <td
                    className={TableStyle.lastBorder}
                    style={{ height: "40px !important", textAlign: "center" }}
                  >
                    <span>{dateFormate(dayjs, item?.createdDate)}</span>
                  </td>
                  <td
                    className={TableStyle.childBorder}
                    style={{ height: "40px !important", textAlign: "center" }}
                  >
                    <span>
                      {" "}
                      {item?.mfaEnabled === false ? "Disabled" : "Enabled"}
                    </span>
                  </td>
                  <td
                    className={TableStyle.childBorder}
                    style={{
                      height: "40px !important",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <div>
                      {popoverVisible ? (
                        <Popover
                          content={() => getContent(item)}
                          title="Change Role"
                          trigger="click"
                        >
                          <div
                            onClick={() => {
                              setChecked()
                              setRowData(item);
                              setPopoverVisible(true);
                            }}
                          >
                            <EditButton />
                          </div>
                        </Popover>
                      ) : (
                        <div
                          onClick={() => {
                            setRowData(item);
                            setPopoverVisible(true);
                          }}
                        >
                          <EditButton />
                        </div>
                      )}
                    </div>
                  </td>
                  <td
                    className={TableStyle.lastBorder}
                    style={{ height: "40px !important", textAlign: "center" }}
                  >
                    <Switch
                      defaultChecked={item?.accountStatus}
                      onChange={(checked) => {
                        onChange(item, checked)
                        setPopoverVisible(true)}}
                      style={{ color: "red" }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">
                  <Empty />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminList;
