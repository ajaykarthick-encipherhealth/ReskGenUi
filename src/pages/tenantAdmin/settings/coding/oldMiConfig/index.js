import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
} from "antd";
import React, { useState, useEffect } from "react";
import Style from "./../../style.module.css";
import RegularButton from "../../../../../components/button";
import ButtonStyles from "../../../../../components/button/style.module.css";
import { actions as settingActions } from "../../../../../stores/tenantAdmin/settings";

import Tags from "../../components/tags";
import {
  handleEditInputChange,
  handleEditTag,
  handleRemoveTag,
  handleSaveEdit,
} from "../insulin";
import { connect } from "react-redux";

const OldMiConfig = ({ getCodingDetails, updateSettings, list }) => {
    const [form] = Form.useForm();
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [selectFile, setSelectFile] = useState("");
  const [medical, setMedical] = useState({
    findComboFromPMH: false,
    considerESRDAsHcc: false,
    indirectComboCodes: false,
    addOnDirectComboCodes: false,
    calculateComboIncludingPastMedicalHistory: false,
  });

  useEffect(() => {
    getCodingDetails({ type: "CODING" });
  }, []);

  useEffect(() => {
    if (list?.response) {
      form.setFieldsValue({
        findComboFromPMH: list?.response?.findComboFromPMH,
        considerESRDAsHcc: list?.response?.considerESRDAsHcc,
        indirectComboCodes: list?.response?.indirectComboCodes,
        addOnDirectComboCodes: list?.response?.addOnDirectComboCodes,
        calculateComboIncludingPastMedicalHistory:
          list.response?.calculateComboIncludingPastMedicalHistory,
      });
      setMedical({
        findComboFromPMH: list?.response?.findComboFromPMH,
        considerESRDAsHcc: list?.response?.considerESRDAsHcc,
        indirectComboCodes: list?.response?.indirectComboCodes,
        addOnDirectComboCodes: list?.response?.addOnDirectComboCodes,
        calculateComboIncludingPastMedicalHistory:
          list.response?.calculateComboIncludingPastMedicalHistory,
      });
    }
  }, [list]);

  const onChange = (value, values) => {
    console.log(values);
    setMedical(values);
  };
  const handleSubmit = async (values) => {
    try {
      const res = await updateSettings(values);
      if (res?.status == "SUCCESS") {
        getResponePopup(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleAddTag = () => {
    if (inputValue) {
      setTags([...tags, inputValue]);
      setInputValue("");
    }
  };
  return (
    <div className="p-3">
      <div>
        <div className={Style.title}>OldMi Configuration</div>
      </div>
      <div>
        <div>
          <Form
            id={"chart-audit"}
            onFinish={handleSubmit}
            form={form}
            onValuesChange={onChange}
          >
            <div className="d-flex ">
              <div className=" p-3" style={{ width: "35%" }}>
                <div>
                  <div className="d-flex justify-content-between mt-1">
                    <div>
                      <div className={Style.heading}>
                        Capture OldMi Conditions
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <Form.Item name="addOnDirectComboCodes">
                        <Switch />
                      </Form.Item>
                      <div className={`m-2`}>
                        {medical?.addOnDirectComboCodes ? "Enable" : "Disable"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>

        <div>
          <div>
            <div>
              <div className="mb-4 w-[100%]">
                {/* <div className="text-lg font-semibold my-2" id="modal-title">
                Add
              </div> */}

                <div className="d-flex my-2 justify-content-between">
                  <div className="w-100">
                    <Input
                      placeholder={"Insulin Medications"}
                      onChange={handleInputChange}
                      value={inputValue}
                      style={{ padding: "22px" }}
                    />
                  </div>
                  <RegularButton name={"Add"} onClick={handleAddTag} />
                </div>
              </div>

              <div className="mt-2 max-h-[60vh] overflow-y-auto">
                {tags?.length > 0 ? (
                  tags?.map((tag, index) => (
                    <div
                      key={index}
                      className="mb-2 mr-2"
                      style={{ display: "inline-block" }}
                    >
                      {editIndex === index ? (
                        <Input
                          size="small"
                          value={editValue}
                          onChange={(e) =>
                            handleEditInputChange({ e, setEditValue })
                          }
                          onBlur={() =>
                            handleSaveEdit({
                              index,
                              setTags,
                              setEditIndex,
                              setEditValue,
                              editValue,
                              tags,
                            })
                          }
                          onPressEnter={() =>
                            handleSaveEdit({
                              index,
                              setTags,
                              setEditIndex,
                              setEditValue,
                              editValue,
                              tags,
                            })
                          }
                          className="mr-2 w-auto p-2.5"
                        />
                      ) : (
                        <Tags
                          tag={tag}
                          index={index}
                          handleRemoveTag={() =>
                            handleRemoveTag({ index, setTags, tags })
                          }
                          handleEditTag={() =>
                            handleEditTag({
                              index,
                              setEditIndex,
                              setEditValue,
                              tags,
                            })
                          }
                          editIndex={editIndex}
                          editValue={editValue}
                          handleEditInputChange={(e) =>
                            handleEditInputChange({ e, setEditValue })
                          }
                          handleSaveEdit={() =>
                            handleSaveEdit({
                              index,
                              setTags,
                              setEditIndex,
                              setEditValue,
                              editValue,
                              tags,
                            })
                          }
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div>No tags available</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    list: state?.tenantAdmin?.settings?.codingGuidelines?.data,
  }),
  {
    getCodingDetails: settingActions.codingGuidelinesAction,
    updateSettings: settingActions.updateMedical,
  }
);
export default enhancer(OldMiConfig);
