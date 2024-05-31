import { Modal } from "antd";
import React from "react";

const ModalPop = ({ openModal, content,setOpenModal }) => {
  return (
    <Modal open={openModal} footer={false} onCancel={()=>setOpenModal(false)}>
      {content}
    </Modal>
  );
};

export default ModalPop;
