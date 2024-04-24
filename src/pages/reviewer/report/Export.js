import { Button, Checkbox, Form, Input, Modal, Radio, Select } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./report.module.css";
import {
  getExportDetails,
  getUsersList,
} from "../../../store/actions/ReportActions";
import { useDispatch, useSelector } from "react-redux";
import { checkBoxData, debounce } from "../../admin/report/Export";
import { updateSentReport } from "../../../services/ReportService";
import { getActiveTab } from "../../../store/actions/l2Action/AuditReportAction";
import InputField from "../../../components/input";
const { Option } = Select;

const Export = ({
  isModalVisible,
  closeModal,
  rowsLength,
  setIsModalVisible,
  setSelectedRows,
  setSelectAll,
  selectedRows,
  isSent,
}) => {
  const usersList = useSelector((state) => state.report?.usersList);
  const selectedReportInfo = useSelector((state) => state.report?.reportInfo);
  const list = useSelector((state) => state.report.row);
  const [selectedUser, setSelectedUser] = useState();
  const [search, setSearch] = useState("");
  const [display, setDisplay] = useState(false);
  const [userList, setUsersList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [removedUsers, setRemovedUsers] = useState([]);
  const [reportName, setReportName] = useState("");
  const [form] = Form.useForm();
  const idList = list?.map((data) => data?.patientId);

  const [checkall, setCheckAll] = useState(checkBoxData);

  useEffect(() => {
    setCurrentUser(localStorage.getItem("userId"));
    var orgId = localStorage.getItem("orgId");
    dispatch(getUsersList(orgId, search));
  }, [search]);
  const dispatch = useDispatch();
  const options = usersList?.response
    ?.map(
      (data) =>
        data?.userName !== currentUser && {
          label: (
            <span>
              {data?.firstName}&nbsp;&nbsp;{data?.lastName}
            </span>
          ),
          value: data?.userName,
        }
    )
    .filter(Boolean);

  const handleSelectedOption = (value) => {
    const filteredData = usersList?.response?.filter(
      (data) => data?.userName === value[0]
    );
    setSelectedList(filteredData?.map((item) => item?.userName));
    setSelectedUser((prevUsers) => [
      { ...prevUsers, user: value[0], role: null },
    ]);
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

  const debouncedSearch = debounce((value) => {
    setSearch(value);
  }, 300);
  const handleSearch = (e) => {
    debouncedSearch(e);
  };

  const onFinish = (values) => {
    const patientIds = rowsLength?.map((item) => item?.patientId);
    const editUserAndAccess = userList.reduce((result, { user, role }) => {
      if (Array.isArray(user)) {
        user.forEach((info) => {
          result[info.userName] = role;
        });
      } else {
        result[user] = role;
      }
      return result;
    }, {});

    const fields = checkall?.reduce((acc, data) => {
      acc[data?.title] = data?.checked;
      return acc;
    }, {});
    const data = {
      fields: fields,
      patientIds: patientIds,
      fileType: values.ReportTYpe,
      reportName: values.ReportName,
      userAndAccess: editUserAndAccess,
      patientIds: idList,
    };
    const updatedData = {
      reportName: values?.ReportName,
      reportId: selectedRows?._id,
      userAndAccess: editUserAndAccess,
      removedUsers: removedUsers,
    };

    if (!isSent) {
      dispatch(getExportDetails(data));
    } else {
      dispatch(updateSentReport(updatedData));
      dispatch(getActiveTab("SentReport"));
    }
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

  const deleteUser = (userInfo) => {
    if (Array?.isArray(userInfo)) {
      setUsersList((prevUserList) =>
        prevUserList?.filter(
          (info) => info?.user[0]?.userId !== userInfo[0]?.userId
        )
      );
    } else {
      setRemovedUsers((prev) => [...prev, userInfo]);
      setUsersList((prevUserList) =>
        prevUserList?.filter((info) => info?.user !== userInfo)
      );
    }
  };

  const filteredOptions = options?.filter((option) => {
    return !userList?.some((data) => option?.value === data?.user);
  });
  useEffect(() => {
    setSelectedList([]);
    if (selectedRows?.receivedUsers?.length > 0) {
      setDisplay(true);

      setUsersList(selectedRows?.receivedUsers);
    } else {
      setDisplay(false);
      setUsersList([]);
    }
  }, [selectedRows, isModalVisible]);
  form.setFieldsValue({
    ReportName:
    selectedReportInfo?.receivedUsers?.length > 0
        ? selectedReportInfo?.reportName
        : reportName,
  });
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
          label={<div className={styles.fields}>Report Name</div>}
          name="ReportName"
          rules={[
            {
              required: true,
              message: "Please input your ReportName!",
            },
          ]}
        >
          <InputField
            ReportName={
              selectedReportInfo?.reportName ? selectedReportInfo?.reportName : reportName
            }
            setInputValue={setReportName}
            delay={1000}
            type="text"
            placeholder=""
            isSearch={false}
            isDisabled={selectedReportInfo?.reportName ? true : false}
            isInputFiled={true}
          />
        </Form.Item>

        {!isSent && (
          <>
            <Form.Item
              label={<div className={styles.fields}>Report Type</div>}
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
              label={<div className={styles.fields}>Report Fields</div>}
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
          </>
        )}

        <div style={{ display: "flex", marginBottom: "20px" }}>
          <div style={{ width: "100%" }}>
            <Form.Item
              label={<div className={styles.fields}>Send To</div>}
              name="User"
              required
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
                  onDropdownVisibleChange={(visible) => setOpen(visible)}
                  options={filteredOptions}
                />
                {/* {filteredOptions?.map((data) => (
                    <Option key={data?.value} value={data?.value}>
                      {data?.label}
                    </Option>
                  ))}
                </Select> */}
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
                    selectedUser[0]?.role
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
                    {item?.user?.length > 0 && Array.isArray(item?.user)
                      ? item?.user?.map(
                          (info) => `${info?.firstName}  ${info?.lastName}`
                        )
                      : item?.user}
                  </div>
                  <div key={index} className={styles.userRoleContainer}>
                    {item?.role}
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
            <div className={styles.noUser}>No User Selected</div>
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
