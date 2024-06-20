
import React from "react";
import style from "./style.module.css";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";


const TableRisk = ({ data, setActiveButton, setSearchInput }) => {
  const handleHeaderClick = () => {
    setActiveButton("ICD-10");
    setSearchInput(data?.[0]?.diagnosisCode);
  };


  return (
    // <div>
    //   <div className={style.card}>
    //     {/* <div
    //       className={`${style.desc} p-3`}
    //       onClick={() => handleHeaderClick()}
    //     >
    //       <span className={style.code}>{data?.[0]?.diagnosisCode}-</span>
    //       {data?.[0]?.description}
    //     </div> */}
    //     <div>
    //       <div className="row gap-2 mx-2">
    //         <div
    //           className="col-1 d-flex justify-content-center   "
    //           style={{
    //             border: "1px solid #04306F",
    //             padding: "3px",
    //             borderRadius: "6px",
    //           }}
    //         >
    //           <span style={{ fontSize: "16px", fontWeight: "600" }}> Year</span>
    //         </div>
    //         <div
    //           className="col-2 d-flex justify-content-center "
    //           style={{
    //             border: "1px solid  #04306F",
    //             padding: "3px",
    //             borderRadius: "6px",
    //           }}
    //         >
    //           <span style={{ fontSize: "16px", fontWeight: "600" }}>
    //             ESRD/PACE
    //           </span>
    //         </div>
    //         <div
    //           className="col-6 d-flex justify-content-center"
    //           style={{
    //             border: "1px solid  #04306F",
    //             padding: "3px",
    //             borderRadius: "6px",
    //           }}
    //         >
    //           <span style={{ fontSize: "16px", fontWeight: "600" }}>
    //             CMS HCC
    //           </span>
    //         </div>
    //         <div
    //           className="col-2 d-flex justify-content-center "
    //           style={{
    //             border: "1px solid  #04306F",
    //             padding: "3px",
    //             borderRadius: "6px",
    //           }}
    //         >
    //           <span style={{ fontSize: "16px", fontWeight: "600" }}>
    //             {" "}
    //             RX HCC
    //           </span>
    //         </div>
    //       </div>
    //       <div className="row  mx-2 gap-2">
    //         <div
    //           className="col-1 mt-2"
    //           style={{
    //             border: "1px solid #04306F",
    //             padding: "3px",
    //             borderRadius: "6px",
    //             height: "200px",
    //           }}
    //         >
    //           {data?.map((x) => x.year)}
    //         </div>
    //         <div
    //           className="col-2 mt-2"
    //           style={{
    //             border: "1px solid #04306F",
    //             padding: "3px",
    //             borderRadius: "6px",
    //             height: "200px",
    //           }}
    //         >
    //           <div
    //             className="d-flex justify-content-around gap-2 "
    //             style={{
    //               background: "#BAD5FD",
    //               borderRadius: "6px",
    //               padding: "5px",
    //             }}
    //           >
    //             {data?.esrd?.version}
    //           </div>

    //           {/* <div className="d-flex justify-content-center align-items-center ">
    //           <div>18</div>
    //           <Divider
    //             type="vertical"
    //             style={{ height: "150px", color: "black" }}
    //           />
    //           <div>18</div>
    //         </div> */}
    //         </div>
    //         <div
    //           className="col-6 mt-2"
    //           style={{
    //             border: "1px solid #04306F",
    //             padding: "3px",
    //             borderRadius: "6px",
    //             height: "200px",
    //           }}
    //         >
    //           <div
    //             className="d-flex justify-content-around gap-2 "
    //             style={{
    //               background: "#BAD5FD",
    //               borderRadius: "6px",
    //               padding: "5px",
    //             }}
    //           ></div>

    //         </div>
    //         <div
    //           className="col-2 mt-2"
    //           style={{
    //             border: "1px solid #04306F",
    //             padding: "3px",
    //             borderRadius: "6px",
    //             height: "200px",
    //           }}
    //         >
    //           <div
    //             className="d-flex justify-content-around gap-2 "
    //             style={{
    //               background: "#BAD5FD",
    //               borderRadius: "6px",
    //               padding: "5px",
    //             }}
    //           ></div>

    //         </div>
    //       </div>
    //     </div>
    //   </div>

    // </div>
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
