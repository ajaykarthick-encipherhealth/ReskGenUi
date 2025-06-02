import { Radio, Modal } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";
import RegularButton from "../../../components/button";
import styles from "../style.module.css";
import { getStorage } from "../../../utils/storages";
import { getResponePopup } from "../../../utils/reusable";
import { actions as reportActions } from "../../../stores/tenantAdmin/report";

const ExportReportModal = ({
  open,
  handleOk,
  handleCancel,
  selectedRows,
  setIsModalOpen,
  setSelectedRows,
  downloadReport,
}) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("TOOL_GENERATED");
  const options = [
    { label: "Tool Generated Excel", value: "TOOL_GENERATED" },
    { label: "ACO Report", value: "ACO" },
  ];
  const onChange = (e) => {
    setValue(e.target.value);
  };

  const reportDownload = async () => {
    setLoading(true);

    const response = await downloadReport({
      reportInfoId: selectedRows.toString(),
      reportType: value,
    });

    if (response?.status === "SUCCESS" && response?.response) {
      getResponePopup(response);
      setValue("TOOL_GENERATED");
      setIsModalOpen(false);
      setSelectedRows([]);
      const link = document.createElement("a");
      link.href = response.response;
      link.setAttribute("download", "report.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setIsModalOpen(true);
    }

    setLoading(false);
  };

  return (
    <Modal
      footer={null}
      width={500}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose
    >
      <div className="row">
        <div className="d-flex gap-2 align-items-center mt-2">
          <span style={{ color: "#04306f" }} className="font-weight4 font4">
            Download as
          </span>
        </div>
      </div>
      <div className="mt-5">
        <Radio.Group
          className="d-flex align-items-center gap-3 justify-content-center"
          onChange={onChange}
          value={value}
          options={options}
        />
      </div>
      <div
        className={`${styles.btnContainer} mt-3 d-flex justify-content-center align-items-center`}
      >
        <RegularButton
          name="Download"
          onClick={reportDownload}
          bg="#263E50"
          color="#fff"
          disabled={!value}
          loading={loading}
        />
      </div>
    </Modal>
  );
};

const connector = connect((state) => ({}), {
  downloadReport: reportActions.reportDownload,
});

export default connector(ExportReportModal);
