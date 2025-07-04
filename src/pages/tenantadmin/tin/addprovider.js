import React from "react";
import { Modal, Form, Input, Select, Spin } from "antd";
import RegularButton from "../../../components/button";

const ProviderAddForm = ({
  isModalOpen,
  handleOk,
  handleCancel,
  handleFinish,
  handleChanges,
  handleChange,
  form,
  setOpt,
  getProviderNameLoad,
  opt,
  loading,
  providerList,
}) => {
  return (
    <Modal
      title="Add Provider"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <div>
        <Form
          layout="vertical"
          form={form}
          onFinish={handleFinish}
          autoComplete="off"
        >
          <Form.Item
            label="NPI Number"
            name="npiNumber"
            rules={[
              { required: true, message: "Please enter npi number" },
              { pattern: /^\d+$/, message: "Only numbers are allowed" },
            ]}
          >
            <Input
              style={{ width: "100%", height: "2.75rem" }}
              placeholder="Enter NPI Number"
              onChange={handleChanges}
              maxLength={10}
              onClear={() => setOpt([])}
              onBlur={() => {
                const selected = form.getFieldValue("npiNumber");
                if (!selected) {
                  setOpt([]);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === " ") {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>

          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Select
              style={{ width: "100%", height: "2.75rem" }}
              showSearch
              placeholder="Select First Name"
              labelInValue
              filterOption={false}
              onSearch={(value) => handleChange(value, "firstName")}
              onChange={(value, subValue) => {
                form.setFieldsValue({
                  npiNumber: subValue?.number || null,
                  lastName: subValue?.lastName || null,
                  firstName: subValue?.firstName || null,
                });
              }}
              onClear={() => setOpt([])}
              onBlur={() => {
                const selected = form.getFieldValue("firstName");
                if (!selected) {
                  setOpt([]);
                }
              }}
              notFoundContent={
                getProviderNameLoad ? <Spin size="small" /> : "No data"
              }
              options={!getProviderNameLoad && opt}
            />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Select
              style={{ width: "100%", height: "2.75rem" }}
              showSearch
              placeholder="Select Last Name"
              labelInValue
              filterOption={false}
              onSearch={(value) => handleChange(value, "lastName")}
              onChange={(value, subValue) => {
                form.setFieldsValue({
                  npiNumber: subValue?.number || null,
                  firstName: subValue?.firstName || null,
                  lastName: subValue?.lastName || null,
                });
              }}
              onClear={() => setOpt([])}
              onBlur={() => {
                const selected = form.getFieldValue("lastName");
                if (!selected) {
                  setOpt([]);
                }
              }}
              notFoundContent={
                getProviderNameLoad ? <Spin size="small" /> : "No data"
              }
              options={!getProviderNameLoad && opt}
            />
          </Form.Item>
          <Form.Item
            label="Practice Name"
            name="practiceName"
            rules={[{ required: true, message: "Please enter practice name" }]}
          >
            <Select
              style={{ width: "100%", height: "2.75rem" }}
              showSearch
              placeholder="Select Practice Name"
              labelInValue
              options={opt ? providerList : []}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item className="d-flex justify-content-center">
            <RegularButton
              name="Add"
              type="submit"
              bg="#263E50"
              color="#fff"
              loading={loading}
              disabled={getProviderNameLoad || loading}
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ProviderAddForm;
