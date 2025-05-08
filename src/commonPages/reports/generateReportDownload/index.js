import { Button, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import moment from "moment";
import RegularButton from "../../../components/button";
import styles from "../style.module.css";

const GenateReportModal = ({ open, handleOk, handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [download, setDownload] = useState(null);
  const [inputValue, setInputValue] = useState(null);
  const [loader, setLoader] = useState(false);

  const GenerateReport = async () => {};

  const handleInputChange = (name, value) => {
    setInputValue(value);
  };

  useEffect(() => {
    setInputValue(`Report${moment(new Date()).format("MM-DD-YYYY-hh:mm")}`);
  }, []);

  return (
    <Modal
      footer={null}
      width={800}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose={true}
    >
      <div className="row">
        <div className="d-flex gap-2 align-items-center mt-2">
          <span className="font-weight4 font4">Generate Report</span>
        </div>
      </div>

      <div className="row">
        <div className="mt-5">
          <div className="font-weight2 font2">
            <span className={styles.label}>Report Name</span>
          </div>
          <div className="w-50 mt-2">
            <Input
              placeholder={"Report Name"}
              onChange={handleInputChange}
              value={inputValue}
              style={{ padding: "22px" }}
            />
          </div>
        </div>
        <div
          className={`${styles.btnContainer} mt-5 d-flex justify-content-center align-items-center`}
        >
          <div>
            <RegularButton
              name={"Generate"}
              onClick={GenerateReport}
              bg="#263E50"
              color="#fff"
              disabled={!inputValue}
              loading={loading || loader}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

const connector = connect((state) => ({}), {});
export default connector(GenateReportModal);
