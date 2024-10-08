import { CalendarOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import moment from "moment";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { stringToColour } from "./ReusableFunctions";

export const getDateOfServiceBackground = ({ value }) => {
  return Array.isArray(value) ? (
    value?.map((res, index) => {
      if (index < 2) {
        var sectionMapArr = res ? (
          <span
            style={{
              borderColor: stringToColour(res) + 33,
              color: stringToColour(res),
              border: "1px solid",
            }}
            className={`cr-pointer mt-2 text-start ${visitStyles.encounterDate}`}
          >
            <i>
              <CalendarOutlined
                className={visitStyles.calenderIconNew}
                style={{
                  size: 10,
                  color: stringToColour(res),
                }}
              />
            </i>
            {moment(res).format("MMM DD")}
          </span>
        ) : (
          ""
        );
        return sectionMapArr;
      } else if (Array.isArray(value) && value.length - 1 == index) {
        var sectionMapArr = (
          <Popover
            content={
              <>
                {value?.map((item, i) =>
                  i > 1 ? (
                    <span
                      style={{
                        borderColor: stringToColour(item) + 33,
                        color: stringToColour(item),
                        border: "1px solid",
                      }}
                      className={`cr-pointer mt-2 text-start ${visitStyles.encounterDate}`}
                    >
                      <i>
                        <CalendarOutlined
                          className={visitStyles.calenderIconNew}
                          style={{
                            size: 10,
                            color: stringToColour(item),
                          }}
                        />
                      </i>
                      {moment(item).format("MMM DD")}
                    </span>
                  ) : null
                )}
              </>
            }
            trigger={["hover"]}
            placement="bottom"
            overlayStyle={{ zIndex: 9999 }}
          >
            <span
              style={{
                background: "#a0b1a0",
                color: "#fff",
              }}
              className={`mt-2 text-start cr-pointer ${visitStyles.captureheader}`}
            >
              {value.length - 2}+
            </span>
          </Popover>
        );

        return sectionMapArr;
      }
    })
  ) : (
    <span
      style={{
        borderColor: stringToColour(value) + 33,
        color: stringToColour(value),
        border: "1px solid",
      }}
      className={`cr-pointer mt-2 text-start ${visitStyles.encounterDate}`}
    >
      <i>
        <CalendarOutlined
          className={visitStyles.calenderIconNew}
          style={{
            size: 10,
            color: stringToColour(value),
          }}
        />
      </i>
      {moment(value).format("MMM DD")}
    </span>
  );
};

const DateOfServices = () => {
  return <></>;
};

export default DateOfServices;
