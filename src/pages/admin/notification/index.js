import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Checkbox, Radio, Select, notification } from "antd";
import { Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Header from "../../../jsx/layouts/nav/Header";
import styles from "./style.module.css";
import SendList from "./sendList/index";
import {
  getNotificationList,
  postNotification,
} from "../../../services/NotificationService";
import { getUsers } from "../../../store/actions/adminAction/usersAction";
import { SelectUserList } from "../../../services/adminServices/DashboardService";

const { Option } = Select;

export const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(context, args), delay);
  };
};

const Notification = ({}) => {
  const dispatch = useDispatch();
  const usersData = useSelector((state) => state.adminUsers.usersData);
  const options = usersData?.data?.response?.content?.map((data) => ({
    label: data?.firstName + "" + data?.lastName,
    value: data?.userName,
  }));

  const [selectedList, setSelectedList] = useState([]);
  const [selectedListTeam, setSelectedListTeam] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [search, setSearch] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [selectCheckBox, setSelectCheckBox] = useState("");
  const [errMessage, setErrmessage] = useState("");
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
  };

  const handleChange = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  const validDateForm = () => {
    var check = true;
    setErrmessage("");
    setErrmessageRadio("");
    if (inputValue.content == "") {
      check = false;
      setErrmessage("Please Enter Message");
    }
    if (selectCheckBox == "") {
      check = false;
      setErrmessageRadio("Please Select One Option");
    }
    return check;
  };

  const handleSubmit = async () => {
    if (validDateForm()) {
      setIsBtnLoading(true);
      setErrmessage("");
      var data = {
        managerId: null,
        isReviewer: selectCheckBox == "ADMIN" ? true : false,
        isSupervisor: selectCheckBox == "SUPERVISOR" ? true : false,
        isAdmin: selectCheckBox == "REVIEWER" ? true : false,
        usersIds: inputValue.usersIds,
        notificationType: "INFO",
        content: inputValue.content,
        all: selectCheckBox === "ALL" ? true : false,
      };
      var result = await postNotification(data);
      if (result.status == "SUCCESS") {
        setIsBtnLoading(false);
        getNotificationResult();
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
      } else {
      }
    }
  };

  const getNotificationResult = async () => {
    var result = await getNotificationList();
    setNotificationList(result);
  };

  const getTeamUser = async () => {
    var result = await SelectUserList("SUPERVISOR");
    const options = result?.response?.map((data) => ({
      label: data?.firstName + "" + data?.lastName,
      value: data?.userName,
    }));
    setSelectedListTeam(options);
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
            {/* <div className="d-flex">
              <Button
                className={styles.notificationBtn}
              >
                Send
              </Button>
              <Button
                className={`ms-3 ${styles.notificationBtn}`}
              >
                Receive
              </Button>
            </div> */}
            <div
              // className={`row notification ${styles.checkBoxConatiner}`}
              style={{
                display: "flex",

                justifyContent: "space-between",
              }}
            >
              <div>
                {/* <Checkbox.Group options={options} onChange={onChange} /> */}
                <Radio.Group options={radioOptions} onChange={onChange} />
                <p className={styles.errorMessage}>{errMessageRadio}</p>
              </div>

              <div>
                <div>
                  {selectCheckBox == "CUSTOM" ? (
                    <div style={{ width: "515px" }}>
                      <Select
                        className={`ant_select_form ${styles.ant_select_form}`}
                        mode="multiple"
                        placeholder="Please select"
                        onChange={handleSelectedOption}
                        onSearch={handleSearch}
                        value={selectedList}
                        open={openDropdown}
                        onDropdownVisibleChange={(visible) =>
                          setOpenDropdown(visible)
                        }
                        style={{ height: "42px", width: "515px" }}
                      >
                        {filteredOptions?.map((data) => (
                          <Option key={data?.value} value={data?.value}>
                            {data?.label}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  ) : null}
                  {selectCheckBox == "TEAM" ? (
                    <div style={{ width: "515px" }}>
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
                {/* <Button className={`ms-3 ${styles.notificationCancelBtn}`}>
                  Cancel
                </Button> */}
              </div>
            </div>

            <div className={styles.textareaContainer}>
              <textarea
                className={styles.commentsFormControl}
                rows="5"
                required
                id="content"
                name="content"
                placeholder="Message"
                onChange={handleChange}
              ></textarea>
              <p className={styles.errorMessage}>{errMessage}</p>
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

export default Notification;
