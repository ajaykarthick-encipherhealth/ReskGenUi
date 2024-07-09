import React, { useEffect, useState } from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import { Button, Checkbox, Divider, Switch } from "antd";
import FileUploader from "../../components/fileUploader";
import ModalPop from "../../components/modal";
import CommonModalContent from "../../components/commonModalContent";
import { actions as settingActions } from "../../../../../stores/tenantAdmin/settings";
import { connect, useSelector } from "react-redux";
import FileUpload from "../../../../../components/table/tenantSettingsTable/fileUpload";
import { PlusOutlined } from "@ant-design/icons";
import FilterButton from "../../../../../components/table/tenantSettingsTable/filterButton";
import Search from "../../../../../components/table/tenantSettingsTable/search";
import TenantSettingsTable from "../../../../../components/table/tenantSettingsTable/tenantSettingsTable";

const HistoryCodes = ({ updateSettings,updateHistoryCode, getCodingDetails, list }) => {
  console.log(list);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState(null);
  const [isChecked, setIsChecked] = useState({
    captureHistoryCodes: false,
    captureHistoryCodesAsIcdCodes: false,
    includeGeneralGuidelineCodes: false,
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
  const onChange = async(checked, name) => {
    setIsChecked((prev) => ({ ...prev, [name]: checked }));
    try {
      const res = await updateHistoryCode({[name]: checked})
      if (res.status == "SUCCESS") {
        getResponePopup(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Result Code",
      dataIndex: "result_code",
      key: "result_code",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Year",
      dataIndex: "years",
      key: "year",
    },
  ];
  useEffect(() => {
    getHistorys();
  }, []);

  const getHistorys = async () => {
    try {
      const res = await getCodingDetails({ type: "HISTORY_CODES" });
      if (res?.status == "SUCCESS") {
        setIsChecked({
          captureHistoryCodes: res?.response?.captureHistoryCodes,
          captureHistoryCodesAsIcdCodes:
            res?.response?.captureHistoryCodesAsIcdCodes,
          includeGeneralGuidelineCodes:
            res?.response?.includeGeneralGuidelineCodes,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="p-3">
        <div>
          <div className="d-flex justify-content-between mb-4">
            <div className="">
              <div className={Style.title}>History Codes</div>
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
          <div className="d-flex justify-content-between mt-1">
            <div>{"Do you need an Capture History Codes"}</div>
            <div className="d-flex justify-content-between">
              <div name="captureHistoryCodes">
                <Switch
                  className="switch"
                  checked={isChecked?.captureHistoryCodes}
                  onChange={(e) => onChange(e, "captureHistoryCodes")}
                />
              </div>
              <div
                className={`mx-2 text-${
                  isChecked?.captureHistoryCodes ? "info" : "danger"
                }`}
              >
                {isChecked?.captureHistoryCodes ? "Enable" : "Disable"}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between mt-2">
            <div>{"Do you need an Capture History Codes as ICD Codes"}</div>
            <div className="d-flex justify-content-between">
              <div name="captureHistoryCodesAsIcdCodes">
                <Switch
                  className="switch"
                  checked={isChecked?.captureHistoryCodesAsIcdCodes}
                  onChange={(e) => onChange(e, "captureHistoryCodesAsIcdCodes")}
                />
              </div>
              <div
                className={`mx-2 text-${
                  isChecked?.captureHistoryCodesAsIcdCodes ? "info" : "danger"
                }`}
              >
                {isChecked?.captureHistoryCodesAsIcdCodes
                  ? "Enable"
                  : "Disable"}
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-2">
            <div>{" Do you need general guidelines codes "}</div>
            <div className="d-flex justify-content-between">
              <div name="includeGeneralGuidelineCodes">
                <Switch
                  className="switch"
                  checked={isChecked?.includeGeneralGuidelineCodes}
                  onChange={(e) => onChange(e, "includeGeneralGuidelineCodes")}
                />
              </div>
              <div
                className={`mx-2 text-${
                  isChecked?.includeGeneralGuidelineCodes ? "info" : "danger"
                }`}
              >
                {isChecked?.includeGeneralGuidelineCodes ? "Enable" : "Disable"}
              </div>
            </div>
          </div>
          <Divider />
          <div className="d-flex justify-content-start  gap-4 mt-4">
            <div className="ms-auto mx-4">
              <Search setSearch={setSearch} />
            </div>
          </div>
          <div>
            <TenantSettingsTable
              columns={columns}
              data={list?.response?.historyCodesPage?.content}
            />
          </div>
        </div>
      </div>
      <div className="text-end p-3">
        <RegularButton
          type={"outline"}
          name={"Restore Changes"}
          onClick={() => console.log("Restore Changes")}
        />
        <RegularButton
          name={"Save Changes"}
          onClick={() => console.log("Save Changes")}
        />
      </div>
      <ModalPop
        openModal={openModal}
        content={<CommonModalContent tags={tags} setTags={setTags} />}
        setOpenModal={setOpenModal}
      />
    </>
  );
};
const enhancer = connect(
  (state) => ({
    list: state?.tenantAdmin?.settings?.codingGuidelines?.data,
  }),
  {
    updateSettings: settingActions.updateSettingsAction,
    updateHistoryCode: settingActions.updateHistoryCode,
    getCodingDetails: settingActions.codingGuidelinesAction,
  }
);
export default enhancer(HistoryCodes);
