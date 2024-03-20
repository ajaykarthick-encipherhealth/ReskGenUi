import React, { useState, useEffect } from "react";
import Select from "react-select";
import LoadingSpinner from "../../../jsx/components/spinner/spinner";

const FileProcessing = () => {
  const [fileProcessingList, setFileProcessingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const datas = [
      {
        filename: "test",
        name: "Name 1",
        roles: "Coder(Level 1)",
        status: "Completed",
        date: "22 / 12 / 20",
      },
      {
        filename: "test",
        name: "Name 1",
        roles: "Coder(Level 1)",
        status: "In-Progress",
        date: "22 / 12 / 20",
      },
      {
        filename: "test",
        name: "Name 1",
        roles: "Coder(Level 1)",
        status: "Finished Validation",
        date: "22 / 12 / 20",
      },
      {
        filename: "test",
        name: "Name 1",
        roles: "Coder(Level 1)",
        status: "In-Validation",
        date: "22 / 12 / 20",
      },
      {
        filename: "test",
        name: "Name 1",
        roles: "Coder(Level 1)",
        status: "Hold",
        date: "22 / 12 / 20",
      },
      {
        filename: "test",
        name: "Name 1",
        roles: "Coder(Level 1)",
        status: "Finished Validation",
        date: "22 / 12 / 20",
      },
      {
        filename: "test",
        name: "Name 1",
        roles: "Coder(Level 1)",
        status: "Hold",
        date: "22 / 12 / 20",
      },
      {
        filename: "test",
        name: "Name 1",
        roles: "Coder(Level 1)",
        status: "In-Progress",
        date: "22 / 12 / 20",
      },
    ];

    setFileProcessingList(datas);
    setIsLoading(false);
  }, []);

  const options3 = [
    { value: "1", label: "ALL" },
    { value: "2", label: "Enabled" },
    { value: "3", label: "Disabled" },
  ];

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="table-responsive active-projects task-table">
          <div className="tbl-caption  align-items-center">
            <div className="row">
              <div className="col-xl-3">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Date"
                />
              </div>
              <div className="col-xl-3">
                <Select
                  options={options3}
                  className="custom-react-select"
                  defaultValue={options3[0]}
                  isSearchable={false}
                />
              </div>
            </div>
          </div>
          <div id="task-tbl_wrapper" className="dataTables_wrapper no-footer">
            <table
              id="empoloyeestbl2"
              className="table ItemsCheckboxSec dataTable no-footer mb-2 mb-sm-0"
            >
              <thead>
                <tr>
                  <th>SI.NO</th>
                  <th>File Name</th>
                  <th>Users</th>
                  <th>Roles</th>
                  <th>Status</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {fileProcessingList.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <span>{index + 1}</span>
                    </td>
                    <td>
                      <span>{item.filename}</span>
                    </td>
                    <td>
                      <span>{item.name}</span>
                    </td>
                    <td>
                      <span>{item.roles}</span>
                    </td>

                    <td className="td-backcolor">
                      <span
                        className={
                          item.status === "Completed"
                            ? " completed"
                            : item.status === "In-Progress"
                            ? "in-progress"
                            : item.status === "Finished Validation"
                            ? "finished-validation"
                            : item.status === "Hold"
                            ? "hold"
                            : item.status === "In-Validation"
                            ? "invalidation"
                            : ""
                        }
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <span>{item.date}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default FileProcessing;
