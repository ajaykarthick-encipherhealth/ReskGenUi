import React from "react";
import { Drawer, Empty } from "antd";
import RegularButton from "../button";
import { connect } from "react-redux";
import { actions as allActions } from "../../stores/tableView";

const CustomizableDrawer = ({
  open,
  onClose,
  selectedColumns,
  setSelectedColumns,
  setActiveFilters,
  title = "Table Customize",
  handleSubmit,
  handleReset,
  isResetting,
  isSubmitting,
}) => {

  const handleSelectAll = () => {
    setSelectedColumns(prev => {
      const updated = prev.map((col, idx) => ({
        ...col,
        active: true,
        order: idx + 1,
      }));
      return updated;
    });
  };

  const handleClearAll = () => {
    setSelectedColumns(prev =>
      prev.map(col => ({ ...col, active: false, order: null }))
    );
  };

  const toggleColumn = field => {
    setSelectedColumns(prev => {
      const clickedCol = prev.find(col => col.actualField === field);

      // Step 1: Toggle active state of clicked column
      const updated = prev.map(col => {
        if (col.actualField === field) {
          // Toggle off
          if (col.active) {
            return { ...col, active: false, order: null };
          }
          // Toggle on (will reassign order next)
          return { ...col, active: true };
        }
        return col;
      });

      // Step 2: Reassign order to active columns in new sequence
      const activeCols = updated
        .filter(col => col.active && col.actualField !== field)
        .sort((a, b) => a.order - b.order);

      // Put newly clicked (now active) column at the end
      const clickedActive = updated.find(col => col.actualField === field && col.active);
      if (clickedActive) activeCols.push(clickedActive);

      return updated.map(col => {
        if (!col.active) return { ...col, order: null };
        const idx = activeCols.findIndex(c => c.actualField === col.actualField);
        return { ...col, order: idx + 1 };
      });
    });
  };

  const activeWithImplicitOrder = selectedColumns
    ?.map((col, idx) => ({
      ...col,
      implicitOrder: col.order != null ? col.order : idx + 1,
    }))
    .filter(col => col.active)
    .sort((a, b) => a.implicitOrder - b.implicitOrder);

  const displayIndexMap = activeWithImplicitOrder?.reduce((map, col, idx) => {
    map[col.actualField] = idx + 1;
    return map;
  }, {});

  const onInsert = () => {
    const payload = activeWithImplicitOrder.map(col => ({
      id: col.actualField,
      headerName: col.headerName,
      order: displayIndexMap[col.actualField],
    }));
    handleSubmit(payload);    
  };

  return (
    <Drawer
      width={500}
      title={
        <div className="d-flex align-items-center justify-content-between">
          <span>{title}</span>
          <div className="d-flex gap-2">
            <RegularButton name="Select All" onClick={handleSelectAll} />
            <RegularButton name="Clear All" onClick={handleClearAll} />
          </div>
        </div>
      }
      onClose={onClose}
      open={open}
      footer={
        <div className="d-flex align-items-center justify-content-center gap-3">
          <RegularButton
            name="Reset"
            onClick={handleReset}
            loading={isResetting}
          />
          <RegularButton
            name="Insert"
            onClick={onInsert}
            loading={isSubmitting}
          />
        </div>
      }
    >
      <div className="mt-3 mx-3 d-flex flex-column gap-3">
        {selectedColumns?.length > 0 ? (
          selectedColumns?.map(col => {
            const isActive = col.active;
            const displayNumber = displayIndexMap[col.actualField];
            return (
              <div
                key={col.actualField}
                className="d-flex align-items-center gap-3"
                style={{
                  border: "1px solid #d9d9d9",
                  padding: "10px",
                  borderRadius: 6,
                  backgroundColor: isActive ? "#f6ffed" : "#fff",
                  transition: "all 0.3s",
                  cursor: "pointer",
                }}
                onClick={() => toggleColumn(col.actualField)}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: isActive ? "none" : "2px solid #d9d9d9",
                    backgroundColor: isActive ? "#043069" : "transparent",
                    color: isActive ? "#fff" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    userSelect: "none",
                  }}
                >
                  {isActive ? displayNumber : ""}
                </div>
                <div style={{ flex: 1 }}>{col.headerName}</div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-muted">
            <Empty />
          </div>
        )}
      </div>
    </Drawer>
  );
};

const enhancer = connect(
  state => ({}),
  { tableDynamicColumn: allActions.tableDynamicColumn }
);

export default enhancer(CustomizableDrawer);
