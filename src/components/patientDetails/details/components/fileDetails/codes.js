import styles from "./styles.module.css";
const Codes = ({ hccCounts,hccValidCount }) => {
  return (
    <>
      <div className={styles.codesCard}>
        <div className="text-center">
          <h5 style={{marginTop:"5px"}}>Codes</h5>
        </div>
        <div className={styles.codesBottomCards}>
          <div className={styles.codes1}>
            <h5>{hccCounts?.isCmsHcc} CMS</h5>
          </div>
          <div className={styles.codes2}>
            <h5>{hccCounts?.isRxHcc} RX</h5>
          </div>
          <div className={styles.codes3}>
            <h5>{hccValidCount} TOTAL</h5>
          </div>
        </div>
      </div>
    </>
  );
};

export default Codes;
