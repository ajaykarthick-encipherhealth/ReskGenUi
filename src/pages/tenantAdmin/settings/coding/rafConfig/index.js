import React, { useEffect, useState } from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import { Button, Checkbox, Divider, Input, Select, Switch } from "antd";
import FileUploader from "../../components/fileUploader";
import ModalPop from "../../components/modal";
import CommonModalContent from "../../components/commonModalContent";
import { actions as settingActions } from "../../../../../stores/tenantAdmin/settings";
import { connect } from "react-redux";
import TenantSettingsTable from "../../../../../components/table/tenantSettingsTable/tenantSettingsTable";
import { PlusOutlined } from "@ant-design/icons";
import Search from "../../../../../components/table/tenantSettingsTable/search";
import FilterButton from "../../../../../components/table/tenantSettingsTable/filterButton";
import FileUpload from "../../../../../components/table/tenantSettingsTable/fileUpload";
import { useSelector } from "react-redux";
import { getResponePopup } from "../../../../../utils/reusable";
const RAFConfig = ({ updateSettings, getCodingDetails, list }) => {
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState(null);
  const [options, setOptions] = useState([]);
  const [year, setYear] = useState("");
  const [isChecked, setIsChecked] = useState({
    isRafCalculationEnabled: false,
    rafScoreMedicAid: false,
    rafScoreOrec: "",
  });
  const [tags, setTags] = useState([
    "plan",
    "assessment/plan",
    "Current Medication",
    "impression/plan",
    "Impression and Plan",
    "treatment",
    "treatments",
    "hpi",
    "assessment",
    "problem",
    "judgment and insight",
    "recommendations",
    "examinations",
    "examination",
    "diagnoses",
    "cognitive assessment",
    "Todays Treatments",
    "impression",
    "problems",
    "history of present illness",
    "Todays Diagnoses Include",
    "today diagnoses include",
    "mental status exam",
    "medications",
    "HPI Summary",
    "Problem List",
    "Assessment/Plan Summary",
    "Assessment/Plan",
    "Ambulatory Assessment/Plan",
    "New Medications",
    "Renewed Medications",
    "a/p",
  ]);

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
  ];

  const onChange = async (checked, name) => {
    setIsChecked((prev) => ({ ...prev, [name]: checked }));
  };

  useEffect(() => {
    getRafConfig();
  }, []);

  const getRafConfig = async () => {
    try {
      const res = await getCodingDetails({ type: "RAF" });
      if (res?.status == "SUCCESS") {
        console.log(res);
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

  console.log(options);
  return (
    <div>
      <div className="p-3">
        <div className="d-flex justify-content-between">
          <div>
            <div className={Style.title}>RAF Configuration</div>
            <div className="d-flex justify-content-start gap-2 mt-4">
              <div>Year</div>
              <div>
                <Checkbox />
              </div>
              <div>Can We calculate for all Processing Year</div>
            </div>
          </div>
          <div className="d-flex justify-content-start gap-2">
            <div>
              <FileUpload allowedFormat={"File must be in xlsx or CSV"} />
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
        </div>

        <div className="mt-4">
          <div className="d-flex justify-content-between mt-1 mb-4">
            <div>{"Do you need to calculate RAF"}</div>
            <div className="d-flex justify-content-between">
              <Switch
                className="switch"
                checked={isChecked?.isRafCalculationEnabled}
                onChange={(e) => onChange(e, "isRafCalculationEnabled")}
              />
              <div
                className={`mx-2 text-${
                  isChecked?.isRafCalculationEnabled ? "info" : "danger"
                }`}
              >
                {isChecked?.isRafCalculationEnabled ? "Enable" : "Disable"}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <div>{"Do you need RAF medicaid"}</div>
            <div className="d-flex justify-content-between">
              <Switch
                className="switch"
                checked={isChecked?.rafScoreMedicAid}
                onChange={(e) => onChange(e, "rafScoreMedicAid")}
              />
              <div
                className={`mx-2 text-${
                  isChecked?.rafScoreMedicAid ? "info" : "danger"
                }`}
              >
                {isChecked?.rafScoreMedicAid ? "Enable" : "Disable"}
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-4">
            <div>{"Enter RAF score OREC"}</div>
            <div className="d-flex justify-content-between">
              <Input
                className="switch"
                style={{ width: "280px" }}
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

        <Divider />
        <div className="d-flex justify-content-end  gap-4 mt-4">
          <div className="mx-2">
            <Select
              size="large"
              style={{ width: "200px" }}
              placeholder="Select Year"
              options={options}
              onChange={(e, value) => setYear(value.value)}
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
              list?.response?.rafScoreYearList[year == "2023" ? 0 : 1]
                ?.rafScoreBaseRates
            }
          />
        </div>
      </div>
      <ModalPop
        openModal={openModal}
        content={<CommonModalContent tags={tags} setTags={setTags} />}
        setOpenModal={setOpenModal}
      />
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
  }
);
export default enhancer(RAFConfig);
