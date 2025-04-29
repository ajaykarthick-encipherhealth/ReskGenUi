
import React from "react";
import { Drawer, Checkbox, Empty } from "antd";
import RegularButton from "../button";
import { connect } from "react-redux";
import { actions as allActions } from "../../stores/tableView";

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
  handleReset,
  isResetting,
  isSubmitting,
}) => {
  const handleSelectAll = () => {
    setSelectedColumns((prev) => prev.map((col) => ({ ...col, active: true })));
    setActiveFilters?.((prev) =>
      prev.map((filter) => ({ ...filter, active: true }))
    );
  };

  const handleClearAll = () => {
    setSelectedColumns((prev) =>
      prev.map((col) => ({ ...col, active: false }))
    );
  };
  return (
    <div>
      <Drawer
        width={500}
        title={
          <div className="d-flex align-items-center justify-content-between">
            <span>{title}</span>
            {selectedColumns && selectedColumns.length > 0 && (
              <div className="d-flex gap-2">
                <RegularButton name="Select All" onClick={handleSelectAll} />
                <RegularButton name="Clear All" onClick={handleClearAll} />
              </div>
            )}
          </div>
        }
        onClose={onClose}
        open={open}
        footer={
          selectedColumns && selectedColumns.length > 0 ? (
            <div className="d-flex align-items-center justify-content-center gap-3">
              <RegularButton
                name="Reset"
                onClick={handleReset}
                loading={isResetting}
              />
              <RegularButton
                name="Insert"
                onClick={handleSubmit}
                loading={isSubmitting}
              />
            </div>
          ) : null
        }
      >
        <div className="mt-3 mx-3 d-flex flex-column gap-3">
          {selectedColumns && selectedColumns.length > 0 ? (
            selectedColumns.map((option, index) => (
              <div
                key={option.actualField}
                style={{
                  border: "1px solid #d9d9d9",
                  padding: "10px",
                  borderRadius: 6,
                  color: option?.isShow ? "black" : "black",
                  transition: "all 0.3s ease",
                }}
              >
                <Checkbox
                  checked={option?.active}
                  onChange={() => {
                    if (option?.active) {
                      // setActiveFilters?.((prev) =>
                      //   prev?.map((val) =>
                      //     val?.actualField === option?.actualField
                      //       ? { ...val, active: false }
                      //       : val
                      //   )
                      // );
                      setSelectedColumns((prev) =>
                        prev.map((val) =>
                          val?.actualField === option.actualField
                            ? { ...val, active: false }
                            : val
                        )
                      );
                    } else {
                      setSelectedColumns((prev) =>
                        prev.map((val) =>
                          val.actualField === option.actualField
                            ? { ...val, active: true }
                            : val
                        )
                      );
                      // setActiveFilters?.((prev) =>
                      //   prev?.map((val) =>
                      //     val?.actualField === option?.actualField
                      //       ? { ...val, active: true }
                      //       : val
                      //   )
                      // );
                    }
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    {option?.headerName}
                  </div>
                </Checkbox>
              </div>
            ))
          ) : (
            <div className="text-center text-muted">
              <Empty />
            </div>
          )}
        </div>        
      </Drawer>
    </div>
  );
};

const enhancer = connect((state) => ({}), {
  tableDynamicColumn: allActions.tableDynamicColumn,
});

export default enhancer(CustomizableDrawer);
