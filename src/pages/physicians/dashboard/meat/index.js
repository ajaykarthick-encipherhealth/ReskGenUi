import React from "react";
import BarChart from "../barChart";
import PieChart from "../pieChart";
import Styles from "../style.module.css";
import BarChartMeat from "../barChart2";

const Meat = ({ data, meatCount, totalFullMeat }) => {
  const pieValues = [
    { value: 100, name: "Accuracy", itemStyle: { color: "#ffad33" } },
  ];
  return (
    <div>
      <div className="row">
      <div className="col-3">
          <div
            className={`valid-text d-flex justify-content-center align-item-center mb-2 ${Styles.title_card}`}
          >
            <span className={`${Styles.title_card_content}`}>
              TOTAL MEAT
            </span>
          </div>
          <div
            className={`${Styles.card_title_value} m- d-flex justify-content-center`}
          >
            <div>{meatCount ? meatCount : 0}</div>
          </div>
          <div
            className={`valid-text d-flex justify-content-center mt-3 mb-1 ${Styles.title_cards}`}
          >
            <span className={`${Styles.title_card_content}`}>
              COMBINATION COUNT
            </span>
          </div>
          <div className={`${Styles.card_title_value} d-flex justify-content-center`}>
            <div>{totalFullMeat ? totalFullMeat : 0}</div>
          </div>
        </div>
      
        <div className="col-4">
          <div className={`d-flex justify-content-center ${Styles.title}`}>MEAT CARE ACCURACY</div>
          <PieChart data={pieValues} />
        </div>
        <div className="col-5">
        <div className={`d-flex justify-content-center ${Styles.title}`}>TOTAL MEAT VALUES</div>
            <BarChartMeat data={data}/>
        </div>
       
      </div>
    </div>
  );
};

export default Meat;
