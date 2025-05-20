import { Col, Row, Skeleton } from "antd";
import React from "react";

const CardSkeleton = ({
  count = 1,
  height = 100,
  display,
  gap
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div>
          <Skeleton.Input
            style={{
              height: height,
              display:display,
              gap:gap
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
