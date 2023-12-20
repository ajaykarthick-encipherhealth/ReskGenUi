import { Button, Checkbox, Form, Input, Modal, Radio, Select } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./report.module.css";
import {
  getExportDetails,
  getUsersList,
} from "../../../store/actions/ReportActions";
import { useDispatch, useSelector } from "react-redux";
const { Option } = Select;

export const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(context, args), delay);
  };
};
const Export = ({ isModalVisible, closeModal, rowsLength }) => {
  const [selectedUser, setSelectedUser] = useState();
  const [search, setSearch] = useState("");
  const [display, setDisplay] = useState(false);
  const [userList, setUsersList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);

  useEffect(() => {
    var orgId = localStorage.getItem("orgId");
    dispatch(getUsersList(orgId, search));
  }, [search]);
  const dispatch = useDispatch();
  const usersList = useSelector((state) => state.report.usersList);
  const options = usersList?.map((data) => ({
    label: data.userName,
    value: data.userName,
  }));

  const checkBoxData = [
    {
      id: 1,
      title: "patientId",
    },
    {
      id: 2,
      title: "patientName",
    },
    {
      id: 3,
      title: "dob",
    },
    {
      id: 4,
      title: "processedDate",
    },
    {
      id: 5,
      title: "providerName",
    },
    {
      id: 6,
      title: "allocatedOn",
    },
    {
      id: 7,
      title: "noOfValidCodes",
    },
    {
      id: 8,
      title: "noOfSuggestedCodes",
    },
    {
      id: 9,
      title: "noOfDeletedCodes",
    },
    {
      id: 10,
      title: "totalCodes",
    },
    {
      id: 11,
      title: "allocatedUserId",
    },
    {
      id: 12,
      title: "comments",
    },
    {
      id: 13,
      title: "validDisease",
    },
  ];
  const handleSelectedOption = (value) => {
    setSelectedList(value);

    setSelectedUser((prevUsers) => [{ ...prevUsers, user: value }]);
  };

  const handleSelectedRole = (value) => {
    setSelectedUser((prevUsers) =>
      prevUsers?.map((item) => {
        if (value) {
          return { ...item, role: value };
        }
        return item;
      })
    );
  };

  const filteredOptions =
    options &&
    options.filter((option) => !selectedUser?.user?.includes(option.value));

  const debouncedSearch = debounce((value) => {
    setSearch(value);
  }, 300);
  const handleSearch = (e) => {
    debouncedSearch(e);
  };

  const onFinish = (values) => {
    const patientIds = rowsLength?.data?.map((item) => item?.patientId);
    const userAndAccess = userList.reduce((result, { user, role }) => {
      result[user] = role;
      return result;
    }, {});
    const selectedFields = values.ReportFields || [];

    const fields = checkBoxData?.reduce((acc, data) => {
      acc[data.title] = selectedFields?.includes(data.title);
      return acc;
    }, {});
    const data = {
      fields: fields,
      patientIds: patientIds,
      fileType: values.ReportTYpe,
      reportName: values.ReportName,
      userAndAccess: userAndAccess,
    };
    dispatch(getExportDetails(data));
  };

  const deleteUser = (user) => {
    setUsersList(userList?.filter((item) => item.user != user));
  };

  return (
    <Modal
      title="Export "
      visible={isModalVisible}
      onCancel={closeModal}
      footer={false}
      className={styles.modelCon}
    >
      <Form name="basic" onFinish={onFinish}>
        <Form.Item
          label="Report Name"
          name="ReportName"
          rules={[
            {
              required: true,
              message: "Please input your ReportName!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Report Type"
          name="ReportTYpe"
          rules={[
            {
              required: true,
              message: "Please Select your Option!",
            },
          ]}
        >
          <Radio.Group>
            <Radio.Button value="EXCEL" className={styles.excel}>
              Excel
            </Radio.Button>
            <Radio.Button value="CSV" className={styles.excel}>
              CSV
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Report Fields"
          name="ReportFields"
          rules={[
            {
              required: true,
              message: "Please Select your Option!",
            },
          ]}
        >
          <Checkbox.Group>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
                margin: "0px 0",
              }}
            >
              {checkBoxData?.map((data) => (
                <Checkbox key={data.id} value={data.title}>
                  {data.title}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </Form.Item>

        <div style={{ display: "flex", marginBottom: "20px" }}>
          <div style={{ width: "100%" }}>
            <Form.Item
              label="Sender"
              name="User"
              rules={[
                {
                  required: false,
                  message: "Select User",
                },
              ]}
            >
              <div
                style={{
                  width: "99%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Select
                  mode="multiple"
                  placeholder="Please select"
                  onChange={handleSelectedOption}
                  onSearch={handleSearch}
                  className={styles.selectDiv}
                  value={selectedList}
                >
                  {filteredOptions?.map((data) => (
                    <Option key={data.value} value={data.value}>
                      {data.label}
                    </Option>
                  ))}
                </Select>
                <Select
                  // mode="multiple"
                  placeholder="Please select"
                  onChange={(value) => handleSelectedRole(value)}
                  className={styles.selectDiv}
                  value={selectedUser?.map((item) => item.role)}
                >
                  <Option value="READ">Read</Option>
                  <Option value="DOWNLOAD">Download</Option>
                </Select>
                <Button
                  onClick={() => {
                    setDisplay(true);
                    setSelectedUser([]);
                    setUsersList((prev) => [...prev, ...selectedUser]);
                    setSelectedList([]);
                  }}
                  style={{
                    backgroundColor: "#04306f",
                    width: "100px",
                    color: "#fff",
                  }}
                >
                  add
                </Button>
              </div>
            </Form.Item>
          </div>
        </div>
        <div className={styles.displayDiv}>
          {display ? (
            <div>
              {userList?.map((item, index) => (
                <div className={styles.userName}>
                  <div key={index} className={styles.userRoleContainer}>
                    {item.user}
                  </div>
                  <div key={index} className={styles.userRoleContainer}>
                    {item.role}
                  </div>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => deleteUser(item.user)}
                  >
                    X
                  </div>
                </div>
              ))}
            </div>
          ) : (
            "No Users Selected"
          )}
        </div>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
          className={styles.footerBtn}
        >

            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#04306f",
                width: "100px",
                height: "40px",
              }}
            >
              Generate
            </Button>
       
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Export;
