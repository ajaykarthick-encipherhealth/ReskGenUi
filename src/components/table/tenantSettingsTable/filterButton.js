import { Button } from "antd";
import React from "react";

const FilterButton = ({ isActive, label, onClick }) => {
  return (
    <Button
      style={{
        borderRadius: "5px",
        backgroundColor: isActive ? "#06439D" : "#EDEDED",
        color: isActive ? "#FFFF" : "black",
        borderColor: isActive ? "#06439D" : "#EDEDED",
      }}
      onClick={() => {
        onClick();
      }}
    >
      {label}
    </Button>
  );
};

export default FilterButton;
