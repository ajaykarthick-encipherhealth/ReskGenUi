import React from "react";
import DoubleBarChant from "../doubleBarChant";
import Styles from "../style.module.css";

const HighRisk = ({ data }) => {
  const codesList = data?.map((item) => [
    item?.diagnosisCode,
    item?.meatPresentCount,
    item?.meatAbsentCount,
  ]);
  return (
    <div className="row">
      <div className="col-3">
        <div
          className={`valid-text d-flex justify-content-center align-item-center mb-2 ${Styles.title_card}`}
        >
          <span className={`${Styles.title_card_content}`}>
            CONDITION WITH MEAT
          </span>
        </div>
        <div
          className={`${Styles.card_title_value} m- d-flex justify-content-center`}
        >
          <div>
            {data?.map((item) => item.meatPresentCount).length > 0
              ? data
                  ?.map((item) => item.meatPresentCount)
                  ?.reduce((total, count) => total + count)
              : 0}
          </div>
        </div>
        <div
          className={`valid-text d-flex justify-content-center mt-3 mb-1 ${Styles.title_cards}`}
        >
          <span className={`${Styles.title_card_content}`}>
          CONDITION WITHOUT MEAT
          </span>
        </div>
        <div
          className={`${Styles.card_title_value} d-flex justify-content-center`}
        >
          <div>
            {data?.map((item) => item.meatAbsentCount).length > 0
              ? data
                  ?.map((item) => item.meatAbsentCount)
                  ?.reduce((total, count) => total + count)
              : 0}
          </div>
        </div>
      </div>
      <div className="col-8">
        <DoubleBarChant data={codesList} details={data}/>
      </div>
    </div>
  );
};

export default HighRisk;
