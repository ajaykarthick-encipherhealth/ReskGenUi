import React from "react";
import BarChart from "../barChart";
import PieChart from "../pieChart";
import Styles from "../style.module.css";

const Suggested = ({ data, counts }) => {
    const pieValues = [
        { value: 95, name: 'Accuracy', itemStyle: { color: "#73c0de" } },
        { value: 5, name: 'Manual', itemStyle: { color: "#d966ff" } },
      ];
  return (
    <div>
      <div className="row">
        <div className="col-6">
          <div className={Styles.title}>DIAGNOSIS CODES</div>
          <div className="d-flex">
            <BarChart
              diagnosisCode={data
                .map((item) => item.diagnosisCode)
                .splice(0, 9)}
              diagnosisCodeCount={data.map((item) => item.count).splice(0, 9)}
            />
            <div className="d-flex">
              <div
                className="px-3"
                style={{ height: "270px", overflow: "scroll" }}
              >
                <table>
                  <thead
                    style={{
                      position: " -webkit-sticky",
                      position: "sticky",
                      top: 0,
                      background: "#04306f",
                      color: "#fff",
                      padding: "10px",
                    }}
                  >
                    <tr>
                      <th className="p-2">Code</th>
                      <th className="p-2">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr>
                        <td className="p-2">{item.diagnosisCode}</td>
                        <td>{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className={Styles.title}>ACCURACY</div>
          <PieChart data={pieValues}/>
        </div>
        <div className="col-3">
          <div
            className={`valid-text d-flex justify-content-center mb-1 ${Styles.title_card}`}
          >
            <span className={`${Styles.title_card_content}`}>
              RAF WITHOUT MEAT CARE
            </span>
          </div>
          <div className={`${Styles.card_title} d-flex justify-content-center`}>
            <div>{counts.validDiseaseRafSum}</div>
          </div>
          <div
            className={`valid-text d-flex justify-content-center mt-3 mb-1 ${Styles.title_cards}`}
          >
            <span className={`${Styles.title_card_content}`}>
              RAF AMOUNT WITHOUT MEAT CARE
            </span>
          </div>
          <div className={`${Styles.card_title} d-flex justify-content-center`}>
            <div>${counts.validRafAmount}</div>
          </div>
          <div
            className={`valid-text d-flex justify-content-center mt-3 mb-1 ${Styles.title_card_total}`}
          >
            <span className={`${Styles.title_card_content}`}>
              TOTAL DIAGNOSIS CODES
            </span>
          </div>
          <div className={`${Styles.card_title} d-flex justify-content-center`}>
            <div>{data.map((item) => item.count).reduce((tol, item) => tol + item)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggested;
