import React, { useState } from "react";
import AppTable from "../../../components/tables";
import RegularButton from "../../../components/button";
import { connect } from "react-redux";
import { Modal } from "antd";

const QueryTable = ({
  data,
  active,
  setActive,
  setActiveStatus,
  tableLoader,
  gotoPatientDetails,
  setSort,
  sort,
  statusBodyTemplate,
}) => {
  const buttons = ["Pending", "Approved", "Rejected"];
  const [pageNo, setPageNo] = useState(0);
  const [paginationFirst, setPaginationFirst] = useState(0);
    const [pageSize, setPageSize] = useState(15);

  const onPageChange = (e) => {
    setPaginationFirst(e.first);
    setPageNo(e.page);
    setPageSize(e.rows);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleClick = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mt-3">
      <div>
        {buttons.map((btn) => (
          <RegularButton
            key={btn}
            name={btn}
            type={active === btn ? "primary" : "outline"}
            onClick={() => {
              setSort(""), setActive(btn);
              setActiveStatus(btn.toLocaleUpperCase());
            }}
          />
        ))}
      </div>
      <div className="mt-3">
        <AppTable
          data={data?.response?.pageResponse?.content}
          column={data?.response?.metaDataDTO.filter((item) => item.active)}
          loader={tableLoader}
          pagination={true}
          first={pageNo === 0 ? 0 : paginationFirst}
          totalRecords={data?.response?.pageResponse?.totalElements}
          row={15}
          onPageChange={onPageChange}
          onRowClick={
            active === "Approved" || active === "Rejected"
              ? showModal
              : gotoPatientDetails
          }
          setSort={setSort}
          sort={sort}
          statusBodyTemplate={statusBodyTemplate}
        />
      </div>
      <div>
        <Modal
          open={isModalOpen}
          footer={null}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div className=" d-flex align-items-center justify-content-center mt-2">
            You are Unable to Open this file
          </div>
          <div className="d-flex align-items-center justify-content-center mt-4">
            <RegularButton onClick={handleClick} name={"Ok"} />
          </div>
        </Modal>
      </div>
    </div>
  );
};

const connector = connect(
  (state) => ({
    data: state?.tableView?.tableView?.data,
  }),
  {  }
);

export default connector(QueryTable);
