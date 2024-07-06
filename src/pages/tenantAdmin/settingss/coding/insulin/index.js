import React from "react";
import Style from "../../style.module.css";
import RegularButton from "../../../../../components/button";
import { Button, Input } from "antd";
import { useState } from "react";
import Tags from "../../components/tags";

export const handleRemoveTag = ({ index, setTags, tags }) => {
  const newTags = [...tags];
  newTags.splice(index, 1);
  setTags(newTags);
  // await updateTagsOnServer(newTags);
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

const Insulin = () => {
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
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

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
    <>
      <div className="p-3" style={{ height: "80vh" }}>
        <div className="d-flex justify-content-between">
          <div className={Style.title}>Insulin Medications</div>
        </div>
        <div>
          <div>
            <div className="mb-4 w-[100%]">
              <div className="text-lg font-semibold my-2" id="modal-title">
                Add
              </div>
              
              <div className="d-flex justify-content-between">
                <div className="w-100">
                  <Input
                    placeholder={"Insulin Medications"}
                    onChange={handleInputChange}
                    value={inputValue}
                    style={{padding:"22px"}}
                  />
                </div>
                <RegularButton name={"Add"} onClick={handleAddTag}/>
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
        <RegularButton
          name={"Save Changes"}
          onClick={() => console.log("Save Changes")}
        />
      </div>
    </>
  );
};

export default Insulin;
