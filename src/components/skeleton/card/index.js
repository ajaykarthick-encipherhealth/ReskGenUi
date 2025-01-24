import { Col, Row, Skeleton } from "antd";
import React from "react";

const CardSkeleton = ({
  count = 1,
  height = 100,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div>
          <Skeleton.Input
            style={{
              height: height,
            }}
            active
            block={true}
          />
        </div>
      ))}
    </>
  );
};
export default CardSkeleton;
