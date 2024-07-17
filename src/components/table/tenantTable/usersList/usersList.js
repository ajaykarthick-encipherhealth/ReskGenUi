import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Empty, Popover, Select, Switch } from "antd";
import dayjs from "dayjs";
import TableStyle from "../../table.module.css";
import styles from "../../../../styles/auth.module.css";
import EditButton from "../../../../images/adminUsers/EditButton";
import {
  capitalizeFirstLetter,
  dateFormate,
  renderUserPrfoileAvatar,
  renderUserPrfoileAvatarDisabled,
  sortFunction,
} from "../../../headerFilters/functions";
import { CloseCircleOutlined } from "@ant-design/icons";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import EditButtonDisbled from "../../../../images/adminUsersDisabled/EditButtonDisabled";
import { getSelectUserList } from "../../../../store/actions/adminAction/DashboardAction";
import { connect } from "react-redux";
import { actions as tenantAdminAction } from "../../../../stores/tenantAdmin/users";
const items = [
  { value: "ADMIN", label: "Admin", role: "admin" },
  { value: "REVIEWER", label: "Reviewer", role: "REVIEWER" },
  { value: "SUPERVISOR", label: "Supervisor", role: "SUPERVISOR" },
];

const UserList = ({
  userList,
  sortOrder,
  setSortOrder,
  setSort,
  usersList,
  getEnableUser,
  getAllUsersList,
  setPageCount,
}) => {
  const usersData = usersList;
  const dispatch = useDispatch();
  const [rowData, setRowData] = useState();
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isMultiple, setIsMultiple] = useState(false);
  const [open, setOpen] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(null);
  const [openManager, setOpenManager] = useState(false);
  const [selectedManager, setSelectedManager] = useState();
  const [switchStates, setSwitchStates] = useState({});
  const [roleChangeLoader, setRoleChangeLoader] = useState(false);

  const selectUserList = useSelector(
    (state) => state?.AdminDashboardReducers?.selectedUsers
  );

  const onChange = async (item, checked) => {
    setSwitchStates((prevState) => ({
      ...prevState,
      [item.email]: checked,
    }));
    const res = await getEnableUser({
      checked: checked ? "yes" : "no",
      user: item,
    });
    if (res?.status === "SUCCESS") {
      getAllUsersList({ pageCount: 0 });
    }
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
        <div className="d-flex justify-content-end cr-pointer">
          <CloseCircleOutlined onClick={() => setPopoverVisible(null)} />
        </div>
        <div style={{ height: "200px", width: "100%" }}>
          <div className="my-2">Change Role</div>
          <Select
            style={{ width: "300px", height: "30px" }}
            mode={"multiple"}
            onChange={(e) => handleRows(e, data?.role)}
            options={items}
            placeholder={!data?.role[0] && "Select Role"}
            defaultValue={isMultiple ? data.role : data?.role}
            // open={open}
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
                // open={openManager}
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
              handleSave();
            }}
            disabled={selectedRoles?.length === 0 ? true : false}
          >
            {roleChangeLoader ? "Loading...." : "Save"}
          </button>
        </div>
      </div>
    );
  };

  const handleSave = async () => {
    if (selectedRoles?.length > 0) {
      setRoleChangeLoader(true);
      const res = await getEnableUser({
        checked: null,
        user: rowData,
        role: selectedRoles,
        setPopoverVisible: setPopoverVisible,
        selectedManager: selectedManager,
        field: "addRole",
      });
      if (res?.status === "SUCCESS") {
        getAllUsersList({ pageCount: 0 });
        setPopoverVisible(null);
        setPageCount(0);
        setRoleChangeLoader(false);
      }
    }
  };
  useEffect(() => {
    // getEnableUser({ checked: "no", user: rowData });
    dispatch(getSelectUserList("REVIEWER"));
  }, [rowData]);
  useEffect(() => {
    if (usersData?.data?.response?.content) {
      const initialSwitchStates = {};
      usersData.data.response.content.forEach((user) => {
        initialSwitchStates[user.email] = user.accountStatus;
      });
      setSwitchStates(initialSwitchStates);
    }
  }, [usersData]);

  return (
    <div className={`${TableStyle.classContaineer} mt-3`}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th className={TableStyle.rowEmailStyle}>NAME</th>
            <th style={{ paddingLeft: "120px" }}>EMAIL</th>
            <th
              style={{
                textAlign: "center",
              }}
            >
              ORGANIZATION
            </th>
            <th
              style={{
                textAlign: "center",
                paddingLeft: "50px",
              }}
            >
              ROLE
            </th>
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
            <th style={{ textAlign: "center" }}>MFA</th>
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
                  {item.firstName || item.lastName || item?.profileImageUrl ? (
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
                  <span>{item?.email ? item?.email : "---"}</span>
                </td>
                <td
                  className={TableStyle.childBorder}
                  style={{
                    backgroundColor:
                      item.accountStatus === true ? "" : "#0000001a",
                    textAlign: "center",
                  }}
                >
                  <span>
                    {item?.organizationDTO?.name
                      ? item?.organizationDTO?.name
                      : "---"}
                  </span>
                </td>
                <td
                  className={TableStyle.childBorder}
                  style={{
                    backgroundColor:
                      item.accountStatus === true ? "" : "#0000001a",
                    // paddingLeft: "70px",
                    textAlign: "center",
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
                      {/* {popoverVisible ? ( */}
                      <Popover
                        content={() => getContent(item)}
                        // title="Change Role"
                        trigger="click"
                        open={popoverVisible === item?.id}
                      >
                        <div
                          onClick={() => {
                            // setChecked(false);
                            setRowData(item);
                            setPopoverVisible(item?.id);
                            setSelectedRoles(item?.role);
                          }}
                        >
                          <EditButton />
                        </div>
                      </Popover>
                      {/* // ) : (
                      //   <div
                      //     onClick={() => {
                      //       setRowData(item);
                      //       setPopoverVisible(item?.id);
                      //     }}
                      //   >
                      //     <EditButton />
                      //   </div>
                      // )} */}
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
                  className={
                    usersData?.data?.response?.content?.length > 0
                      ? TableStyle.lastBorder
                      : TableStyle.noDataBorder
                  }
                  style={{
                    height: "40px !important",
                    textAlign: "center",
                    backgroundColor:
                      item.accountStatus === true ? "" : "#0000001a",
                  }}
                >
                  <Switch
                    checked={switchStates[item.email]}
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
              <td colSpan={8}>
                <Empty />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    usersList: state?.tenantAdmin?.users?.allUsers,
  }),
  {
    getAllUsersList: tenantAdminAction.getAllUsersAction,
    getEnableUser: tenantAdminAction.getEnableUser,
  }
);
export default enhancer(UserList);
