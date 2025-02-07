import styles from "./styles.module.css";
const Codes = ({ hccCounts,hccValidCount,fromHcc }) => {
  return (
    <>
      <div className={styles.codesCardHcc}>
        <div className={`text-center ${styles.rafscoreheader}`}>
          <h5>Codes</h5>
        </div>
        <div className={styles.codesBottomCards}>
          <div className={fromHcc?styles.hccCodes1:styles.codes1}>
            <label className="pt-2">{hccCounts?.isCmsHcc}<div className={styles.hccCounts}>CMS</div> </label>
          </div>
          <div className={fromHcc?styles.hccCodes2:styles.codes2}>
            <label className="pt-2">{hccCounts?.isRxHcc} <div className={styles.hccCounts}>RX</div> </label>
          </div>
          <div className={fromHcc?styles.hccCodes3:styles.codes3}>
            <label className="pt-2">{hccValidCount}<div className={styles.hccCounts}>TOTAL</div> </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Codes;
