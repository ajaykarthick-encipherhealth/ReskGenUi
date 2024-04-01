import moment from "moment";
import { renderUserPrfoileAvatar } from "../headerFilters/functions";
import Style from "./table.module.css";
import AppPagination from "./pagination";
import { reusableElipses } from "../../pages/physician/comparison/content/ValidHcc";

const AppTable = ({
  data,
  column,
  status,
  totalElements,
  paginationFirst,
  onPageChange,
}) => {
  return (
    <div className={Style.classContaineer}>
      <table className={Style.classTable}>
        <thead className={Style.classThead}>
          <tr>
            {column.map((item, index) => (
              <TableHeadItem item={item} />
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <TableRow item={item} column={column} status={status} />
          ))}
        </tbody>
      </table>
      <AppPagination
        paginationFirst={paginationFirst}
        totalElements={totalElements}
        onPageChange={onPageChange}
      />
    </div>
  );
};

const TableHeadItem = ({ item }) => <th align="center">{item.name}</th>;
const TableRow = ({ item, column, status }) => {
  return (
    <tr>
      {column.map((columnItem, index) => {
        if (columnItem.isImage) {
          return (
            <td
              className={
                index == 0
                  ? Style.firstTdBorder
                  : column.length - 1 == index
                  ? Style.lastBorder
                  : Style.childBorder
              }
            >
              {item[`${columnItem.value.first}`] ||
              item[`${columnItem.value.last}`] ||
              item[`${columnItem.value.img}`] ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ marginRight: "10px" }}>
                    {renderUserPrfoileAvatar(
                      item[`${columnItem.value.first}`],
                      item[`${columnItem.value.last}`],
                      item[`${columnItem.value.img}`],
                      "header"
                    )}
                  </span>
                  <span>
                    {item[`${columnItem.value.first}`]}{" "}
                    {item[`${columnItem.value.last}`]}
                  </span>
                </div>
              ) : (
                <div style={{ paddingLeft: "50px" }}>---</div>
              )}
            </td>
          );
        }

        if (columnItem.isSingleRow) {
          return (
            <td
              className={
                index == 0
                  ? Style.firstTdBorder
                  : column.length - 1 == index
                  ? Style.lastBorder
                  : Style.childBorder
              }
            >
              <div> {item[`${columnItem.value.id}`]} </div>
              <div> {item[`${columnItem.value.name}`]} </div>
            </td>
          );
        }

        if (columnItem.isDate) {
          return (
            <td
              className={
                index == 0
                  ? Style.firstTdBorder
                  : column.length - 1 == index
                  ? Style.lastBorder
                  : Style.childBorder
              }
            >
              {moment(item[`${columnItem.value}`]).format("MM-DD-YYYY")}
            </td>
          );
        }
        if (columnItem.isStatus) {
          return (
            <td
              className={
                index == 0
                  ? Style.firstTdBorder
                  : column.length - 1 == index
                  ? Style.lastBorder
                  : Style.childBorder
              }
            >
              {status(item[`${columnItem.value}`])}
            </td>
          );
        }
        return (
          <td
            className={
              index == 0
                ? Style.firstTdBorder
                : column.length - 1 == index
                ? Style.lastBorder
                : Style.childBorder
            }
          >
            {reusableElipses(item[`${columnItem.value}`], 30)}
            {/* {item[`${columnItem.value}`]} */}
          </td>
        );
      })}
    </tr>
  );
};

export default AppTable;
