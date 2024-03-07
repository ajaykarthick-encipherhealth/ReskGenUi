import styles from "./styles.module.css";
const getMeatFound = (code, data, value) => {
  const result = data?.filter(
    (res2) => res2.diagnosisCode.replace(".", "") == code.replace(".", "")
  );
  var backColor = "#f93d3d";
  if (result.length != 0) {
    switch (value) {
      case "M":
        if (result[0]?.monitor) {
          backColor = "#15b315";
        }
        break;
      case "E":
        if (result[0]?.evaluate) {
          backColor = "#15b315";
        }
        break;
      case "A":
        if (result[0]?.assessment) {
          backColor = "#15b315";
        }
        break;
      case "T":
        if (result[0]?.treatment) {
          backColor = "#15b315";
        }
        break;
      default:
        null;
    }
  }
  // var badgeMap = (
  //   <span
  //     style={{ backgroundColor: backColor, color: "white" }}
  //     className={`mt-2 ${styles.badgeMeat}`}
  //   >
  //     {value}
  //   </span>
  // );
  return (
    <span
      style={{ backgroundColor: backColor, color: "white" }}
      className={`mt-2 ${styles.badgeMeat}`}
    >
      {value}
    </span>
  );
};

export default getMeatFound;
