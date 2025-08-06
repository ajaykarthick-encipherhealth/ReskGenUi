import React from "react";
import AppChart from "../appchart";
import ChartHeader from "../chartheader";

const GroupCard = ({ charts,chartType,dates }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: 16,
        height: "100%",
      }}
    >
      {charts?.map((item, id) => {
        const getColSpan = (cls = "") => {
          const match = cls.split(" ").find((c) => c.startsWith("col-"));
          return match ? +match.replace("col-", "") : 1;
        };

        const getRowSpan = (cls = "") => {
          const match = cls.split(" ").find((c) => c.startsWith("row-"));
          return match ? +match.replace("row-", "") : 1;
        };

        const style = {
          gridColumn: `span ${getColSpan(item.size)}`,
          gridRow: `span ${getRowSpan(item.size)}`,
          height: "100%",
        };

        return (
          <div key={id} style={style}>
            {item.customHeader && (
              <ChartHeader customHeader={item.customHeader} />
            )}
            <AppChart
              key={id}
            type={item.type === "chartType" ? chartType : item.type}
              title={item.title}
              series={item.series}
              categories={item.categories}
              height={item?.height}
              chartBackground={item?.chartBackground}
              showLegendBarLine={(id == 0 && item.series.length > 1) ? true : false}
              dates={dates}
            />
          </div>
        );
      })}
    </div>
  );
};

export default GroupCard;
