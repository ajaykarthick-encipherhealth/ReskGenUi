import React, { useEffect, useState } from "react";
import moment from "moment";
import TableStyle from "../../table.module.css";
import { Switch } from "antd";
import { useDispatch } from "react-redux";
import Selector from "../../../selector";
import EditButton from "../../../../images/adminUsers/EditButton";
// import { getEnableUser } from "../../../../store/actions/adminAction/usersAction";
import { dateFormate } from "../../../headerFilters/functions";
import { enableUser } from "../../../../services/adminServices/usersService";

export default function AdminList({ userList }) {
  const dispatch = useDispatch();
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedOption, setSelectedOption] = useState();
  const [checked, setChecked] = useState(false);
  const [rowData, setRowData] = useState();

  const filteredData = userList?.filter((item) => item?.id === selectedRow);
  const Options =
    filteredData?.flatMap((item) =>
      item?.role?.map((data) => ({ label: data, value: data }))
    ) ?? [];

  const toggleEditRole = (rowId) => {
    setSelectedRow((prevRow) => (prevRow === rowId?.id ? null : rowId?.id));
    setRowData(rowId);
    setChecked(checked)
  };

  const onChange = (item, checked) => {
    dispatch(enableUser(checked, item, null, setSelectedRow));
  };
  useEffect(() => {
    if (selectedOption) {
      dispatch(
        enableUser(
          checked,
          rowData,
          selectedOption,
          setSelectedRow
        )
      );
    }
  }, [selectedOption]);

  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Date Created</th>
            <th>Action</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {userList?.map((item, index) => (
            <tr key={index} style={{ height: "35px" }}>
              <td
                className={TableStyle.childBorder}
                style={{ height: "47px !important" }}
              >
                <span>{item?.firstName ? item?.firstName : "---"}</span>
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
                {selectedRow === item?.id? (
                  <div style={{ margin: "-20px 0px 0px -20px", width: "70%" }}>
                    <Selector
                      selectlabel=""
                      setSelectedOption={setSelectedOption}
                      selectOptions={Options}
                      defaultSelectValue1={Options[0]}
                    />
                  </div>
                ) : (
                  <span>{item?.role[0] ? item?.role[0] : "---"}</span>
                )}
              </td>

              <td
                className={TableStyle.lastBorder}
                style={{ height: "40px !important" }}
              >
                <span>{dateFormate(item?.createdDate)}</span>
              </td>
              <td
                className={TableStyle.childBorder}
                style={{
                  height: "40px !important",
                  cursor: "pointer",
                }}
              >
                <div onClick={() => toggleEditRole(item)}>
                  <EditButton />
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
