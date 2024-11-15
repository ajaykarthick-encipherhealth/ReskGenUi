import React, { useEffect, useState } from "react";
import { Switch } from "antd";
import { actions as settingActions } from "../../../../../stores/tenantAdmin/settings";
import { connect } from "react-redux";
import { getResponePopup } from "../../../../../utils/reusable";
import Style from "../../style.module.css";

const PMHConditionConfig = ({
  updateDirectCode,
  getCodingDetails,
}) => {
  const [isGuidelines, setIsGuidelines] = useState(false);

//   useEffect(() => {
//     getDirectConfirmDetails();
//   }, [paginationFirst]);

  const getDirectConfirmDetails = async () => {
    try {
      const res = await getCodingDetails({
        type: "DIRECT_CONFIRM_CODES",
        page: page,
      });
      if (res?.status == "SUCCESS") {
        setIsGuidelines(res?.response?.includeGeneralGuidelineCodes);
      }
    } catch (error) {}
  };

  const handleGuidelines = async (value) => {
    try {
      const res = await updateDirectCode({
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
          <div className={Style.title}>PMH Condition Config</div>
        </div>
        <div>
          <div className="d-flex justify-content-start  gap-4 mt-4">
            <div className="mx-3">{"Do you need general guidelines codes"}</div>
            <div className="d-flex justify-content-between">
              <Switch
                checked={isGuidelines}
                onChange={(e) => {
                  setIsGuidelines(e);
                  handleGuidelines(e);
                }}
              />
              <div className={`mx-2`}>{isGuidelines ? "Yes" : "No"}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const enhancer = connect(
  (state) => ({
    list: state?.tenantAdmin?.settings?.codingGuidelines?.data,
  }),
  {
    updateSettings: settingActions.updateSettingsAction,
    updateDirectCode: settingActions.updateDirectCode,
    uploadfile: settingActions.uploadFiles,
    editComoridConditions: settingActions.editComoridConditions,
    deleteComoridConditions: settingActions.deleteComoridConditions,
    getCodingDetails: settingActions.codingGuidelinesAction,
    uploadFiles: settingActions.uploadFiles,
  }
);
export default enhancer(PMHConditionConfig);
