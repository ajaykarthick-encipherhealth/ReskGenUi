import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Offcanvas, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Select, notification } from "antd";
import { getUsersList } from "../../../../store/actions/ReportActions";
import styles from "../style.module.css";

const { Option } = Select;

export const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(context, args), delay);
  };
};

const CreateNotification = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const usersList = useSelector((state) => state.report.usersList);
  const options = usersList?.response?.map((data) => ({
    label: data.userName,
    value: data.userName,
  }));
  const [validated, setValidated] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState();
  const [userList, setUsersList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const typeList = [
    {
      label: "INFO",
      value: "INFO",
    },
    {
      label: "ALERT",
      value: "ALERT",
    },
  ];

  const [inputValue, setInputValue] = useState({
    notificationType: "",
    content: "",
    userId: "",
  });

  const handleChange = async (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputValue({ ...inputValue, [key]: value });
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true) {
      console.log(inputValue);
      const response = await axios.put(
        ENDPOINTS.apiEndointFileUploadHcc +
          `communication/push-notifications/send`,
        inputValue
      );
      var result = response.data;
      if (result.status == "SUCCESS") {
        notification.success({
          message: result.message,
          placement: "top",
          duration: 1,
        });
        setOpen(false);
      }
    }
    setValidated(true);
  };

  const debouncedSearch = debounce((value) => {
    setSearch(value);
  }, 300);
  const handleSearch = (e) => {
    debouncedSearch(e);
  };

  const handleSelectedOption = (value) => {
    setSelectedList(value);
    setSelectedUser((prevUsers) => [{ ...prevUsers, user: value }]);
    setInputValue({ ...inputValue, ["userId"]: value });

    setOpenDropdown(false);
  };

  const handleSelectedType = (value) => {
    setInputValue({ ...inputValue, ["notificationType"]: value });
  };

  const filteredOptions =
    options &&
    options.filter((option) => !selectedUser?.user?.includes(option.value));

  useEffect(() => {
    var orgId = localStorage.getItem("orgId");
    dispatch(getUsersList(orgId, search));
  }, [search]);

  return (
    <Offcanvas
      onHide={setOpen}
      show={open}
      className="offcanvas-end"
      placement="end"
    >
      <div className="offcanvas-header">
        <h5 className="modal-title" id="#gridSystemModal">
          Add Notification
        </h5>
        <button
          type="button"
          className="btn-close"
          onClick={() => setOpen(false)}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div className="offcanvas-body">
        <div className="container-fluid">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-xl-12 mb-3">
                <Form.Label>
                  Notification Type <span className="text-danger">*</span>{" "}
                </Form.Label>
                <Select
                  className={`ant_select_form ${styles.ant_select_form}`}
                  mode="single"
                  placeholder="Please select"
                  onChange={handleSelectedType}
                >
                  {typeList?.map((data) => (
                    <Option key={data?.value} value={data?.value}>
                      {data?.label}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="col-xl-12 mb-3">
                <Form.Label>
                  User <span className="text-danger">*</span>{" "}
                </Form.Label>
                <div>
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
                  >
                    {filteredOptions?.map((data) => (
                      <Option key={data?.value} value={data?.value}>
                        {data?.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="col-xl-12 mb-3">
                <Form.Label>
                  Content <span className="text-danger">*</span>{" "}
                </Form.Label>
                <textarea
                  className={styles.commentsFormControl}
                  rows="5"
                  required
                  id="content"
                  name="content"
                  placeholder="Add Content"
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            <div>
              <Button type="submit" className="btn btn-primary btn-sm me-1">
                Submit
              </Button>
              <Button
                className="btn btn-danger btn-sm light ms-1"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Offcanvas>
  );
};

export default CreateNotification;
