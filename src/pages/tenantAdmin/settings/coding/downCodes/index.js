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
import Search from "../../../../../components/table/tenantSettingsTable/search";
import TenantSettingsTable from "../../../../../components/table/tenantSettingsTable/tenantSettingsTable";
import EditSettings from "../../components/edit";

const DownCodes = ({
  updateSettings,
  getCodingDetails,
  list,
  editComoridConditions,
  deleteComoridConditions,
}) => {
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState(null);
  const [isChecked, setIsChecked] = useState({
    isDownCodeConversionEnabled: false,
    includeGeneralGuidelineCodes: false,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editRowValue, setEditRowValue] = useState(null);
  const [selectFile, setSelectFile] = useState("");
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [page, setPage] = useState(0);
  const [isCheckeds, setIsCheckeds] = useState(false);
  const [tags, setTags] = useState([]);

  const onChange = async (checked, name) => {
    setIsChecked((prev) => ({ ...prev, [name]: checked }));
    try {
      const res = await updateSettings({ [name]: checked });
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
    getDownCodes();
  }, [page, search]);

  const getDownCodes = async () => {
    try {
      const res = await getCodingDetails({
        type: "DOWN_CODES",
        page: page,
        search: search,
      });
      if (res?.status == "SUCCESS") {
        setIsChecked({
          isDownCodeConversionEnabled:
            res?.response?.isDownCodeConversionEnabled,
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
        target: "DOWN_CODES",
      });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
        setIsEdit(false);
        setEditRowValue(null);
        getDownCodes();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditRow = async () => {
    try {
      const res = await editComoridConditions({
        ...editRowValue,
        ...form.getFieldsValue(),
        target: "DOWN_CODES",
      });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
        setIsEdit(false);
        setEditRowValue(null);
        getDownCodes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitPatientFile = async () => {
    const formData = new FormData();
    formData.append("file", selectFile.originFileObj);
    formData.append("target", "DOWN_CODES");
    formData.append("isDefaultYear", isCheckeds);
    const headers = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
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
          <div className="d-flex justify-content-between">
            <div>
              <div className={Style.title}>Down Codes</div>
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
          <div style={{ width: "30%" }}>
            <div className="d-flex justify-content-between mt-4">
              <div>{"Do you need general guidelines codes"}</div>
              <div className="d-flex justify-content-between">
                <div name="isDownCodeConversionEnabled">
                  <Switch
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
            <div className="d-flex justify-content-between mt-4">
              <div>{"Do you need an Down Code Conversion"}</div>
              <div className="d-flex justify-content-between">
                <div name="isDownCodeConversionEnabled">
                  <Switch
                    checked={isChecked?.isDownCodeConversionEnabled}
                    onChange={(e) => onChange(e, "isDownCodeConversionEnabled")}
                  />
                </div>
                <div className={`mx-2`}>
                  {isChecked?.isDownCodeConversionEnabled ? "Yes" : "No"}
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
              data={list?.response?.downCodesPage?.content}
              handleEdit={(e) => {
                setEditRowValue(e);
                setIsEdit(e);
                form.setFieldsValue({ ...e });
              }}
              handleDelete={handleDeleteRow}
              paginationFirst={paginationFirst}
              totalElements={list?.response?.downCodesPage?.totalElements}
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
            target={"DOWN_CODES"}
            setOpenModal={() => setOpenModal(false)}
            isResult={true}
          />
        }
        setOpenModal={() => setOpenModal(false)}
      />
      <Modal
        title="Edit Down Codes"
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
    updateSettings: settingActions.updateDownCodes,
    editComoridConditions: settingActions.editComoridConditions,
    deleteComoridConditions: settingActions.deleteComoridConditions,
    getCodingDetails: settingActions.codingGuidelinesAction,
  }
);
export default enhancer(DownCodes);
