import { Col, Row, Skeleton } from "antd";
import React from "react";

const CardSkeleton = ({ count = 1, width, height, border }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div >
          <Skeleton.Input
            style={{
              width: width,
              height: height,
              borderRadius: border,
            }}
            active
          />
        </div>
      ))}
    </>
  );
};
export default CardSkeleton;
