import Image from "next/image";
import React from "react";

const StatCard = ({
  icon,
  title,
  value,
  bgColor = "#F5F5F5",
  borderRadius,
  padding,
  display,
  alignItems,
  gap,
  minWidth,
  justifyContent,
  textAlign,
  fontSize,
  fontWeight,
  height,
  width,
  flexDirection,
  paddingTop,
  backgroundColor,
  textColor,
  border,
  style
}) => {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        backgroundImage: `url(${bgColor?.src})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: 'cover',
        border: border,
        borderRadius: borderRadius,
        padding: padding,
        display: display,
        flexDirection: flexDirection,
        alignItems: alignItems,
        gap: gap,
        width: minWidth,
        justifyContent: justifyContent,
        height: height || "80px",
        ...style,
      }}
    >
      {/* {icon && (
        <div
          style={{
            backgroundColor: backgroundColor || "#F5F5F5" ,
            borderRadius: "8px",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
          }}
        >
          <Image
            src={icon}
            alt={title}
            style={{ width: 24, height: 24, objectFit: "contain" }}
          />
        </div>
      )} */}

      <div style={{ textAlign: textAlign, paddingTop: paddingTop }}>
        <div style={{ fontWeight: "600", fontSize: "14px", color: textColor }}>{title}</div>
        <div
          style={{
            fontSize: fontSize || "36px",
            textAlign: textAlign,
            fontWeight: fontWeight,
            paddingTop: paddingTop,
            color: textColor
          }}
        >
          {value}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default StatCard;
