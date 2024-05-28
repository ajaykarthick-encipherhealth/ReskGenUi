import { Button } from "antd";
import React from "react";

const CodifyButton = ({onClick, style, label,className}) => {
  return (
    <div>
      <Button onClick={onClick} style={style} className={className}>{label}</Button>
      
    </div>
  );
};

export default CodifyButton;
