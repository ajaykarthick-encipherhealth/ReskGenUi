import { Button, Checkbox, Form, Input, Modal, Select } from "antd";
import React, { useState } from "react";
import styles from "./report.module.css";

const Export = ({
  isModalVisible,
  closeModal,
  onFinish,
  handleButtonClick,
}) => {
  const [selectedUser, setSelectedUser] = useState([]);
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
    setSelectedUser((prev) => [...prev, value]);
  };
  const deleteUser = (item) => {
    setSelectedUser(selectedUser?.filter((data) => data !== item));
  };
  const filteredOptions = options.filter(
    (option) => !selectedUser.includes(option.value)
  );
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
          <div
            style={{
              width: "60%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button
              //   key="close"
              className={styles.excel}
              //   onClick={handleButtonClick}
            >
              Excel
            </button>
            <button
              //   key="close"
              className={styles.excel}
              //   onClick={handleButtonClick}
            >
              CSV
            </button>
          </div>
        </Form.Item>

        <Form.Item
          label="Report Fields"
          name="ReportFields"
          valuePropName="checked"
          rules={[
            {
              required: true,
              message: "Please Select your Option!",
            },
          ]}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              margin: "0px 0",
            }}
          >
            {checkBoxData?.map((data) => (
              <Checkbox>{data.title}</Checkbox>
            ))}
          </div>
        </Form.Item>

        <Form.Item
          label="Sender"
          name="sender"
          rules={[
            {
              required: true,
              message: "",
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
              onChange={handleSelectedOption}
            />
            <Select
              //   defaultValue="lucy"
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
            />
            <div className={styles.displayDiv}>
              {selectedUser?.length > 0 ? (
                <div>
                  {selectedUser?.map((item) => (
                    <div className={styles.userName}>
                      <div>{item}</div>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => deleteUser(item)}
                      >
                        X
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                "No Users Selected"
              )}
            </div>
          </div>
        </Form.Item>
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
