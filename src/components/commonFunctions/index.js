import Style from "./style.module.css";

export const getButtonStatus = (value) => {
  switch (value) {
    case "pending":
      return (
        <div className={`${Style.status} ${Style.pending}`}>
          <>Pending</>
        </div>
      );
    case "approved":
      return (
        <div className={`${Style.status} ${Style.approved}`}>
          <>Approved</>
        </div>
      );
      case "decline":
      return (
        <div className={`${Style.status} ${Style.decline}`}>
          <>Decline</>
        </div>
      );
    default:
      return <>Test</>;
  }
};
