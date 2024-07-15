import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Input, Row, Col, Select } from "antd";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const { Option } = Select;
const Personal = ({ Styles }) => {
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
                  suffix={<FontAwesomeIcon icon={faUser} />}
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item style={{ marginBottom: "30px" }}>
                <label className={Styles.customLabel}>Last Name</label>
                <Input placeholder="Enter Field 2" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} justify="space-between" className={Styles.customRow}>
            <Col span={10}>
              <Form.Item style={{ marginBottom: "30px" }}>
                <label className={Styles.customLabel}>Email</label>
                <Input placeholder="Enter Field 1" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item style={{ marginBottom: "30px" }}>
                <label className={Styles.customLabel}>Password</label>
                <Input placeholder="Enter Field 2" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} justify="space-between" className={Styles.customRow}>
            <Col span={10}>
              <Form.Item style={{ marginBottom: "20px" }}>
                <label className={Styles.customLabel}>Role</label>
                <Input placeholder="Enter Field 1" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item style={{ marginBottom: "30px" }}>
                <label className={Styles.customLabel}>Username</label>
                <Input placeholder="Enter Field 2" />
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
