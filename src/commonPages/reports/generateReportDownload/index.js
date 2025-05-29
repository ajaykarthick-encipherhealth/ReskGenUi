import { Button, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import moment from "moment";
import RegularButton from "../../../components/button";
import styles from "../style.module.css";
import { actions as reportActions } from "../../../stores/tenantAdmin/report";
import { getStorage } from "../../../utils/storages";
import { getResponePopup } from "../../../utils/reusable";

const GenerateReportModal = ({
  open,
  handleOk,
  handleCancel,
  generateReport,
  selectedRows,
  setIsModalOpen,
  getGenerateReport,
  setSelectedRows
}) => {
  const clientId = getStorage("client");
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const GenerateReport = async () => {
    setLoading(true);
    const userId = getStorage("userId")

    const response = await generateReport({
      data: {
        tenantId: clientId,
        fileType: "EXCEL",
        reportName: inputValue,
        tinId: selectedRows.toString(),
        userAndAccess: {
          [userId]: "DOWNLOAD",
        },
      }
    });

    if (response?.status === "SUCCESS") {
      getResponePopup(response);
      getGenerateReport()
      setIsModalOpen(false);
      setInputValue("")
      setSelectedRows([])
    } else {
      setIsModalOpen(true);
    }
    setLoading(false);
  };
  useEffect(() => {
    const defaultName = `Report${moment(new Date()).format("MM-DD-YYYY-hh:mm")}.xlsx`;
    setInputValue(defaultName);
  }, []);

  return (
    <Modal
      footer={null}
      width={800}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose
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
              placeholder="Report Name"
              onChange={handleInputChange}
              value={inputValue}
              style={{ padding: "22px" }}
            />
          </div>
        </div>
        <div className={`${styles.btnContainer} mt-5 d-flex justify-content-center align-items-center`}>
          <RegularButton
            name="Generate"
            onClick={GenerateReport}
            bg="#263E50"
            color="#fff"
            disabled={!inputValue}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  );
};

const connector = connect((state)=>( {
}),{
  generateReport: reportActions.reportGenerate
});


export default connector(GenerateReportModal);
