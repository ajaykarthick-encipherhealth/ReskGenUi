import React from "react";
import { Modal } from "antd";
const ResuableModal = ({
  title,
  isModalOpen,
  handleOk,
  handleCancel,
  destroyOnClose,
  mask,
  width,
  children,
}) => {
  return (
    <div className="antdModal">
      <Modal
        title={title}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={destroyOnClose}
        mask={mask}
        footer={null}
        width={width}
      >
        {children}
      </Modal>
    </div>
  );
};
export default ResuableModal;
