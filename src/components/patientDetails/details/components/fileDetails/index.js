import Title from "./title";
import styles from "./styles.module.css";
import Details from "./fileDetails";
import Flag from "./flag";
import Codes from "./codes";

const FileDetails = ({title,fileResult,hccCounts,hccValidCount,patienIdDetails,patientDetails,flagFirstData}) => {
  return (
    <>
      <div  className={`row ${styles.container}`}>
        <div className="col-xl-1">
          <Title title={title}/>
        </div>
        <div className="col-xl-4">
          <Details fileResult={fileResult}/>
        </div>
        <div className="col-xl-4">
          <Flag patienIdDetails={patienIdDetails} patientDetails={patientDetails} flagFirstData={flagFirstData}/>
        </div>
        <div className="col-xl-3">
          <Codes hccCounts={hccCounts} hccValidCount={hccValidCount}/>
        </div>
      </div>
    </>
  );
};

export default FileDetails;
