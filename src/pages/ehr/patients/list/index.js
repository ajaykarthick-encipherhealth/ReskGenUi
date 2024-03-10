import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Empty, Popover, Select, Switch, Modal } from "antd";
import dayjs from "dayjs";
import TableStyle from "../../../../components/table/table.module.css";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import SpinnerDots from "../../../../components/spinner";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import {
  renderUserPrfoileAvatar,
  renderUserPrfoileAvatarDisabled,
} from "../../../../components/headerFilters/functions";

const items = [
  { value: "ADMIN", label: "Admin", role: "admin" },
  { value: "REVIEWER", label: "Reviewer", role: "REVIEWER" },
  { value: "SUPERVISOR", label: "Supervisor", role: "SUPERVISOR" },
];

const PatientList = ({ userList, sortOrder, setSortOrder, setSort }) => {
  const router = useRouter();
  const usersData = useSelector((state) => state.adminUsers.usersData);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const handleTableRowClick = () => {
    setOpen(true);
  };
  const gotoDetails = () => {
    setOpen(true);
    router.push("patients/details");
  };

  const selectUserList = useSelector(
    (state) => state?.AdminDashboardReducers?.selectedUsers
  );

  const patientList = [
    {
      id: "EH-1234",
      firstName: "Francis",
      lastName: "Tomy",
      dob: "05/25/1898",
      phone: 999 - 555 - 4444,
      address: "1 E 2nd St, New York, NY 10003, USA",
      ssn: "XXX_XXX_555",
    },

    {
      id: "EH-1235",
      firstName: "Charlie",
      lastName: "Smith",
      dob: "05/25/1878",
      phone: 999 - 555 - 4444,
      address: "1 E 2nd, NY 10003, USA",
      ssn: "XXX_XXX_666",
    },
    {
      id: "EH-1236",
      firstName: "Andrew",
      lastName: "Martinez",
      dob: "05/25/1878",
      phone: 999 - 555 - 4444,
      address: "5nd St,York, NY 10003, USA",
      ssn: "XXX_XXX_7777",
    },
  ];

  return (
    <div>
      {!usersData || usersData?.loading ? (
        <SpinnerDots />
      ) : (
        <table className={TableStyle.classTable}>
          <thead className={TableStyle.classThead}>
            <tr>
              <th style={{ textAlign: "center" }}>MRN</th>
              <th className={TableStyle.rowEmailStyle}>NAME</th>
              <th style={{ textAlign: "center" }}>DATE OF BIRTH</th>
              <th style={{ textAlign: "center" }}>SEX</th>
              <th style={{ textAlign: "center" }}>PHONE</th>
              <th style={{ textAlign: "center" }}>ADDRESS</th>
              <th style={{ textAlign: "center" }}>SSN</th>
            </tr>
          </thead>
          <tbody>
            {!usersData?.loading && patientList.length > 0 ? (
              patientList.map((item, index) => (
                <tr
                  key={index}
                  style={{
                    height: "35px",
                  }}
                  onClick={handleTableRowClick}
                >
                  <td
                    className={TableStyle.childBorder}
                    style={{ textAlign: "center" }}
                  >
                    {item.id}
                  </td>
                  <td
                    className={TableStyle.childBorder}
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {item.firstName ||
                    item.lastName ||
                    item?.profileImageUrl ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {item.accountStatus === false ? (
                          <span
                            style={{
                              marginRight: "10px",
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
                    style={{ textAlign: "center" }}
                  >
                    05/25/1898
                  </td>
                  <td
                    className={TableStyle.childBorder}
                    style={{ textAlign: "center" }}
                  >
                    F
                  </td>
                  <td
                    className={TableStyle.childBorder}
                    style={{ textAlign: "center" }}
                  >
                    999-555-444
                  </td>
                  <td
                    className={TableStyle.childBorder}
                    style={{ textAlign: "center" }}
                  >
                    1 E 2nd St, New York, NY 10003, USA
                  </td>
                  <td
                    className={TableStyle.childBorder}
                    style={{ textAlign: "center" }}
                  >
                    XXX_XXX_555
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
      <Modal
        title="Confirm External Access"
        onOk={gotoDetails}
        onCancel={() => setOpen(false)}
        centered
        open={open}
        okText="Grant Access"
        cancelText="Deny Access"
      >
        <p>Are you sure want to grant access to data</p>
      </Modal>
    </div>
  );
};

export default PatientList;
