import { Modal, Select } from "antd";
import { connect } from "react-redux";
import RegularButton from "../../components/button";
import { actions as allActions } from "../../stores/tenantAdmin/patientAllocations";
import {  useState } from "react";
import { getResponePopup } from "../../utils/reusable";

const MoveBackModal = ({
  open,
  setOpen,
  levelOptions,
  selectedRowsId,
  moveBack,
  setSelectedRows,
  setSelectedRowsId,
  roleId,
  activeTab,
  getMoveBack,
  setIsMoveBackLoader,
  moveBackLoader
}) => {
  const [selectLevel, setSelectLevel] = useState([]);
  const handleChange = (value) => {
    setSelectLevel(value);
  };

  const handleSubmit = async () => {
    setIsMoveBackLoader(true)
    try {
      const response = await moveBack({
        patientIdList: selectedRowsId,
        roleDetailsToMoveBack: selectLevel,
      });

      if (response?.status === "SUCCESS") {
        setIsMoveBackLoader(false)
        getResponePopup(response);
        getMoveBack()
        setSelectedRowsId([]);
        setSelectedRows([]);
        setSelectLevel([]);
        setOpen(false);
      } else {
        getResponePopup(response);
        setIsMoveBackLoader(false)
      }
    } catch (error) {
      console.error("failed");
    }
  };

  return (
    <div> 
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setSelectLevel([]);
          setSelectedRowsId([]);
          setSelectedRows([]);
        }}
        title="Select Level"
        footer={false}
        width={700}
        className={"custom-modal"}
      >
        <div style={{ height: "500px" }}>
          <div className="mt-4">
            <Select
              allowClear
              value={selectLevel}
              onChange={handleChange}
              placeholder="Select level"
              className="w-50 h-50"
            >
              {levelOptions?.map((item) => (
                <Option key={item} value={item}>
                  {item}
                </Option>
              ))}{" "}
            </Select>
          </div>

          <div className=" h-100 d-flex align-items-center justify-content-center">
            <RegularButton
              disabled={!selectLevel}
              type="submit"
              onClick={handleSubmit}
              name={"Done"}
              loading={moveBackLoader}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

const connector = connect(
  (state) => ({
    levelOptions:
      state?.tenantAdmin?.patientsAllocation?.moveBackLevel?.data?.response,
  }),
  {
    moveBack: allActions.postMoveBack,
  }
);
export default connector(MoveBackModal);
