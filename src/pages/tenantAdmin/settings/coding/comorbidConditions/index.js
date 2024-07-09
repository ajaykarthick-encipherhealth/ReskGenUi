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

const ComorbidConditions = ({ updateSettings,updateComorbidCondition, getCodingDetails,list }) => {
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState(null);
  const [isGuidelines, setIsGuidelines] = useState(false);
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
  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
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
    getCodingDetailsDetails()
  }, []);

  const getCodingDetailsDetails = async () => {
    try {
      const res = await getCodingDetails({ type: "COMORBID_CONDITIONS" });
      if (res?.status == "SUCCESS") {
        setIsGuidelines(res?.response?.includeGeneralGuidelineCodes);
      }
    } catch (error) {}
  };

  const handleGuidelines = async (value) => {
    try {
      const res = await updateComorbidCondition({
        includeGeneralGuidelineCodes: value,
      });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="p-3">
        <div className="d-flex justify-content-between">
          <div className={Style.title}>Comorbid Conditions</div>
        </div>
        <div>
         
          <div className="d-flex justify-content-start gap-2 mt-4">
            <div>Year</div>
            <div>
              <Checkbox />
            </div>
            <div>Can We calculate for all Processing Year</div>
          </div>

          <div className="d-flex justify-content-start gap-2 mt-4">
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
          <Divider />
          <div className="d-flex justify-content-start  gap-4 mt-4">
            <div className="mx-3">{"Do you need general guidelines codes"}</div>
            <div className="d-flex">
            <Switch
                checked={isGuidelines}
                onChange={(e) => {
                  setIsGuidelines(e);
                  handleGuidelines(e);
                }}
              />
              <div className={`mx-2`}>{isGuidelines ? "Yes" : "No"}</div>
            </div>

            <div className="ms-auto mx-4">
              <Search setSearch={setSearch} />
            </div>
          </div>
          <div>
            <TenantSettingsTable columns={columns} data={list?.response?.comorbidConditionsPage?.content} />
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
const enhancer = connect((state) => ({
  list: state?.tenantAdmin?.settings?.codingGuidelines?.data,
}), {
  updateSettings: settingActions.updateSettingsAction,
  updateComorbidCondition: settingActions.updateComorbidCondition,
  getCodingDetails: settingActions.codingGuidelinesAction,
});
export default enhancer(ComorbidConditions);
