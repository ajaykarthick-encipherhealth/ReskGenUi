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
  const [selectFile, setSelectFile] = useState("");
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [page, setPage] = useState(0);
  const [isCheckeds, setIsCheckeds] = useState(false);
  const [tags, setTags] = useState([
    
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
  }, [page]);

  const getRafConfig = async () => {
    try {
      const res = await getCodingDetails({ type: "RAF", page: page });
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

  const submitPatientFile = async () => {
    const formData = new FormData();
    formData.append("file", selectFile.originFileObj);
    formData.append("target", "HISTORY_CODES");
    formData.append("isDefaultYear", false);
    const headers = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    // setSelectFile(formData);
    try {
      const res = await axios.post(
        ENDPOINTS.apiEndoint +
          `management/tenantAdmin/codes/upload
      `,
        formData,
        headers
      );
      setSelectFile("");
      if (res.data.status == "SUCCESS") {
        getResponePopup(res);
      } else if (res.data.status == "USER_DEFINED_ERROR") {
        getResponePopup(res);
      }
    } catch (error) {
      if (error.response.status == 513) {
        getResponePopup({ status: "USER_DEFINED_ERROR" });
      }
    }
  };
  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPage(e.page);
  };
  return (
    <div>
      <div className="p-3">
        {/* <div className="d-flex justify-content-between">
          <div>
            <div className={Style.title}>RAF Configuration</div>
            <div className="d-flex justify-content-start gap-2 mt-4">
              <div>Year</div>
              <div>
              <Switch
                    checked={isCheckeds}
                    onChange={(e) => setIsCheckeds(e)}
                  />
              </div>
              <div>Can We calculate for all Processing Year</div>
            </div>
          </div>
          <div className="d-flex justify-content-start gap-2">
          <div className="d-flex">
                <FileUpload
                  allowedFormat={"File must be in xlsx or CSV"}
                  onChange={(e) => setSelectFile(e.file)}
                  fileList={[]}
                  accept={".xlsx, .csv"}
                />
                <RegularButton
                  name="Upload"
                  type={selectFile}
                  disabled={!selectFile}
                  onClick={submitPatientFile}
                />
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
        <Divider /> */}
        <div className={Style.title}>RAF Configuration</div>
        <div className="mt-4" style={{width: "35%"}}>
          <div className="d-flex justify-content-between mt-1 mb-4">
            <div>{"Do you need to calculate RAF"}</div>
            <div className="d-flex justify-content-between">
              <Switch
                // className="switch"
                checked={isChecked?.isRafCalculationEnabled}
                onChange={(e) => onChange(e, "isRafCalculationEnabled")}
              />
              <div
                className={`mx-2`}
              >
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
              <div
                className={`mx-2`}
              >
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
            data={ list?.response?.rafScoreYearList ? 
              list?.response?.rafScoreYearList[year == "2023" ? 0 : 1]
                ?.rafScoreBaseRates : []
            }
            paginationFirst={paginationFirst}
            totalElements={
              list?.response?.historyCodesPage?.totalElements
            }
            onPageChange={onPageChange}
            isNoPagenation={false}
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
