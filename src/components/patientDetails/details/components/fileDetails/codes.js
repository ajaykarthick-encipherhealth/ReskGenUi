import styles from "./styles.module.css";
const Codes = ({ hccCounts,hccValidCount,fromHcc }) => {
  return (
    <>
      <div className={fromHcc?styles.codesCardHcc:styles.codesCard}>
        <div className={`text-center ${styles.rafscoreheader}`}>
          <h5>Codes</h5>
        </div>
        <div className={styles.codesBottomCards}>
          <div className={fromHcc?styles.hccCodes1:styles.codes1}>
            <label className="pt-2">{hccCounts?.isCmsHcc}<br/> CMS</label>
          </div>
          <div className={fromHcc?styles.hccCodes2:styles.codes2}>
            <label className="pt-2">{hccCounts?.isRxHcc}<br/> RX</label>
          </div>
          <div className={fromHcc?styles.hccCodes3:styles.codes3}>
            <label className="pt-2">{hccValidCount}<br/> TOTAL</label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Codes;
