import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Empty, Popover, Select, Switch } from "antd";
import dayjs from "dayjs";
import TableStyle from "../../table.module.css";
import styles from "../../../../styles/auth.module.css";
import EditButton from "../../../../images/adminUsers/EditButton";
import {
  dateFormate,
  renderUserPrfoile,
} from "../../../headerFilters/functions";
import { enableUser } from "../../../../services/adminServices/usersService";

const items = [
  { value: "ADMIN", label: "Admin", role: "admin" },
  { value: "L1AUDITOR", label: "L1auditor", role: "l1auditor" },
  { value: "L2AUDITOR", label: "L2auditor", role: "l2auditor" },
];
const { Option } = Select;
const AdminList = ({ userList }) => {
  const dispatch = useDispatch();
  const [checkedd, setChecked] = useState();
  const [rowData, setRowData] = useState();
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isMultiple, setIsMultiple] = useState(false);

  const onChange = (item, checked) => {
    setRowData(item);
    setChecked(checked);
  };

  const handleRows = (value) => {
    const updatedValue = Array.isArray(value) ? value : [value];
    setSelectedRoles(updatedValue);
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
            defaultValue={isMultiple ? [data?.role[0]] : data?.role[0]}
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
                dispatch(enableUser(checkedd, rowData, selectedRoles));
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
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th className={TableStyle.rowStyle}>User Name</th>
            <th className={TableStyle.rowStyle}>Email</th>
            <th>Role</th>
            <th>Date Created</th>
            <th>Action</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {userList?.length > 0 ? (
            userList?.map((item, index) => (
              <tr key={index} style={{ height: "35px" }}>
                <td
                  className={TableStyle.childBorder}
                  style={{ height: "47px !important" }}
                >
                  <div style={{ display: "flex" }}>
                    {renderUserPrfoile(
                      item?.firstName,
                      item?.lastBorder,
                      item?.profileImageUrl,
                      null,
                      "30px",
                      "30px"
                    )}
                    <span style={{ margin: "5px 0 0 5px" }}>
                      {item?.firstName ? item?.firstName : "---"}
                    </span>
                  </div>
                </td>
                <td
                  className={TableStyle.childBorder}
                  style={{ height: "40px !important" }}
                >
                  <span>{item?.lastName ? item?.lastName : "---"}</span>
                </td>
                <td
                  className={TableStyle.childBorder}
                  style={{ height: "40px !important" }}
                >
                  <span>{item?.userName ? item?.userName : "---"}</span>
                </td>
                <td
                  className={TableStyle.childBorder}
                  style={{ height: "40px !important" }}
                >
                  <span>{item?.email ? item?.email : "---"}</span>
                </td>
                <td
                  className={TableStyle.childBorder}
                  style={{ height: "40px !important" }}
                >
                  <div
                    style={{
                      margin: "-20px 0px 0px -20px",
                      width: "100%",
                    }}
                  >
                    {item?.role?.length > 0 ? (
                      <Select
                        className={`custom-ant-select ${TableStyle.customAntSelect}`}
                        style={{ width: "100%", marginTop: "15px" }}
                        defaultValue={item?.role[0]?.toLowerCase()}
                      >
                        {item?.role?.map((data) => (
                          <Option key={data} value={data} disabled={true}>
                            <span style={{ color: "#000" }}>
                              {" "}
                              {data.toLowerCase()}
                            </span>
                          </Option>
                        ))}
                      </Select>
                    ) : (
                      "---"
                    )}
                  </div>
                </td>

                <td
                  className={TableStyle.lastBorder}
                  style={{ height: "40px !important" }}
                >
                  <span>{dateFormate(dayjs, item?.createdDate)}</span>
                </td>
                <td
                  className={TableStyle.childBorder}
                  style={{
                    height: "40px !important",
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <Popover
                      content={() => getContent(item)}
                      title="Change Role"
                      trigger="click"
                    >
                      <div
                        onClick={() => {
                          setRowData(item);
                        }}
                      >
                        <EditButton />
                      </div>
                    </Popover>
                  </div>
                </td>
                <td
                  className={TableStyle.lastBorder}
                  style={{ height: "40px !important" }}
                >
                  <Switch
                    defaultChecked={item?.accountStatus}
                    onChange={(checked) => onChange(item, checked)}
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
    </div>
  );
};

export default AdminList;
