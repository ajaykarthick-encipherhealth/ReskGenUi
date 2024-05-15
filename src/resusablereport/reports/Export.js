import { Button, Checkbox, Form, Input, Modal, Radio, Select } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./report.module.css";
import {
  getExportDetails,
  getUsersList,
} from "../../store/actions/ReportActions";
import { useDispatch, useSelector } from "react-redux";
import { checkBoxData, debounce } from "../../pages/admin/reports/Export";
import { updateSentReport } from "../../services/ReportService";
import { getActiveTab } from "../../store/actions/l2Action/AuditReportAction";
import InputField from "../../components/input";
import { SVGICON } from "../../jsx/constant/theme";
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
  const [activeButton, setActiveButton] = useState("excel");
  const [activeBtn, setActiveBtn] = useState("read");
  const [checkall, setCheckAll] = useState(checkBoxData);
  const [inputStr, setInputStr] = useState("");

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
      { ...prevUsers, user: value[0], role: activeBtn.toUpperCase() },
    ]);
    setOpen(false);
  };
  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };
  const handleActiveBtn = (buttonType) => {
    setActiveBtn(buttonType);
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
        : inputStr,
  });
  const isAllChecked = checkall?.every((item) => item.checked);

  useEffect(() => {
    setInputStr("");
  }, [isModalVisible]);
  return (
    <Modal
      title="Export "
      visible={isModalVisible}
      onCancel={closeModal}
      footer={false}
      className={styles.modelCon}
    >
      <Form form={form} onFinish={onFinish}>
        <div className="container-fluid">
          {/* <label className={styles.text}>Report Name</label> */}
          <div className={`p-2 ${styles.reportLabel}`}>
            Give a proper & suitable name for Report
          </div>

          <div className="col-md-12">
            <div className="d-flex text-center">
              <div className="col-md-10" style={{ marginRight: "10px" }}>
                <div className="form-group">
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
                        selectedReportInfo?.reportName
                          ? selectedReportInfo?.reportName
                          : inputStr
                      }
                      setInputValue={setReportName}
                      delay={1000}
                      type="text"
                      placeholder=""
                      isSearch={false}
                      isDisabled={selectedReportInfo?.reportName ? true : false}
                      isInputFiled={true}
                      activeTab={"Report"}
                      setSearchVal={setInputStr}
                      isReport={true}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="col-md-2">
                <div className={`text-right ${styles.btncontainer}`}>
                  <Button
                    style={{
                      marginRight: "10px",
                      backgroundColor:
                        activeButton === "excel" ? "white" : "transparent",
                      border: "none",
                      color: "black",
                    }}
                    onClick={() => handleButtonClick("excel")}
                  >
                    Excel
                  </Button>
                  <Button
                    style={{
                      backgroundColor:
                        activeButton === "csv" ? "white" : "transparent",
                      border: "none",
                      color: "black",
                    }}
                    onClick={() => handleButtonClick("csv")}
                  >
                    CSV
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12" style={{ marginTop: "10px" }}>
            <div className="d-flex p-2">
              <div>
                <div className="d-flex p-2">
                  <div style={{ marginRight: "10px" }}>Report Fields</div>
                  <div>
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
                      checked={isAllChecked}
                    >
                      {" "}
                      Select All
                    </Checkbox>
                  </div>
                </div>
                <div className={`p-2 ${styles.reportLabel}`}>
                  Select the fields you want to sent
                </div>
                <div
                  style={{
                    marginRight: "10px",
                    backgroundColor: "#EBF3FE",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  <ul>
                    {checkall?.map((data) => (
                      <li key={data?.id} style={{ padding: "5px" }}>
                        <Checkbox
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
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="col-md-9">
                <div className={`p-2 `}>Sent To</div>
                <div className={`p-2 ${styles.reportLabel}`}>
                  Select the fields you want to sent
                </div>
                <div className="d-flex">
                  <div className="col-md-9">
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Select
                        style={{
                          width: "100%",
                          marginRight: "10px",
                          background: "#EBF3FE",
                        }}
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
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className={`text-right ${styles.btncontainers}`}>
                      <Button
                        style={{
                          marginRight: "10px",
                          backgroundColor:
                            activeBtn === "read" ? "white" : "transparent",
                          border: "none",
                          color: "black",
                        }}
                        onClick={() => {
                          handleActiveBtn("read");
                          handleSelectedRole("READ");
                        }}
                      >
                        Read
                      </Button>
                      <Button
                        style={{
                          backgroundColor:
                            activeBtn === "download" ? "white" : "transparent",
                          border: "none",
                          color: "black",
                        }}
                        onClick={() => {
                          handleActiveBtn("download");
                          handleSelectedRole("DOWNLOAD");
                        }}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Button
                    onClick={() => {
                      setDisplay(true);
                      setSelectedUser([]);
                      setUsersList((prev) => [...prev, ...selectedUser]);
                      setSelectedList([]);
                    }}
                    style={{
                      backgroundColor: "#04306f",
                      width: "64px",
                      color: "#fff",
                      marginTop: "10px",
                    }}
                    disabled={
                      selectedUser && selectedUser?.length > 0 ? false : true
                    }
                  >
                    Add
                  </Button>
                </div>

                <div className={styles.listContainer}>
                  {display ? (
                    <div>
                      {userList?.map((item, index) => (
                        <div className={styles.userName}>
                          <div key={index} className={styles.userRoleContainer}>
                            {item?.user?.length > 0 && Array.isArray(item?.user)
                              ? item?.user?.map(
                                  (info) =>
                                    `${info?.firstName}  ${info?.lastName}`
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
                            {SVGICON.deleteIcon}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.noUser}>No User Selected</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Form.Item>
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
        </div>
      </Form>
    </Modal>
  );
};

export default Export;
