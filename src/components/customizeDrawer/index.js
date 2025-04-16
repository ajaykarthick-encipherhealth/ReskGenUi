import React from "react";
import { Drawer, Checkbox } from "antd";
import RegularButton from "../button";

const CustomizableDrawer = ({
  open,
  onClose,
  options,
  selectedColumns,
  setSelectedColumns,
  handleInsert,
  title = "Table Customize",
  setActiveFilters
}) => {
  return (
    <Drawer title={title} onClose={onClose} open={open}>
      <div className="mt-3 mx-3 d-flex flex-column gap-3">
        {selectedColumns.map((option, index) => {
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
                key={option.value}
                checked={option?.isShow}
                onChange={() => {
                  if (option?.isShow) {
                    setActiveFilters((prev)=>(
                     prev?.map((val) =>
                      val?.title === option?.filterKey
                        ? { ...val, active: false }
                        : val
                    )
                    ))
                    setSelectedColumns((prev) =>
                    {                      
                     return prev.map((val) => val?.value == option.value ? {...val, isShow: false} : val)}
                    );
                  } else {
                    setSelectedColumns((prev) => 
                      prev.map((val) => val.value == option.value ? {...val, isShow: true} : val)
                    );
                  }
                }}
              >
                <div
                  className="d-flex align-items-center gap-3 "
                >
                  {option.name}
                  <div></div>
                  
                </div>
              </Checkbox>
            </div>
          );
        })}
      </div>
      <div className="w-100">
        <div className="mt-4  d-flex align-items-center justify-content-center">
          <RegularButton name="Insert" onClick={handleInsert} />
        </div>
      </div>
    </Drawer>
  );
};

export default CustomizableDrawer;
