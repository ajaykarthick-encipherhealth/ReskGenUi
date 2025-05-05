import React, { useEffect, useState } from "react";
import ReusableFilters from "../../../../components/reusableFilters";
import AppTable from "../../../../components/tables";
import { Button, Drawer, Form, Input } from "antd";
import { connect } from "react-redux";
import { actions as settingActions } from "../../../../stores/tenantAdmin/settings";
import {
  getResponePopup,
} from "../../../../utils/reusable";
import { actions as tableAction } from "../../../../stores/tableView";

const Clients = ({
  createClient,
  getTableData,
  data,
  tableLoader,
  tableDynamicColumn,
  tableDynamicColumnReset,
  pageLoad,
}) => {
  const [form] = Form.useForm();

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

  const showClientDrawer = () => {
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
      clientName: values?.clientName,
      clientId: values?.clientId,
    };
    try {
      const res = await createClient(data);
      if (res?.status === "SUCCESS") {
        form.resetFields();
        getClientsDetails();
        onDrawerClose();
        getResponePopup(res);
        setOpen(false);
      } else {
        setOpen(true);
      }
    } catch (error) {
      console.error("client creation error:", error);
      setOpen(false);
    }
  };
  const handleReset = async () => {
    setIsResetting(true);

    const payload = {
      pageId: "1b4e28ba-2fa1-11d2-883f-0016d3cca427",
    };
    try {
      const response = await tableDynamicColumnReset({ payload });
      if (response?.status === "SUCCESS") {
        getClientsDetails();
        onClose();
        getResponePopup(response);
      }
      setIsResetting(false);
    } catch (error) {
      getResponePopup(error?.response);
    }
  };
  const getClientsDetails = async () => {
    const response = await getTableData({
      pageId: "1b4e28ba-2fa1-11d2-883f-0016d3cca427",
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
      pageId: "1b4e28ba-2fa1-11d2-883f-0016d3cca427",
      headerNames: data.map((col) => col.id),
    };

    try {
      const response = await tableDynamicColumn({ payload });
      if (response?.status === "SUCCESS") {
        getClientsDetails();
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
    getClientsDetails();
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
    setActiveFilters(
      data?.response?.metaDataDTO.filter(
        (item) => item.active && item?.filter?.style
      )
    );
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
          />
        </div>

        <div
          id="Project-btn"
          name="Project-btn"
          className="d-flex justify-content-center align-items-center mt-3"
          style={{ width: "10%" }}
        >
          <Button
            data-testid="Project-user"
            className="btn btn-sm w-full text-ellipsis tableButton mt-2"
            onClick={showClientDrawer}
          >
            Create Client
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
        <div className="mt-3 mx-4">
          <Drawer
            title="Create New Client"
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
                  label="Client ID"
                  name="clientId"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Client ID",
                    },
                  ]}
                >
                  <Input placeholder="Client ID" />
                </Form.Item>
                <Form.Item
                  label="Client Name"
                  name="clientName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Client Name",
                    },
                  ]}
                >
                  <Input placeholder="Client Name" />
                </Form.Item>
                <Form.Item>
                  <div className="d-flex align-items-center justify-content-center">
                    <Button
                      htmlType="submit"
                      style={{
                        width: 100,
                        background: "rgb(4, 48, 111)",
                        color: "#fff",
                      }}
                    >
                      Create
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

const enhancer = connect(
  (state) => ({
    data: state?.tableView?.tableView?.data,
    tableLoader: state?.tableView?.tableViewLoading,
    pageLoad: state?.tenantAdmin?.tin?.getPageRendering,
  }),
  {
    createProject: settingActions.createProjectAction,
    tableDynamicColumn: tableAction.tableDynamicColumn,
    tableDynamicColumnReset: tableAction.tableDynamicColumnReset,
    getTableData: tableAction.tableViewAction,
    createClient: settingActions.createClientAction,
  }
);
export default enhancer(Clients);
