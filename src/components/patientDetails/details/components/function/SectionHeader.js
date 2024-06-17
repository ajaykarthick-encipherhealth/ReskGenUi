import { Popover } from "antd";
import visitStyles from "../../../../../styles/visitdata.module.css";
import { stringToColour } from "./ReusableFunctions";

export const getSectionHeaderBackground = ({ value }) => {
  return value?.map((res, index) => {
    if (index < 2) {
      var sectionMapArr = res ? (
        <span
          style={{
            background: stringToColour(res) + 33,
            color: stringToColour(res),
          }}
          className={`cr-pointer mt-2 text-start ${visitStyles.captureheader}`}
        >
          {res}
        </span>
      ) : (
        ""
      );
      return sectionMapArr;
    } else if (value.length - 1 == index) {
      var sectionMapArr = (
        <Popover
          content={
            <>
              {value?.map((item, i) =>
                i > 1 ? (
                  <span
                    style={{
                      background: stringToColour(item) + 33,
                      color: stringToColour(item),
                    }}
                    className={`cr-pointer mt-2 text-start ${visitStyles.captureheader}`}
                  >
                    {item}
                  </span>
                ) : null
              )}
            </>
          }
          trigger={["hover"]}
          placement="bottom"
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
  });
};

const SectionHeaders = () => {
  return <></>;
};

export default SectionHeaders;
