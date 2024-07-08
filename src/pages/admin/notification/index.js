import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, connect } from "react-redux";
import { Radio, Select, notification } from "antd";
import { Button, Spinner } from "react-bootstrap";
import Header from "../../../jsx/layouts/nav/Header";
import styles from "./style.module.css";
import SendList from "./sendList/index";
import {
  getNotificationList,
  postNotification,
} from "../../../services/NotificationService";
import { getUsers } from "../../../store/actions/adminAction/usersAction";
import { SelectUserList } from "../../../services/adminServices/DashboardService";
import { actions as tenantAdminActions } from "../../../stores/tenantAdmin/notification";

const { Option } = Select;

export const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(context, args), delay);
  };
};

const Notification = ({ getAllCustomUsers, allCustomUsers }) => {
  const dispatch = useDispatch();
  const options = allCustomUsers?.data?.response?.map((data) => ({
    label: data?.firstName + " " + data?.lastName,
    value: data?.userName,
  }));

  const [selectedList, setSelectedList] = useState([]);
  const [selectedListTeam, setSelectedListTeam] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [selectCheckBox, setSelectCheckBox] = useState("");
  const [errMessage, setErrmessage] = useState({ msg: "", userErr: "" });
  const [errMessageRadio, setErrmessageRadio] = useState("");

  const [notificationList, setNotificationList] = useState([]);
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const [inputValue, setInputValue] = useState({
    notificationType: "INFO",
    content: "",
    usersIds: [],
    isReviewer: false,
    isSupervisor: false,
    isAdmin: false,
    managerId: "",
  });

  const radioOptions = [
    {
      label: "ALL",
      value: "ALL",
    },
    {
      label: "ADMIN",
      value: "ADMIN",
    },
    {
      label: "SUPERVISOR",
      value: "SUPERVISOR",
    },
    {
      label: "REVIEWER",
      value: "REVIEWER",
    },
    {
      label: "TEAM",
      value: "TEAM",
    },
    {
      label: "CUSTOM",
      value: "CUSTOM",
    },
  ];

  const filteredOptions =
    options &&
    options.filter((option) => !selectedUser?.user?.includes(option.value));

  const handleSelectedOption = (value) => {
    setSelectedList(value);
    setSelectedUser((prevUsers) => [{ ...prevUsers, user: value }]);
    setInputValue({ ...inputValue, ["usersIds"]: value });
    setOpenDropdown(false);
  };

  const handleSelectedOptionTeam = (value) => {
    setInputValue({ ...inputValue, ["managerId"]: value });
    setOpenDropdown(false);
  };

  const debouncedSearch = debounce((value) => {
    setSearch(value);
  }, 300);

  const handleSearch = (e) => {
    setSearchUser(e);
    debouncedSearch(e);
  };

  const onChange = ({ target: { value } }) => {
    setErrmessageRadio("");
    setSelectCheckBox(value);
    if (value == "CUSTOM") {
      getAllCustomUsers();
    }
  };

  const handleChange = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  const validDateForm = () => {
    let check = true;
    setErrmessageRadio("");
    // setErrmessage({ msg: "", userErr: "" });
    if (inputValue.content == "") {
      check = false;
      setErrmessage({ msg: "Please Enter Message", userId: "" });
    }

    if (selectCheckBox == "") {
      check = false;
      setErrmessageRadio("Please Select One Option");
    }

    return check;
  };

  const ValidateUser = () => {
    let check = true;
    if (selectCheckBox === "TEAM") {
      if (inputValue.managerId === "") {
        check = false;
        setErrmessage({ msg: "", userErr: "Please select manager" });
      }
      if (inputValue.managerId === "" && inputValue.content === "") {
        check = false;
        setErrmessage({
          msg: "Please Enter Message",
          userErr: "Please select manager",
        });
      }
    } else if (selectCheckBox === "CUSTOM") {
      if (inputValue.usersIds.length === 0) {
        check = false;
        setErrmessage({ msg: "", userErr: "Please select user" });
      }
      if (inputValue.usersIds.length === 0 && inputValue.content === "") {
        check = false;
        setErrmessage({
          msg: "Please Enter Message",
          userErr: "Please select user",
        });
      }
    } else {
      return (check = true);
    }

    return check;
  };
  const handleSubmit = async () => {
    if (ValidateUser() && validDateForm()) {
      setIsBtnLoading(true);
      setErrmessage({ msg: "", userErr: "" });
      let data = {
        managerId: null,
        isAdmin: selectCheckBox == "ADMIN" ? true : false,
        isSupervisor: selectCheckBox == "SUPERVISOR" ? true : false,
        isReviewer: selectCheckBox == "REVIEWER" ? true : false,
        usersIds: inputValue.usersIds,
        notificationType: "INFO",
        content: inputValue.content,
        all: selectCheckBox === "ALL" ? true : false,
      };
      let result = await postNotification(data);
      if (result.status == "SUCCESS") {
        setInputValue({
          notificationType: "INFO",
          content: "",
          usersIds: [],
          isReviewer: false,
          isSupervisor: false,
          isAdmin: false,
          managerId: "",
        });
        setSelectCheckBox("");
        setIsBtnLoading(false);
        getNotificationResult();
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
      }
    }
  };

  const getNotificationResult = async () => {
    let result = await getNotificationList();
    setNotificationList(result);
  };

  const getTeamUser = async () => {
    let result = await SelectUserList("SUPERVISOR");
    const options = result?.response?.map((data) => ({
      label: data?.firstName + "" + data?.lastName,
      value: data?.userName,
    }));
    setSelectedListTeam(options);
  };

  const clearSelectAll = () => {
    setSelectedList([]);
  };

  useEffect(() => {
    getTeamUser();
  }, []);

  useEffect(() => {
    getNotificationResult();
  }, []);
  useEffect(() => {
    dispatch(
      getUsers({
        pageCount: 0,
        search: searchUser,
        startDate: "",
        endDate: "",
        status: "",
        role: "",
        sort: "",
      })
    );
  }, [searchUser]);

  return (
    <>
      <div className={`menu-toggle`}>
        <Header />
        <div class="content-body">
          <div className="container-fluid">
            <div
              style={{
                display: "flex",

                justifyContent: "space-between",
              }}
            >
              <div style={{ paddingTop: "8px" }}>
                <Radio.Group
                  options={radioOptions}
                  onChange={onChange}
                  value={selectCheckBox}
                />
                <p className={styles.errorMessage}>{errMessageRadio}</p>
              </div>

              <div>
                <div>
                  {selectCheckBox == "CUSTOM" ? (
                    <>
                      <div className="d-flex" style={{ width: "600px" }}>
                        <Select
                          className={`ant_select_form ${styles.ant_select_form}`}
                          mode="multiple"
                          placeholder="Please select"
                          onChange={handleSelectedOption}
                          // onSearch={handleSearch}
                          value={selectedList}
                          open={openDropdown}
                          onDropdownVisibleChange={(visible) =>
                            setOpenDropdown(visible)
                          }
                          maxTagCount={3}
                          style={{ height: "42px", width: "515px" }}
                        >
                          {filteredOptions?.map((data) => (
                            <Option key={data?.value} value={data?.value}>
                              {data?.label}
                            </Option>
                          ))}
                        </Select>
                        {selectedList?.length > 1 && (
                          <div>
                            <Button
                              className={styles.selectClearBtn}
                              onClick={() => clearSelectAll()}
                            >
                              Clear
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className={styles.errorMessage}>
                        {errMessage?.userErr}
                      </p>
                    </>
                  ) : null}
                  {selectCheckBox == "TEAM" ? (
                    <div style={{ width: "600px" }}>
                      <Select
                        className={`ant_select_form ${styles.ant_select_form}`}
                        placeholder="Please select"
                        onChange={handleSelectedOptionTeam}
                        onDropdownVisibleChange={(visible) =>
                          setOpenDropdown(visible)
                        }
                        style={{ height: "42px", width: "515px" }}
                      >
                        {selectedListTeam?.map((data) => (
                          <Option key={data?.value} value={data?.value}>
                            {data?.label}
                          </Option>
                        ))}
                      </Select>
                      <p className={styles.errorMessage}>
                        {errMessage?.userErr}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                <Button
                  className={styles.notificationSentBtn}
                  onClick={() => handleSubmit()}
                >
                  {isBtnLoading ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className={styles.btnLoading}
                    />
                  ) : null}
                  Send
                </Button>
              </div>
            </div>

            <div className={styles.textareaContainer}>
              <textarea
                className={styles.commentsFormControl}
                value={inputValue?.content}
                rows="5"
                required
                id="content"
                name="content"
                placeholder="Message"
                onChange={handleChange}
              ></textarea>
              <p className={styles.errorMessage}>{errMessage?.msg}</p>
            </div>
            <div className={styles.sendListContainer}>
              <SendList result={notificationList} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const enhancer = connect(
  (state) => ({
    allCustomUsers: state?.tenantAdmin?.notification?.customUsers,
  }),
  {
    getAllCustomUsers: tenantAdminActions.getCustomUsersAction,
  }
);
export default enhancer(Notification);
