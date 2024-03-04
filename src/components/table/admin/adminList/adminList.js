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
  renderUserPrfoileAvatarDisabled,
  sortFunction,
} from "../../../headerFilters/functions";
import { enableUser } from "../../../../services/adminServices/usersService";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import SpinnerDots from "../../../spinner";
import { useSelector } from "react-redux";
import EditButtonDisbled from "../../../../images/adminUsersDisabled/EditButtonDisabled";
import { getSelectUserList } from "../../../../store/actions/adminAction/DashboardAction";

const items = [
  { value: "ADMIN", label: "Admin", role: "admin" },
  { value: "REVIEWER", label: "Reviewer", role: "REVIEWER" },
  { value: "SUPERVISOR", label: "Supervisor", role: "SUPERVISOR" },
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
  const [openManager, setOpenManager] = useState(false);
  const [selectedManager, setSelectedManager] = useState();

  const selectUserList = useSelector(
    (state) => state?.AdminDashboardReducers?.selectedUsers
  );
  const onChange = (item, checked) => {
    setRowData(item);
    setChecked(checked ? "yes" : "no");
  };

  const handleRows = (value) => {
    const updatedValue = Array.isArray(value) ? value : [value];
    setSelectedRoles(updatedValue);
    setOpen(false);
  };
  const handleManager = (value) => {
    setSelectedManager(value);
    setOpenManager(false);
  };
  const optionsUser = selectUserList?.data?.response?.map((res) => ({
    value: res.userName,
    label: res.firstName + " " + res.lastName,
  }));
  const getContent = (data) => {
    return (
      <div>
        <div style={{ height: "200px", width: "100%" }}>
          <div className="my-2">Change Role</div>
          <Select
            style={{ width: "300px", height: "30px" }}
            mode={"multiple"}
            onChange={(e) => handleRows(e, data?.role)}
            options={items}
            placeholder={!data?.role[0] && "Select Role"}
            defaultValue={isMultiple ? data.role : data?.role}
            open={open}
            onDropdownVisibleChange={(visible) => setOpen(visible)}
          />
          {selectedRoles?.length <= 1 && selectedRoles[0] === "REVIEWER" && (
            <>
              <div className="mt-4 my-2">Change Manager</div>

              <Select
                style={{ width: "300px" }}
                onChange={handleManager}
                options={optionsUser?.length > 0 ? optionsUser : []}
                placeholder={"Change Manager"}
                // defaultValue={isMultiple ? magerData.role : magerData?.role}
                open={openManager}
                onDropdownVisibleChange={(visible) => setOpenManager(visible)}
              />
            </>
          )}
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
                  enableUser(
                    null,
                    rowData,
                    selectedRoles,
                    setPopoverVisible,
                    selectedManager,
                    "addrole"
                  )
                );
                setPopoverVisible(false);
              }
            }}
            disabled={selectedRoles?.length === 0 ? true : false}
          >
            Save
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    dispatch(enableUser(checkedd, rowData));
    dispatch(getSelectUserList("SUPERVISOR"));
  }, [checkedd, rowData]);

  return (
    <div className={TableStyle.classContaineer}>
      {!usersData || usersData?.loading ? (
        <SpinnerDots />
      ) : (
        <table className={TableStyle.classTable}>
          <thead className={TableStyle.classThead}>
            <tr>
              <th className={TableStyle.rowEmailStyle}>NAME</th>
              <th className={TableStyle.rowEmailStyle}>EMAIL</th>
              <th style={{ textAlign: "center", width: "170px" }}>ROLE</th>
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
            {!usersData?.loading &&
            usersData?.data?.response?.content?.length > 0 ? (
              usersData?.data?.response?.content?.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    height: "35px",
                    backgroundColor:
                      item.accountStatus === true ? "" : "#0000001a",
                  }}
                >
                  <td
                    className={TableStyle.childBorder}
                    style={{
                      textAlign: "center",
                      backgroundColor:
                        item.accountStatus === true ? "" : "#0000001a",
                    }}
                  >
                    {item.firstName ||
                    item.lastName ||
                    item?.profileImageUrl ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {item.accountStatus === true ? (
                          <span
                            style={{
                              marginRight: "10px",
                              color: item.accountStatus === true ? "" : "gray",
                            }}
                          >
                            {renderUserPrfoileAvatar(
                              item.firstName,
                              item.lastName,
                              item?.profileImageUrl,
                              "header"
                            )}
                          </span>
                        ) : (
                          <span
                            style={{
                              marginRight: "10px",
                              color: item.accountStatus === true ? "" : "gray",
                            }}
                          >
                            {renderUserPrfoileAvatarDisabled(
                              item.firstName,
                              item.lastName,
                              item?.profileImageUrl,
                              "header"
                            )}
                          </span>
                        )}

                        <span
                          style={{
                            color: item.accountStatus === true ? "" : "gray",
                          }}
                        >
                          {item.firstName} {item.lastName}
                        </span>
                      </div>
                    ) : (
                      <div style={{ textAlign: "center" }}>---</div>
                    )}
                  </td>
                  <td
                    className={TableStyle.childBorder}
                    style={{
                      backgroundColor:
                        item.accountStatus === true ? "" : "#0000001a",
                    }}
                  >
                    <span
                      style={{
                        color: item.accountStatus === true ? "" : "gray",
                      }}
                    >
                      {" "}
                      {item?.email ? item?.email : "---"}
                    </span>
                  </td>
                  <td
                    className={TableStyle.childBorder}
                    style={{
                      backgroundColor:
                        item.accountStatus === true ? "" : "#0000001a",
                    }}
                  >
                    <div className={TableStyle.rowStyle2}>
                      {item?.role?.length > 0 ? (
                        <>
                          <span
                            style={{
                              color: item.accountStatus === true ? "" : "gray",
                            }}
                          >
                            {item?.role
                              ?.map((data) => capitalizeFirstLetter(data))
                              .join(",")}
                          </span>
                        </>
                      ) : (
                        "---"
                      )}
                    </div>
                  </td>

                  <td
                    className={TableStyle.lastBorder}
                    style={{
                      height: "40px !important",
                      textAlign: "center",
                      backgroundColor:
                        item.accountStatus === true ? "" : "#0000001a",
                    }}
                  >
                    <span
                      style={{
                        color: item.accountStatus === true ? "" : "gray",
                      }}
                    >
                      {dateFormate(dayjs, item?.createdDate)}
                    </span>
                  </td>
                  <td
                    className={TableStyle.childBorder}
                    style={{
                      height: "40px !important",
                      textAlign: "center",
                      backgroundColor:
                        item.accountStatus === true ? "" : "#0000001a",
                    }}
                  >
                    <span
                      style={{
                        color: item.accountStatus === true ? "" : "gray",
                      }}
                    >
                      {" "}
                      {item?.mfaEnabled === false ? "Disabled" : "Enabled"}
                    </span>
                  </td>
                  {item.accountStatus === true ? (
                    <td
                      className={TableStyle.childBorder}
                      style={{
                        height: "40px !important",
                        cursor: "pointer",
                        textAlign: "center",
                        backgroundColor:
                          item.accountStatus === true ? "" : "#0000001a",
                      }}
                    >
                      <div>
                        {popoverVisible ? (
                          <Popover
                            content={() => getContent(item)}
                            // title="Change Role"
                            trigger="click"
                          >
                            <div
                              onClick={() => {
                                setChecked();
                                setRowData(item);
                                setPopoverVisible(true);
                                setSelectedRoles(item?.role);
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
                  ) : (
                    <td
                      className={TableStyle.childBorder}
                      style={{
                        height: "40px !important",
                        cursor: "pointer",
                        textAlign: "center",
                        backgroundColor:
                          item.accountStatus === true ? "" : "#0000001a",
                      }}
                    >
                      <div>
                        <EditButtonDisbled />
                      </div>
                    </td>
                  )}

                  <td
                    className={TableStyle.lastBorder}
                    style={{
                      height: "40px !important",
                      textAlign: "center",
                      backgroundColor:
                        item.accountStatus === true ? "" : "#0000001a",
                    }}
                  >
                    <Switch
                      defaultChecked={item?.accountStatus}
                      onChange={(checked) => {
                        onChange(item, checked);
                        setPopoverVisible(true);
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>
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
