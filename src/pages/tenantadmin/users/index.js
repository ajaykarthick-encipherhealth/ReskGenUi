import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import "react-facebook-loading/dist/react-facebook-loading.css";
import { actions as tableAction } from "../../../stores/tableView";
import { actions as tenantAdminAction } from "../../../stores/tenantAdmin/users";
import ReusableFilters from "../../../components/reusableFilters";
import AppTable from "../../../components/tables";
import Header from "../../../jsx/layouts/nav/Header";
import {
  createIdGens,
  findItemWithTrueKey,
  findMatchesByField,
  getResponePopup,
  tableCustomFilterClearCheck,
} from "../../../utils/reusable";
import { Button, Popover, Select } from "antd";
import Usersmodal from "./usersmodal";
import { actions as allActions } from "../../../stores/tenantAdmin/users";
import { actions as authActions } from "../../../stores/authFlows";
import { getLocalStored } from "../../../utils/storages";
import { assignUserPageId } from "../../../utils/pageIds";

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
  id,
}) => {
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
  const [selectedRoleList, setSelectedRoleList] = useState([]);
  const [visiblePopoverKey, setVisiblePopoverKey] = useState(null);
  const [editingUser, setEditingUser] = useState([]);
  const [isFilter, setIsFilter] = useState(true);
  const [clear, setClear] = useState(false);
  const [role, setRole] = useState([]);
  const { aliasName = null } = getLocalStored();
  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageNumber(e.page);
    setPageSize(e.rows);
  };
  const handleOpenModal = () => {
    setUsersModal(true);
    setVisiblePopoverKey(false);
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
      pageId:assignUserPageId,
      cilentBased: true,
      qaLead: true,
      projectLead: true,
    });
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);

    const payload = {
      pageId: assignUserPageId,
      headerNames: data.map((col) => col.id),
    };

    try {
      const response = await tableDynamicColumn({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        const filterCheck = tableCustomFilterClearCheck(
         { searchText,
          selectedDateRanges,
          selectedDates,
          selectedOption,
          setSearchText,
          setSelectedDateRanges,
          setSelectedDates,
          setSelectedOption,
          data}
        );
        if (filterCheck) {
          getUsersAPi();
        }
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
      pageId: assignUserPageId,
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
    } else {
      getResponePopup(response);
    }
  };
  const roles = allRoles?.content?.map((item) => ({
    value: item?.roleName,
    label: item?.roleName?.split("_")?.join(" "),
  }));

  const handleCancel = () => {
    setSelectedRole(selectedRoleList);
    setVisiblePopoverKey(false);
  };
  const onCloseIconClick = () => {
    setSelectedRole(selectedRoleList);
    setVisiblePopoverKey(false);
  };
const content = (item) => {
  const FIXED_ROLE = item.currentUser && aliasName ? aliasName : null;

  const updatedRoles = roles.map((role) => ({
    ...role,
    disabled: role.value === FIXED_ROLE, 
  }));

  const handleRoleChange = (value) => {
    if (FIXED_ROLE && !value.includes(FIXED_ROLE)) {
      value = [FIXED_ROLE, ...value];
    }
    setSelectedRole(value);
  };

  return (
    <>
      <Select
        options={updatedRoles}
        placeholder="Select the role"
        style={{ width: 250 }}
        dropdownStyle={{ width: 250 }}
        value={selectedRole}
        mode="multiple"
        onChange={handleRoleChange}
        data-testid={id ? createIdGens("userEdit") : createIdGens("userEdit")}
      />

      <div className="d-flex align-items-center justify-content-center mt-3 gap-2">
        <Button
          onClick={handleRoleSubmit}
          className="btn tableButton btn-sm w-full"
          data-testid={
            id ? createIdGens("submitBtn") : createIdGens("submitBtn")
          }
        >
          Submit
        </Button>
        <Button
          onClick={handleCancel}
          className="btn tableButton btn-sm w-full"
          data-testid={
            id ? createIdGens("cancelBtn") : createIdGens("cancelBtn")
          }
        >
          Cancel
        </Button>
      </div>
    </>
  );
};



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
      setSelectedRoleList(editingUser.roleNames);
    }
  }, [editingUser]);
  return (
    <div className={`show `}>
      {/* <Header /> */}
      <div className="content-body">
        <div className="container-fluid table-responsive active-projects task-table">
          <div className="d-flex mt-4 ">
            <div className="p-2" style={{ width: "95%" }}>
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
                tableLoader={tableLoader}
              />
            </div>

            {aliasName !== "PROJECT_LEAD" && aliasName !== "QA_LEAD" && (
              <div
                id={
                  id
                    ? createIdGens("assign-userBtn")
                    : createIdGens("assign-userBtn")
                }
                className="d-flex justify-content-center align-items-center mt-4"
              >
                <Button
                  data-testid={
                    id ? createIdGens("assignUser") : createIdGens("assignUser")
                  }
                  className="btn btn-sm w-full text-ellipsis tableButton"
                  onClick={handleOpenModal}
                >
                  Assign User
                </Button>
              </div>
            )}
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
              setSelectedRoleList={setSelectedRoleList}
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
