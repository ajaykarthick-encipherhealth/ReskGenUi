import React, { useEffect, useState } from "react";
import { Empty, message, Popover, Select, Tooltip } from "antd";
import { FlagFilled } from "@ant-design/icons";
import {
  formatDateTime,
  getResponePopup,
  reusableEllipses,
} from "../../../../../utils/reusable";
import { getStatusIcon } from "../../../../reuseableFunctions";
import moment from "moment";

const { Option } = Select;

const DosSelect = ({
  options,
  handleOptions,
  setSearch,
  setFlagContainerActive,
  selectedDate,
  setSelectedDate,
}) => {
  const [open, setOpen] = useState(false);
  const dosData = options?.map((item, i) => ({
    ...item,
    page: item?.fileDetailDTO?.dosSummaries?.find(
      (it) => it?.dos == item?.dateOfService
    ),
    flags: item?.flagsWithColor,
    status: item?.workflow?.status,
  }));
  const selectedRow = dosData?.find(
    (row) => row?.dateOfService === selectedDate
  );

  // useEffect(() => {
  //   const selectedDateExists = dosData?.some(
  //     (item) => item?.dateOfService === selectedDate
  //   );

  //   if ((!selectedDate || !selectedDateExists) && dosData?.length > 0) {
  //     setSelectedDate(dosData[0]?.dateOfService);
  //     // handleOptions(dosData[0]?.dateOfService);
  //     // setSearch({
  //     //   value: dosData[0]?.page?.substring || "",
  //     //   page: dosData[0]?.page?.startPageNumber || 1,
  //     // });
  //   }
  // }, [dosData]);
  useEffect(() => {
    const selectedDateExists = dosData?.some(
      (item) => item?.dateOfService === selectedDate
    );

    if (dosData?.length === 0) {
      setSelectedDate(null);
    } else if ((!selectedDate || !selectedDateExists) && dosData?.length > 0) {
      setSelectedDate(dosData[0]?.dateOfService);
    }
  }, [dosData]);

  const getDos = (item) => (
    <div className="d-flex ant-badge gap-1 align-items-center ">
      <div
        className="ant-badge d-flex gap-1"
        onClick={() => {
          setSearch({
            value: item?.page?.substring || null,
            page: item?.page?.startPageNumber || null,
          });
        }}
      >
        <span>
          {item?.stateIndicators?.includes("CHART") && (
            <span
              className="p-1 rounded-1 ant-badge"
              style={{
                background: "#87d068",
                color: "#fff",
                fontSize: "10px",
              }}
            >
              C
            </span>
          )}
          {item?.stateIndicators?.includes("LAB") && (
            <span
              className="p-1 rounded-2 mx-1 me-2"
              style={{
                background: "#108ee9",
                color: "#fff",
                fontSize: "10px",
              }}
            >
              L
            </span>
          )}
          {item?.stateIndicators?.includes("RADIOLOGY") && (
            <span
              className="p-1 rounded-2 mx-1"
              style={{
                background: "#f50",
                color: "#fff",
                fontSize: "10px",
              }}
            >
              R
            </span>
          )}
        </span>

        <span className="">
          {item?.dateOfService
            ? moment(item?.dateOfService).format("MM-DD-YYYY")
            : "---"}
        </span>
        <span>{getStatusIcon(item?.workflow?.[0]?.status)}</span>
      </div>
    </div>
  );

  const renderSelectedRow = (row) => {
    if (!row) return null;
    return (
      <span className="d-flex w-100 justify-content-between">
        <span>{getDos(row)}</span> |
        <span>
          {" "}
          Pages:{" "}
          {row?.page?.startPageNumber && row?.page?.endPagNumber
            ? row?.page?.startPageNumber + " - " + row?.page?.endPagNumber
            : "---"}
        </span>{" "}
        |{" "}
        <div className="flag-elipse">
          Flags:{" "}
          {row?.flags?.length <= 0
            ? "---"
            : row?.flags?.map((flag, index) => (
                <FlagFilled
                  key={index}
                  style={{
                    color: flag?.flagDetails?.flagColour,
                    marginRight: 6,
                  }}
                />
              ))}
        </div>{" "}
        | {""}
        <div className="flag-elipse">
          <Tooltip title={row?.providerName}> {row?.providerName}</Tooltip>
        </div>
      </span>
    );
  };

  return (
    <Select
      style={{ width: 490 }}
      placeholder="--- Select DOS ---"
      value={selectedDate ? selectedDate : undefined}
      onClear={() => {
        setSelectedDate(null);
        handleOptions("");
        setSearch({
          value: "",
          page: 1,
        });
      }}
      open={open}
      onDropdownVisibleChange={(visible) => setOpen(visible)}
      dropdownRender={() => (
        <div style={{ maxHeight: "250px", overflowY: "auto" }}>
          {dosData?.length === 0 ? (
            <div className="text-center">
              <Empty />
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#002b5b",
                  color: "white",
                }}
              >
                <tr>
                  <th style={{ textAlign: "left", padding: "8px 12px" }}>
                    DOS
                  </th>
                  <th style={{ textAlign: "left", padding: "8px 12px" }}>
                    Page No
                  </th>
                  <th style={{ textAlign: "left", padding: "8px 12px" }}>
                    Flags
                  </th>
                  <th style={{ textAlign: "left", padding: "8px 12px" }}>
                    Provider Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {dosData?.map((item) => (
                  <tr
                    key={item?.dateOfService}
                    style={{
                      backgroundColor:
                        selectedDate === item?.dateOfService
                          ? "#e6f7ff"
                          : "white",
                      cursor: "pointer",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    {/* DOS */}
                    <td
                      style={{
                        padding: "8px 12px",
                        width: "35%",
                        textAlign: "left",
                      }}
                      onClick={() => {
                        setSelectedDate(item?.dateOfService);
                        handleOptions(item?.dateOfService);
                        setOpen(false);
                      }}
                    >
                      {getDos(item)}
                    </td>

                    {/* Page No */}
                    <td style={{ padding: "8px 12px", textAlign: "left" }}>
                      <span
                        onClick={() =>
                          setSearch({
                            value: "",
                            page: item?.page?.startPageNumber,
                          })
                        }
                      >
                        {item?.page?.startPageNumber}
                      </span>
                      <span className="mx-1"> - </span>
                      <span
                        onClick={() =>
                          setSearch({
                            value: "",
                            page: item?.page?.endPagNumber,
                          })
                        }
                      >
                        {item?.page?.endPagNumber}
                      </span>
                    </td>

                    {/* Flags */}
                    <td style={{ padding: "8px 12px", textAlign: "left" }}>
                      {item?.flags?.length === 0 ? (
                        "---"
                      ) : (
                        <>
                          {item?.flags?.slice(0, 1).map((flag, i) => (
                            <Tooltip
                              title={flag?.flagDetails?.flagName || ""}
                              key={i}
                            >
                              <FlagFilled
                                style={{
                                  color: flag?.flagDetails?.flagColour,
                                  marginRight: 6,
                                }}
                                onClick={() => {
                                  setFlagContainerActive("Flag");
                                  setOpen(false);
                                }}
                              />
                            </Tooltip>
                          ))}
                          {item?.flags?.length > 1 && (
                            <Popover
                              title="Additional Flags"
                              overlayStyle={{ zIndex: 9999 }}
                              content={
                                <div>
                                  {item?.flags?.slice(1).map((flag, index) => (
                                    <div key={index}>
                                      <FlagFilled
                                        style={{
                                          color: flag?.flagDetails?.flagColour,
                                          marginRight: 6,
                                        }}
                                        onClick={() => {
                                          setFlagContainerActive("Flag");
                                          setOpen(false);
                                        }}
                                      />
                                      {flag?.flagDetails?.flagName ||
                                        "Unnamed Flag"}
                                    </div>
                                  ))}
                                </div>
                              }
                              placement="top"
                            >
                              <span
                                className="px-2 py-1 border rounded"
                                style={{
                                  background: "#002b5b",
                                  color: "#fff",
                                  cursor: "pointer",
                                }}
                              >
                                +{item?.flags?.length - 1}
                              </span>
                            </Popover>
                          )}
                        </>
                      )}
                    </td>

                    {/* Provider Name */}
                    <td style={{ padding: "8px 12px", textAlign: "left" }}>
                      {reusableEllipses({
                        str: item.providerName?.toString() || "--",
                        count: 13,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    >
      {selectedRow && (
        <Option value={selectedDate}>{renderSelectedRow(selectedRow)}</Option>
      )}
    </Select>
  );
};

export default DosSelect;
