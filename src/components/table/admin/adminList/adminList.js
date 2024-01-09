import React, {useState } from "react";
import TableStyle from "../../table.module.css";
import moment from "moment";
import { Paginator } from "primereact/paginator";
import Footer from "../../../../jsx/layouts/Footer";

export default function AdminList({ userList, getAllList }) {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [paginationFirst, setPaginationFirst] = useState(0);
  const onPageChange = async (event) => {
    const newPageNo = event.page;
    setPageNo(newPageNo);
    setPaginationFirst(newPageNo * pageSize);

    var tenId = localStorage.getItem("tenantId");
    var uId = localStorage.getItem("userId");
    var orgId = localStorage.getItem("orgId");

    await getAllList(tenId, orgId, newPageNo, pageSize, status);
  };

  return (
    <div className={TableStyle.classContaineer}>
      <table className={TableStyle.classTable}>
        <thead className={TableStyle.classThead}>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Role</th>
            {/* <th>Status</th> */}
            <th>Date Created</th>
            {/* <th>Action</th> */}
          </tr>
        </thead>
        <tbody>
          {userList?.record?.map((item, index) => (
            <tr key={index} style={{ height: "35px" }}>
              <td
                className={TableStyle.childBorder}
                style={{ height: "47px !important" }}
              >
                <span>{item.firstName ? item.firstName : "---"}</span>
              </td>
              <td
                className={TableStyle.childBorder}
                style={{ height: "40px !important" }}
              >
                <span>{item.lastName ? item.lastName : "---"}</span>
              </td>
              <td
                className={TableStyle.childBorder}
                style={{ height: "40px !important" }}
              >
                <span>{item.userName ? item.userName : "---"}</span>
              </td>
              <td
                className={TableStyle.childBorder}
                style={{ height: "40px !important" }}
              >
                <span>{item.email ? item.email : "---"}</span>
              </td>
              <td
                className={TableStyle.childBorder}
                style={{ height: "40px !important" }}
              >
                <span>{item?.role[0] ? item?.role[0] : "---"}</span>
              </td>
              {/* <td
                className={TableStyle.childBorder}
                style={{ height: "40px !important" }}
              >
                <span key={index}>
                  {" "}
                  <Switch
                    id={index}
                      onChange={(event) =>
                        switchHandler(event, index)
                      }
                      checked={isStatus[index]}
                    checkedChildren="Enabled"
                    unCheckedChildren="Disabled"
                  />
                </span>
              </td> */}
              <td
                className={TableStyle.lastBorder}
                style={{ height: "40px !important" }}
              >
                <span>
                  {moment(item.createdDate).format("DD/MM/YYYY hh:mm A")}
                </span>
              </td>
              {/* <td>
                                  <div className="d-flex">
                                    <button
                                      onClick={() => userEdit(item)}
                                      className="btn hegiht10 btn-primary shadow  sharp me-1 action-btn"
                                    >
                                      <FontAwesomeIcon
                                        icon={faPencilAlt}
                                        fontSize={11}
                                      />
                                    </button>
                                    <button
                                      onClick={() => userDelete(item)}
                                      className="btn hegiht10 btn-danger shadow  sharp me-1 action-btn"
                                    >
                                      <FontAwesomeIcon
                                        icon={faTrash}
                                        fontSize={11}
                                      />
                                    </button>
                                  </div>
                                </td> */}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-container">
        <Paginator
          first={paginationFirst}
          rows={15}
          totalRecords={userList?.count}
          onPageChange={onPageChange}
        />
        <div className="total-pages">Total count: {userList?.count}</div>
      </div>
      <Footer />
    </div>
  );
}
