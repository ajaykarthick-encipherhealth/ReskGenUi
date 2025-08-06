import AppChart from "../../appchart";
import teleVisit from "../../../../../../src/images/invalid/televisit.webp";
import scope from "../../../../../../src/images/invalid/scope.webp";
import inValid from "../../../../../../src/images/invalid/invalid.webp";
import imProper from "../../../../../../src/images/invalid/improper.webp";
import multiple from "../../../../../../src/images/invalid/multiple.webp";
import mrn from "../../../../../../src/images/invalid/mrn.webp";
import illegal from "../../../../../../src/images/invalid/illelegal.webp";
import dos1 from "../../../../../../src/images/invalid/calenderDos1.webp";
import teleVisitNew from "../../../../../../src/images/invalid/televisitnew.webp";
import invalidNew from "../../../../../../src/images/invalid/invalidnew.webp";
import dosnew from "../../../../../../src/images/invalid/calender1.webp";
import multipleNew from "../../../../../../src/images/invalid/multiplenew.webp";
import mrnNew from "../../../../../../src/images/invalid/mrnnew.webp";
import illegalNew from "../../../../../../src/images/invalid/illelegalnew.webp";
import scopeNew from "../../../../../../src/images/invalid/scopenew.webp";
import { getColorValue } from "../../../../../utils/reusable";
import CardSkeleton from "../../../../../components/skeleton/card";
import { formatKValue, toFixedNum } from "../../function";

const categoriesDate = [
  "Feb 26",
  "Mar 1",
  "Mar 4",
  "Mar 7",
  "Mar 9",
  "Mar 13",
  "Mar 16",
];
export const DOSCount = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      categories={categoriesDate}
      series={[
        {
          name: "DOS Count",
          data: [361, 150, 40, 100, 25.6, 24.6, 26],
          color: getColorValue("7"),
          area: chartType === "area",
        },
      ]}
      customHeader={{
        label: "Current / Overall",
        value:
          formatKValue(toFixedNum(732, 2)) +
          " / " +
          formatKValue(toFixedNum(800, 2)),
        images: dosnew,
        background: "#A8ADFF",
        header: "DOS Count",
      }}
    />
  );
};

export const InvalidDocument = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      categories={categoriesDate}
      customHeader={{
        label: "Current / Overall",
        value: 241 + " / " + formatKValue(toFixedNum(4000, 2)),
        images: imProper,
        background: "#FFDCDC",
        header: "Invalid Document",
      }}
      series={[
        {
          name: "Invalid Document",
          data: [36, 28, 40, 33, 31, 37, 36],
          color: getColorValue("5"),
          area: chartType === "area",
        },
      ]}
    />
  );
};

export const Televisit = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: "111 / 200",
        images: teleVisitNew,
        background: "#CDE0FE",
        header: "Televisit (Audio visit) count",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "Televist (Audio Visit) Count",
          data: [14, 19, 10, 16, 12, 20, 20],
          color: getColorValue("4"),
          area: chartType === "area",
        },
      ]}
    />
  );
};

export const InvalidCredentails = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: "76 / 90",
        images: invalidNew,
        background: "#D3F2F8",
        header: "Invalid Credentails",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "Invalid Credentails",
          data: [9, 14, 7, 10, 11, 13, 12],
          color: getColorValue("3"),
          area: chartType === "area",
        },
      ]}
    />
  );
};

export const PatientDOBMismatch = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: "32 / 40",
        images: dos1,
        background: "#D2CCFF",
        header: "Patient DOB Mismatch",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "Patient DOB Mismatch",
          data: [4, 3, 6, 5, 4, 5, 5],
          color: getColorValue("7"),
          area: chartType === "area",
        },
      ]}
    />
  );
};

export const PatientNameMismatch = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: "27 / " + formatKValue(toFixedNum(1000, 2)),
        images: multipleNew,
        background: "#CDE0FE",
        header: "Patient Name Mismatch",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "Patient Name Mismatch",
          data: [3, 4, 2, 5, 3, 4, 6],
          color: getColorValue("4"),
          area: chartType === "area",
        },
      ]}
    />
  );
};

export const ScopeYearMismatch = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: 68 + " / " + formatKValue(toFixedNum(2500, 2)),
        images: scopeNew,
        background: "#D1DAFA",
        header: "Scope Year Mis-match",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "Scope Year Mis-match",
          data: [10, 7, 12, 9, 8, 11, 11],
          color: getColorValue("1"),
          area: chartType === "area",
        },
      ]}
    />
  );
};

export const PatientDeceased = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: "8 / 50",
        images: multipleNew,
        background: "#CDE0FE",
        header: "Patient Deceased",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "Scope Year Mis-match",
          data: [1, 1, 2, 0, 1, 2, 1],
          color: getColorValue("4"),
          area: chartType === "area",
        },
      ]}
    />
  );
};

export const MRNIDMismatch = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: 297 + " / " + formatKValue(toFixedNum(1500, 2)),
        images: mrnNew,
        background: "#D2CCFF",
        header: "MRN ID Mismatch",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "MRN ID Mismatch",
          data: [45, 38, 41, 36, 47, 43, 47],
          color: getColorValue("7"),
          area: chartType === "area",
        },
      ]}
    />
  );
};

export const MultiplePatientFound = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: "5 / 30",
        images: multipleNew,
        background: "#CDE0FE",
        header: "Multiple Patient Found",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "Multiple Patient Found",
          data: [1, 0, 0, 1, 1, 1, 1],
          color: getColorValue("4"),
          area: chartType === "area",
        },
      ]}
    />
  );
};

export const PatientInActive = ({ chartType, chartChange }) => {
  return chartChange ? (
    <CardSkeleton count={1} height={200} />
  ) : (
    <AppChart
      type={chartType}
      customHeader={{
        label: "Current / Overall",
        value: 297 + " / " + formatKValue(toFixedNum(3300, 2)),
        images: illegalNew,
        background: "#D3F2F8",
        header: "Patient In-active",
      }}
      categories={categoriesDate}
      series={[
        {
          name: "Patient In-active",
          data: [1, 1, 1, 1, 1, 0, 0],
          color: getColorValue("3"),
          area: chartType === "area",
        },
      ]}
    />
  );
};
