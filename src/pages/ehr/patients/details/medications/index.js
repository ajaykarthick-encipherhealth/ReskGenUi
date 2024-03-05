import React, { useEffect, useState } from "react";
import TableStyle from "../../../../../components/table/table.module.css";
import { Empty } from "antd";

const Medications = ({ userList, sortOrder, setSortOrder, setSort }) => {
  const data = [
    {
      medicine: "Acetaminophen 500mg tablet",
      prescribedBy: "John Smith",
      medicationInstruction:
        "Take 1 tablet by mouth every 4-6 hours as needed for pain",
    },
    {
      medicine: "Lisinopril 10mg tablet",
      prescribedBy: "Emily Johnson",
      medicationInstruction: "Take 1 tablet by mouth daily as prescribed",
    },
    {
      medicine: "Amoxicillin 500mg capsule",
      prescribedBy: "John Smith",
      medicationInstruction: "Take 1 capsule by mouth every 8 hours for 7 days",
    },
  ];
  return (
    <div class="table-responsive active-projects task-table">
      <div className={TableStyle.classContaineer}>
        <table className={TableStyle.classTable}>
          <thead className={TableStyle.classThead}>
            <tr>
              <th style={{ textAlign: "center" }}>Medicine</th>
              <th style={{ textAlign: "center" }}>PrescribedBy</th>
              <th style={{ textAlign: "center" }}>MedicationInstruction</th>
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 ? (
              data?.map((item) => (
                <tr
                  style={{
                    height: "35px",
                  }}
                  className={TableStyle.trDiv}
                >
                  <td
                    className={TableStyle.childBorder}
                    style={{ textAlign: "center" }}
                  >
                    {item.medicine}
                  </td>
                  <td
                    className={TableStyle.childBorder}
                    style={{ textAlign: "center" }}
                  >
                    {item.prescribedBy}
                  </td>
                  <td
                    className={TableStyle.childBorder}
                    style={{ textAlign: "center" }}
                  >
                    {item.medicationInstruction}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8}>
                  <Empty />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Medications;
