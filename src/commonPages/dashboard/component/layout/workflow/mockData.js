import { getFormattedChartData } from "../../function";
import AppChart from "../../appchart";
import AccuracyChart from "../../accuracyChart";
import StatCard from "../../statChart";
import processing from "../../../../../images/tenantAdmin/processing.svg";
import failed from "../../../../../images/tenantAdmin/failed.svg";
import completed from "../../../../../images/tenantAdmin/completed.svg";
import styles from "../../../reviewerStyles.module.css";
import Buttonscroller from "../../../../../components/buttonSroller";
import upload from "../../../../../images/tenantAdmin/upload.svg";
import { faGaugeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Notifications from "../../notifications";
import {
  getColorValue,
  getStatusColor,
  getRoleColor,
} from "../../../../../utils/reusable";
import uploadContainer from "../../../../../images/dashboard/uploadContainer.png";
import processingContainer from "../../../../../images/dashboard/processingContainer.png";
import completedContainer from "../../../../../images/dashboard/completedContainer.png";
import failedContainer from "../../../../../images/dashboard/failedContainer.png";
import CardSkeleton from "../../../../../components/skeleton/card";

const statCardsData = [
  {
    icon: upload,
    title: "Upload",
    value: 293,
    bgColor: uploadContainer,
  },
  {
    icon: processing,
    title: "Processing",
    value: 4,
    bgColor: processingContainer,
  },
  {
    icon: completed,
    title: "Completed",
    value: 293,
    bgColor: completedContainer,
  },
  {
    icon: failed,
    title: "Failed",
    value: 4,
    bgColor: failedContainer,
  },
];

const TabButtons = [
  {
    id: 1,
    title: "CogentAI Accuracy",
  },
  {
    id: 2,
    title: "Organization Quality",
  },
];

const dummyData = [
  {
    id: 1,
    content: "Test notification 1 from dummy",
    createdDate: new Date().toISOString(),
    fromUserDetails: {
      firstName: "Priya",
      lastName: "V",
      role: "Developer",
    },
  },
  {
    id: 2,
    content: "System update scheduled",
    createdDate: new Date().toISOString(),
    fromUserDetails: {
      firstName: "Rahul",
      lastName: "Sharma",
      role: "Admin",
    },
  },
];
export const OrgPieChartInfo = ({ chartType, chartChange }) => {
  const OrgPieChartSeries = [
    { name: "Three Gen", value: 5, color: getColorValue("1") },
    { name: "Health Med Pro", value: 10, color: getColorValue("3") },
    { name: "Encipher Health", value: 13, color: getColorValue("6") },
    { name: "Vanguard", value: 6, color: getColorValue("4") },
    { name: "Cogent Health", value: 15, color: getColorValue("2") },
  ];
  const {
    categories: OrgPieChartCategories,
    formattedSeries: OrgPieChartFormatted,
    height: OrgPieChartHeight,
    legendData: OrePieChartLegendData,
  } = getFormattedChartData(OrgPieChartSeries, chartType);
  return chartChange ? (
    <div className="">
      <CardSkeleton count={1} height={200} />
    </div>
  ) : (
    <AppChart
      type={chartType}
      categories={OrgPieChartCategories}
      series={OrgPieChartFormatted}
      legendData={OrePieChartLegendData}
      height={300}
      showLegend={true}
      radius={["55%", "60%"]}
      showLabel={true}
      xAxisRotated={true}
    />
  );
};

export const WorkFlowFiles = ({ chartType }) => {
  return (
    <>
      <div className="d-flex justify-content-between w-100 flex-wrap gap-3">
        {statCardsData.map((card) => (
          <StatCard
            key={card.title}
            icon={card.icon}
            title={card.title}
            value={card.value}
            bgColor={card.bgColor}
            padding="16px"
            minWidth="200px"
            gap="12px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="14px"
            height="60px"
            fontSize="20px"
            fontWeight={700}
            textColor={"white"}
            textAlign="center"
            border="4px solid #B3B3B3"
          />
        ))}
      </div>

      <AppChart
        type={chartType}
        categories={[
          "June 19",
          "June 21",
          "June 23",
          "June 25",
          "June 27",
          "June 29",
          "Jul 01",
          "Jul 03",
          "Jul 05",
        ]}
        series={[
          {
            name: "Completed",
            data: [12, 13, 25, 8, 10, 25, 8, 13, 27],
            color: getColorValue("5"),
          },
          {
            name: "Processing",
            data: [5, 20, 25, 5, 20, 25, 5, 20, 25],
            color: getColorValue("7"),
          },
          {
            name: "Failed",
            data: [10, 15, 30, 10, 15, 30, 10, 15, 30],
            color: getColorValue("1"),
          },
        ]}
      />
    </>
  );
};

export const AllocatedStatus = ({ chartType, chartChange }) => {
  const allocatedSeries = [
    { name: "Allocated", value: 210, color: getStatusColor("1") },
    { name: "Not Allocated", value: 0, color: getStatusColor("2") },
  ];

  const {
    categories: allocatedCategories,
    formattedSeries: allocatedFormatted,
    height: allocatedHeight,
  } = getFormattedChartData(allocatedSeries, chartType);

  return chartChange ? (
    <div className="">
      <CardSkeleton count={1} height={200} />
    </div>
  ) : (
    <AppChart
      type={chartType}
      categories={allocatedCategories}
      series={allocatedFormatted}
      height={allocatedHeight}
      showLegend={true}
      showLegendBarLine={false}
    />
  );
};

export const Coder1 = ({ chartType, chartChange }) => {
  const coder1Series = [
    { name: "Allocated", value: 2, color: getStatusColor("1") },
    { name: "Completed", value: 3, color: getStatusColor("2") },
    { name: "InProgress", value: 5, color: getStatusColor("7") },
    { name: "ReassignedPending", value: 4, color: getStatusColor("4") },
    { name: "ReassignedCompleted", value: 6, color: getStatusColor("5") },
  ];

  const {
    categories: coder1Categories,
    formattedSeries: coder1Formatted,
    height: coder1Height,
  } = getFormattedChartData(coder1Series, chartType);

      return chartChange ? (
        <div className="">
          <CardSkeleton count={1} height={200}/>
        </div>
      ) : (
        <AppChart
          type={chartType}
          categories={coder1Categories}
          series={coder1Formatted}
          height={coder1Height}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated ={true}
        />
      );
}

export const Coder2 = ({ chartType, chartChange }) => {
  const coder2Series = [
    { name: "Allocated", value: 3, color: getStatusColor("1") },
    { name: "Completed", value: 2, color: getStatusColor("2") },
    { name: "InProgress", value: 5, color: getStatusColor("7") },
    { name: "ReassignedPending", value: 6, color: getStatusColor("4") },
    { name: "ReassignedCompleted", value: 1, color: getStatusColor("5") },
    { name: "QueriedApproved", value: 4, color: getStatusColor("3") },
    { name: "QueriedPending", value: 7, color: getStatusColor("6") },
  ];
  const {
    categories: coder2Categories,
    formattedSeries: coder2Formatted,
    height: coder2Height,
  } = getFormattedChartData(coder2Series, chartType);

      return chartChange ? (
        <div className="">
          <CardSkeleton count={1} height={200}/>
        </div>
      ) : (
        <AppChart
          type={chartType}
          categories={coder2Categories}
          series={coder2Formatted}
          height={coder2Height}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated ={true}
        />
      );
}

export const QA = ({ chartType, chartChange }) => {
  const QASeries = [
    { name: "Allocated", value: 3, color: getStatusColor("1") },
    { name: "Completed", value: 6, color: getStatusColor("2") },
    { name: "InProgress", value: 2, color: getStatusColor("7") },
    { name: "ReassignedPending", value: 5, color: getStatusColor("4") },
    { name: "ReassignedCompleted", value: 2, color: getStatusColor("5") },
    { name: "QueriedApproved", value: 6, color: getStatusColor("3") },
    { name: "QueriedPending", value: 7, color: getStatusColor("6") },
  ];
  const {
    categories: QACategories,
    formattedSeries: QAFormatted,
    height: QAHeight,
  } = getFormattedChartData(QASeries, chartType);

      return chartChange ? (
        <div className="">
          <CardSkeleton count={1} height={200}/>
        </div>
      ) : (
        <AppChart
          type={chartType}
          categories={QACategories}
          series={QAFormatted}
          height={QAHeight}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated ={true}
        />
      );
}

export const ProjectLead = ({ chartType, chartChange }) => {
  const PLSeries = [
    { name: "Allocated", value: 3, color: getStatusColor("1") },
    { name: "Completed", value: 7, color: getStatusColor("2") },
    { name: "InProgress", value: 4, color: getStatusColor("7") },
    { name: "ReassignedPending", value: 2, color: getStatusColor("4") },
    { name: "ReassignedCompleted", value: 7, color: getStatusColor("5") },
    { name: "QueriedApproved", value: 4, color: getStatusColor("3") },
    { name: "QueriedPending", value: 2, color: getStatusColor("6") },
  ];
  const {
    categories: PLCategories,
    formattedSeries: PLFormatted,
    height: PLHeight,
  } = getFormattedChartData(PLSeries, chartType);

      return chartChange ? (
        <div className="">
          <CardSkeleton count={1} height={200}/>
        </div>
      ) : (
        <AppChart
          type={chartType}
          categories={PLCategories}
          series={PLFormatted}
          height={PLHeight}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated ={true}
        />
      );
}

export const QALead = ({ chartType, chartChange }) => {
  const QALeadSeries = [
    { name: "Allocated", value: 3, color: getStatusColor("1") },
    { name: "Completed", value: 6, color: getStatusColor("2") },
    { name: "InProgress", value: 3, color: getStatusColor("7") },
    { name: "ReassignedPending", value: 7, color: getStatusColor("4") },
    { name: "ReassignedCompleted", value: 8, color: getStatusColor("5") },
    { name: "QueriedApproved", value: 9, color: getStatusColor("3") },
    { name: "QueriedPending", value: 10, color: getStatusColor("6") },
  ];
  const {
    categories: QALeadCategories,
    formattedSeries: QALeadFormatted,
    height: QALeadHeight,
  } = getFormattedChartData(QALeadSeries, chartType);

      return chartChange ? (
        <div className="">
          <CardSkeleton count={1} height={200}/>
        </div>
      ) : (
        <AppChart
          type={chartType}
          categories={QALeadCategories}
          series={QALeadFormatted}
          height={QALeadHeight}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated ={true}
        />
      );
}

export const Owner = ({ chartType, chartChange }) => {
  const OwnerSeries = [
    { name: "Allocated", value: 5, color: getStatusColor("1") },
    { name: "Completed", value: 3, color: getStatusColor("2") },
    { name: "InProgress", value: 8, color: getStatusColor("7") },
    { name: "ReassignedPending", value: 2, color: getStatusColor("4") },
    { name: "ReassignedCompleted", value: 8, color: getStatusColor("5") },
    { name: "QueriedApproved", value: 3, color: getStatusColor("3") },
    { name: "QueriedPending", value: 6, color: getStatusColor("6") },
  ];
  const {
    categories: OwnerCategories,
    formattedSeries: OwnerFormatted,
    height: OwnerHeight,
  } = getFormattedChartData(OwnerSeries, chartType);

      return chartChange ? (
        <div className="">
          <CardSkeleton count={1} height={200}/>
        </div>
      ) : (
        <AppChart
          type={chartType}
          categories={OwnerCategories}
          series={OwnerFormatted}
          height={OwnerHeight}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated ={true}
        />
      );
}

export const Users = ({ chartType, chartChange }) => {
  const UsersSeries = [
    { name: "Admin", value: 2, color: getRoleColor("1") },
    { name: "Coder 1", value: 6, color: getRoleColor("2") },
    { name: "Coder 2", value: 8, color: getRoleColor("3") },
    { name: "QA", value: 12, color: getRoleColor("4") },
    { name: "QA Lead", value: 4, color: getRoleColor("5") },
    { name: "Project Lead", value: 13, color: getRoleColor("6") },
    { name: "Owner", value: 6, color: getRoleColor("7") },
  ];
  const {
    categories: UsersSeriesCategories,
    formattedSeries: UsersSeriesFormatted,
    height: UsersSeriesHeight,
  } = getFormattedChartData(UsersSeries, chartType);

      return chartChange ? (
        <div className="">
          <CardSkeleton count={1} height={200}/>
        </div>
      ) : (
        <AppChart
          type={chartType}
          categories={UsersSeriesCategories}
          series={UsersSeriesFormatted}
          height={UsersSeriesHeight}
          showLegend={true}
          showLegendBarLine={false}
          xAxisRotated ={true}
        />
      );
}

export const Accuracy = ({ chartType, chartChange }) => {
  return (
    <>
      <div
        style={{
          margin: "20px 20px 0px 0px",
          display: "flex",
        }}
        className="d-flex justify-content-end"
      >
        <div>
          <Buttonscroller
            Buttons={TabButtons}
            handleButtonClick={() => {}}
            activeButton={0}
            activeColor="#fff"
            inActiveColor="#000000"
            activeBg="#2472FF"
            // inActiveBg="#E6EEFF"
            containerBg="#E6EEFF"
            width="150px"
          />
        </div>
      </div>
      <div className="row">
        <div className="col-9">
          <AccuracyChart
            type="column"
            xAxisFontColor="Gray"
            LeftYaxisFont="black"
            yAxis1Title="Accuracy Changes Count"
            yAxis2Title="Accuracy Changes Count"
            yAxisFont1="#2CAFFE"
            yAxisFont2="#2472FF"
            rightYaxisFont="black"
            series={[
              {
                name: "Total Codes Count",
                data: [
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 20,
                  16, 8, 0, 0, 0, 1, 0, 0, 0,
                ],
                color: "#2472FF",
                yAxis: 1,
                type: "column",
              },
              {
                name: "Engine Score",
                data: [
                  100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
                  100, 80, 96, 100, 100, 100, 64, 79, 84, 100, 100, 100, 93,
                  100, 100, 100,
                ],
                color: "#2CAFFE",
                yAxis: 0,
                type: "spline",
              },
            ]}
          />
        </div>
        <div className="col-3 my-4">
          <div
            style={{
              height: "200px",
              borderRadius: "8px",
              boxShadow: "0 0px 3px 0 rgba(0, 0, 0, 0.2)",
              border: "0.5px solid #3479FE",
              backgroundColor: "#F0F6FF",
            }}
            className="w-100"
          >
            <div className="p-4">
              <div className="d-flex justify-content-center py-2">
                <FontAwesomeIcon
                  className={`mt-1 ${styles.Img}`}
                  icon={faGaugeHigh}
                />
                <div className={styles.heading}>Accuracy</div>
              </div>
              <div className={styles.percentage}>
                <h1 className="fw-bold">93%</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const Notificatin = () => {
  return (
    <div className="py-2">
      <Notifications useDummyData={true} dummyNotificationData={dummyData} />
    </div>
  );
};
