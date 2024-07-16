import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Form,
  Input,
  Select,
} from "antd";
import {
  faUser,
  faEnvelope,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import Styles from "../tenantOnboarding.module.css";

const Organisation = ({  credentials, handleInputChange }) => {
  const validateEmail = (_, value) => {
    if (!value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Invalid email format"));
  };

  return (
    <div>
      <div style={{ margin: "100px" }}>
        <Form layout="vertical">
          <Form.Item style={{ marginBottom: "60px" }}>
            <label className={Styles.customLabel}>Name</label>
            <Input
              placeholder="Enter Name"
              suffix={<FontAwesomeIcon icon={faUser} />}
              name="name"
              value={credentials?.name || ""}
              onChange={handleInputChange}
            />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: "60px" }}
            rules={[
              { required: true, message: "Email is required" },
              { validator: validateEmail }
            ]}
            validateStatus={
              credentials?.email ? (validateEmail() ? "success" : "error") : ""
            }
            help={
              credentials?.email && !validateEmail()
                ? "Please enter a valid email"
                : ""
            }
          >
            <label className={Styles.customLabel}>Email</label>
            <Input
              placeholder="Enter your mail id"
              suffix={<FontAwesomeIcon icon={faEnvelope} />}
              name="email"
              value={credentials?.email || ""}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: "60px" }}>
            <label className={Styles.customLabel}>Address</label>
            <Input
              placeholder="Enter your Address"
              suffix={<FontAwesomeIcon icon={faLocationDot} />}
              name="address"
              value={credentials?.address || ""}
              onChange={handleInputChange}
            />
          </Form.Item>
        </Form>
        <div></div>
      </div>
    </div>
  );
};

export default Organisation;
