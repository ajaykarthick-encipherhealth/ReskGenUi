import React, { useState } from "react";
import { message, Popover, Select, Tooltip } from "antd";
import { FlagFilled } from "@ant-design/icons";
import { formatDateTime, getResponePopup } from "../../../../../utils/reusable";
import { getStatusIcon } from "../../../../reuseableFunctions";
import moment from "moment";

const { Option } = Select;

const DosSelect = ({
  options,
  handleOptions,
  setSearch,
  setFlagContainerActive,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [open, setOpen] = useState(false);
  const dosData = options?.map((item, i) => ({
    ...item,
    page: item?.fileDetailDTO?.dosSummaries?.find(
      (it) => it?.dos == item?.dateOfService
    ),
    flags: item?.flagsWithColor,
  }));
  const selectedRow = dosData?.find(
    (row) => row?.dateOfService === selectedDate
  );

  const getDos = (item) => (
    <div className="d-flex ant-badge gap-1 align-items-center ">
      <div
        className="ant-badge d-flex align-items-end gap-1"
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
        <span>{getStatusIcon(item?.processedStatus)}</span>
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
          Pages:  {row?.page?.startPageNumber && row?.page?.endPagNumber ? row?.page?.startPageNumber + " - " + row?.page?.endPagNumber : "---"}
        </span>{" "}
        |{" "}
        <div className="flag-elipse">
          Flags:{" "}
          {row?.flags?.length <= 0
            ? "---"
            : row?.flags?.map((flag, index) => (
                <FlagFilled
                  key={index}
                  style={{ color: flag?.flagDetails?.flagColour, marginRight: 6 }}
                />
              ))}
        </div>
      </span>
    );
  };

  return (
    <Select
      style={{ width: 400 }}
      placeholder="--- Select DOS ---"
      allowClear
      value={selectedDate}
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
        <div style={{ padding: 0, maxHeight: "200px", overflowY: "scroll" }}>
          {/* Header row */}
          <div
            style={{
              display: "flex",
              fontWeight: "bold",
              padding: "8px 12px",
              backgroundColor: "#002b5b",
              color: "white",
            }}
          >
            <div style={{ width: "40%" }}>DOS</div>
            <div style={{ width: "20%" }}>Page No</div>
            <div style={{ width: "40%" }}>Flags</div>
          </div>

          {/* Data rows */}
          {dosData?.map((item) => (
            <div
              key={item?.dateOfService}
              style={{
                display: "flex",
                padding: "8px 12px",
                cursor: "pointer",
                borderBottom: "1px solid #f0f0f0",
                alignItems: "center",
                backgroundColor:
                  selectedDate === item?.dateOfService ? "#e6f7ff" : "white",
              }}
            >
              <div
                style={{ width: "40%" }}
                onClick={() => {
                  setSelectedDate(item?.dateOfService);
                  handleOptions(item?.dateOfService);
                  setOpen(false);
                }}
              >
                {getDos(item)}
              </div>
              <div style={{ width: "20%" }}>
                <span
                  onClick={() => {
                    setSearch({
                      value: "",
                      page: item?.page?.startPageNumber,
                    });
                  }}
                >
                  {item?.page?.startPageNumber}
                </span>
                <span className="mx-1">-</span>
                <span
                  onClick={() => {
                    setSearch({
                      value: "",
                      page: item?.page?.endPagNumber,
                    });
                  }}
                >
                  {item?.page?.endPagNumber}
                </span>
              </div>
              <div style={{ width: "40%" }}>
                {item?.flags?.length <= 0 ? (
                  "---"
                ) : item?.flags?.length <= 3 ? (
                  item?.flags.map((flag, i) => (
                    <Tooltip title={flag?.flagDetails?.flagName || ""}>
                      <FlagFilled
                        key={i}
                        style={{
                          color: flag?.flagDetails?.flagColour,
                          marginRight: 6,
                        }}
                        onClick={() => {
                          setFlagContainerActive("Flag");
                          setOpen(false);
                          // if (
                          //   flag?.patientFlag?.hyperlinks &&
                          //   flag?.patientFlag?.hyperlinks[0]
                          // ) {
                          //   const link = flag?.patientFlag?.hyperlinks[0];
                          //   setSearch({
                          //     value: link.substring,
                          //     page: link.pageNumber,
                          //   });
                          // } else {
                          //   getResponePopup({status: "USER_DEFINED_ERROR", message: "Hyperlink Not Found!"})
                          // }
                        }}
                      />
                    </Tooltip>
                  ))
                ) : (
                  <>
                    {" "}
                    <span>
                      {item?.flags?.map(
                        (flag, i) =>
                          i <= 3 && (
                            <FlagFilled
                              key={i}
                              style={{
                                color: flag?.flagDetails?.flagColour,
                                marginRight: 6,
                              }}
                            />
                          )
                      )}
                    </span>
                    <span>
                      {item?.flags?.length - 4 == 0 ? (
                        ""
                      ) : (
                        <span
                          className="px-2 py-1 border rounded"
                          style={{ background: "#002b5b", color: "#fff" }}
                        >
                          {/* <Popover
                            placement="right"
                            content={
                              <>
                                {item.flags.map(
                                  (flag, i) =>
                                    i > 3 && (
                                      <FlagFilled
                                        key={i}
                                        style={{
                                          color: flag.color,
                                          marginRight: 6,
                                        }}
                                      />
                                    )
                                )}
                              </>
                            }
                            zIndex={9999}
                          > */}
                          +{item?.flags?.length - 4}
                          {/* </Popover> */}
                        </span>
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
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
