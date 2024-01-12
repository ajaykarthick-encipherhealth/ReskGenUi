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
const Export = ({
  isModalVisible,
  closeModal,
  rowsLength,
  setIsModalVisible,
  setSelectedRows,
  setSelectAll,
}) => {
  const [selectedUser, setSelectedUser] = useState();
  const [search, setSearch] = useState("");
  const [display, setDisplay] = useState(false);
  const [userList, setUsersList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const checkBoxData = [
    {
      id: 1,
      title: "patientId",
      heading: "Patient Id",
      checked: false,
    },
    {
      id: 2,
      title: "patientName",
      heading: "Patient Name",
      checked: false,
    },
    {
      id: 3,
      title: "dob",
      heading: "Dob",
      checked: false,
    },
    {
      id: 4,
      title: "processedDate",
      heading: "Processed Date",
      checked: false,
    },
    {
      id: 5,
      title: "providerName",
      heading: "Provider Name",
      checked: false,
    },
    {
      id: 6,
      title: "allocatedOn",
      heading: "Allocated On",
      checked: false,
    },
    {
      id: 7,
      title: "noOfValidCodes",
      heading: "No Of Valid Codes",
      checked: false,
    },
    {
      id: 8,
      title: "noOfSuggestedCodes",
      heading: "No Of Suggested Codes",
      checked: false,
    },
    {
      id: 9,
      title: "noOfDeletedCodes",
      heading: "No Of Deleted Codes",
      checked: false,
    },
    {
      id: 10,
      title: "totalCodes",
      heading: "Total Codes",
      checked: false,
    },
    {
      id: 11,
      title: "allocatedUserId",
      heading: "Allocated UserId",
      checked: false,
    },
    {
      id: 12,
      title: "comments",
      heading: "Comments",
      checked: false,
    },
    {
      id: 13,
      title: "validDisease",
      heading: "Valid Disease",
      checked: false,
    },
  ];
  const [checkall, setCheckAll] = useState(checkBoxData);

  useEffect(() => {
    var orgId = localStorage.getItem("orgId");
    dispatch(getUsersList(orgId, search));
  }, [search]);
  const dispatch = useDispatch();
  const usersList = useSelector((state) => state.report.usersList);
  const options = usersList?.response?.map((data) => ({
    label: data.userName,
    value: data.userName,
  }));

  const handleSelectedOption = (value) => {
    setSelectedList(value);
    setSelectedUser((prevUsers) => [{ ...prevUsers, user: value }]);
    setOpen(false);
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
    userList &&
    options?.filter((option) => {
      return !userList?.some((data) => data?.user?.includes(option?.label));
    });

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
    const fields = checkall?.reduce((acc, data) => {
      acc[data.title] = data?.checked;
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
    form.resetFields();
    setUsersList([]);
    setCheckAll((prev) => {
      return prev?.map((data) => {
        return { ...data, checked: false };
      });
    });
    setSelectedRows([]);
    setSelectAll(false);
    setTimeout(() => {
      setIsModalVisible(false);
    }, 500);
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
      <Form form={form} name="basic" onFinish={onFinish}>
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              margin: "0px 0",
            }}
          >
            <Checkbox
              key={0}
              value={"all"}
              onChange={(e) => {
                if (e.target.value === "all") {
                  setCheckAll((prev) => {
                    return prev?.map((data) => {
                      return { ...data, checked: e.target.checked };
                    });
                  });
                }
              }}
            >
              {" "}
              Check All
            </Checkbox>
            {checkall?.map((data) => (
              <>
                <Checkbox
                  key={data?.id}
                  value={data?.title}
                  checked={data?.checked}
                  onChange={(e) => {
                    setCheckAll((prev) => {
                      return prev?.map((data) => {
                        if (data?.title === e.target.value) {
                          return { ...data, checked: e.target.checked };
                        } else {
                          return data;
                        }
                      });
                    });
                  }}
                >
                  {data.heading}
                </Checkbox>
              </>
            ))}
          </div>
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
                  open={open}
                  // disabled={selectedList?.length >= 1}
                  onDropdownVisibleChange={(visible) => setOpen(visible)}
                >
                  {filteredOptions?.map((data) => (
                    <Option key={data?.value} value={data?.value}>
                      {data?.label}
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
                  disabled={
                    selectedUser &&
                    selectedUser[0]?.user &&
                    selectedUser[0]?.role &&
                    selectedUser[0]?.user?.length <= 1
                      ? false
                      : true
                  }
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
              color: "#fff",
              width: "100px",
              height: "40px",
            }}
            disabled={userList?.length > 0 ? false : true}
          >
            Generate
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Export;
