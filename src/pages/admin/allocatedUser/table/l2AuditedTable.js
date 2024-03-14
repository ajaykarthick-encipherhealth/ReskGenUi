import React, { useEffect, useState } from "react";
import moment from "moment";
import TableStyle from "../../../../components/table/table.module.css";
import { notification, Select as AntSelect, Empty } from "antd";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import axios from "../../../../utility/axiosConfig";
import ENDPOINTS from "../../../../utility/enpoints";
import AllocatedAdminList from "../../../../components/table/admin/allocatedAdminList/allocatedAdminList";



function L2AllocatedAdminList({
  l2UserList,
}) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortDueOrder, setSortDueOrder] = useState("asc");
  const [sortCompleteOrder, setSortCompleteOrder] = useState("asc");
  const [detailsContent, setDetailsContent] = useState();
  const [isPatientList, setIsPatientList] = useState(false);
  const [l2PatientListAll,setL2PatientListAll] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState([]);
  const [headerCheckValidation, setHeaderCheckValidation] = useState([]);
  const [patinetListAll, setPatinetListAll] = useState([]);

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedRowsId, setSelectedRowsId] = useState([]);

  const dispatch = useDispatch();
  const navigate = useRouter();

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  const handleRowCheckboxChange = (row) => {
    const isSelected = selectedRows.some(
      (selectedRow) => selectedRow.patientId === row.patientId
    );

    let updatedRows;

    if (isSelected) {
      updatedRows = selectedRows.filter(
        (selectedRow) => selectedRow.patientId !== row.patientId
      );
    } else {
      updatedRows = [...selectedRows, row];
    }

    setSelectedRows(updatedRows);
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const gotoPatientDetails = (data) => {
    dispatch(patientDetails(data));
    if (data.computing === 2) {
      const controller = new AbortController();
      const { signal } = controller;
      controller.abort();
      localStorage.setItem("patientId", data.patientId);
      navigate.push("/physician/patients/details");
    } else {
      notification.warning({
        message: data.patientId + " file not processed. Please wait.",
      });
    }
  };

  const sortTableByDate = (value) => {
    const sortedContent = [...detailsContent];
    if (value === "dueDate") {
      if (sortDueOrder === "asc") {
        sortedContent.sort((a, b) => dayjs(a.dueDate).diff(dayjs(b.dueDate)));
        setSortDueOrder("desc");
      } else {
        sortedContent.sort((a, b) => dayjs(b.dueDate).diff(dayjs(a.dueDate)));
        setSortDueOrder("asc");
      }
    }
    if (value === "completeDate") {
      if (sortCompleteOrder === "asc") {
        sortedContent.sort((a, b) =>
          dayjs(a.lastModifiedDate).diff(dayjs(b.lastModifiedDate))
        );
        setSortCompleteOrder("desc");
      } else {
        sortedContent.sort((a, b) =>
          dayjs(b.lastModifiedDate).diff(dayjs(a.lastModifiedDate))
        );
        setSortCompleteOrder("asc");
      }
    }
    setDetailsContent(sortedContent);
  };

  const renderRows = () => {
    return detailsContent?.map((data, index) => (
      <tr
        style={{ height: "35px" }}
        key={index}
        onClick={() => {
          getL2PatientList(data.userName)
        }}
      >
        <td className={TableStyle.firstTdBorder}>{data.name}</td>
        <td className={TableStyle.childBorder}>{data.userName}</td>
      </tr>
    ));
  };

  const getL2PatientList = async(value)=>{
      var resoureUrl = `dbservice/l2audit/patients?username=${value}`
      const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
      if (response.data) {
        var resultMap = [];
        var result = response?.data?.response;
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
        setIsPatientList(true)
        setIsLoading(false);
    }
    // dispatch(getL2PatientListAll(value));
  }

  const getAllCheckList = async(value)=>{
    var resoureUrl = `dbservice/l2audit/patients?username=${value}`
    const response = await axios.get(ENDPOINTS.apiEndoint + resoureUrl);
    if (response.data) {
      var resultMap = [];
        var result = response?.data?.response;
      const data = result.map((item) => ({
        id: item.patientId,
        name: item.patientName,
      }));
      setSelectedRowsId(data);
      setHeaderCheckValidation(data);
  }
  // dispatch(getL2PatientListAll(value));
}

  
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
    {!isPatientList ?
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
      </table>:
      
       <AllocatedAdminList
       patinetListAll={patinetListAll}
       selectAllChecked={selectAllChecked}
       setSelectAllChecked={
         setSelectAllChecked
       }
       selectedRowsId={selectedRowsId}
       setSelectedRowsId={setSelectedRowsId}
       selectedChart={headerCheckValidation}
     />
      }
      <div></div>
    </div>
  ); // const updatedRows = selectAll ? [] : reportListAll;
  // setSelectedRows(updatedRows);;
}

export default L2AllocatedAdminList;
