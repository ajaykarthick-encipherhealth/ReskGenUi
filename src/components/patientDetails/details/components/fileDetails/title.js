import styles from "./styles.module.css";
const Title = ({title}) => {
    return <>
       <div className={styles.titleCard}>
         <h5>{title}</h5>
       </div>
    </>;
  };
  
  export default Title;
  