import {
  Modal,
  Input,
  Form,
  Button,
  Select,
  Checkbox,
  Tag,
  notification,
} from "antd";
import style from "../style.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createIdGen } from "../../../../utils/reusable";

const { TextArea } = Input;
const { Option } = Select;

const NotificationModal = ({
  isModalOpen,
  setIsModalOpen,
  postNotification,
  getNotificationList,
  allCustomUsers,
  getAllCustomUsers,
  id,
}) => {
  const [form] = Form.useForm();
  const [notifyAll, setNotifyAll] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [roles, setRoles] = useState({
    isAdmin: false,
    isReviewer: false,
    isSupervisor: false,
    isCustom: false,
  });
  const router = useRouter();
  const rolesList = [
    { userRole: "notifyAll", label: "Notify All Users", allUser: true },
    { userRole: "isAdmin", label: "Tenant Admin" },
    { userRole: "isReviewer", label: "Reviewer" },
    { userRole: "isSupervisor", label: "Supervisor" },
    { userRole: "isCustom", label: "Custom" },
  ];
  useEffect(() => {
    getAllCustomUsers();
  }, []);

  const options = allCustomUsers?.data?.response?.map((data) => ({
    label: `${data?.firstName} ${data?.lastName}`,
    value: data?.userName,
  }));

  const handleSelectedOption = (value) => {
    setSelectedList(value);
  };

  const clearSelectAll = () => {
    setSelectedList([]);
  };

  const handleSubmit = async (values) => {
    if (
      !notifyAll &&
      selectedList.length === 0 &&
      !Object.values(roles).some((role) => role)
    ) {
      notification.error({
        message: "Please select at least one user or check 'Notify All Users'",
      });
      return;
    }

    const data = {
      managerId: "",
      ...roles,
      notificationType: "INFO",
      content: values.message,
      title: values.title,
      notificationCategories: values.category.toUpperCase(),
      all: notifyAll,
      usersIds: notifyAll ? [] : selectedList,
    };

    const result = await postNotification(data);

    if (result.status === "SUCCESS") {
      form.resetFields();
      setSelectedList([]);
      setIsModalOpen(false);
      getNotificationList();
      notification.success({
        message: result.message,
        placement: "top",
        duration: 1,
      });
    } else {
      notification.error({
        message: result.message || "Something went wrong",
      });
    }
  };

const handleCheckboxChange = (userRole, checked) => {
  if (userRole === "notifyAll") {
    setNotifyAll(checked);
    setRoles({
      isAdmin: checked,
      isReviewer: checked,
      isSupervisor: checked,
      isCustom: false,
    });
  } else {
    setRoles((prevRoles) => {
      const updatedRoles = { ...prevRoles, [userRole]: checked };
      if (prevRoles.notifyAll && userRole !== "isCustom") {
        setNotifyAll(false);
      }

      return updatedRoles;
    });
  }
};

const isCheckboxDisabled = (userRole) => {
  const roleSelected =
    ["isAdmin", "isReviewer", "isSupervisor"].some((role) => roles[role]) ||
    notifyAll;

  if (userRole === "isCustom") {
     return roleSelected ;
  }
  if (userRole === "notifyAll") {
    return roles.isCustom;
  }
  return roles.isCustom;
};


  return (
    <div>
      <Modal
        title="Add Notification"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={736}
      >
        <div
          id={
            id
              ? createIdGen("Add_Notification " + id)
              : createIdGen(
                  "Add_Notification" + router.pathname.replaceAll(" ")
                )
          }
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            labelCol={{ style: { fontWeight: "bold" } }}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input placeholder="Enter notification title" />
            </Form.Item>
            <Form.Item
              label="Message"
              name="message"
              rules={[{ required: true, message: "Please enter a message" }]}
            >
              <TextArea
                style={{ minHeight: "102px", resize: "none" }}
                placeholder="Enter notification message"
              />
            </Form.Item>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select
                data-testid="select-category"
                placeholder="Select category"
                allowClear
              >
                <Option value="general">General</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
              </Select>
            </Form.Item>
            <div className="d-flex gap-2 align-items-center mb-2">
              <div className="fw-bold">Users</div>

              {rolesList.map(({ userRole, label, allUser }) => (
                <Checkbox
                  key={userRole}
                  checked={
                    allUser
                      ? roles.isAdmin && roles.isReviewer && roles.isSupervisor
                      : roles[userRole]
                  }
                  onChange={(e) =>
                    handleCheckboxChange(userRole, e.target.checked)
                  }
                  disabled={isCheckboxDisabled(userRole)}
                >
                  {label}
                </Checkbox>
              ))}
            </div>

            {roles.isCustom && (
              <Form.Item label="Select Users">
                <div className="d-flex" style={{ width: "100%" }}>
                  <Select
                    data-testid="select-users"
                    mode="multiple"
                    placeholder="Please select users"
                    onChange={handleSelectedOption}
                    value={selectedList}
                    open={openDropdown}
                    onDropdownVisibleChange={setOpenDropdown}
                    maxTagCount={3}
                    style={{ flex: 1 }}
                    allowClear
                  >
                    {options?.map((data) => (
                      <Option key={data.value} value={data.value}>
                        {data.label}
                      </Option>
                    ))}
                  </Select>
                  {selectedList.length > 1 && (
                    <Button
                      className={style.selectClearBtn}
                      onClick={clearSelectAll}
                      style={{ marginLeft: 8 }}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </Form.Item>
            )}
            <Form.Item>
              <div
                id="notification-submit"
                className="d-flex align-items-center justify-content-center mt-3"
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: "#04306f" }}
                >
                  Submit
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default NotificationModal;
