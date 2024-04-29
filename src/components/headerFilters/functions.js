import { Avatar } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import CryptoJS from "crypto-js";
import { SVGICON } from "../../jsx/constant/theme";
import TableStyle from "../table/table.module.css";

// for search
export const searchFunction = (
  searchValue,
  setSearch,
  setSentSearch,
  setReceivedSearch,
  setCoderSearch,
  activeTab
) => {
  if (activeTab === "SentReport") {
    setSentSearch(e.target.value);
  } else if (activeTab === "ReceivedReport") {
    setReceivedSearch(e.target.value);
  } else if (activeTab === "CoderReport") {
    setCoderSearch(e.target.value);
  } else {
    setSearch(e.target.value);
  }
};

// for select
export const handleSelector = (option, setSelectedOption) => {
  setSelectedOption(option?.value);
};

export const processstatusBodyTemplate = (rowData) => {
  switch (rowData.processedStatus) {
    case "COMPLETED":
      return (
        <div className="patient-status">
          <span className={`badge processed-text`}>Completed</span>
        </div>
      );

    case "PENDING":
      return (
        <div className="patient-status">
          <span className={`badge processing-text`}>Pending</span>
        </div>
      );

    case "DECLINED":
      return (
        <div className="patient-status">
          <span className={`badge failed-text`} style={{ color: "red" }}>
            Declined
          </span>
        </div>
      );

    case "NOTCOMPUTED":
      return (
        <div className="patient-status">
          <span className={`badge processing-text`}>Not Computed</span>
        </div>
      );

    case "COMPUTED":
      return (
        <div className="patient-status">
          <span className={`badge processing-text`}>Computed</span>
        </div>
      );
    case "HOLD":
      return (
        <div className="patient-status">
          <span className={`badge hold-text`}>Hold</span>
        </div>
      );
    case null:
      return (
        <div className="patient-status">
          <span className={`badge processing-text`}></span>
        </div>
      );
  }
};

// for rangepicker
export const handleRnagePicker = ({
  dates,
  dateString,
  setStartDate,
  setEndDate,
  setSelectedDates,
  activeTab,
  setReceivedStartDate,
  setReceivedEndDate,
  setCoderStartDate,
  setCoderEndDate,
}) => {
  if (dates === null || (Array.isArray(dates) && dates.length === 0)) {
    if (setSelectedDates) {
      setSelectedDates(null);
    }
    if (activeTab === "SentReport" || !activeTab) {
      setStartDate("");
      setEndDate("");
    } else if (activeTab === "ReceivedReport") {
      setReceivedStartDate("");
      setReceivedEndDate("");
    } else if (activeTab === "CoderReport") {
      setCoderStartDate("");
      setCoderEndDate("");
    }
    return;
  }

  const formattedDates =
    dateString?.length > 0 &&
    dateString?.map((data, index) => {
      const formattedDate =
        index === 1
          ? data && `${data}T23:59:59.999Z`
          : data && `${data}T00:00:00.000Z`;

      return formattedDate;
    });
  if (setSelectedDates) {
    setSelectedDates([dayjs(dateString[0]), dayjs(dateString[1])]);
  }
  if (activeTab === "SentReport" || !activeTab) {
    setStartDate(formattedDates[0]);
    setEndDate(formattedDates[1]);
  } else if (activeTab === "ReceivedReport") {
    setReceivedStartDate(formattedDates[0]);
    setReceivedEndDate(formattedDates[1]);
  } else if (activeTab === "CoderReport") {
    setCoderStartDate(formattedDates[0]);
    setCoderEndDate(formattedDates[1]);
  }
};

