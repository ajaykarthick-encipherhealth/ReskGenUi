import React, { useEffect, useState } from "react";
import moment from "moment";
import TableStyle from "../../table.module.css";
import { Switch } from "antd";
import { useDispatch } from "react-redux";
import Selector from "../../../selector";
import EditButton from "../../../../images/adminUsers/EditButton";
import { getEnableUser } from "../../../../store/actions/adminAction/usersAction";

export default function AdminList({ userList }) {
  const dispatch = useDispatch();
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedOption, setSelectedOption] = useState();
  const [checked, setChecked] = useState(false);
  const [rowData, setRowData] = useState();

  // var tenId = localStorage.getItem("tenantId");
  // var uId = localStorage.getItem("userId");
  // var orgId = localStorage.getItem("orgId");
  // const data = {
  //   orgId: orgId,
  //   tenantId: tenId,
  //   userId: uId,
  // };
  const filteredData = userList?.filter((item) => item?.id === selectedRow);
  const Options =
    filteredData?.flatMap((item) =>
      item?.role?.map((data) => ({ label: data, value: data }))
    ) ?? [];

  const toggleEditRole = (rowId) => {
    setSelectedRow((prevRow) => (prevRow === rowId?.id ? null : rowId?.id));
    setRowData(rowId);
    // dispatch(getEnableUser(checked,rowData?.userName,selectedOption, setSelectedRow));
  };

  const onChange = (item, checked) => {
    // setRowData(item);
    // setChecked(checked);
    dispatch(getEnableUser(checked, item?.userName, null, setSelectedRow));
  };
  useEffect(() => {
    if (selectedOption) {
      dispatch(
        getEnableUser(
          checked,
          rowData?.userName,
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
                {selectedRow === item?.id && Options?.length > 1 ? (
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
                <span>
                  {item?.createdDate
                    ? moment(item?.createdDate).format("MM-DD-YYYY")
                    : "---"}
                </span>
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
                  defaultChecked
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
