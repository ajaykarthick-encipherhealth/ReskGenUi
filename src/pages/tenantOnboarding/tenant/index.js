import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Input, Button, Row, Col, Select } from "antd";
import {
  faUser,
  faKey,
  faIdCard,
  faMobile,
  faGlobe,
  faTrash,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import Styles from "../tenantOnboarding.module.css";

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
const Tenant = ({
  
  sets,
  addSet,
  nextStep,
  deleteSet,
  credentials,
  handleInputChange,
  handleRoleChange,
}) => {
  return (
    <div>
      <div style={{ margin: "100px" }}>
        <Form layout="vertical">
          <Row gutter={16} justify="space-between" className={Styles.customRow}>
            <Col span={10}>
              <Form.Item >
                <label className={Styles.customLabel}>Client ID</label>
                <Input
                  placeholder="Enter Client ID"
                  suffix={<FontAwesomeIcon icon={faUser} />}
                  name="clientId"
                  value={credentials?.clientId}
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item className={Styles.customRow}>
                <label className={Styles.customLabel}>Tenant ID</label>
                <Input
                  placeholder="Enter Tenant ID"
                  suffix={<FontAwesomeIcon icon={faIdCard} />}
                  name="tenantid"
                  value={credentials?.tenantid}
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} justify="space-between" className={Styles.customRow}>
            <Col span={10}>
              <Form.Item className={Styles.customRow}>
                <label className={Styles.customLabel}>Client Secret</label>
                <Input
                  placeholder="Enter Client Secret"
                  suffix={<FontAwesomeIcon icon={faKey} />}
                  name="clientSecret"
                  value={credentials?.clientSecret}
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item className={Styles.customRow}>
                <label className={Styles.customLabel}>App Object ID</label>
                <Input
                  placeholder="Enter App Object ID"
                  suffix={<FontAwesomeIcon icon={faMobile} />}
                  name="appObjectId"
                  value={credentials?.appObjectId}
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} justify="space-between" className={Styles.customRow}>
            <Col span={10}>
              <Form.Item className={Styles.customRow}>
                <label className={Styles.customLabel}>Client Scope</label>
                <Input
                  placeholder="Enter Client Scope"
                  suffix={<FontAwesomeIcon icon={faIdCard} />}
                  name="scope"
                  value={credentials?.scope}
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item className={Styles.customRow}>
                <label className={Styles.customLabel}>Tenant Domain</label>
                <Input
                  placeholder="Enter Tenant Domain"
                  suffix={<FontAwesomeIcon icon={faGlobe} />}
                  name="tenantDomain"
                  value={credentials?.tenantDomain}
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16} justify="space-between" className={Styles.customRow}>
            {sets?.map((set, index) => (
              <div style={{ display: "flex", width: "60%" }} key={set.id}>
                <Col span={9}>
                  <Form.Item className={Styles.customRow}>
                    <div style={{ width: "100%" }} className={"customSelect"}>
                      <Select
                        placeholder="Roles"
                        value={credentials?.roles[set.id]?.role || undefined}
                        defaultValue={"Roles"}
                        onChange={(value) =>
                          handleRoleChange(value, set.id, "role")
                        }
                      >
                        {roles?.map((role) => (
                          <Option key={role.value} value={role.value}>
                            {role?.label}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item className={Styles.customRow}>
                    <label className={Styles.customLabel}>ID</label>
                    <Input
                      placeholder="Enter ID"
                      suffix={<FontAwesomeIcon icon={faGlobe} />}
                      value={credentials?.roles[set.id]?.idValue || ""}
                      onChange={(e) =>
                        handleRoleChange(e.target.value, set.id, "idValue")
                      }
                    />
                  </Form.Item>
                </Col>
                <div
                  className={`d-flex align-items-center justify-content-center mt-2 ${Styles.delete_button}`}
                  onClick={() => deleteSet(set.id)}
                >
                  <FontAwesomeIcon
                    color="red"
                    fontSize={"20px"}
                    icon={faTrash}
                  />
                </div>
              </div>
            ))}

            <Col span={2}>
              <Button className={Styles.customButton} onClick={addSet}>
                Add
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  style={{ marginRight: "8px" }}
                />
              </Button>
            </Col>
          </Row>

          <Row
            gutter={16}
            style={{
              justifyContent: "flex-end",
            }}
            className={Styles.customRow}
          ></Row>
        </Form>
        <div></div>
      </div>
    </div>
  );
};

export default Tenant;