// if has 2 rangepickers
export const handleRnagePicker2 = ({
  date,
  dateString,
  setStartDate,
  setEndDate,
  setStartDate2,
  setEndDate2,
  setStartDate3,
  setEndDate3,
  setStartDate4,
  setEndDate4,
  setStartDate5,
  setEndDate5,
  setStartDate6,
  setEndDate6,
}) => {
  const formattedDates = dateString?.map((date, index) => {
    const formattedDate =
      index === 1
        ? date && `${date}T23:59:59.999Z`
        : date && `${date}T00:00:00.000Z`;
    return formattedDate;
  });
  if (setStartDate && setEndDate) {
    setStartDate(formattedDates[0]);
    setEndDate(formattedDates[1]);
  }
  if (setStartDate2 && setEndDate2) {
    setStartDate2(formattedDates[0]);
    setEndDate2(formattedDates[1]);
  }
  if (setStartDate3 && setEndDate3) {
    setStartDate3(formattedDates[0]);
    setEndDate3(formattedDates[1]);
  }
  if (setStartDate4 && setEndDate4) {
    setStartDate4(formattedDates[0]);
    setEndDate4(formattedDates[1]);
  }
  if (setStartDate5 && setEndDate5) {
    setStartDate5(formattedDates[0]);
    setEndDate5(formattedDates[1]);
  }
  if (setStartDate6 && setEndDate6) {
    setStartDate6(formattedDates[0]);
    setEndDate6(formattedDates[1]);
  }
};

export const dateFormate = (dayjs, date) => {
  return date ? dayjs(date).format("MM-DD-YYYY") : <div>---</div>;
};

//sorting
export const sortFunction = (sortDir, setSortDir, setSort, field) => {
  setSortDir(sortDir === "ASC" ? "DESC" : "ASC");
  setSort({ sortDir: sortDir === "ASC" ? "DESC" : "ASC", sortField: field });
};
export const priorityOptions = [
  {
    value: "URGENT",
    label: (
      <>
        <i>{SVGICON.alert}</i>{" "}
        <span style={{ fontSize: "13px", color: "red" }}>Urgent</span>{" "}
      </>
    ),
  },
  {
    value: "HIGH",
    label: (
      <>
        <i className={TableStyle.highFlag}>{SVGICON.alert}</i>
        <span style={{ fontSize: "13px", color: "#cf940a" }}>High</span>{" "}
      </>
    ),
  },
  {
    value: "NORMAL",
    label: (
      <>
        <i className={TableStyle.normalFlag}>{SVGICON.alert}</i>
        <span style={{ fontSize: "13px", color: "#4466ff " }}>Normal</span>{" "}
      </>
    ),
  },
  {
    value: "LOW",
    label: (
      <>
        <i className={TableStyle.lowFlag}>{SVGICON.alert}</i>{" "}
        <span style={{ fontSize: "13px", color: "#87909e" }}>Low</span>{" "}
      </>
    ),
  },
];

export const priorityStatus = (value) => {
  switch (value) {
    case "URGENT":
      return (
        <>
          <i>{SVGICON.alert}</i>{" "}
          <span style={{ fontSize: "13px", color: "red" }}>Urgent</span>{" "}
        </>
      );
    case "HIGH":
      return (
        <>
          <i className={TableStyle.highFlag}>{SVGICON.alert}</i>
          <span style={{ fontSize: "13px", color: "#cf940a" }}>High</span>{" "}
        </>
      );
    case "NORMAL":
      return (
        <>
          <i className={TableStyle.normalFlag}>{SVGICON.alert}</i>
          <span style={{ fontSize: "13px", color: "#4466ff " }}>
            Normal
          </span>{" "}
        </>
      );
    case "LOW":
      return (
        <>
          <i className={TableStyle.lowFlag}>{SVGICON.alert}</i>{" "}
          <span style={{ fontSize: "13px", color: "#87909e" }}>Low</span>{" "}
        </>
      );
    default:
      break;
  }
};

export const generateOptionsList = (items) => {
  if (!items?.data) {
    return [{ label: "Loading...", value: "Loading..." }];
  } else {
    const options = [
      { label: "All", value: "" },
      ...items?.data?.data?.response?.map((item) => ({
        label: (
          <span>
            {item?.firstName}&nbsp;&nbsp;{item?.lastName}
          </span>
        ),
        value: item?.userName,
      })),
    ].filter(Boolean);
    return options;
    // }
  }
};
export const generateOptionsLists = (items) => {
  if (!items?.data) {
    return [{ label: "Loading...", value: "Loading..." }];
  } else {
    const options = [
      { label: "All", value: "" },
      ...items?.data?.data?.response?.map((item) => ({
        label: (
          <span>
            {item?.patientAllocatedFirstName}&nbsp;&nbsp;
            {item?.patientAllocatedLastName}
          </span>
        ),
        value: item?.patientAllocated,
      })),
    ].filter(Boolean);
    return options;
  }
};

