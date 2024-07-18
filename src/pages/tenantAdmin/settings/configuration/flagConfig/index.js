import React, { useEffect, useState } from "react";
import Style from "./../../style.module.css";
import RegularButton from "../../../../../components/button";
import { ColorPicker, Form, Popconfirm } from "antd";
import { connect, useSelector } from "react-redux";
import { actions as settingActions } from "../../../../../stores/tenantAdmin/settings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { getResponePopup } from "../../../../../utils/reusable";

const FlagConfig = ({ getFlagConfigDetails, flagSave, deleteFlag }) => {
  const [form] = Form.useForm();
  const [color, setColor] = useState("#1677ff");
  const [flags, setFlags] = useState([]);
  const [flag, setFlag] = useState("");
  const [isEdit, setIsEdit] = useState(null);
  useEffect(() => {
    getFlagDetails();
  }, []);

  const getFlagDetails = async () => {
    try {
      const res = await getFlagConfigDetails();
      if (res?.status == "SUCCESS") {
        setFlags(res.response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (isEdit) {
      try {
        const res = await flagSave({
          id: isEdit.id,
          flagName: flag,
          flagIcon: isEdit.flagIcon,
          flagColour: color,
          isActive: isEdit.isActive,
        });
        if (res?.status == "SUCCESS") {
          getResponePopup(res);
          getFlagDetails();
          setColor("#1677ff");
          setFlag("");
          setIsEdit(null);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const res = await flagSave({
          flagName: flag,
          flagIcon: "Test icon",
          flagColour: color,
          isActive: true,
        });
        if (res?.status == "SUCCESS") {
          getResponePopup(res);
          getFlagDetails();
          setColor("#1677ff");
          setFlag("");
          setIsEdit(null);
        } else if (res?.status == "USER_DEFINED_ERROR") {
          getResponePopup(res);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleEdit = (value) => {
    setIsEdit(value);
    setFlag(value.flagName);
    setColor(value.flagColour);
  };

  const handleDeleteFlag = async (value) => {
    try {
      const res = await deleteFlag(value.id);
      if (res.status == "SUCCESS") {
        getResponePopup(res);
        getFlagDetails();
      }
    } catch (error) {}
  };
  return (
    <>
      <div className="p-3" style={{ height: "65vh" }}>
        <div className="d-flex justify-content-between">
          <div className={Style.title}>Flag Configuration</div>
          <div className="d-flex mb-3">
            <div className="input-group">
              <label
                className="border px-2 rounded-start"
                id="button-addon1"
                style={{ padding: "5px 0" }}
              >
                <ColorPicker
                  value={color}
                  showText
                  onChange={(e, color) => setColor(color)}
                />
              </label>
              <input
                type="text"
                className="border px-2"
                placeholder=""
                aria-label="Example text with button addon"
                aria-describedby="button-addon1"
                style={{
                  height: "45px",
                  borderRadius: 0,
                  width: "250px",
                }}
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
              />
            </div>
            <RegularButton
              name={isEdit ? "Update" : "Save"}
              onClick={handleSubmit}
            />
            <RegularButton
              name={"Cancel"}
              type={"outline"}
              onClick={() => {
                setColor("#1677ff");
                setFlag("");
                setIsEdit(null);
              }}
            />
          </div>
        </div>
        {/* <div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="inlineRadio1"
              value="option1"
            />
            <label className="form-check-label" for="inlineRadio1">
              All
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="inlineRadio2"
              value="option2"
            />
            <label className="form-check-label" for="inlineRadio2">
              Recently Added
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              id="inlineRadio3"
              value="option3"
            />
            <label className="form-check-label" for="inlineRadio3">
              Deleted Flag
            </label>
          </div>
        </div> */}
        <div>
          {flags?.map((item) => (
            <div
              className={`p-1 px-3 d-inline-block m-2`}
              style={{ border: `1px solid ${item.flagColour}` }}
            >
              <span
                className={Style.flagDot}
                style={{ backgroundColor: `${item.flagColour}` }}
              ></span>
              <span>{item.flagName}</span>

              <span className="px-2 cr-pointer">
                {
                  <FontAwesomeIcon
                    icon={faPen}
                    style={{
                      fontSize: "15px",
                      color: "#6464ff",
                    }}
                    onClick={() => {
                      handleEdit(item);
                    }}
                  />
                }
              </span>
              <span className=" cr-pointer">
                {
                  <Popconfirm
                    title="Are you sure you want to delete?"
                    onConfirm={() => handleDeleteFlag(item)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{
                        fontSize: "15px",
                        color: "#dc4848",
                      }}
                      // onClick={() => }
                    />
                  </Popconfirm>
                }
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* <div className="text-end p-3">
        <RegularButton
          type={"outline"}
          name={"Restore Changes"}
          onClick={() => console.log("Restore Changes")}
        />
        <RegularButton name={"Save Changes"} onClick={() => handleSubmit()} />
      </div> */}
    </>
  );
};

const enhancer = connect((state) => ({}), {
  getFlagConfigDetails: settingActions.getFlags,
  flagSave: settingActions.updateFlags,
  deleteFlag: settingActions.deleteFlags,
});

export default enhancer(FlagConfig);
