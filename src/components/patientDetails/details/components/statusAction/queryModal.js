import { Form, Modal, Select, Input } from 'antd';
import React from 'react';
const { TextArea } = Input;
import { actions as detailsActions } from "../../../../../stores/patient/details";
import { connect } from 'react-redux';
import styles from "../../hcc/styles.module.css";
import { getStorage } from '../../../../../utils/storages';
import { getResponePopup } from '../../../../../utils/reusable';
import RegularButton from '../../../../button';

const QueryModal = ({
  isOpen,
  onCancel,
  raiseQuery,
  roles,
  setIsQueried,
  setIsOpen,
  getStatus,
  localPatientId,
}) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const patientId = getStorage("patientId");
    const aliasName = getStorage("aliasName");
    const data = {
      patientId: patientId,
      aliasName: aliasName,
      queryReason: values?.reason,
      queriedToAliasName: values?.role,
    };
    const response = await raiseQuery(data);
    if (response?.status === "SUCCESS") {
      setIsQueried(true);
      getStatus(localPatientId);
      getResponePopup(response);
      setIsOpen(false);
      form.resetFields();
    } else {
      getResponePopup(response);
    }
  };
  const selectOptions = roles?.data?.response?.map((role) => ({
    label: role.aliasName,
    value: role.aliasName,
  }));
  return (
    <Modal
      title="Raise Query"
      open={isOpen}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item
          label="Select Role"
          name="role"
          rules={[{ required: true, message: "Select the Role!" }]}
        >
          <Select options={selectOptions} placeholder="Select Role" />
        </Form.Item>

        <Form.Item
          label="Reason"
          name="reason"
          rules={[{ required: true, message: "Enter Reason" }]}
        >
          <TextArea rows={4} maxLength={100} placeholder="Enter Reason" />
        </Form.Item>

        <Form.Item>
          <div className="d-flex align-items-center justify-content-center">
            <RegularButton type="submit" name="Submit" width={100} />
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};


const enhancer = connect(
  (state) => ({

    roles: state.patientDetails.details?.allRoles,
  }),
  {
    raiseQuery: detailsActions.raiseQueryAction,
   
  }
);
export default enhancer(QueryModal);