export const getBackgroundColor = (randomNumber) => {
  switch (randomNumber) {
    case 1:
      return "#F28585";
    case 2:
      return "#04306F";
    case 3:
      return "#E6A4B4";
    case 4:
      return "#607274";
    case 5:
      return "#DED0B6";
    case 6:
      return "#C3E2C2";
    default:
      return "#9BB8CD";
  }
};

export const renderUserPrfoile = (
  firstName,
  lastName,
  imageUrl,
  field,
  width,
  height
) => {
  const firstNameInitial = firstName?.charAt(0) || "";
  const secondNameInitial = lastName?.charAt(0) || "";
  const hash = (firstNameInitial.charCodeAt(0) % 6) + 1;
  const backgroundColor = field ? getBackgroundColor(hash) : "#F3C217";

  if (!imageUrl) {
    const profileAvatar = (
      <Avatar
        style={{
          backgroundColor: backgroundColor,
          color: "white",
          cursor: "pointer",
          width: width ? width : "47px",
          height: height ? height : "47px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
          fontWeight: 700,
        }}
      >
        {firstNameInitial?.toUpperCase() + secondNameInitial?.toUpperCase()}
      </Avatar>
    );
    return profileAvatar;
  } else {
    const profileAvatar = (
      <img
        src={imageUrl}
        alt="avatar"
        // className="rounded-4 shadow-4"
        style={{
          width: width ? width : "50px",
          height: height ? height : "50px",
          borderRadius: "50%",
          // objectFit: "cover"
        }}
      />
    );
    return profileAvatar;
  }
};
export const renderUserPrfoileAvatar = (
  firstName,
  lastName,
  imageUrl,
  field
) => {
  const firstNameInitial = firstName?.charAt(0) || "";
  const secondNameInitial = lastName?.charAt(0) || "";
  const hash = (firstNameInitial.charCodeAt(0) % 6) + 1;
  const backgroundColor = field ? getBackgroundColor(hash) : "#F3C217";

  if (!imageUrl) {
    const profileAvatar = (
      <Avatar
        style={{
          backgroundColor: backgroundColor,
          color: "white",
          cursor: "pointer",
          width: "30px",
          height: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "15px",
          fontWeight: 500,
        }}
      >
        {firstNameInitial?.toUpperCase() + secondNameInitial?.toUpperCase()}
      </Avatar>
    );
    return profileAvatar;
  } else {
    const profileAvatar = (
      <img
        src={imageUrl}
        alt="avatar"
        // className="rounded-4 shadow-4"
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        }}
      />
    );
    return profileAvatar;
  }
};

export const renderUserPrfoileAvatarDisabled = (
  firstName,
  lastName,
  imageUrl,
  field
) => {
  const firstNameInitial = firstName?.charAt(0) || "";
  const secondNameInitial = lastName?.charAt(0) || "";

  if (!imageUrl) {
    const profileAvatar = (
      <Avatar
        style={{
          backgroundColor: "gray",
          color: "white",
          cursor: "pointer",
          width: "30px",
          height: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "15px",
          fontWeight: 500,
        }}
      >
        {firstNameInitial?.toUpperCase() + secondNameInitial?.toUpperCase()}
      </Avatar>
    );
    return profileAvatar;
  } else {
    const profileAvatar = (
      <img
        src={imageUrl}
        alt="avatar"
        // className="rounded-4 shadow-4"
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        }}
      />
    );
    return profileAvatar;
  }
};

