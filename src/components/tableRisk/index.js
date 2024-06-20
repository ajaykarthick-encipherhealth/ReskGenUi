
import React from "react";
import style from "./style.module.css";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";


const TableRisk = ({ data, setActiveButton, setSearchInput }) => {
  const handleHeaderClick = () => {
    setActiveButton("ICD-10");
    setSearchInput(data?.[0]?.diagnosisCode);
  };


  return (
    <div className={style.card}>
     <div
         className={`${style.desc} p-3`}
           onClick={() => handleHeaderClick()}
        >
          <span className={style.code}>{data?.[0]?.diagnosisCode}-</span>
           {data?.[0]?.description}
       </div>
       <table class="table table-bordered">
      <thead>
        <tr>
          <th rowspan={2} scope="col">Year</th>
          <th scope="col">ESRD/PACE</th>
          <th colspan={3} scope="col">
            CMS HCC
          </th>
          <th scope="col">RX HCC</th>
        </tr>
        {data?.map?.((head, i) => (
          <tr>
           
            {i == 0 && head?.esrd?.map((item) => <th scope="col">{item.version}</th>)}
            {i == 0 && head?.cmsHcc?.map((item) => <th scope="col" >{item.version}</th>)}
            {i == 0 && head?.rxHcc?.map((item) => <th scope="col">{item.version}</th>)}
          </tr>
        ))}
      </thead>

      <tbody>
        {data?.map?.((list, i) => {
          return (
            <>
              <tr>
                <td>{list.year}</td>
                {list?.esrd?.map((res) => (
                  <td >
                    <div className="d-flex justify-content-center gap-2">
                    {res.value}
                    {res.payment ? <span><CheckCircleOutlined className="text-success" /></span> : <CloseCircleOutlined  className="text-danger" />} 
                    </div>
                  

                  </td>
                ))}

                {list?.cmsHcc?.map((res) => (
                 <td >
                 <div className="d-flex justify-content-center gap-2">
                 {res.value}
                 {res.payment ? <span><CheckCircleOutlined className="text-success" /></span> : <CloseCircleOutlined  className="text-danger" />} 
                 </div>
               

               </td>
                ))}
                {list?.rxHcc?.map((res) => (
                  <td >
                  <div className="d-flex justify-content-center gap-2">
                  {res.value}
                  {res.payment ? <span><CheckCircleOutlined className="text-success" /></span> : <CloseCircleOutlined  className="text-danger" />} 
                  </div>
                

                </td>
                ))}
              </tr>
            </>
          );
        })}
      </tbody>
    </table> 
       </div>
      

    
  );
};

export default TableRisk;
