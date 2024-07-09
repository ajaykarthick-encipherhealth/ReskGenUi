import React, { useEffect } from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import { Button, Input, Switch } from "antd";
import { useState } from "react";
import Tags from "../../components/tags";
import { connect, useSelector } from "react-redux";
import { getResponePopup } from "../../../../../utils/reusable";
import { actions as settingActions } from "../../../../../stores/tenantAdmin/settings";

export const handleRemoveTag = ({ index, setTags, tags }) => {
  const newTags = [...tags];
  newTags.splice(index, 1);
  setTags(newTags);
};
export const handleEditInputChange = ({ e, setEditValue }) => {
  setEditValue(e.target.value);
};

export const handleSaveEdit = ({
  index,
  setTags,
  setEditIndex,
  setEditValue,
  editValue,
  tags,
}) => {
  const newTags = [...tags];
  newTags[index] = editValue;
  setTags(newTags);
  setEditIndex(null);
  setEditValue("");
};

export const handleEditTag = ({ index, setEditIndex, setEditValue, tags }) => {
  setEditIndex(index);
  setEditValue(tags[index]);
};

const Insulin = ({ getCodingDetails, updateSettings, list }) => {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isCaptureInsulin, setIsCaptureInsulin] = useState({
    captureInsulinMedicationAsIcdCodes: false,
    includeGeneralInsulinMedications: false,
  });

  useEffect(() => {
    getCodingDetails({ type: "INSULIN_MEDICATIONS" });
  }, []);

  useEffect(() => {
    if (list?.response?.insulinMedications) {
      setIsCaptureInsulin({
        captureInsulinMedicationAsIcdCodes:
          list?.response?.captureInsulinMedicationAsIcdCodes,
        includeGeneralInsulinMedications:
          list?.response?.includeGeneralInsulinMedications,
      });
      setTags(list?.response?.insulinMedications);
    }
  }, [list]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleAddTag = () => {
    if (inputValue) {
      setTags([...tags, inputValue]);
      setInputValue("");
    }
  };
  const onChange = (checked, type) => {
    console.log("onChange", checked);
    setIsCaptureInsulin((prev) => ({ ...prev, [type]: checked }));
  };
  const handleSubmit = async () => {
    try {
      const res = await updateSettings({
        ...isCaptureInsulin,
        insulinMedications: tags,
      });
      if (res?.status == "SUCCESS") {
        getResponePopup(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="p-3" style={{ height: "65vh" }}>
        <div className="d-flex justify-content-between">
          <div className={Style.title}>Insulin Medications</div>
        </div>
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
            <div className="d-flex justify-content-between my-4">
              <div>Do you need an Capture Insulin Medication as ICD Codes</div>
              <div className="d-flex justify-content-between">
                <Switch
                  checked={
                    isCaptureInsulin?.captureInsulinMedicationAsIcdCodes
                  }
                  className="directCodeSwitch"
                  onChange={(e) =>
                    onChange(e, "captureInsulinMedicationAsIcdCodes")
                  }
                />
                <div className={`mx-2 text-${"info"}`}>
                  {isCaptureInsulin?.captureInsulinMedicationAsIcdCodes
                    ? "Yes"
                    : "No"}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between my-4">
              <div>Do you need to include general insulin medications</div>
              <div className="d-flex justify-content-between">
                <Switch
                  checked={
                    isCaptureInsulin?.includeGeneralInsulinMedications
                  }
                  className="directCodeSwitch"
                  onChange={(e) =>
                    onChange(e, "includeGeneralInsulinMedications")
                  }
                />
                <div className={`mx-2 text-${"info"}`}>
                  {isCaptureInsulin?.includeGeneralInsulinMedications
                    ? "Yes"
                    : "No"}
                </div>
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
      <div className="text-end p-3">
        <RegularButton
          type={"outline"}
          name={"Restore Changes"}
          onClick={() => console.log("Restore Changes")}
        />
        <RegularButton name={"Save Changes"} onClick={() => handleSubmit()} />
      </div>
    </>
  );
};

const enhancer = connect((state) => ({
  list: state?.tenantAdmin?.settings?.codingGuidelines?.data,
}), {
  getCodingDetails: settingActions.codingGuidelinesAction,
  updateSettings: settingActions.updateInsulinConfig,
});
export default enhancer(Insulin);
