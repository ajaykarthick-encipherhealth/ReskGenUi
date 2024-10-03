import { Modal } from "antd";
import React from "react";

const ModalPop = ({ openModal, content, setOpenModal, width,handleOk   }) => {
  return (
    
    <Modal
      open={openModal}
      footer={false}
      onCancel={setOpenModal}
      onOk={handleOk}
      width={width ? width : 700}
      destroyOnClose={true}
    >
      {content}
    </Modal>
  );
};

export default ModalPop;
