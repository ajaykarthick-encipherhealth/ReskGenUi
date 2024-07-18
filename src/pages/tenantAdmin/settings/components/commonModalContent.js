import { Button, Form, Input, Popconfirm, Select, Switch } from "antd";
import React, { useState } from "react";
import Style from "../style.module.css";
import RegularButton from "../../../../components/button";
import {
  handleEditInputChange,
  handleEditTag,
  handleSaveEdit,
} from "../coding/insulin";
import Tags from "./tags";
import { connect } from "react-redux";
import { actions as manualAddActions } from "../../../../stores/tenantAdmin/settings";
import { getResponePopup, getYears } from "../../../../utils/reusable";
import ButtonStyles from "../../../../components/button/style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const CommonModalContent = ({
  tags,
  setTags,
  isChecked,
  target,
  setOpenModal,
  createDirectCodes,
  handleEdit,
  handleDelete,
  // isEdit,
  // handleUpdate,
  setAddManually,
}) => {
  const [form] = Form.useForm();
  const [selectedOption, setSelectedOption] = useState("Default");
  const [inputStrValue, setInputStrValue] = useState({
    code: "",
    description: "",
  });
  const [isEdit, setIsEdit] = useState("");

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
  // const handleFormSubmit = (values) => {
  //   console.log("values", values);

  //   values.target = "DIRECT_CONFIRM_CODES";
  //   !values.isDefaultYear ? (values.year = values.year) : delete values.year;
  //   if (selectedOption === "Default") {
  //     values.default = [
  //       {
  //         code: values.code,
  //         description: values.description,
  //       },
  //     ];
  //   } else if (selectedOption === "Code") {
  //     values.codes = values.codes;
  //   } else {
  //     values.description = values.description;
  //   }
  //   delete values.description;
  //   delete values.code;
  //   console.log(values);
  //   // form.resetFields();

  //   // createDirectCodes(values);
  // };

  const manuallyAdded = async (e) => {
    try {
      const res = await setAddManually({
        ...e,
        target: target,
        isDefaultYear: isChecked,
        defaults: [],
      });
      if (res.status == "SUCCESS") {
        getResponePopup(res);
        setOpenModal(false);
      } else if (res.status == "USER_DEFINED_ERROR") {
        getResponePopup(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const manuallyAddedCodes = async () => {
    console.log(selectedOption);
    try {
      const res = await setAddManually({
        [selectedOption.toLowerCase() + "s"]: tags,
        target: target,
        isDefaultYear: isChecked,
        defaults: [],
      });

      if (res.status == "SUCCESS") {
        getResponePopup(res);
        setOpenModal(false);
        setTags([]);
      } else if (res.status == "USER_DEFINED_ERROR") {
        getResponePopup(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = () => {
    const update = tags.map((item, index) =>
      isEdit == index + 1 ? inputValue : item
    );
    setInputValue("");
    setIsEdit("");
    setTags(update);
  };

  return (
    <>
      <div className="d-flex gap-3">
        <div className="fw-500" style={{ fontSize: "22px" }}>
          Add Manually
        </div>
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
          <Form
            form={form}
            onFinish={(e) => {
              // handleFormSubmit(e),
              manuallyAdded(e);
            }}
          >
            <label htmlFor="code">Code</label>
            <div className="d-flex justify-content-between">
              <div className="w-100">
                <Form.Item name="code">
                  <Input
                    placeholder={"Code"}
                    // onChange={(e) => handleInputChange(e, "code")}
                    // value={inputStrValue?.code}
                    style={{ padding: "22px" }}
                  />
                </Form.Item>
              </div>
            </div>
            <label htmlFor="description"> Description</label>
            <div className="d-flex justify-content-between">
              <div className="w-100">
                <Form.Item name="description">
                  <Input
                    placeholder={"Description"}
                    // onChange={(e) => handleInputChange(e, "description")}
                    // value={inputStrValue?.description}
                    style={{ padding: "22px" }}
                  />
                </Form.Item>
              </div>
            </div>
            {/* <div className="d-flex gap-5">
              <div className="font-semibold"> Billable </div>
              <div className="mx-2 w-100">
                <Form.Item name="code">
                  <Switch
                    title="Yes"
                    defaultChecked={true}
                    className="directCodeSwitch"
                    onChange={handleSwitch}
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="d-flex gap-1">
              <div className="font-semibold"> Default Year </div>
              <div className="mx-2">
                <Form.Item name="isDefaultYear">
                  <Switch
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                    // defaultChecked={true}
                    className="directCodeSwitch"
                  />
                </Form.Item>
              </div>
            </div> */}
            {!isChecked && (
              <>
                <label htmlFor="year">Year</label>
                <div className="d-flex justify-content-between">
                  <div className="w-100">
                    <Form.Item name="years">
                      <Select
                        allowClear
                        options={getYears()}
                        size="large"
                        mode="multiple"
                      />
                    </Form.Item>
                  </div>
                </div>
              </>
            )}

            <div className="d-flex justify-content-center">
              <Form.Item>
                <Button
                  htmlType="submit"
                  className={ButtonStyles.outer}
                  style={{ height: "45px" }}
                >
                  Submit
                </Button>
              </Form.Item>
            </div>
          </Form>
        </>
      )}
      {selectedOption !== "Default" && (
        <div>
          <div className="mb-4 w-[100%]">
            <div className="mt-2">
              <label htmlFor="year">Year</label>
              <div className="d-flex justify-content-between">
                <div style={{ width: "100%" }}>
                  <Select
                    allowClear
                    options={getYears()}
                    size="large"
                    mode="multiple"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>
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
              {isEdit ? (
                <RegularButton name={"Edit"} onClick={handleUpdate} />
              ) : (
                <RegularButton name={"Add"} onClick={handleAddTag} />
              )}
            </div>
          </div>
          {/* <div
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
                    <div className="me-2">
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
                        className="mr-2 w-auto p-3"
                      />
                    </div>
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
                  <div className="p-2 mx-2 rounded py-1 fs-4" style={{backgroundColor: "#bae0fc"}}>
                    <label>{tag}</label>
                    <span className="px-2 cr-pointer">
                {
                  <FontAwesomeIcon
                    icon={faPen}
                    style={{
                      fontSize: "15px",
                      color: "#6464ff",
                    }}
                    onClick={() => {
                      handleEdit(tag);
                    }}
                  />
                }
              </span>
              <span className=" cr-pointer">
                {
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{
                      fontSize: "15px",
                      color: "#dc4848",
                    }}
                    onClick={() => handleDelete(tag)}
                  />
                }
              </span>
                  </div>
                </div>
              ))
            ) : (
              <div>No tags available</div>
            )}
          </div> */}
          <div
            // className="mt-2"
            style={{ height: "200px", overflowY: "scroll" }}
          >
            {tags.length > 0 &&
              tags.map((item, index) => (
                <span
                  className="p-2 px-3 me-2 my-1 d-inline-block rounded"
                  style={{ background: "#c8c8ff" }}
                >
                  <span>{item}</span>
                  <span className="px-2 cr-pointer">
                    {
                      <FontAwesomeIcon
                        icon={faPen}
                        style={{
                          fontSize: "15px",
                          color: "#6464ff",
                        }}
                        onClick={() => {
                          setIsEdit(index + 1);
                          setInputValue(item);
                        }}
                      />
                    }
                  </span>
                  <span className=" cr-pointer">
                    {
                      <Popconfirm
                        title="Are you sure you want to delete?"
                        onConfirm={() => {
                          const del = tags.filter((item, ind) => ind != index);
                          setTags(del);
                        }}
                        okText="Yes"
                        cancelText="No"
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{
                            fontSize: "15px",
                            color: "#dc4848",
                          }}
                        />
                      </Popconfirm>
                    }
                  </span>
                </span>
              ))}
          </div>
          {tags.length > 0 && (
            <div className="d-flex mt-5 justify-content-center">
              <RegularButton name="Submit" onClick={manuallyAddedCodes} />
            </div>
          )}
        </div>
      )}
    </>
  );
};
const enhancer = connect((state) => ({}), {
  createDirectCodes: manualAddActions.manualAddAction,
  setAddManually: manualAddActions.addManually,
});
export default enhancer(CommonModalContent);
