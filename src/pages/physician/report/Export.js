import { Button, Checkbox, Form, Input, Modal, Radio, Select } from "antd";
import React, { useState } from "react";
import styles from "./report.module.css";

const Export = ({
  isModalVisible,
  closeModal,
  onFinish,
  handleButtonClick,
}) => {
  const [selectedUser, setSelectedUser] = useState([]);
  const[selUser,setSelUser]=useState()
  const[selRole,SetSelRole]=useState()
  const options = [
    {
      value: "lucy",
      label: "Lucy",
    },
    {
      value: "Read",
      label: "Read",
    },
    {
      value: "Download",
      label: "Download",
    },
  ];
  const checkBoxData = [
    {
      id: 1,
      title: "Patient Id",
    },
    {
      id: 2,
      title: "Patient Name",
    },
    {
      id: 3,
      title: "HCC",
    },
    {
      id: 4,
      title: "Suggestion",
    },
    {
      id: 5,
      title: "Deleted",
    },
    {
      id: 6,
      title: "Total codes",
    },
    {
      id: 7,
      title: "Completed date",
    },
    {
      id: 8,
      title: "Comments",
    },
    {
      id: 9,
      title: "Auditor Name",
    },
    {
      id: 10,
      title: "Flag",
    },
  ];
  const handleSelectedOption = (value) => {
    setSelUser(value)
    setSelectedUser((prev) => [...prev, { user: value, role: "" }]);
  };
  const handleSelectedRole = (value) => {
    SetSelRole(value)
    setSelectedUser((prevUsers) => {
      const updatedUsers = prevUsers.map((user, index) => {
        if (index === prevUsers.length - 1) {
          return { ...user, role: value }; // Update the role for the latest added user
        }
        return user;
      });
      return updatedUsers;
    });
  };
  const deleteUser = (item) => {
    setSelectedUser(selectedUser?.filter((data) => data.user !== item));
  };
  const filteredOptions = options.filter(
    (option) => !selectedUser?.user?.includes(option.value)
  );
  const handleSearch = () => {
    console.log("dc");
  };
  return (
    <Modal
      title="Export "
      visible={isModalVisible}
      onCancel={closeModal}
      footer={false}
      className={styles.modelCon}
    >
      <Form name="basic" onFinish={onFinish}>
        <Form.Item
          label="Report Name"
          name="ReportName"
          rules={[
            {
              required: true,
              message: "Please input your ReportName!",
            },
          ]}
        >
          <Input style={{ width: "50%" }} />
        </Form.Item>

        <Form.Item
          label="Report Type"
          name="ReportTYpe"
          rules={[
            {
              required: true,
              message: "Please Select your Option!",
            },
          ]}
        >
          <Radio.Group>
            <Radio.Button value="Excel" className={styles.excel}>
              Excel
            </Radio.Button>
            <Radio.Button value="CSV" className={styles.excel}>
              CSV
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Report Fields"
          name="ReportFields"
          rules={[
            {
              required: true,
              message: "Please Select your Option!",
            },
          ]}
        >
          <Checkbox.Group>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
                margin: "0px 0",
              }}
            >
              {checkBoxData?.map((data) => (
                <Checkbox key={data.id} value={data.title}>
                  {data.title}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </Form.Item>

      <div style={{display:"flex",marginBottom:"20px"}}>
     <div style={{width:"50%",marginRight:"10px"}}>
     <Form.Item
          label="Sender"
          name="Sender"
          rules={[
            {
              required: true,
              message: "Select User and Role",
            },
          ]}
        >
          <div
            style={{
              width: "auto",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
        
            <Select
              placeholder="Select"
              className={styles.selectDiv}
              options={filteredOptions}
              showSearch
            //   value={selUser} 
              onSearch={handleSearch}
              onChange={handleSelectedOption}
            />

            <Select
              placeholder="Select"
              className={styles.selectDiv}
              options={[
                {
                  value: "Read",
                  label: "Read",
                },
                {
                  value: "Download",
                  label: "Download",
                },
              ]}
             
              onChange={handleSelectedRole}
            />
          
          </div>
        </Form.Item>
     </div>
        <div className={styles.displayDiv}>
              {selectedUser?.length > 0 ? (
                <>
                  {selectedUser?.map((item, index) => (
                    <div className={styles.userName}>
                      <div key={index} className={styles.userRoleContainer}>
                        {item.user}
                      </div>
                      <div key={index} className={styles.userRoleContainer}>
                        {item.role}
                      </div>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => deleteUser(item.user)}
                      >
                        X
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                "No Users Selected"
              )}
            </div>
      </div>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
          className={styles.footerBtn}
        >
          <Button type="primary" htmlType="submit">
            Generate
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Export;
