import React from "react";
import { Drawer, Checkbox } from "antd";
import RegularButton from "../button";
import { connect } from "react-redux";
import { actions as allActions } from "../../stores/tableView";
import { getResponePopup } from "../../utils/reusable";

const CustomizableDrawer = ({
  open,
  onClose,
  options,
  selectedColumns,
  setSelectedColumns,
  handleInsert,
  title = "Table Customize",
  setActiveFilters,
  tableDynamicColumn,
  handleSubmit,
  handleReset
}) => {
  // const handleSubmit = async () => {
  //   const payload = {
  //     pageId: "3a5feaba-7de6-4557-961b-ab973a688f81",
  //     headerNames: selectedColumns
  //       .filter((col) => col.active)
  //       .map((col) => col.actualField),
  //   };

  //   try {
  //     const response = await tableDynamicColumn({payload});
  //     if (response?.status === "SUCCESS"){
  //       onClose()
  //       getResponePopup(response);
  //     }
  //   } catch (error) {
  //     getResponePopup(error?.response);
  //   }
  // };
 

  return (
    <Drawer title={title} onClose={onClose} open={open}>
      <div className="mt-3 mx-3 d-flex flex-column gap-3">
        {selectedColumns?.map((option, index) => {
          return (
            <div
              style={{
                border: "1px solid #d9d9d9",
                padding: "10px",
                borderRadius: 6,
                // backgroundColor: option?.isShow ? "" : ",
                color: option?.isShow ? "black" : "black",
                transition: "all 0.3s ease",
              }}
            >
              <Checkbox
                key={option.actualField}
                checked={option?.active}
                onChange={() => {
                  if (option?.active) {
                    setActiveFilters((prev) =>
                      prev?.map((val) =>
                        val?.title === option?.filterKey
                          ? { ...val, active: false }
                          : val
                      )
                    );
                    setSelectedColumns((prev) => {
                      return prev.map((val) =>
                        val?.actualField == option.actualField
                          ? { ...val, active: false }
                          : val
                      );
                    });
                  } else {
                    setSelectedColumns((prev) =>
                      prev.map((val) =>
                        val.actualField == option.actualField
                          ? { ...val, active: true }
                          : val
                      )
                    );
                  }
                }}
              >
                <div className="d-flex align-items-center gap-3 ">
                  {option?.headerName}
                  {/* <div>{option?.orderValue}</div> */}
                </div>
              </Checkbox>
            </div>
          );
        })}
      </div>
      <div className="w-100">
        <div className="mt-4 d-flex align-items-center justify-content-center gap-3">
          <div></div>
          <RegularButton name="Reset" onClick={handleReset} />
          <RegularButton name="Insert" onClick={handleSubmit} />
        </div>
      </div>
    </Drawer>
  );
};

const enhancer = connect(
  (state) => ({
  }),
  {
    tableDynamicColumn: allActions.tableDynamicColumn,
  }
);

export default enhancer(CustomizableDrawer);
