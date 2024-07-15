import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Input, Row, Col, Select } from "antd";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const { Option } = Select;
const roles = [
  { value: "ADMIN", label: "Admin" },
  { value: "ADMIN_TECHNICAL_SUPPORT", label: "Admin Technical Support" },
  { value: "ADMIN_MEDICAL_CODER", label: "Admin Medical Coder" },
  { value: "REVIEWER", label: "Reviewer" },
  { value: "SUPERVISOR", label: "Supervisor" },
  { value: "PROVIDER", label: "Provider" },
  { value: "PHYSICIAN", label: "Physician" },
];
const Personal = ({ Styles, credentials, handleInputChange }) => {
  const validateEmail = (_, value) => {
    // Basic email validation regex
    if (!value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Invalid email format"));
  };
  const validateMobileNumber = (_, value) => {
    if (!value || /^[0-9]{10}$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Invalid mobile number format"));
  };
  return (
    <div>
      <div style={{ margin: "100px" }}>
        <Form layout="vertical">
          <Row gutter={16} justify="space-between" className={Styles.customRow}>
            <Col span={10}>
              <Form.Item style={{ marginBottom: "30px" }}>
                <label className={Styles.customLabel}>First Name</label>
                <Input
                  placeholder="Enter Field 1"
                  // suffix={<FontAwesomeIcon icon={faUser} />}
                  name="firstName"
                  value={credentials.firstName}
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item style={{ marginBottom: "30px" }}>
                <label className={Styles.customLabel}>Last Name</label>
                <Input
                  placeholder="Enter Field 2"
                  name="lastName"
                  value={credentials.lastName}
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} justify="space-between" className={Styles.customRow}>
            <Col span={10}>
              <Form.Item
                style={{ marginBottom: "30px" }}
                name="emailId"
                rules={[
                  {
                    required: true,
                    message: "Please enter your email address",
                  },
                  { validator: validateEmail },
                ]}
              >
                <div>
                  <label className={Styles.customLabel}>Email</label>
                  <Input
                    placeholder="Enter Email"
                    name="emailId"
                    type="email"
                    value={credentials.emailId}
                    onChange={handleInputChange}
                  />
                </div>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item style={{ marginBottom: "30px" }}>
                <label className={Styles.customLabel}>Password</label>
                <Input
                  placeholder="Enter Field 2"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} justify="space-between" className={Styles.customRow}>
            <Col span={10}>
              <Form.Item style={{ marginBottom: "30px" }}>
                <label className={Styles.customLabel}>Confirm Password</label>
                <Input
                  placeholder="Enter Confirm Password"
                  name="confirmPassword"
                  value={credentials.confirmPassword}
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                style={{ marginBottom: "30px" }}
                name="mobileNumber"
                rules={[
                  {
                    required: true,
                    message: "Please enter your email address",
                  },
                  { validator: validateMobileNumber },
                ]}
              >
                
                <div>
                  <label className={Styles.customLabel}>Mobile Number</label>
                  <Input
                    placeholder="Enter Mobile Number"
                    name="mobileNumber"
                    value={credentials.mobileNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </Form.Item>
            </Col>
          </Row>
          {/* <Row gutter={16} justify="space-between" className={Styles.customRow}>
            <Col span={10}>
              <Form.Item style={{ marginBottom: "20px" }}>
                <label className={Styles.customLabel}>Role</label>
                <Input
                  placeholder="Enter Field 1"
                  name="role"
                  value={credentials.role}
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item style={{ marginBottom: "30px" }}>
                <label className={Styles.customLabel}>Username</label>
                <Input
                  placeholder="Enter Field 2"
                  name="userName"
                  value={credentials.userName}
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
          </Row> */}
          <Row gutter={16} justify="space-between" className={Styles.customRow}>
            <Col span={10}>
              <Form.Item style={{ marginBottom: "20px" }} className="selectantdrole">
                <label className={Styles.customLabel}>Role</label>
                <Select
                  placeholder="Select a role"
                  name="role"
                  value={credentials.role}
                  onChange={(value) =>
                    handleInputChange({ target: { name: "role", value } })
                  }
                >
                  {roles.map((role) => (
                    <Option key={role.value} value={role.value}>
                      {role.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item style={{ marginBottom: "30px" }}>
                <label className={Styles.customLabel}>Username</label>
                <Input
                  placeholder="Enter Username"
                  name="userName"
                  value={credentials.userName}
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div></div>
      </div>
    </div>
  );
};

export default Personal;
