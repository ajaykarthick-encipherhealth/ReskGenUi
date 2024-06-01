import React from "react";
import style from "./style.module.css";

const TableRisk = ({ data, subheader,activeButton,setActiveButton }) => {

  const handleHeaderClick = () => {
    console.log("clicked");
    setActiveButton("ICD-10");
  };
  return (
    <div className="d-flex mt-3">
      <div className={`${style.header} w-100`}>
        <table className="table table-bordered">
          <td colSpan={12} className={style.head}>
            <span className={style.code}  onClick={()=>handleHeaderClick()}>
              {data?.diagnosisCode}-{data?.description}
            </span>
          </td>
          <tr className="tablerow">
            <th className = "tablehead"colSpan={6}> CMS HCC</th>
            <th colSpan={2}>RX HCC</th>
          </tr>
           
            <tr>
              {subheader?.map((item, index) => (
                <td key={index} scope="row" > 
                  {item.label}
                </td>
              ))}
            </tr>
            <tbody className="tablebody">
              <tr >
              <td className="tablerow" scope="row">{data?.year}</td>
              <td>{data?.cmsHccEsrdModelCategoryV24Payment}</td>
              <td>{data?.cmsHccEsrdModelCategoryV24Payment}</td>
              <td>{data?.cmsHccModelCategoryV24Payment}</td>
              <td>{data?.cmsHccModelCategoryV22Payment}</td>
              <td>{data?.rxHccModelCategoryV08Payment}</td>
              <td>{data?.rxHccModelCategoryV05Payment}</td>
              <td>{data?.rxHccModelCategoryV08Payment}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableRisk;
