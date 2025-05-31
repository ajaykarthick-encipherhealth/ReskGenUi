import { Radio, Modal } from "antd";
import React, {  useState } from "react";
import { connect } from "react-redux";
import RegularButton from "../../../components/button";
import styles from "../style.module.css";
import { getStorage } from "../../../utils/storages";
import { getResponePopup } from "../../../utils/reusable";

const ExportReportModal = ({
  open,
  handleOk,
  handleCancel,
  generateReport,
  selectedRows,
  setIsModalOpen,
  setSelectedRows,
}) => {
  const clientId = getStorage("client");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("1");

  const options = [
    { label: "Tool Generated Excel", value: "1" },
    { label: "ACO Report", value: "2" },
  ];
  const onChange = (e) => {
    setValue(e.target.value);
  };

  const downloadReport = async () => {
    setLoading(true);
    const userId = getStorage("userId");
    // let fileName =
  //   "https://mcibeforeocrdev.blob.core.windows.net/test/Patient%20Roaster.xlsx?sp=r&st=2025-05-12T05:29:09Z&se=2026-05-12T13:29:09Z&spr=https&sv=2024-11-04&sr=b&sig=ianNxwle85tYi3TGVPz5RLD26zBJkRYGU%2FgfrrHFAZM%3D";
  // const link = document.createElement("a");
  // link.href = `${fileName}`;
  // link.download = fileName;
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);

    // const response = await generateReport({
    //   data: {
    //     tenantId: clientId,
    //     fileType: "EXCEL",
    //     // reportName: inputValue,
    //     tinId: selectedRows.toString(),
    //     userAndAccess: {
    //       [userId]: "DOWNLOAD",
    //     },
    //   },
    // });

    // if (response?.status === "SUCCESS") {
    //   getResponePopup(response);
    //   setValue("1")
    //   setIsModalOpen(false);
    //   setSelectedRows([]);
    // } else {
    //   setIsModalOpen(true);
    // }
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
          <Radio.Group  className="d-flex align-items-center gap-3 justify-content-center" onChange={onChange} value={value} options={options} />
        </div>
        <div
          className={`${styles.btnContainer} mt-3 d-flex justify-content-center align-items-center`}
        >
          <RegularButton
            name="Download"
            onClick={downloadReport}
            bg="#263E50"
            color="#fff"
            disabled={!value }
            loading={loading}
          />
        </div>
    </Modal>
  );
};

const connector = connect((state) => ({}), {
});

export default connector(ExportReportModal);
