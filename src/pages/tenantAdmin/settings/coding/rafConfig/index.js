import React, { useEffect, useState } from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import { Button, Divider, Input, Modal, Select, Switch } from "antd";
import { actions as settingActions } from "../../../../../stores/tenantAdmin/settings";
import { connect } from "react-redux";
import TenantSettingsTable from "../../../../../components/table/tenantSettingsTable/tenantSettingsTable";
import { PlusOutlined } from "@ant-design/icons";
import { getResponePopup } from "../../../../../utils/reusable";
import RafModal from "../../components/rafModal";

const RAFConfig = ({
  updateSettings,
  getCodingDetails,
  deleteComoridConditions,
  list,
  editComoridConditions,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [listCount, setListCount] = useState([]);
  const [options, setOptions] = useState([]);
  const [year, setYear] = useState("");
  const [isChecked, setIsChecked] = useState({
    isRafCalculationEnabled: false,
    rafScoreMedicAid: false,
    rafScoreOrec: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editRowValue, setEditRowValue] = useState(null);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [page, setPage] = useState(0);

  const columns = [
    {
      title: "RAF Category",
      dataIndex: "rafCategory",
      key: "rafCategory",
    },
    {
      title: "RAF Version",
      dataIndex: "rafVersion",
      key: "rafVersion",
    },
    {
      title: "RAF Percentage",
      dataIndex: "rafPercentage",
      key: "rafPercentage",
    },
    {
      title: "RAF Score Base Rate",
      dataIndex: "rafScoreBaseRate",
      key: "rafScoreBaseRate",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];

  const onChange = async (checked, name) => {
    setIsChecked((prev) => ({ ...prev, [name]: checked }));
  };

  useEffect(() => {
    getRafConfig();
  }, [page]);

  const getRafConfig = async () => {
    try {
      const res = await getCodingDetails({ type: "RAF", page: page });
      if (res?.status == "SUCCESS") {
        setIsChecked({
          isRafCalculationEnabled: res?.response?.isRafCalculationEnabled,
          rafScoreMedicAid: res?.response?.rafScoreMedicAid,
          rafScoreOrec: res?.response?.rafScoreOrec,
        });
        const opt = res?.response?.rafScoreYearList?.map((item) => ({
          label: item.year,
          value: item.year,
        }));
        setOptions(opt);
        setYear(opt[0].value);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async () => {
    try {
      const res = await updateSettings(isChecked);
      if (res.status == "SUCCESS") {
        getResponePopup(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditRow = async (value) => {
    try {
      const res = await editComoridConditions({
        ...editRowValue,
        ...value,
        target: "RAF",
      });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
        setIsEdit(false);
        setOpenModal(false);
        setEditRowValue(null);
        getRafConfig()
      } else if (res.status == "USER_DEFINED_ERROR") {
        getResponePopup(res);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteRow = async (value) => {
    try {
      const res = await deleteComoridConditions({
        id: value.id,
        target: "HEALTH_METRICS",
      });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
        setIsEdit(false);
        setEditRowValue(null);
        getRafConfig()
      } else if (res.status == "USER_DEFINED_ERROR") {
        getResponePopup(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPage(e.page);
  };

  useEffect(() => {
    if (year) {
      list?.response?.rafScoreYearList?.map((item, i) => {
        if (year == item.year) {
          setListCount(item.rafScoreBaseRates);
        }
      });
    }
  }, [year]);
  return (
    <div>
      <div className="p-3">
        <div className={Style.title}>RAF Configuration</div>
        <div className="d-flex justify-content-between">
          <div className="mt-4" style={{ width: "35%" }}>
            <div className="d-flex justify-content-between mt-1 mb-4">
              <div>{"Do you need to calculate RAF"}</div>
              <div className="d-flex justify-content-between">
                <Switch
                  // className="switch"
                  checked={isChecked?.isRafCalculationEnabled}
                  onChange={(e) => onChange(e, "isRafCalculationEnabled")}
                />
                <div className={`mx-2`}>
                  {isChecked?.isRafCalculationEnabled ? "Yes" : "No"}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <div>{"Do you need RAF medicaid"}</div>
              <div className="d-flex justify-content-between">
                <Switch
                  // className="switch"
                  checked={isChecked?.rafScoreMedicAid}
                  onChange={(e) => onChange(e, "rafScoreMedicAid")}
                />
                <div className={`mx-2`}>
                  {isChecked?.rafScoreMedicAid ? "Yes" : "No"}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between mt-4">
              <div>{"Enter RAF score OREC"}</div>
              <div className="d-flex justify-content-between">
                <Input
                  // className="switch"
                  style={{ width: "200px" }}
                  value={isChecked?.rafScoreOrec}
                  onChange={(e) => onChange(e.target.value, "rafScoreOrec")}
                />
              </div>
            </div>
            <div className="text-end mt-4">
              <RegularButton
                name={"Save Changes"}
                onClick={() => handleSubmit()}
              />
            </div>
          </div>
          <div>
            <Button
              icon={<PlusOutlined />}
              style={{
                height: "47px",
              }}
              onClick={() => {
                setOpenModal(true);
              }}
            >
              Add Manually
            </Button>
          </div>
        </div>
        <Divider />
        <div className="d-flex justify-content-end  gap-4 mt-4">
          <div className="mx-2">
            <Select
              size="large"
              style={{ width: "200px" }}
              placeholder="Select Year"
              options={options}
              onChange={(e, value) => {
                setYear(value.value);
              }}
              value={year}
            />
          </div>
          {/* <div className="mx-2">
            <Search setSearch={setSearch} value={search} />
          </div> */}
        </div>
        <div>
          <TenantSettingsTable
            columns={columns}
            data={
              listCount.length > 0
                ? listCount
                : list?.response?.rafScoreYearList
                ? list?.response?.rafScoreYearList[0]?.rafScoreBaseRates
                : []
            }
            handleEdit={(e) => {
              console.log(e);
              setOpenModal(true);
              setIsEdit(true);
              setEditRowValue(e);
            }}
            handleDelete={handleDeleteRow}
            paginationFirst={paginationFirst}
            totalElements={list?.response?.historyCodesPage?.totalElements}
            onPageChange={onPageChange}
            isNoPagenation={false}
          />
        </div>
      </div>
      <Modal
        title={`${isEdit ? "Edit" : "ADD"} RAF Codes` }
        onCancel={() => {
          setOpenModal(false);
          setIsEdit(false);
          setEditRowValue(null);
        }}
        footer={false}
        open={openModal}
        width={"52%"}
      >
        <RafModal
          setIsEdit={setOpenModal}
          page={page}
          reRenderPage={getRafConfig}
          isEdit={isEdit}
          updateDetails={editRowValue}
          year={year}
          handleEditRow={handleEditRow}
        />
      </Modal>
    </div>
  );
};
const enhancer = connect(
  (state) => ({
    list: state?.tenantAdmin?.settings.codingGuidelines?.data,
  }),
  {
    updateSettings: settingActions.updateRafConfigs,
    getCodingDetails: settingActions.codingGuidelinesAction,
    editComoridConditions: settingActions.editComoridConditions,
    deleteComoridConditions: settingActions.deleteComoridConditions,
  }
);
export default enhancer(RAFConfig);