export const renderUserPrfoileAvatarCustom = (
  firstName,
  lastName,
  imageUrl,
  field,
  width,
  height
) => {
  const firstNameInitial = firstName?.charAt(0) || "";
  const secondNameInitial = lastName?.charAt(0) || "";
  const hash = (firstNameInitial.charCodeAt(0) % 6) + 1;
  const backgroundColor = field ? getBackgroundColor(hash) : "#F3C217";

  if (!imageUrl) {
    const profileAvatar = (
      <Avatar
        style={{
          backgroundColor: backgroundColor,
          color: "white",
          cursor: "pointer",
          width: width,
          height: height,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "15px",
          fontWeight: 500,
        }}
      >
        {firstNameInitial?.toUpperCase() + secondNameInitial?.toUpperCase()}
      </Avatar>
    );
    return profileAvatar;
  } else {
    const profileAvatar = (
      <img
        src={imageUrl}
        alt="avatar"
        // className="rounded-4 shadow-4"
        style={{
          width: width,
          height: height,
          borderRadius: "50%",
        }}
      />
    );
    return profileAvatar;
  }
};

export const getSelectedDaysCount = (DateRanges) => {
  const startDate = new Date(
    moment(DateRanges?.startDate).format("YYYY-MM-DD")
  );
  const endDate = new Date(moment(DateRanges?.endDate).format("YYYY-MM-DD"));

  const differenceMs = Math.abs(endDate - startDate);

  const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
  return differenceDays;
};

export const disableFutureDate = (current) => {
  return current && current.isAfter(moment());
};

export const disablePastDate = (current) => {
  return current && current.isBefore(moment().subtract(1, "day"));
};

export const capitalizeFirstLetter = (string) => {
  const formattedString = string?.toLowerCase();
  return formattedString?.charAt(0).toUpperCase() + formattedString.slice(1);
};

export const handleTogglePasswordVisibility = (
  showPassword,
  setShowPassword
) => {
  setShowPassword(!showPassword);
};

export const getValidatePassword = (password, setErrors) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  if (password.length === 0) {
    setErrors({
      password: "Please enter the password",
    });
    return false;
  }
  if (password.length < 8) {
    setErrors({
      password: "Password should be greater than 8 characters",
    });
    return false;
  }
  if (password.length > 14) {
    setErrors({
      password: "Password should be less than 14 characters",
    });
    return false;
  }
  if (password.length > 0 && !passwordRegex.test(password)) {
    setErrors({
      password:
        "Password must contain at least 1 capital letter, 1 small letter, 1 number, and 1 special character",
    });
    return false;
  }

  return true;
};

export const validateConfirmPassword = (
  password,
  confirmPassword,
  setErrors,
) => {
  if (password !== confirmPassword) {
    setErrors({
      email: "",
      confirmPass: "Passwords do not match",
    });
    return false;
  }

  return true;
};

export const validateYear = (year, setErrors) => {
  const yearPattern = /^\d{4}$/;
  const correctYear = parseInt(year) > 0;
  const currentYear = new Date().getFullYear();

  if (year?.length === 0) {
    setErrors({
      year: "Please enter year",
    });

    return false;
  }
  if (!yearPattern.test(year) && !correctYear) {
    setErrors({
      year: "Please enter a valid 4-digit positive year",
    });
    return false;
  }
  if (year > currentYear || year?.length < 4) {
    setErrors({
      year: "Please enter a valid year",
    });
    return false;
  }

  return true;
};
const encryptData = (data, key, iv) => {
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
  const ivUtf8 = CryptoJS.enc.Utf8.parse(iv);

  const encrypted = CryptoJS.AES.encrypt(data, keyUtf8, {
    iv: ivUtf8,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};
function generateRandomString() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

export const encyptingPass = (password) => {
  const plaintextData = password;
  const encryptionKey = "B27AA05B9A2490D1AE59B33B45CFD4B0"; // Should be 16, 24, or 32 bytes
  const initializationVector = generateRandomString(); // Should be 16 bytes
  const encryptedData = encryptData(
    plaintextData,
    encryptionKey,
    initializationVector
  );
  const values = { pass: encryptedData, iv: initializationVector };
  return values;
};


export const getDateAndTime = (date) => {
  return moment(date).format('MM/DD/YYYY h:mm A')
}