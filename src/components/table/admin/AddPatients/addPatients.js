import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import moment from "moment";
import TableStyle from "../../table.module.css";
import { notification, Select as AntSelect, Empty, Popover } from "antd";
import { selectedRoWDetails } from "../../../../store/actions/adminAction/fileProcessingActions";
import {
  renderUserPrfoileAvatar,
  sortFunction,
} from "../../../headerFilters/functions";
import { getStorage, setStorage } from "../../../../utils/storages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import SvgFlag from "../../../patientDetails/details/components/svg/svg";

function AddPatientListTable({
  patinetListAll,
  actionBodyTemplate,
  statusBodyTemplate,
  patientDetails,
  sortOrder,
  setSortOrder,
  setSort,
  page,
  sortCompleteOrder,
  setSortCompleteOrder,
}) {
  const [detailsContent, setDetailsContent] = useState(patinetListAll);
  const dispatch = useDispatch();
  const navigate = useRouter();

  const gotoPatientDetails = (data) => {
    dispatch(patientDetails(data));
    if (data?.computing === 2) {
      const controller = new AbortController();
      const { signal } = controller;
      controller.abort();
      setStorage("patientId", data?.patientId);
      var role = getStorage("role");
      if (role == "tenant_admin") {
        navigate.push({
          pathname: "/tenantAdmin/patients/details",
          query: page,
        });
      } else {
        navigate.push({ pathname: "/admin/patients/details", query: page });
      }
      // setStorage('paginations', JSON.stringify(page))
    } else {
      notification.warning({
        message: data?.patientId + " file not processed. Please wait.",
      });
    }
  };

  const handleTableRowClick = (e) => {
    const targetTd = e.target.closest("td");
    if (targetTd) {
      const dataIndex = targetTd.parentElement.rowIndex - 1;
      const clickedData = patinetListAll[dataIndex];
      gotoPatientDetails(clickedData);
    }
  };
  const flagContennt = {
    status: "SUCCESS",
    message: "Success!!",
    response: {
      content: [
        {
          createdDate: "2024-09-23T08:06:28.266Z",
          lastModifiedDate: "2024-09-23T08:22:26.677Z",
          active: true,
          version: 15,
          createdBy: "tenantadmin@3gencogentai.onmicrosoft.com",
          lastModifiedBy: "anonymousUser",
          id: "Abitest02",
          mrNumber: null,
          dob: "1942-04-12",
          batchId: null,
          gender: "FEMALE",
          latestFileUploadDate: "2024-09-23T08:17:59.646Z",
          flagIds: null,
          flagList: [
            {
              createdDate: null,
              lastModifiedDate: null,
              active: true,
              version: 1,
              createdBy: null,
              lastModifiedBy: null,
              id: "0dd48178-f1a3-4fcb-9a31-e62180e0139b",
              flagName: "PROVIDER_SIGN_MISSED",
              flagIcon: "Test - Icon",
              flagColour: "#e28743",
            },
            {
              createdDate: null,
              lastModifiedDate: "2024-07-22T11:06:36.397Z",
              active: true,
              version: 2,
              createdBy: null,
              lastModifiedBy: "tenantadmin@cogentaihealth.onmicrosoft.com",
              id: "dc567287-e747-4064-ac96-2a29340d660b",
              flagName: "NO_HCC_FOUND",
              flagIcon: "Test - Icon",
              flagColour: "#cccc49",
            },
          ],
          patientId: "Abitest02",
          accuracyScore: null,
          patientAllocated: null,
          patientAllocatedFirstName: null,
          patientAllocatedLastName: null,
          patientAllocatedProfileImage: null,
          computing: 2,
          processStageChart: "FINISHED",
          processStageRadiology: null,
          processStageLab: null,
          processStageId: "2878fe16-dcdd-428c-a26f-bfbc8d095b4c",
          processStageIdRadiology: null,
          processStageIdLab: null,
          allocatedOn: null,
          allocatedBy: "tenantadmin@3gencogentai.onmicrosoft.com",
          allocatedByFirstName: "Admin",
          allocatedByLastName: "3 Gen",
          allocatedByProfileImage: null,
          patientName: "EIGHTS F MIL PEARLIE BOOKER",
          processedDate: null,
          dueDate: null,
          processedStatus: "PENDING",
          auditedStatus: "NOT_AUDIT",
          auditedBy: null,
          auditedByFirstName: null,
          auditedByLastName: null,
          auditedByProfileImage: null,
          auditedDate: null,
          computedDate: "2024-09-23T08:22:26.644Z",
          fileName: "7W90HR6JK36-453545573-Booker_Pearlie.pdf",
          auditedAssigned: null,
          auditedAssignedFirstName: null,
          auditedAssignedLastName: null,
          auditedAssignedProfileImage: null,
          auditAllocatedBy: null,
          auditDueDate: null,
          auditAllocatedDate: null,
          auditAllocatedByFirstName: null,
          auditAllocatedByLastName: null,
          auditAllocatedByProfileImage: null,
          createdByFirstName: "Admin",
          createdByLastName: "3 Gen",
          createdByProfileImage: null,
          validDiseaseCount: null,
          deletedDiseaseCount: null,
          comboDiseaseCount: null,
          priority: null,
          emr: null,
          aco: null,
          mbi: null,
          firstName: null,
          middleName: null,
          lastName: null,
          tin: 0,
          tinName: null,
          inpi: null,
          inpiFirstName: null,
          inpiLastName: null,
          organizationId: "66b4e232b838441047dbf9c6",
          totalPages: 18,
          facility: null,
          credentials: null,
          practice: null,
          isFlagShow: true,
          inValidDiseaseCount: null,
          rafScore: null,
        },
        {
          createdDate: "2024-09-23T08:06:28.266Z",
          lastModifiedDate: "2024-09-23T08:22:26.677Z",
          active: true,
          version: 15,
          createdBy: "tenantadmin@3gencogentai.onmicrosoft.com",
          lastModifiedBy: "anonymousUser",
          id: "Abitest02",
          mrNumber: null,
          dob: "1942-04-12",
          batchId: null,
          gender: "FEMALE",
          latestFileUploadDate: "2024-09-23T08:17:59.646Z",
          flagIds: null,
          flagList: [
            {
              createdDate: null,
              lastModifiedDate: null,
              active: true,
              version: 1,
              createdBy: null,
              lastModifiedBy: null,
              id: "0dd48178-f1a3-4fcb-9a31-e62180e0139b",
              flagName: "PROVIDER_SIGN_MISSED",
              flagIcon: "Test - Icon",
              flagColour: "#e28743",
            },
            {
              createdDate: null,
              lastModifiedDate: "2024-07-22T11:06:36.397Z",
              active: true,
              version: 2,
              createdBy: null,
              lastModifiedBy: "tenantadmin@cogentaihealth.onmicrosoft.com",
              id: "dc567287-e747-4064-ac96-2a29340d660b",
              flagName: "NO_HCC_FOUND",
              flagIcon: "Test - Icon",
              flagColour: "#cccc49",
            },
          ],
          patientId: "Abitest02",
          accuracyScore: null,
          patientAllocated: null,
          patientAllocatedFirstName: null,
          patientAllocatedLastName: null,
          patientAllocatedProfileImage: null,
          computing: 2,
          processStageChart: "FINISHED",
          processStageRadiology: null,
          processStageLab: null,
          processStageId: "2878fe16-dcdd-428c-a26f-bfbc8d095b4c",
          processStageIdRadiology: null,
          processStageIdLab: null,
          allocatedOn: null,
          allocatedBy: "tenantadmin@3gencogentai.onmicrosoft.com",
          allocatedByFirstName: "Admin",
          allocatedByLastName: "3 Gen",
          allocatedByProfileImage: null,
          patientName: "EIGHTS F MIL PEARLIE BOOKER",
          processedDate: null,
          dueDate: null,
          processedStatus: "PENDING",
          auditedStatus: "NOT_AUDIT",
          auditedBy: null,
          auditedByFirstName: null,
          auditedByLastName: null,
          auditedByProfileImage: null,
          auditedDate: null,
          computedDate: "2024-09-23T08:22:26.644Z",
          fileName: "7W90HR6JK36-453545573-Booker_Pearlie.pdf",
          auditedAssigned: null,
          auditedAssignedFirstName: null,
          auditedAssignedLastName: null,
          auditedAssignedProfileImage: null,
          auditAllocatedBy: null,
          auditDueDate: null,
          auditAllocatedDate: null,
          auditAllocatedByFirstName: null,
          auditAllocatedByLastName: null,
          auditAllocatedByProfileImage: null,
          createdByFirstName: "Admin",
          createdByLastName: "3 Gen",
          createdByProfileImage: null,
          validDiseaseCount: null,
          deletedDiseaseCount: null,
          comboDiseaseCount: null,
          priority: null,
          emr: null,
          aco: null,
          mbi: null,
          firstName: null,
          middleName: null,
          lastName: null,
          tin: 0,
          tinName: null,
          inpi: null,
          inpiFirstName: null,
          inpiLastName: null,
          organizationId: "66b4e232b838441047dbf9c6",
          totalPages: 18,
          facility: null,
          credentials: null,
          practice: null,
          isFlagShow: true,
          inValidDiseaseCount: null,
          rafScore: null,
        },
      ],
      pageable: {
        pageNumber: 0,
        pageSize: 15,
        sort: {
          sorted: false,
          empty: true,
          unsorted: true,
        },
        offset: 0,
        paged: true,
        unpaged: false,
      },
      last: true,
      totalElements: 1,
      totalPages: 1,
      first: true,
      size: 15,
      number: 0,
      sort: {
        sorted: false,
        empty: true,
        unsorted: true,
      },
      numberOfElements: 1,
      empty: false,
    },
  };
  const popoverContent = (
    <div>
      <strong>Flag details</strong>

      {flagContennt?.response?.content.map((patient, patientIndex) => (
        <div key={patientIndex} className="patient-details">
          {patient.flagList.map((flag, flagIndex) => (
            <div key={flagIndex}>
              <span className="p-1">
                <SvgFlag fillColor={flag.flagColour} />
              </span>
              {flag.flagName}
            </div>
          ))}
        </div>
      ))}
      {console.log(flagContennt?.response?.content, "flagContennt")}
    </div>
  );

  const renderRows = () => {
    return patinetListAll?.length === 0 ? (
      <tr>
        <td colSpan="9">
          <Empty />
        </td>
      </tr>
    ) : (
      <>
        {patinetListAll?.map((data, index) => (
          <tr
            key={index}
            onClick={() => {
              dispatch(
                selectedRoWDetails({
                  patientId: data?.patientId,
                  processStageId: data?.processStageId,
                })
              );
            }}
          >
            <td
              className={TableStyle.firstTdBorder}
              onClick={handleTableRowClick}
            >
              {data?.isFlagShow === true ? (
                <Popover content={popoverContent} placement="right">
                  <span className="p-1">
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{
                        color: "#ff5050",
                        fontSize: "10px",
                        cursor: "pointer",
                      }}
                    />
                  </span>
                </Popover>
              ) : (
                <span className="p-2">&nbsp;</span>
              )}

              {data?.patientId ? data?.patientId : "---"}
            </td>
            <td
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
            >
              {data?.fileName ? data?.fileName : "---"}
            </td>
            <td
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
            >
              {data?.totalPages ? data?.totalPages : "---"}
            </td>
            <td
              className={TableStyle.childBorder}
              style={{ textAlign: "left" }}
              onClick={handleTableRowClick}
            >
              {data?.createdByFirstName ||
              data?.createdByLastName ||
              data?.createdByProfileImage ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ marginRight: "10px" }}>
                    {renderUserPrfoileAvatar(
                      data?.createdByFirstName,
                      data?.createdByLastName,
                      data?.createdByProfileImage,
                      "header"
                    )}
                  </span>
                  <span>
                    {data?.createdByFirstName} {data?.createdByLastName}
                  </span>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>---</div>
              )}
            </td>
            <td
              style={{ textAlign: "center" }}
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
            >
              {data?.computedDate
                ? moment(data?.computedDate).format("MM-DD-YYYY, h:mm a")
                : "---"}
            </td>
            <td
              style={{ textAlign: "center" }}
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
            >
              {data?.createdDate
                ? moment(data?.createdDate).format("MM-DD-YYYY, h:mm a")
                : "---"}
            </td>
            <td
              style={{ marginLeft: "10px" }}
              className={TableStyle.childBorder}
              onClick={handleTableRowClick}
            >
              {statusBodyTemplate(data)}
            </td>
            <td
              className={TableStyle.lastBorder}
              style={{ textAlign: "center" }}
            >
              {actionBodyTemplate(data)}
            </td>
          </tr>
        ))}
      </>
    );
  };

  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>PATIENT ID</th>
            <th>FILE NAME</th>
            <th className="text-truncate">TOTAL PAGES</th>
            <th style={{ textAlign: "center" }} className="text-truncate">
              CREATED BY
            </th>

            <th
              style={{
                cursor: "pointer",
                paddingLeft: "15px",
                textAlign: "center",
              }}
              onClick={() => {
                sortFunction(sortOrder, setSortOrder, setSort, "computedDate");
              }}
              className="text-truncate"
            >
              COMPUTED DATE{" "}
              {sortOrder === "ASC" ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )}
            </th>
            <th
              onClick={() => {
                sortFunction(
                  sortCompleteOrder,
                  setSortCompleteOrder,
                  setSort,
                  "createdDate"
                );
              }}
              style={{ textAlign: "center" }}
              className="text-truncate"
            >
              CREATED DATE
              <span
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  textAlign: "center",
                  paddingLeft: "15px",
                }}
              >
                {sortCompleteOrder === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}
              </span>
            </th>

            <th style={{ paddingLeft: "55px" }}>STATUS</th>
            <th>UPLOAD</th>
          </tr>
        </thead>

        <tbody>
          {detailsContent?.length <= 0 ? (
            <tr>
              <td colSpan="9">
                <Empty />
              </td>
            </tr>
          ) : (
            renderRows()
          )}
        </tbody>
      </table>
      <div></div>
    </div>
  );
}

export default AddPatientListTable;
