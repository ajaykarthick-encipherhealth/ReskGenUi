import { Form, Input, Select } from "antd";
import React from "react";
import {
  getProviderNameManually,
  getSectionNameManually,
} from "../function/ReusableFunctions";
import AddSection from "./AddSection";
import style from "../../../../../components/button/style.module.css";
import RegularButton from "../../../../button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";

export const checkMeatType = (e) => {
  switch (e) {
    case "M":
      return "Monitor";
    case "E":
      return "Evaluation";
    case "A":
      return "Assessment";
    case "T":
      return "Treatment";
    default:
      break;
  }
};

const Meat = ({
  listOfSection,
  getSelectedDos,
  dosList,
  providerDetails,
  showSection,
  capturedSections,
  sectionCount,
  selectMeat,
  section,
  setMeatDisplay,
  setShowSection,
  setSection,
  setSectionCount,
  handleMeatSubmit,
  isMeat,
  isActive,
  sectionDelete,
  date,
  isEdit,
  sectionEdit,
  handleEdit
}) => {
 
  return (
    <div>
      <div className="row">
        <div className="col-12">
          <Form.Item
            label={
              <label>
                {checkMeatType(selectMeat)} Aspect{" "}
                <span style={{ color: "red" }}>*</span>
              </label>
            }
            name={`${checkMeatType(selectMeat)}Aspect`}
            rules={[
              {
                required: true,
                message: "Please enter diagnosis code",
              },
            ]}
          >
            <Input name={`${checkMeatType(selectMeat)}Aspect`} />
          </Form.Item>
        </div>
        <div className="col-12">
          <Form.Item
            label={
              <label>
                DOS <span style={{ color: "red" }}>*</span>
              </label>
            }
            name="dos"
            rules={[
              {
                required: true,
                message: "Please enter date of service",
              },
            ]}
          >
            <Select
              disabled
              mode="multiple"
              maxTagCount="responsive"
              className={`ant_select_form hcc_form mb-2`}
              placeholder="DOS"
              //   onChange={(selOption, val) => {
              //     handleSelectChange(selOption, "dos");
              //   }}
              options={
                getSelectedDos
                  ? [{ label: getSelectedDos, value: getSelectedDos }]
                  : dosList
              }
            />
          </Form.Item>
        </div>
        <div className="col-12">
          {providerDetails?.length > 0 && (
            <div>
              <div className={`${style.subHeader} border-bottom`}>Provider</div>
              <div className="">
                {getProviderNameManually({
                  data: providerDetails,
                })}
              </div>
            </div>
          )}
        </div>
        <div className="col-12">
          {listOfSection?.length > 0 && (
            <div className="py-4">
              <div className="d-flex border-bottom align-items-end justify-content-between">
                <div className={`${style.subHeader} mb-2`}>Section List</div>
                <div className="mb-1">
                  <RegularButton
                    type=""
                    method={"button"}
                    name="Add"
                    onClick={() => setShowSection(false)}
                  />
                </div>
              </div>
              <div className="mt-2">
                {getSectionNameManually({
                  data: listOfSection,
                  sectionDelete,
                  sectionEdit
                })}
              </div>
            </div>
          )}
        </div>
        {(listOfSection?.length <= 0 || !showSection) && (
          <div className="col-12 mt-2">
            <Form.Item
              label={
                <label>
                  Section <span style={{ color: "red" }}>*</span>
                </label>
              }
              name={`${checkMeatType(selectMeat)}section`}
              rules={[
                {
                  required: true,
                  message: "Please enter section",
                },
              ]}
            >
              <Select
                size="large"
                options={capturedSections}
                onChange={(val) => setSection(val)}
              />
            </Form.Item>
          </div>
        )}
      </div>
      {(listOfSection?.length <= 0 || !showSection) && (
        <div className="border rounded">
          {sectionCount?.map((item, index) => (
            <div className="pt-2">
              <div className="d-flex justify-content-between px-3">
                <b>Section - {index + 1}</b>
                <label>
                  {index == 0 && (
                    <label
                      className="cr-pointer px-2"
                      onClick={() =>
                        setSectionCount([
                          ...sectionCount,
                          ...[Math.max(...sectionCount) + 1],
                        ])
                      }
                    >
                      <FontAwesomeIcon icon={faPlus} color="#04306f" />
                    </label>
                  )}
                  {sectionCount?.length > 1 && (
                    <label
                      className="cr-pointer"
                      onClick={() => {
                        const remove = sectionCount.filter(
                          (val) => val != item
                        );
                        setSectionCount(remove);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashCan} color="#04306f" />
                    </label>
                  )}
                </label>
              </div>
              <AddSection
                key={index}
                id={index}
                section={section}
                selectMeat={selectMeat}
                date={date}
              />
            </div>
          ))}
          <Form.Item>
            <div className="d-flex justify-content-center mt-4">
              {!isEdit ? (
                <RegularButton
                  type=""
                  name="Save"
                  width="100px"
                  // onClick={handledSave}
                />
              ) : (
                <RegularButton
                  type=""
                  method={"button"}
                  name="Edit"
                  width="100px"
                  onClick={handleEdit}
                />
              )}
              {listOfSection?.length > 0 && (
                <RegularButton
                  type="outline"
                  name="Cancel"
                  width="100px"
                  method={"button"}
                  onClick={() => setShowSection(true)}
                />
              )}
            </div>
          </Form.Item>
        </div>
      )}
      {true && (
        <Form.Item>
          <div className="d-flex justify-content-center mt-5">
            <RegularButton
              type="outline"
              name="Back"
              width="100px"
              method={"button"}
              onClick={() => setMeatDisplay(false)}
            />
            <RegularButton
              type=""
              name="Submit"
              width="100px"
              method={"button"}
              onClick={handleMeatSubmit}
              disabled={isMeat ? !(isMeat && isActive) : isMeat}
            />
          </div>
        </Form.Item>
      )}
    </div>
  );
};

export default Meat;
