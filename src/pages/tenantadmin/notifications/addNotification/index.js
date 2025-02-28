
import { Modal, Input, Form, Button, Select, Checkbox, Tag } from "antd";
import style from "../style.module.css";
import { useState } from "react";

const { TextArea } = Input;
const { Option } = Select;

const NotificationModal = ({ isModalOpen, setIsModalOpen }) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [inputValue, setInputValue] = useState("");

const handleAddUser = () => {
  if (inputValue.trim() && !users.includes(inputValue)) {
    const newUsers = [...users, inputValue];

    setUsers(newUsers);
    form.setFieldsValue({ users: newUsers }); 
    setInputValue("");
  }
};

const handleRemoveUser = (user) => {
  const filteredUsers = users.filter((u) => u !== user);

  setUsers(filteredUsers);
  form.setFieldsValue({ users: filteredUsers }); 
};

const handleSubmit = (values) => {
  setIsModalOpen(false);
  form.resetFields();
  setUsers([]); 
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
            <div>
              <TextArea
                className={style.commentsFormControl}
                style={{ minHeight: "102px", resize: "none" }}
                placeholder="Enter notification message"
              />
            </div>
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select category" allowClear>
              <Option value="general">General</Option>
              <Option value="medium">Medium</Option>
              <Option value="alert">High</Option>
            </Select>
          </Form.Item>
          <div className="d-flex gap-2 align-items-center">
            <div className=" py-2 fw-bold">Users</div>

            <Checkbox>Notify All Users</Checkbox>
          </div>
          <Form.Item
            name="users"
            rules={[{ required: true, message: "Please enter a user" }]}
          >
            <Input
              placeholder="Enter user"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={handleAddUser}
              suffix={
                <Button
                  type="primary"
                  onClick={handleAddUser}
                  style={{ backgroundColor: "#04306f" }}
                >
                  {" "}
                  Add{" "}
                </Button>
              }
            />
          </Form.Item>

          <div className="mt-2">
            <div
              style={{
                height: "200px",
                overflow: "auto",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
              }}
            >
              {users.map((user) => (
    
                  <Tag
                    className="m-2 p-1"
                    key={user}
                    closable
                    onClose={() => handleRemoveUser(user)}
                    style={{ marginBottom: "5px" , height:"30px", testAlign:"center"}}
                  >
                    {user}
                  </Tag>

              ))}
            </div>
          </div>
          <Form.Item>
            <div className="d-flex align-items-center justify-content-center mt-3">
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
      </Modal>
    </div>
  );
};

export default NotificationModal;
