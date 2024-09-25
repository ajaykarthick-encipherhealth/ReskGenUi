import { Button, Checkbox, Form, Input, Modal, Radio, Select } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./report.module.css";
import {
  getExportDetails,
  getUsersList,
  getUsersLists
} from "../../store/actions/ReportActions";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "../../pages/admin/reports/Export";
import { updateSentReport } from "../../services/ReportService";
import { getActiveTab } from "../../store/actions/l2Action/AuditReportAction";
import InputField from "../../components/input";
import { SVGICON } from "../../jsx/constant/theme";
import { getStorage } from "../../utils/storages";

export const checkBoxData = [
  {
    id: 1,
    title: "Patient Id",
    heading: "Patient ID",
    checked: false,
  },
  {
    id: 2,
    title: "patient Name",
    heading: "Patient Name",
    checked: false,
  },
  {
    id: 3,
    title: "DOS",
    heading: "DOS",
    checked: false,
  },
  {
    id: 4,
    title: "DOB",
    heading: "DOB",
    checked: false,
  },
  {
    id: 5,
    title: "Computed Date",
    heading: "Computed Date",
    checked: false,
  },
  {
    id: 6,
    title: "Provider Names",
    heading: "Provider Names",
    checked: false,
  },
  {
    id: 7,
    title: "Allocated On",
    heading: "Allocated On",
    checked: false,
  },
  {
    id: 8,
    title: "NO Of Valid Codes",
    heading: "No Of Valid Codes",
    checked: false,
  },
  {
    id: 9,
    title: "No Of Suggested Codes",
    heading: "No Of Suggested Codes",
    checked: false,
  },
  {
    id: 10,
    title: "No Of Deleted Codes",
    heading: "No Of Deleted Codes",
    checked: false,
  },
  {
    id: 11,
    title: "Total Codes",
    heading: "Total Codes",
    checked: false,
  },
  {
    id: 12,
    title: "Patient Allocated",
    heading: "Patient Allocated",
    checked: false,
  },
  {
    id: 13,
    title: "Hcc Diagnosis Codes Desc",
    heading: "Hcc Diagnosis Codes Desc",
    checked: false,
  },
  {
    id: 14,
    title: "Hcc Diagnosis Codes",
    heading: "Hcc Diagnosis Codes",
    checked: false,
  },
  {
    id: 15,
    title: "Suggested Diagnosis Codes",
    heading: "Suggested Diagnosis Codes",
    checked: false,
  },
  {
    id: 16,
    title: "Suggested Diagnosis Codes Desc",
    heading: "Suggested Diagnosis Codes Desc",
    checked: false,
  },
  {
    id: 17,
    title: "SUGGESTED PAGE NUMBER",
    heading: "Suggested Page Number",
    checked: false,
  },
  {
    id: 18,
    title: "MEAT PRESENT",
    heading: "MEAT Present",
    checked: false,
  },
  {
    id: 19,
    title: "MEAT",
    heading: "MEAT",
    checked: false,
  },
  {
    id: 20,
    title: "Provider Credentials",
    heading: "Provider Credentials",
    checked: false,
  },
  {
    id: 21,
    title: "Provider Signature",
    heading: "Provider Signature",
    checked: false,
  },
  {
    id: 22,
    title: "Authorized Provider",
    heading: "Authorized Provider",
    checked: false,
  },
  {
    id: 23,
    title: "HCC PAGE NUMBER",
    heading: "HCC Page Number",
    checked: false,
  },
  {
    id: 24,
    title: "RISK ADJUSTMENT",
    heading: "Risk Adjustment",
    checked: false,
  },
  {
    id: 25,
    title: "PAGE NUMBERS",
    heading: "Page Numbers",
    checked: false,
  },
  {
    id: 26,
    title: "FLAG",
    heading: "Flag",
    checked: false,
  },
];
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
  const usersList = useSelector((state) => state.report?.usersLists);
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
    setCurrentUser(getStorage("userId"));
    var orgId = getStorage("orgId");
    dispatch(getUsersLists(orgId, search));
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
    const patientIds = rowsLength
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
      fileType: activeButton.toUpperCase(),
      reportName: values.ReportName,
      userAndAccess: editUserAndAccess,
    };
    const updatedData = {
      reportName: values?.ReportName,
      reportId: selectedRows?._id,
      userAndAccess: editUserAndAccess,
      removedUsers: removedUsers,
    };
    console.log(data);
    if (!isSent) {
      dispatch(getExportDetails(data));
    } else {
      dispatch(updateSentReport(updatedData));
      dispatch(getActiveTab("Sent"));
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
              {!selectedReportInfo && (
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
                      borderRadius: "10px",
                      height: "435px",
                      overflowY: "scroll"
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
                                    return {
                                      ...data,
                                      checked: e.target.checked,
                                    };
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
              )}
              <div className={`col-md-${selectedReportInfo ? "12" : "9"}`}>
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
