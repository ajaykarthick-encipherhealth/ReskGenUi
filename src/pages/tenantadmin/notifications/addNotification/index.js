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
import { createIdGen } from "../../../../utils/reusable";
import { useRouter } from "next/router";

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
const router = useRouter()
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
    if (!notifyAll && selectedList.length === 0) {
      notification.error({
        message: "Please select at least one user or check 'Notify All Users'",
      });
      return;
    }

    const data = {
      managerId: "",
      isAdmin: false,
      isSupervisor: false,
      isReviewer: false,
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
              ? createIdGen("notification-form ")
              : createIdGen(
                  "notification-form"+ router.pathname.replaceAll(" ")
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
                className={style.commentsFormControl}
                style={{ minHeight: "102px", resize: "none" }}
                placeholder="Enter notification message"
              />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select placeholder="Select category" allowClear>
                <Option value="general">General</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
              </Select>
            </Form.Item>

            <div className="d-flex gap-2 align-items-center mb-2">
              <div className="fw-bold">Users</div>
              <Checkbox
                checked={notifyAll}
                onChange={(e) => setNotifyAll(e.target.checked)}
              >
                Notify All Users
              </Checkbox>
            </div>

            {!notifyAll && (
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
