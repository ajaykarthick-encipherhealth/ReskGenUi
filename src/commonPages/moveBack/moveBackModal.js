import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, DatePicker, Modal, Select } from "antd";
import modalStyle from "../../pages/tenantadmin/allocateduser/allocate/style.module.css";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import {
  faSearch,
  faXmark,
  faUser,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  disablePastDate,
  priorityOptions,
} from "../../components/headerFilters";
import { actions as allActions } from "../../stores/admin/patientAllocation";
import { connect } from "react-redux";
import {
  createIdGen,
  formatDateForIndex,
  getResponePopup,
} from "../../utils/reusable";
import styles from "../../components/tables/table.module.css";
import { getStorage } from "../../utils/storages";
import TableSkeleton from "../../components/skeleton/table";
import RegularButton from "../../components/button";

const MoveBackModal = ({ open, setOpen }) => {
  return (
    <div>
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        title="Select Level"
        footer={false}
        width={700}
        className={"custom-modal"}
      >
        <div style={{height:'500px'}}>
        <div className="mt-4">
        <Select  placeholder="Select level" className="w-50 h-50"/>
        </div>
      
      <div className=" h-100 d-flex align-items-center justify-content-center">
        <RegularButton name={"Done"} />
      </div>
      </div>
      </Modal>
     
    </div>
  );
};

const connector = connect((state) => ({}), {});
export default connector(MoveBackModal);
