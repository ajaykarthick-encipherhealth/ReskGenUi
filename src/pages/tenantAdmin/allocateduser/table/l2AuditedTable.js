import React, { useEffect, useState } from "react";
import TableStyle from "../../../../components/table/table.module.css";
import { Select as AntSelect, Empty } from "antd";

import axios from "../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../utility/enpoints";
import AllocatedAdminList from "../../../../components/table/admin/allocatedAdminList/allocatedAdminList";

function L2AllocatedAdminList({ l2UserList }) {
  const [detailsContent, setDetailsContent] = useState();
  const [isPatientList, setIsPatientList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [headerCheckValidation, setHeaderCheckValidation] = useState([]);
  const [patinetListAll, setPatinetListAll] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedRowsId, setSelectedRowsId] = useState([]);

  const renderRows = () => {
    return detailsContent?.map((data, index) => (
      <tr
        style={{ height: "35px" }}
        key={index}
        onClick={() => {
          getL2PatientList(data.userName);
        }}
      >
        <td className={TableStyle.firstTdBorder}>{data.name}</td>
        <td className={TableStyle.childBorder}>{data.userName}</td>
      </tr>
    ));
  };

  const getL2PatientList = async (value) => {
    let resoureUrl = `dbservice/l2audit/patients?username=${value}`;
    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response.data) {
      let resultMap = [];
      let result = response?.data?.response;
      result?.map((res) => {
        resultMap.push({
          ...res,
          patientId: res.patientId,
          patientName: res.patientName,
          computedDate: res.computedDate,
        });
      });
      const data = result.map((item) => ({
        id: item.patientId,
        name: item.patientName,
      }));
      setHeaderCheckValidation(data);
      if (result.length > 0) {
        setPatinetListAll(result);
      } else {
        setPatinetListAll([]);
      }
      setIsPatientList(true);
      setIsLoading(false);
    }
  };

  const getAllCheckList = async (value) => {
    let resoureUrl = `dbservice/l2audit/patients?username=${value}`;
    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response.data) {
      let resultMap = [];
      let result = response?.data?.response;
      const data = result.map((item) => ({
        id: item.patientId,
        name: item.patientName,
      }));
      setSelectedRowsId(data);
      setHeaderCheckValidation(data);
    }
  };

  useEffect(() => {
    if (selectAllChecked) {
      getAllCheckList();
    } else {
      setSelectedRowsId([]);
    }
  }, [selectAllChecked]);

  useEffect(() => {
    setDetailsContent(l2UserList);
  }, [l2UserList]);

  return (
    <div className={TableStyle.classContaineer}>
      {!isPatientList ? (
        <table className={TableStyle.classTable}>
          <thead className={TableStyle.classThead}>
            <tr>
              <th>Name</th>
              <th>User Name</th>
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
      ) : (
        <AllocatedAdminList
          patinetListAll={patinetListAll}
          selectAllChecked={selectAllChecked}
          setSelectAllChecked={setSelectAllChecked}
          selectedRowsId={selectedRowsId}
          setSelectedRowsId={setSelectedRowsId}
          selectedChart={headerCheckValidation}
        />
      )}
      <div></div>
    </div>
  );
}

export default L2AllocatedAdminList;
