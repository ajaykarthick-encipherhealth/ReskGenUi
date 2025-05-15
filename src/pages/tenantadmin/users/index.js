import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { actions as tableAction } from "../../../stores/tableView";
import { actions as tenantAdminAction } from "../../../stores/tenantAdmin/users";
import ReusableFilters from "../../../components/reusableFilters";
import AppTable from "../../../components/tables";
import Header from "../../../jsx/layouts/nav/Header";
import { findItemWithTrueKey, findMatchesByField, getResponePopup } from "../../../utils/reusable";
import CardSkeleton from "../../../components/skeleton/card";
import { Button, Popover, Select } from "antd";
import Usersmodal from "./usersmodal";
import {actions as allActions} from '../../../stores/tenantAdmin/users'
import {actions as authActions} from '../../../stores/authFlows'

const Users = ({
  pageLoad,
  tableLoader,
  getTableData,
  tableDynamicColumn,
  editUserRoles,
  data,
  getAllRoles,
  tableDynamicColumnReset,
  getEnableUser,
  allRoles,
  getRoles,
}) => {
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState([]);
  const [switchStates, setSwitchStates] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [sort, setSort] = useState({
    allocatedOn: {
      sortDir: "DESC",
      sortField: "allocatedOn",
    },
    dueDate: {
      sortDir: "DESC",
      sortField: "dueDate",
    },
    processedDate: {
      sortDir: "DESC",
      sortField: "processedDate",
    },
  });
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [test, setTest] = useState(data?.response?.metaDataDTO);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [usersModal, setUsersModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedRole, setSelectedRole] = useState([]);
  const [visiblePopoverKey, setVisiblePopoverKey] = useState(null);
  const [editingUser, setEditingUser] = useState([]);
  const [isFilter, setIsFilter] = useState(true);
  const [clear, setClear] = useState(false);
  const [role, setRole] = useState([]);

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageNumber(e.page);
    setPageSize(e.rows);
  };
  const handleOpenModal = () => {
    setUsersModal(true);
  };

  const showDrawer = () => {
    setTest(data?.response?.metaDataDTO);
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const getUsersAPi = async () => {
    const res = await getTableData({
      pageNo,
      pageNumber,
      pageSize: 15,
      selectedOption,
      sort: sort,
      selectedDateRanges,
      searchText: searchText,
      pageId: "8e4f1d2a-7b3c-45e6-9f1d-2a7b3c45e6f1",
      cilentBased: true,
    });
  };

  useEffect(() => {
    setParamsFilter("check");
    if (window !== "undefined" && paramsFilter) {
      getUsersAPi();
    }
  }, [
    selectedOption,
    selectedDateRanges,
    searchText,
    pageSize,
    pageNo,
    paramsFilter,
    sort,
    pageNumber,
    pageLoad,
  ]);
  useEffect(() => {
    if (editingUser) {
      setSelectedRole(editingUser.roleNames); 
    }
  }, [editingUser]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);

    const payload = {
      pageId: "8e4f1d2a-7b3c-45e6-9f1d-2a7b3c45e6f1",
      headerNames: data.map((col) => col.id),
    };

    try {
      const response = await tableDynamicColumn({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        getUsersAPi();
        onClose();
        getResponePopup(response);
      }
      setIsSubmitting(false);
    } catch (error) {
      getResponePopup(error?.response);
    }
  };
  const handleSwitchToggle = async (item, checked) => {
    if (isLoading) return;
    setIsLoading(true);
    setSwitchStates((prevStates) => ({
      ...prevStates,
      [item.userName]: checked,
    }));
    const data = {
      userName: item.userName,
      isActive: checked ? true : false,
      isClientBased: true,
    };
    try {
      const res = await getEnableUser({
        data,
      });
      if (res?.status === "SUCCESS") {
        getUsersAPi();
      }
    } catch (error) {
      console.error("Error toggling switch:", error);
    }
    setIsLoading(false);
  };

  const handleReset = async () => {
    setIsResetting(true);

    const payload = {
      pageId: "8e4f1d2a-7b3c-45e6-9f1d-2a7b3c45e6f1",
    };
    try {
      const response = await tableDynamicColumnReset({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        getUsersAPi();
        onClose();
        getResponePopup(response);
      }
      setIsResetting(false);
    } catch (error) {
      getResponePopup(error?.response);
    }
  };
  const handleRoleSubmit = async () => {
    const payload = {
      userName: selectedItem,
      roles: selectedRole,
    };
    const response = await editUserRoles(payload);
    if (response?.status === "SUCCESS") {
      getUsersAPi();
      setVisiblePopoverKey(false);
      getRoles();
      getResponePopup(response);
    }
  };
  const roles = allRoles?.content?.map((item) => ({
    value: item?.roleName,
    label: item?.roleName?.split("_")?.join(" "),
  }));
  const handleCancel = () => {
    setSelectedRole(role);
    setVisiblePopoverKey(false);
  };
  const onCloseIconClick = () =>{
    setSelectedRole(role);
    setVisiblePopoverKey(false);
  }

  const content = () => (
    <>
      <Select
        options={roles}
        placeholder="Select the role"
        style={{ width: 250 }}
        dropdownStyle={{ width: 250 }}
        value={selectedRole}
        mode="multiple"
        onChange={(value) => setSelectedRole(value)}
      />

      <div className="d-flex align-items-center justify-content-center mt-3 gap-2">
        <Button
          onClick={handleRoleSubmit}
          className="btn tableButton btn-sm w-full"
        >
          Submit
        </Button>
        <Button
          onClick={handleCancel}
          className="btn tableButton btn-sm w-full"
        >
          Cancel{" "}
        </Button>
      </div>
    </>
  );

  const handleAction = (item) => {
    setSelectedItem(item?.userName);
  };

  useEffect(() => {
    if (
      (isFilter && data?.response?.metaDataDTO) ||
      !findMatchesByField(activeFilters, data?.response?.metaDataDTO)
    ) {
      setActiveFilters(
        data?.response?.metaDataDTO.filter(
          (item) => item.active && item?.filter?.style
        )
      );
      setIsFilter(false);
    }
  }, [data?.response?.metaDataDTO]);

  useEffect(() => {
    if (data?.response?.pageResponse?.content) {
      const initialSwitchStates = {};
      data?.response?.pageResponse?.content.forEach((user) => {
        initialSwitchStates[user.userName] = user.accountStatus;
      });
      setSwitchStates(initialSwitchStates);
    }
  }, [data?.response?.pageResponse?.content]);

  useEffect(() => {
    getAllRoles();
  }, []);

  return (
    <div className={`show `}>
      <Header />
      <div className="content-body">
        <div className="container-fluid table-responsive active-projects task-table">
            <div className="d-flex mt-4 ">
              <div className="p-2" style={{ width: "90%" }}>
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
                  setPageNo={setPageNo}
                  //customize table
                  open={open}
                  onClose={onClose}
                  selectedColumns={test}
                  setSelectedColumns={setTest}
                  showCustomizeTable={true}
                  showDrawer={showDrawer}
                  handleSubmit={handleSubmit}
                  handleReset={handleReset}
                  isSubmitting={isSubmitting}
                  isResetting={isResetting}
                  setClear={setClear}
                />
              </div>
              <div
                id="assign-btn"
                name="assign-btn"
                className="d-flex justify-content-center align-items-center  mt-4"
              >
                <Button
                  data-testid="assign-user"
                  className="btn btn-sm w-full text-ellipsis tableButton"
                  onClick={handleOpenModal}
                >
                  Assign User
                </Button>
              </div>
            </div>
          <div className="mt-4">
            <AppTable
              data={data?.response?.pageResponse?.content}
              column={data?.response?.metaDataDTO.filter((item) => item.active)}
              loader={tableLoader}
              setSort={setSort}
              sort={sort}
              first={pageNo === 0 ? 0 : paginationFirst}
              totalRecords={data?.response?.pageResponse?.totalElements}
              row={15}
              onPageChange={onPageChange}
              switchStates={switchStates}
              onSwitchToggle={handleSwitchToggle}
              isEdit={findItemWithTrueKey(data?.response?.staticDesign, "edit")}
              handleAction={handleAction}
              content={content}
              visiblePopoverKey={visiblePopoverKey}
              setVisiblePopoverKey={setVisiblePopoverKey}
              setEditingUser={setEditingUser}
              setRole={setRole}
              selectedRole={selectedRole}
              onCloseIconClick={onCloseIconClick}
            />
          </div>
          <div>
            <Usersmodal
              getUsersAPi={getUsersAPi}
              open={usersModal}
              setOpen={setUsersModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
const enhancer = connect(
  (state) => ({
    tableLoader: state?.tableView?.tableViewLoading,
    data: state?.tableView?.tableView?.data,
    tableStatus: state?.tableView?.TableStatusView?.data?.response,
    pageLoad: state?.tenantAdmin?.tin?.getPageRendering,
    allRoles: state?.tenantAdmin?.users?.getUsersRoles?.data?.response,
  }),
  {
    getTableData: tableAction.tableViewAction,
    tableDynamicColumn: tableAction.tableDynamicColumn,
    tableDynamicColumnReset: tableAction.tableDynamicColumnReset,
    getEnableUser: tenantAdminAction.usersSoftDelete,
    getAllRoles: allActions.usersAllRoles,
    editUserRoles: allActions.userEditRoles,
     getRoles: authActions.allRoles,
  }
);
export default enhancer(Users);
