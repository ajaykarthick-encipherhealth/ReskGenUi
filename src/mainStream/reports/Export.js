import { Button, Checkbox, Form, Input, Modal, Radio, Select } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./report.module.css";
import { connect } from "react-redux";
import InputField, { debounce } from "../../components/input";
import { SVGICON } from "../../jsx/constant/theme";
import { getStorage } from "../../utils/storages";
import { actions as allActions } from "../../stores/admin/report";
import { createIdGen, getResponePopup } from "../../utils/reusable";
import { actions as reviewerAction } from "../../stores/reviewer/report";
import { useRouter } from "next/router";
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
  getActiveTab,
  updateSentReport,
  selectedReportInfo,
  usersList,
  getUsersLists,
  getExportDetails,
  exportLoader,
  updateReportLoader,
  sentReport,
  prefillData,
  setPrefillData,
  id,
}) => {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [display, setDisplay] = useState(false);
  const [userList, setUsersList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [removedUsers, setRemovedUsers] = useState([]);
  const [reportName, setReportName] = useState("");
  const [form] = Form.useForm();
  const [activeButton, setActiveButton] = useState("excel");
  const [activeBtn, setActiveBtn] = useState("read");
  const [checkall, setCheckAll] = useState(checkBoxData);
  const [inputStr, setInputStr] = useState(prefillData);
  const [filteredOptions, setFilteredOptions] = useState([]);

  const handleSelectedOption = (value) => {
    const filteredData = usersList?.data?.response?.filter((data) =>
      value.includes(data?.userName)
    );
    setSelectedList(value);
    setSelectedUser((prevUsers) => {
      const updatedUsers = filteredData.map((item) => ({
        user: item?.userName,
        role: activeBtn?.toUpperCase(),
      }));
      return updatedUsers;
    });

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

  const onFinish = async (values) => {
    const patientIds = rowsLength;
    const editUserAndAccess = userList?.reduce((result, { user, role }) => {
      result[user] = role;
      return result;
    }, {});
    const filteredId = checkall?.filter((item) => item?.checked);
    const data = {
      reportFields: filteredId?.map((info) => info?.heading),
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

    try {
      let res;
      if (!isSent) {
        res = await getExportDetails(data);
      } else {
        res = await updateSentReport(updatedData);
      }
      if (res?.status === "SUCCESS") {
        sentReport({
          pagenum: "",
          startDate: "",
          endDate: "",
          search: "",
          sort: "",
        });
        getResponePopup(res);
        form.resetFields();
        setSelectedUser([]);
        setSelectedList([]);
        setUsersList([]);
        setCheckAll((prev) => {
          return prev?.map((data) => {
            return { ...data, checked: false };
          });
        });
        setSelectedRows([]);
        setSelectAll(false);
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
    }
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

  const getOptionsList = async () => {
    const res = await getUsersLists();
    if (res) {
      const options = res?.response
        ?.map(
          (data) =>
            data?.userName !== currentUser && {
              label: (
                <span>
                  {data?.firstName}&nbsp;&nbsp;{data?.lastName}
                </span>
              ),
              value: data?.userName,
              searchString:
                `${data?.firstName} ${data?.lastName}`.toLowerCase(),
            }
        )
        .filter(Boolean);
      setFilteredOptions(options);
    }
  };
  useEffect(() => {
    setInputStr("");
  }, [isModalVisible]);
  useEffect(() => {
    if (selectedReportInfo?.reportName) {
      setPrefillData(selectedReportInfo.reportName);
    }
  }, [selectedReportInfo]);
  useEffect(() => {
    setCurrentUser(getStorage("userId"));
    // getUsersLists();
    getOptionsList();
    setInputStr(prefillData);
  }, []);

  const isAnyChecked = checkall?.some((item) => item?.checked);
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
          <div className={`py-2 ${styles.reportLabel}`}>
            Give a proper & suitable name for Report
          </div>

          <div className="col-12">
            <div className="d-flex text-center">
              <div className="col-10" style={{ marginRight: "10px" }}>
                <div
                  id="export-Input"
                  name="export-Input"
                  className="form-group"
                >
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
                      // ReportName={
                      //   selectedReportInfo?.reportName
                      //     ? selectedReportInfo?.reportName
                      //     : inputStr
                      // }
                      ReportName={inputStr}
                      setInputValue={setReportName}
                      delay={1000}
                      type="text"
                      placeholder="Please enter the report name"
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
              <div className="col-2">
                <div className={`text-right ${styles.btncontainer}`}>
                  <div id="report-Excelbtn" name="report-Excelbtn">
                    <Button
                      className="excelBtn"
                      data-testid="excel-btn"
                      name="excel-btn"
                      style={{
                        // marginRight: "10px",
                        backgroundColor:
                          activeButton === "excel" ? "white" : "transparent",
                        border: "none",
                        color: "black",
                      }}
                      onClick={() => handleButtonClick("excel")}
                    >
                      Excel
                    </Button>
                  </div>
                  <div className="csv-btn" name="csv-btn">
                    <Button
                      className="excelBtn"
                      data-testid="csv-btn"
                      name="csv-btn"
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
          </div>
          <div className="col-12" style={{ marginTop: "10px" }}>
            <div className="d-flex ">
              {!selectedReportInfo && (
                <div>
                  <div className="d-flex p-2">
                    <div style={{ marginRight: "10px" }}>Report Fields</div>
                    <div className="all-checked" name="all-checked">
                      <Checkbox
                        data-testid="select-all"
                        name="select-all"
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
                    Select the fields you want to send
                  </div>
                  <div
                    style={{
                      marginRight: "10px",
                      backgroundColor: "#EBF3FE",
                      padding: "10px",
                      borderRadius: "10px",
                      height: "435px",
                      overflowY: "scroll",
                    }}
                  >
                    <ul>
                      {checkall?.map((data, index) => (
                        <li
                          id={
                            id
                              ? createIdGen("checkAll" + index)
                              : createIdGen(
                                  "checkAll " +
                                    index +
                                   router.pathname.replaceAll("/", " ")
                                )
                          }
                          key={data?.id}
                          style={{ padding: "5px" }}
                        >
                          <Checkbox
                            id={
                              id
                                ? createIdGen("checked" + index)
                                : createIdGen(
                                    "checked " +
                                      index +
                                     router.pathname.replaceAll("/", " ")
                                  )
                            }
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
              <div className={`col-${selectedReportInfo ? "12" : "9"}`}>
                <div className={`p-2 `}>Sent To</div>
                <div className={`p-2 ${styles.reportLabel}`}>
                  Select the users you want to send
                </div>
                <div className="d-flex">
                  <div className="col-md-8 col-xl-9 col-lg-8">
                    <div
                      id="select-username"
                      name="select-username"
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Select
                        data-testid="export-select"
                        name="export-select"
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
                        filterOption={(input, option) =>
                          option?.label?.props?.children
                            ?.join("")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      />
                      {/* {filteredOptions?.map((data) => (
                    <Option key={data?.value} value={data?.value}>
                      {data?.label}
                    </Option>
                  ))}
                </Select> */}
                    </div>
                  </div>
                  <div className="col-md-4 col-xl-3 col-lg-4">
                    <div className={`text-right ${styles.btncontainers}`}>
                      <div className="read-btn" name="read-btn">
                        <Button
                          data-testid="readButton"
                          name="readButton"
                          className="excelBtn"
                          style={{
                            // marginRight: "10px",
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
                      </div>
                      <div name="download-btn" id="download-btn">
                        <Button
                          className="excelBtn"
                          data-testid="downloadButton"
                          name="downloadButton"
                          style={{
                            backgroundColor:
                              activeBtn === "download"
                                ? "white"
                                : "transparent",
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
                </div>

                <div id="add-Btn" name="add-btn">
                  <Button
                    id="addButton"
                    name="addButton"
                    onClick={() => {
                      setDisplay(true);
                      // setSelectedUser([]);
                      setSelectedList([]);
                      setUsersList((prev) => [...prev, ...selectedUser]);
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
                        <div className="pt-1">
                          <div className={styles.userName}>
                            <div
                              key={index}
                              className={styles.userRoleContainer}
                            >
                              {item?.user?.length > 0 &&
                              Array.isArray(item?.user)
                                ? item?.user?.map(
                                    (info) =>
                                      `${info?.firstName}  ${info?.lastName}`
                                  )
                                : item?.user}
                            </div>
                            <div
                              key={index}
                              className={styles.userRoleContainer}
                            >
                              {item?.role}
                            </div>

                            <div
                              id={
                                id
                                  ? createIdGen("delete" + index)
                                  : createIdGen(
                                      "delete " +
                                        index +
                                       router.pathname.replaceAll("/", " ")
                                    )
                              }
                              style={{ cursor: "pointer" }}
                              onClick={() => deleteUser(item.user)}
                            >
                              {SVGICON.deleteIcon}
                            </div>
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
          id="generate-Btn"
          name="generate-Btn"
          className="mt-2 d-flex align-items-center justify-content-center"
        >
          <Form.Item
            disabled={userList?.length > 0 && isAnyChecked ? false : true}
          >
            <div id="generate-Button" name="generate-Button">
              <Button
                id="generateBtn"
                name="generateBtn"
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "#04306f",
                  color: "#fff",
                  width: "100px",
                  height: "40px",
                }}
                disabled={
                  userList?.length > 0 && isAnyChecked
                    ? false
                    : true || exportLoader || updateReportLoader
                }
                loading={exportLoader || updateReportLoader}
              >
                Generate
              </Button>
            </div>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};
const connector = connect(
  (state) => ({
    selectedReportInfo: state?.admin?.report.selectedReportInfo,
    usersList: state?.admin?.report?.usersLists,
    exportLoader: state?.admin?.report?.exportLoader,
    updateReportLoader: state?.tenantAdmin?.tenantAdmin?.updateReportLoader,
  }),
  {
    getActiveTab: allActions.activeTab,
    updateSentReport: allActions.updateSentReport,
    getUsersLists: allActions.getUsersLists,
    getExportDetails: allActions.getExportDetails,
    sentReport: reviewerAction.sentReport,
  }
);
export default connector(Export);
