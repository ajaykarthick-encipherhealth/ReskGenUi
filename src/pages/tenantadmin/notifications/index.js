import { Button } from "react-bootstrap";
import Header from "../../../jsx/layouts/nav/Header";
import NotificationCard from "./noficationCard";
import style from "./style.module.css";
import { PlusCircleFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import NotificationModal from "./addNotification";
import Pagination from "../../../mainStream/components/pagination";
import { actions as notificationAction } from "../../../stores/admin/notifications";
import { connect } from "react-redux";
import { actions as AdminAction } from "../../../stores/admin/users";
import CardSkeleton from "../../../components/skeleton/card";
import { priorityOptions } from "../../../components/headerFilters/functions";
import ReusableFilters from "../../../components/updatedFilters";

const NotificationList = ({
  allCustomUsers,
  getUsers,
  getNotificationList,
  loader,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [activeFilters, setActiveFilters] = useState(["Search"]);
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
    const [clear, setClear] = useState(false);
    const priorityOptions = [
        {
            label: "High",
            value: "HIGH",

        },
        {
            label: "Medium",
            value: "MEDIUM",
        },
        {
            label: "General",
            value: "LOW",
        },

    ]
  const getNotificationResult = async () => {
    let result = await getNotificationList();
    if (result) {
      setNotificationList(result);
    }
  };
    const commonFilterItems = [
      {
        id: 1,
        title: "Search",
        type: "search",
        value: null,
        placeholder: "Search",
      },
      {
        id: 2,
        title: "Status",
        type: "select",
        value: null,
        placeholder: "Select Status",
        options: [
          { label: "COMPLETED", value: "COMPLETED" },
          { label: "PENDING", value: "PENDING" },
          { label: "DECLINED", value: "DECLINED" },
          { label: "HOLD", value: "HOLD" },
        ],
      },
      {
        id: 3,
        title: "dueDate",
        type: "rangePicker",
        value: null,
        placeholder: "Due Date",
        pickerType: "year",
      },
     
      {
        id: 5,
        title: "Priority",
        type: "select",
        value: null,
        placeholder: "Select Priority",
        options: priorityOptions,
      },
 
    ];
  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNum(e.page);
  };
  useEffect(() => {
    getNotificationResult();
  }, []);
  useEffect(() => {
    getUsers({
      pageCount: 0,
      search: "",
      startDate: "",
      endDate: "",
      status: "",
      role: "",
      sort: "",
    });
  }, []);

  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      <Header />
      <div className="content-body">
        <div className="container-fluid">
          <div className="d-flex  justify-content-between align-items-center">
            <ReusableFilters
              setActiveFilters={setActiveFilters}
              setSearchText={setSearchText}
              searchText={searchText}
              setSelectedOption={setSelectedOption}
              selectedOption={selectedOption}
              setSelectedDateRanges={setSelectedDateRanges}
              selectedDateRanges={selectedDateRanges}
              setPageNumber={setPageNumber}
              FilterItems={commonFilterItems}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              activeFilters={activeFilters}
              setClear={setClear}
              clear={clear}
            />
            <div >
              <Button
                id="addNotification"
                name="addNotification"
                style={{ background: "#04306f", color: "#fff" }}
                className="btn btn-sm ms-2 flr width-max-content"
                onClick={() => setIsModalOpen(true)}
              >
                <PlusCircleFilled /> Add Notification
              </Button>
            </div>
          </div>
          {loader ? (
            <div className="d-flex gap-2 m-2">
              <div className="col-6">
                <CardSkeleton count={5} height={150} />
              </div>
              <div className="col-6">
                <CardSkeleton count={5} height={150} />
              </div>
            </div>
          ) : (
            <>
              <div>
                <NotificationCard notificationList={notificationList} />
              </div>
              <div className="p-1">
                {/* <Pagination
      first={pageNum === 0 ? 0 : paginationFirst}
      totalRecords={details?.reportStatusDTOList?.totalElements}
      onPageChange={onPageChange}
      row={8}
    /> */}
              </div>
            </>
          )}
        </div>
      </div>
      {isModalOpen && (
        <NotificationModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    allCustomUsers: state?.tenantAdmin?.notification?.customUsers,
    loader: state?.admin?.notification?.loader,
  }),
  {
    // getAllCustomUsers: tenantAdminActions.getCustomUsersAction,
    getUsers: AdminAction.getAllUsersAction,
    getNotificationList: notificationAction.getNotificationList,
    postNotification: notificationAction.getPostNotificationList,
    // SelectUserList: allActions.getSelectUserList,
  }
);
export default enhancer(NotificationList);
