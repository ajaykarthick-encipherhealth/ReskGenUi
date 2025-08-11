import React, { useEffect, useState } from "react";
import ReusableFilters from "../../../../components/reusableFilters";
import AppTable from "../../../../components/tables";
import { Button, DatePicker, Drawer, Form, Input } from "antd";
import { connect } from "react-redux";
import { actions as settingActions } from "../../../../stores/tenantAdmin/settings";
import {
  findMatchesByField,
  formatDateForIndex,
  getResponePopup,
  tableCustomFilterClearCheck,
} from "../../../../utils/reusable";
import { actions as tableAction } from "../../../../stores/tableView";
import { actions as authActions } from "../../../../stores/authFlows";
import { disablePastDate } from "../../../../components/headerFilters/functions";
import RegularButton from '../../../../components/button'

const Projects = ({
  createProject,
  getTableData,
  data,
  tableLoader,
  tableDynamicColumn,
  tableDynamicColumnReset,
  pageLoad,
  getAllProjects,
  projectLoader,
  deleteProcess,
}) => {
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const [activeFilters, setActiveFilters] = useState([]);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [test, setTest] = useState(data?.response?.metaDataDTO);
  const [pageSize, setPageSize] = useState(15);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isFilter, setIsFilter] = useState(true);
  const [clear, setClear] = useState(false);

  const showProjectDrawer = () => {
    setDrawerOpen(true);
  };
  const onDrawerClose = () => {
    setDrawerOpen(false);
    form.resetFields();
  };

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
  };
  const showDrawer = () => {
    setTest(data?.response?.metaDataDTO);
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (values) => {
    const data = {
      projectName: values?.projectName,
      projectInitiatedDate: values.projectInitiatedDate?.[0]
        ?.startOf("day")
        ?.toISOString(),
      projectEndDate: values.projectInitiatedDate?.[1]
        ?.endOf("day")
        ?.toISOString(),
    };
    try {
      const res = await createProject(data);
      if (res?.status === "SUCCESS") {
        form.resetFields();
        getProjects();
        getAllProjects();
        onDrawerClose();
        getResponePopup(res);
      } else {
        getResponePopup(res);
      }
    } catch (error) {
      console.error("Project creation error:", error);
    }
  };


const handleDeleteProcess = async () => {
  try {
    const res = await deleteProcess();
    getResponePopup(res);
  } catch (error) {
    console.error("File deletion error:", error);
  }
};

  const handleReset = async () => {
    setIsResetting(true);

    const payload = {
      pageId: "937b0477-f0cd-46e7-b8ab-fefb38f91859",
    };
    try {
      const response = await tableDynamicColumnReset({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        getProjects();
        onClose();
        getResponePopup(response);
      }
      setIsResetting(false);
    } catch (error) {
      getResponePopup(error?.response);
    }
  };
  const getProjects = async () => {
    const response = await getTableData({
      pageId: "7e57d004-2b97-0e7a-b45f-5387367791cd",
      pageNo,
      pageSize,
      selectedDateRanges,
      selectedOption,
      searchText,
    });
  };
  const handleTableSubmit = async (data) => {
    setIsSubmitting(true);

    const payload = {
      pageId: "7e57d004-2b97-0e7a-b45f-5387367791cd",
      headerNames: data.map((col) => col.id),
    };

    try {
      const response = await tableDynamicColumn({ payload });
      if (response?.status === "SUCCESS") {
        setIsFilter(true);
        const filterCheck = tableCustomFilterClearCheck({
          searchText,
          selectedDateRanges,
          selectedDates,
          selectedOption,
          setSearchText,
          setSelectedDateRanges,
          setSelectedDates,
          setSelectedOption,
          data,
        });
        if (filterCheck) {
          getProjects();
        }
        onClose();
        getResponePopup(response);
      }
      setIsSubmitting(false);
    } catch (error) {
      getResponePopup(error?.response);
    }
  };
  useEffect(() => {
    setParamsFilter("check");
    if (window !== "undefined" && paramsFilter) {
      getProjects();
    }
  }, [
    selectedOption,
    selectedDateRanges,
    searchText,
    pageNo,
    paramsFilter,
    paginationFirst,
    pageLoad,
  ]);

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

  return (
    <div>
      <div className=" d-flex mt-5 mx-5">
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
            handleSubmit={handleTableSubmit}
            handleReset={handleReset}
            isSubmitting={isSubmitting}
            isResetting={isResetting}
            setClear={setClear}
            tableLoader={tableLoader}
          />
        </div>

        <div
          id="Project-btn"
          name="Project-btn"
          className="d-flex justify-content-center align-items-center mt-3 ms-2"
        >
          <Button
            data-testid="Project-user"
            className="btn btn-sm w-full text-ellipsis tableButton mt-2"
            onClick={showProjectDrawer}
          >
            Create Project
          </Button>
        </div>
        <div
          id="delete-btn"
          name="delete-btn"
          className="d-flex justify-content-center align-items-center mt-3 ms-2"
        >
          <Button
            data-testid="delete-files"
            className="btn btn-sm w-full text-ellipsis tableButton mt-2"
            onClick={handleDeleteProcess}
          >
            Delete files
          </Button>
        </div>
      </div>
      <div className="mx-3 mt-5">
        <AppTable
          data={data?.response?.pageResponse?.content}
          column={data?.response?.metaDataDTO.filter((item) => item.active)}
          loader={tableLoader}
          first={pageNo === 0 ? 0 : paginationFirst}
          totalRecords={data?.response?.pageResponse?.totalElements}
          row={15}
          onPageChange={onPageChange}
        />
      </div>
      <div>
        <Drawer
          title="Create New Project"
          onClose={onDrawerClose}
          open={drawerOpen}
        >
          <div className="mt-3 mx-4">
            <Form
              form={form}
              className="customInput"
              onFinish={handleSubmit}
              layout="vertical"
              autoComplete="off"
              style={{ maxWidth: 300 }}
            >
              <Form.Item
                label="Project Name"
                name="projectName"
                rules={[
                  {
                    required: true,
                    message: "Please enter Project Name",
                  },
                ]}
              >
                <Input placeholder="Project Name" />
              </Form.Item>
              <Form.Item
                name="projectInitiatedDate"
                rules={[
                  {
                    required: true,
                    message: "Please enter the Start Date and End Date",
                  },
                ]}
                label=" Date"
              >
                <RangePicker
                  inputReadOnly
                  style={{ border: "1px solid #d9d9d9" }}
                  format="MM-DD-YYYY"
                  disabledDate={(current) => disablePastDate(current)}
                />
              </Form.Item>
              <Form.Item>
                <div className="d-flex align-items-center justify-content-center">
                  <RegularButton
                    disabled={projectLoader}
                    type="submit"
                    name={"Create"}
                    loading={projectLoader}
                  />
                </div>
              </Form.Item>
            </Form>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    data: state?.tableView?.tableView?.data,
    tableLoader: state?.tableView?.tableViewLoading,
    pageLoad: state?.tenantAdmin?.tin?.getPageRendering,
    allRoles: state?.tenantAdmin?.patientsAllocation?.getRoles?.data?.response,
    projectLoader: state.tenantAdmin?.settings?.projectCreationLoading,
  }),
  {
    createProject: settingActions.createProjectAction,
    tableDynamicColumn: tableAction.tableDynamicColumn,
    tableDynamicColumnReset: tableAction.tableDynamicColumnReset,
    getTableData: tableAction.tableViewAction,
    getAllProjects: authActions.projectDetails,
    deleteProcess: settingActions.deleteProcessAction,
  }
);
export default enhancer(Projects);