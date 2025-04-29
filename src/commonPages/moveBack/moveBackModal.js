import { Modal, Select, Switch } from "antd";
import { connect } from "react-redux";
import RegularButton from "../../components/button";
import { actions as allActions } from "../../stores/tenantAdmin/patientAllocations";
import { useState } from "react";
import { getResponePopup } from "../../utils/reusable";

const MoveBackModal = ({
  open,
  setOpen,
  levelOptions,
  selectedRowsId,
  moveBack,
  setSelectedRows,
  setSelectedRowsId,
  getMoveBack,
  setIsMoveBackLoader,
  moveBackLoader,
}) => {  
  const [selectLevel, setSelectLevel] = useState([]);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [revertDescription, setRevertDescription] = useState(null);

  const options = levelOptions?.map((org, index) => ({
    value: org?.status,
    label: org?.status?.split("_")?.join(" "),
  }));
  console.log(levelOptions,"levelOptions")
  const handleChange = (value) => {
    setSelectLevel(value);
    const selectedOption = levelOptions?.find((opt) => opt.status === value);
    setRevertDescription(selectedOption?.revertDescription || "");
  };

  const onChange = (checked) => {
    setIsSwitchOn(checked);
  };

  const handleSubmit = async () => {
    setIsMoveBackLoader(true);
    try {
      const response = await moveBack({
        patientIdList: selectedRowsId,
        roleDetailsToMoveBack: selectLevel,
        isRevertSelected: isSwitchOn,
      });

      if (response?.status === "SUCCESS") {
        setIsMoveBackLoader(false);
        getResponePopup(response);
        getMoveBack();
        setSelectedRowsId([]);
        setSelectedRows([]);
        setSelectLevel([]);
        setOpen(false);
        setIsSwitchOn(false);
        setRevertDescription(null);
      } else {
        getResponePopup(response);
        setIsMoveBackLoader(false);
        setIsSwitchOn(false);
        setRevertDescription(null);
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
          setIsSwitchOn(false);
          setRevertDescription(null);
        }}
        title="Select Level"
        footer={false}
        width={500}
        className={"custom-modal"}
      >
        <div style={{ height: "250px" }}>
          <div className="mt-4 d-flex justify-content-between ">
            <Select
              allowClear
              value={selectLevel}
              onChange={handleChange}
              placeholder="Select level"
              className="w-50 h-50"
              options={options}
            ></Select>
          </div>
          <div className="mt-4 ">
              <div className="d-flex gap-2 fontWeight2">
                Revert
                <Switch checked={isSwitchOn} onChange={onChange} />
              </div>
            </div>
          <div>
            {revertDescription && (
              <div className="font1 text-muted mt-2">{revertDescription}</div>
            )}
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
