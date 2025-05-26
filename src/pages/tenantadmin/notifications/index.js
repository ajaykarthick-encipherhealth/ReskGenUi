import { Button } from "react-bootstrap";
import Header from "../../../jsx/layouts/nav/Header";
import NotificationCard from "./noficationCard";
import { PlusCircleFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import NotificationModal from "./addNotification";
import { actions as notificationAction } from "../../../stores/admin/notifications";
import { connect } from "react-redux";
import { actions as AdminAction } from "../../../stores/admin/users";
import CardSkeleton from "../../../components/skeleton/card";
import ReusableFilters from "../../../components/reusableFilters";
import { actions as tenantAdminActions } from "../../../stores/tenantAdmin/notification";
import Card from "../../../components/card";
import { Empty } from "antd";
import style from "./style.module.css";

const NotificationList = ({
  allCustomUsers,
  getUsers,
  getNotificationList,
  loader,
  postNotification,
  getAllCustomUsers,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [activeFilters, setActiveFilters] = useState([]);
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
      value: "GENERAL",
    },
  ];
  const getNotificationResult = async () => {
    let result = await getNotificationList({
      searchText: searchText,
      selectedOption,
      selectedDateRanges,
    });
    if (result) {
      setNotificationList(result);
    }
  };

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNum(e.page);
  };

  const usersOptions = allCustomUsers?.data?.response?.map((data) => ({
    label: `${data?.firstName} ${data?.lastName}`,
    value: data?.userName,
  }));

  useEffect(() => {
    getAllCustomUsers();
    getUsers({
      pageCount: 0,
      search: "",
      startDate: "",
      endDate: "",
      status: "",
      role: "",
      sort: "",
    });
    getNotificationResult();
  }, [searchText, selectedOption, selectedDateRanges]);

  const opt = {
    Priority: priorityOptions,
    users: usersOptions,
  };

  return (
    <div style={{ backgroundColor: "#F0F6FE" }}>
      <Header />
      <div className="content-body">
        <div className="container-fluid">
          <section className="d-flex">
            <div style={{ width: "90%" }}>
              <ReusableFilters
                showFilter={true}
                setActiveFilters={setActiveFilters}
                setSearchText={setSearchText}
                searchText={searchText}
                setSelectedOption={setSelectedOption}
                selectedOption={selectedOption}
                setSelectedDateRanges={setSelectedDateRanges}
                selectedDateRanges={selectedDateRanges}
                setPageNumber={setPageNumber}
                FilterItems={activeFilters}
                selectedDates={selectedDates}
                setSelectedDates={setSelectedDates}
                activeFilters={activeFilters}
                setClear={setClear}
                clear={clear}
                // setPageNo={setPageNo}
                opt={opt}
              />
            </div>
            <div className="d-flex justify-content-center align-items-center mt-3 w-10">
              <Button
                id="addNotification"
                name="addNotification"
                className={`${style.notificationBtn} btn btn-sm ms-2 flr width-max-content`}
                onClick={() => setIsModalOpen(true)}
              >
                <PlusCircleFilled /> Add Notification
              </Button>
            </div>
          </section>
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
                {notificationList.length <= 0 ? (
                  <Card padding="20px" borderRadius="5px">
                    <div
                      className={` ${style.emptyCard} d-flex align-items-center justify-content-center`}
                    >
                      <Empty />
                    </div>
                  </Card>
                ) : (
                  <NotificationCard notificationList={notificationList} />
                )}
              </div>
              {/* <div className="p-1">
                <Pagination
                  first={pageNum === 0 ? 0 : paginationFirst}
                  totalRecords={notificationList?.totalElements}
                  onPageChange={onPageChange}
                  row={8}
                />
              </div> */}
            </>
          )}
        </div>
      </div>
      {isModalOpen && (
        <NotificationModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          postNotification={postNotification}
          getNotificationList={getNotificationResult}
          allCustomUsers={allCustomUsers}
          getAllCustomUsers={getAllCustomUsers}
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
    getUsers: AdminAction.getAllUsersAction,
    getNotificationList: notificationAction.getNotificationList,
    postNotification: notificationAction.getPostNotificationList,
    getAllCustomUsers: tenantAdminActions.getCustomUsersAction,
  }
);
export default enhancer(NotificationList);
