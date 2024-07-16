import React from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Layout,
  Divider,
  Steps,
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
} from "antd";
import {
  faUser,
  faEnvelope,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

const { Option } = Select;
const Organisation = ({ Styles}) => {
  return (
    <div>
      <div style={{ margin: "100px" }}>
        <Form layout="vertical">
          <Form.Item style={{ marginBottom: "60px" }}>
            <label className={Styles.customLabel}>Name</label>
            <Input
              placeholder="Enter Name"
              suffix={<FontAwesomeIcon icon={faUser} />}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: "60px" }}>
            <label className={Styles.customLabel}>Email</label>
            <Input
              placeholder="Enter your mail id"
              suffix={<FontAwesomeIcon icon={faEnvelope} />}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: "60px" }}>
            <label className={Styles.customLabel}>Address</label>
            <Input
              placeholder="Enter your Address"
              suffix={<FontAwesomeIcon icon={faLocationDot} />}
            />
          </Form.Item>
        </Form>
        <div></div>
      </div>
    </div>
  );
};

export default Organisation;
