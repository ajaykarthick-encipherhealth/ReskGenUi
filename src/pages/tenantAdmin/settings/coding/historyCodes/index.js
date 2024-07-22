import React, { useEffect, useState } from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import { Button, Checkbox, Divider, Form, Modal, Switch } from "antd";
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
import EditSettings from "../../components/edit";
import axios from "../../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../../utility/enpoints";
import { getResponePopup } from "../../../../../utils/reusable";

const HistoryCodes = ({
  updateSettings,
  updateHistoryCode,
  getCodingDetails,
  list,
  editComoridConditions,
  deleteComoridConditions,
}) => {
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState(null);
  const [isChecked, setIsChecked] = useState({
    captureHistoryCodes: false,
    captureHistoryCodesAsIcdCodes: false,
    includeGeneralGuidelineCodes: false,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editRowValue, setEditRowValue] = useState(null);
  const [selectFile, setSelectFile] = useState("");
  const [tags, setTags] = useState([]);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [page, setPage] = useState(0);
  const [isCheckeds, setIsCheckeds] = useState(false);

  const onChange = async (checked, name) => {
    setIsChecked((prev) => ({ ...prev, [name]: checked }));
    try {
      const res = await updateHistoryCode({ [name]: checked });
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
      dataIndex: "resultCode",
      key: "resultCode",
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
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];
  useEffect(() => {
    getHistorys();
  }, [page, search]);

  const getHistorys = async () => {
    try {
      const res = await getCodingDetails({
        type: "HISTORY_CODES",
        page: page,
        search: search,
      });
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
  const handleDeleteRow = async (value) => {
    try {
      const res = await deleteComoridConditions({
        id: value.id,
        target: "HISTORY_CODES",
      });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
        setIsEdit(false);
        setEditRowValue(null);
        getHistorys();
      }else if (res.data.status == "USER_DEFINED_ERROR") {
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
        ...form.getFieldsValue(),
        target: "HISTORY_CODES",
      });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
        setIsEdit(false);
        setEditRowValue(null);
        getHistorys();
      }else if (res.data.status == "USER_DEFINED_ERROR") {
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
    formData.append("isDefaultYear", isCheckeds);
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
    <>
      <div className="p-3">
        <div>
          <div className="d-flex justify-content-between mb-4">
            <div className="">
              <div className={Style.title}>History Codes</div>
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
          <div style={{ width: "40%" }}>
            <div className="d-flex justify-content-between mt-1">
              <div>{"Do you need an Capture History Codes"}</div>
              <div className="d-flex justify-content-between">
                <div name="captureHistoryCodes">
                  <Switch
                    // className="switch"
                    checked={isChecked?.captureHistoryCodes}
                    onChange={(e) => onChange(e, "captureHistoryCodes")}
                  />
                </div>
                <div className={`mx-2`}>
                  {isChecked?.captureHistoryCodes ? "Yes" : "No"}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between mt-2">
              <div>{"Do you need an Capture History Codes as ICD Codes"}</div>
              <div className="d-flex justify-content-between">
                <div name="captureHistoryCodesAsIcdCodes">
                  <Switch
                    // className="switch"
                    checked={isChecked?.captureHistoryCodesAsIcdCodes}
                    onChange={(e) =>
                      onChange(e, "captureHistoryCodesAsIcdCodes")
                    }
                  />
                </div>
                <div className={`mx-2`}>
                  {isChecked?.captureHistoryCodesAsIcdCodes ? "Yes" : "No"}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <div>{" Do you need general guidelines codes "}</div>
              <div className="d-flex justify-content-between">
                <div name="includeGeneralGuidelineCodes">
                  <Switch
                    // className="switch"
                    checked={isChecked?.includeGeneralGuidelineCodes}
                    onChange={(e) =>
                      onChange(e, "includeGeneralGuidelineCodes")
                    }
                  />
                </div>
                <div className={`mx-2`}>
                  {isChecked?.includeGeneralGuidelineCodes ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </div>
          <Divider />
          <div className="d-flex justify-content-start  gap-4 mt-4">
            <div className="ms-auto mx-4">
              <Search setSearch={setSearch} value={search} />
            </div>
          </div>
          <div>
            <TenantSettingsTable
              columns={columns}
              data={list?.response?.historyCodesPage?.content}
              handleEdit={(e) => {
                setEditRowValue(e);
                setIsEdit(e);
                form.setFieldsValue({ ...e });
              }}
              // isNoDelete={false}
              handleDelete={handleDeleteRow}
              paginationFirst={paginationFirst}
              totalElements={list?.response?.historyCodesPage?.totalElements}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </div>
      <ModalPop
        openModal={openModal}
        content={
          <CommonModalContent
            tags={tags}
            setTags={setTags}
            isChecked={isCheckeds}
            target={"HISTORY_CODES"}
            setOpenModal={() => setOpenModal(false)}
            isResult={true}
          />
        }
        setOpenModal={() => setOpenModal(false)}
      />
      <Modal
        title="Edit History Codes"
        onCancel={() => setIsEdit(false)}
        footer={false}
        open={isEdit}
      >
        <EditSettings form={form} handleEditRow={handleEditRow} />
      </Modal>
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
    editComoridConditions: settingActions.editComoridConditions,
    deleteComoridConditions: settingActions.deleteComoridConditions,
    getCodingDetails: settingActions.codingGuidelinesAction,
  }
);
export default enhancer(HistoryCodes);
