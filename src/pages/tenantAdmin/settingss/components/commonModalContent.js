import { Form, Input, Select, Switch } from "antd";
import React, { useState } from "react";
import Style from "../style.module.css";
import RegularButton from "../../../../components/button";
import {
  handleEditInputChange,
  handleEditTag,
  handleSaveEdit,
} from "../coding/insulin";
import Tags from "./tags";

const CommonModalContent = ({tags,setTags}) => {
  const [form] = Form.useForm();
  const [selectedOption, setSelectedOption] = useState("Default");
  const [inputStrValue, setInputStrValue] = useState({
    code: "",
    description: "",
  });

  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleInputTagChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleAddTag = () => {
    if (inputValue) {
      setTags([...tags, inputValue]);
      setInputValue("");
    }
  };
  const handleOption = (value) => {
    setSelectedOption(value);
  };
  const handleInputChange = (e, field) => {
    // [field]=e.target.value
    setInputStrValue(([field] = e.target.value));
  };
  const handleSwitch = (checked) => {
    console.log(`switch to ${checked}`);
  };
  const handleFormSubmit = (value) => {
    console.log(value);
    form.resetFields();
  };
  return (
    <>
      <div className="d-flex">
        <div className="font-bold"> Add Manually</div>
        <Select
          defaultValue={{ value: "Default", label: "Default" }}
          options={[
            { value: "Default", label: "Default" },
            { value: "Description", label: "Description" },
            { value: "Code", label: "Code" },
          ]}
          className={Style.selector}
          onChange={handleOption}
        />
      </div>
      {selectedOption === "Default" && (
        <>
          <Form form={form} onFinish={handleFormSubmit}>
            <Form.Item name="code">
              <label htmlFor="code"> code</label>
              <div className="d-flex justify-content-between">
                <div className="w-100">
                  <Input
                    placeholder={"Code"}
                    onChange={(e) => handleInputChange(e, "code")}
                    value={inputStrValue?.code}
                    style={{ padding: "22px" }}
                  />
                </div>
              </div>
            </Form.Item>
            <Form.Item name="description">
              <label htmlFor="description"> Description</label>
              <div className="d-flex justify-content-between">
                <div className="w-100">
                  <Input
                    placeholder={"Description"}
                    onChange={(e) => handleInputChange(e, "description")}
                    value={inputStrValue?.description}
                    style={{ padding: "22px" }}
                  />
                </div>
              </div>
            </Form.Item>
            <Form.Item name="code">
              <div className="d-flex">
                <div className="font-semibold"> Billable </div>
                <div className="mx-2">
                  <Switch
                    defaultChecked={true}
                    className="directCodeSwitch"
                    onChange={handleSwitch}
                  />
                </div>
              </div>
            </Form.Item>
            <Form.Item name="code">
              <div className="d-flex justify-content-center">
                <RegularButton name={"Submit"} htmlType="submit" />
              </div>
            </Form.Item>
          </Form>
        </>
      )}
      {selectedOption !== "Default" && (
        <div>
          <div className="mb-4 w-[100%]">
            <div className="text-lg font-semibold my-2" id="modal-title">
              {`Add ${selectedOption}`}
            </div>

            <div className="d-flex justify-content-between">
              <div className="w-100">
                <Input
                  placeholder={`${selectedOption}`}
                  onChange={handleInputTagChange}
                  value={inputValue}
                  style={{ padding: "22px" }}
                />
              </div>
              <RegularButton name={"Add"} onClick={handleAddTag} />
            </div>
          </div>
          <div
            className="mt-2"
            style={{ height: "400px", overflowY: "scroll" }}
          >
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
      )}
    </>
  );
};

export default CommonModalContent;
