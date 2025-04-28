import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReusableFilters from "../../../../components/reusableFilters";
import AppTable from "../../../../components/tables";
import data from "../../../../pages/reviewer/patients/data.json";
import { Button, DatePicker, Drawer, Form, Input } from "antd";
import { connect } from "react-redux";
import { actions as settingActions } from "../../../../stores/tenantAdmin/settings";

const Clients = ({ createClient }) => {
  const [form] = Form.useForm();
  const commonFilterItems = [
    {
      id: "01",
      title: "Search",
      type: "search",
      value: null,
      placeholder: "Search",
      header: "Patient Name / ID",
      active: true,
    },
  ];
  const columns = [
    {
      headerName: "Patient Id",
      actualField: "patientId",
      isShow: true,
      filterKey: "Search",
    },
    {
      headerName: "Batch Name",
      value: "batchName",
      isShow: true,
      filterKey: "batch",
    },
    {
      headerName: "File Name",
      value: "fileName",
      isShow: true,
    },
    {
      headerName: "HCC Count",
      value: "validDiseaseCount",
      isShow: true,
    },
    {
      headerName: "Allocated Date",
      value: "allocatedOn",
      sortable: true,
      isDate: true,
      isShow: true,
      filterKey: "allocatedDate",
    },
    {
      headerName: "Due Date",
      value: "dueDate",
      sortable: true,
      isDate: true,
      isShow: true,
      filterKey: "dueDate",
    },
    {
      headerName: "Completed Date",
      value: "processedDate",
      sortable: true,
      isDate: true,
      isShow: true,
      filterKey: "completedDate",
    },

    {
      headerName: "Allocated By",
      sortable: true,
      isImage: true,
      value: {
        first: "allocatedByFirstName",
        last: "allocatedBylastName",
        img: "allocatedByProfileImage",
      },
      isShow: true,
    },
    {
      headerName: "Priority",
      value: "priority",
      isShow: true,
      filterKey: "Priority",
    },
    {
      headerName: "Status",
      value: "statusProxy",
      proxcystatus: true,
      infoIcon: true,
      isShow: true,
      filterKey: "Status",
    },
  ];
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState(commonFilterItems);
  const [paramsFilter, setParamsFilter] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDateRanges, setSelectedDateRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
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
            columns={columns}
          />
        </div>

        <div
          id="client-btn"
          name="client-btn"
          className="d-flex justify-content-center align-items-center mt-3"
          style={{ width: "10%" }}
        >
          <Button
            data-testid="client-user"
            className="btn btn-sm w-full text-ellipsis tableButton"
            onClick={showDrawer}
          >
            Create Client
          </Button>
        </div>
      </div>
      <div className="mx-3 mt-5">
        <AppTable
          data={data}
          column={columns.filter((item) => item.isShow)}
          loader={""}
          first={pageNo === 0 ? 0 : paginationFirst}
          totalRecords={34}
          row={15}
          onPageChange={onPageChange}
        />
      </div>
      <div>
        <Drawer title="Create New Client" onClose={onClose} open={open}>
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
  );
};

const enhancer = connect((state) => ({}), {
  createClient: settingActions.createClientAction,

});
export default enhancer(Clients);
