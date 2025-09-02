import React, { useState } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import { Form, Input, Select, Row, Col } from "antd";
import { actions as tinActions } from "../../stores/tenantAdmin/tin";
import { connect } from "react-redux";
import { getStorage, setStorage } from "../../utils/storages";
import { useRouter } from "next/router";

const Addpatients = ({
  addPatientId,
  setAddPatientId,
  validated,
  handleSubmitPatientId,
  handleChangePatientId,
  orgAllList,
  tinDetails,
  getPageRendering,
  loader,
}) => {
  const router = useRouter();
  const isProjectRoute = router.pathname === "/tenantadmin/project";

  const [form] = Form.useForm();
  const TinOptions = tinDetails?.map((client) => (
    {
    label: client.tinName,
    value: client.tinNumber,
    tinId: client.id,
  }
));

  const handleCancel = () => {
    form.resetFields();
    setAddPatientId(false);
  };
  const handleTinChange = (value) => {
    setStorage("tinNumber", value);
  };
  return (
    <Offcanvas
      data-testid="add-patient-details"
      onHide={() => {
        setAddPatientId(false);
        form.resetFields();
      }}
      show={addPatientId}
      className="offcanvas-end"
      placement="end"
    >
      <div className="offcanvas-header">
        <h5 className="modal-title" id="#gridSystemModal">
          Add Patient Details
        </h5>
        <button
          type="button"
          className="btn-close"
          onClick={() => {
            setAddPatientId(false);
            form.resetFields();
          }}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div className="offcanvas-body">
        <div className="container-fluid">
          <Form
            data-testid="add-patient-form"
            form={form}
            // onFinish={(values) => {
            //   handleSubmitPatientId(values, form);
            // }}
            onFinish={(values) => {
              const selectedTinObj = tinDetails?.find(
                (tin) => tin.tinNumber === values.tin
              );
              const payload = {
                ...values,
                tin: selectedTinObj?.tinNumber || getStorage("tinNumber"),
                // tinId: selectedTinObj?.id || null,
              };

              handleSubmitPatientId(payload, form);
            }}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            autoComplete="off"
          >
            {" "}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  id="patientId"
                  label="Patient ID"
                  name="patientId"
                  rules={[
                    {
                      required: true,
                      message: "Please enter patient ID!",
                    },
                    {
                      pattern: /^\S*$/,
                      message: "Patient ID should not contain spaces!",
                    },
                  ]}
                >
                  <Input
                    id="patientId"
                    name="patientId"
                    placeholder="Enter patient ID"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Patient Name"
                  name="patientName"
                  id="patientName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter patient name!",
                    },
                  ]}
                >
                  <div>
                    {" "}
                    <Input
                      id="patientName"
                      name="patientName"
                      placeholder="Enter patient name"
                    />
                  </div>
                </Form.Item>
                {isProjectRoute && (
                  <Form.Item
                    label="TIN Name"
                    name="tin"
                    id="tinNumber"
                    rules={[
                      {
                        required: true,
                        message: "Please select TIN!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select TIN"
                      onChange={handleTinChange}
                      options={TinOptions}
                      showSearch={true}
                      allowClear={true}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                )}
              </Col>
              {/* <Col span={24}>
                <Form.Item
                  label="Select Organization"
                  name="organizationId"
                  rules={[
                    {
                      required: true,
                      message: "Please select Organization!",
                    },
                  ]}
                >
                  <Select
                  id="organizationId"
                  name="organizationId"
                    placeholder="Select"
                    options={orgAllList}
                    style={{ height: "42px" }}
                  />
                </Form.Item>
              </Col> */}
            </Row>
            <div style={{ display: "flex", gap: "8px" }}>
              <Form.Item>
                <Button
                  id="submit-btn"
                  name="submit-btn"
                  type="submit"
                  className="btn btn-sm ms-2 flr width-max-content custom-btn-style"
                >
                  {loader ? "Loading..." : "Submit"}
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  id="cancel-btn"
                  name="cancel-btn"
                  className="btn btn-danger btn-sm light ms-1"
                  onClick={() => handleCancel()}
                >
                  Cancel
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </Offcanvas>
  );
};
const enhancer = connect(
  (state) => ({
    tinDetails: state.authReducer?.getTinDropdown?.data?.response,
  }),
  {
    getPageRendering: tinActions.pageRendering,
  }
);
export default enhancer(Addpatients);
