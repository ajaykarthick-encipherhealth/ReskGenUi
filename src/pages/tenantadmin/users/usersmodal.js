import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, DatePicker, Empty, Modal, Select } from "antd";
import modalStyle from "../../../pages/tenantadmin/allocateduser/allocate/style.module.css";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import styles from "../../../components/tables/table.module.css";
import TableSkeleton from "../../../components/skeleton/table";
import RegularButton from "../../../components/button";
import { actions as authActions } from "../../../stores/authFlows";
import { actions as allActions } from "../../../stores/tenantAdmin/users";
import { getStorage } from "../../../utils/storages";
import { getResponePopup } from "../../../utils/reusable";

const UsersModal = ({
  open,
  setOpen,
  usersLoader,
  getAllRoles,
  allRoles,
  getAllUsersList,
  assignedUsers,
  getUsersAPi,
}) => {
  const [activeCard, setActiveCard] = useState("");
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const [userName, setUserName] = useState([]);
  const getInitials = (firstName, lastName) => {
    const firstNameInitial = firstName?.charAt(0) || "";
    const secondNameInitial = lastName?.charAt(0) || "";
    return firstNameInitial?.toUpperCase() + secondNameInitial?.toUpperCase();
  };
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roleIds, setRoleIds] = useState([]);

  const getUserList = async () => {
    const response = await getAllUsersList({ searchText : search });
    if (response?.status === "SUCCESS") {
      let result = response?.response;
      const user = result?.map((item) => {
        return {
          firstName: item?.firstName,
          lastName: item?.lastName,
          id: item?.id,
          role: item?.role,
          email: item?.userName,
        };
      });
      setUserDetails(user);
      {
      }
    }
  };

  const setRoles = async () => {
    const clientId = getStorage("client");
    const projectId = getStorage("project");
    setIsLoading(true);
    const response = await assignedUsers({
      data: {
        userNames: userName,
        authorizedDetails: [
          {
            clientId: clientId,
            projects: [
              {
                projectId: projectId,
                roles: roleIds,
              },
            ],
          },
        ],
      },
    });
    if (response?.status == "SUCCESS") {
      setIsLoading(false);
      getUserList();
      getUsersAPi();
      getResponePopup(response);
      setOpen(false);
      setUserName([]);
      setSearch("");
      setSelectedUserIds([]);
      setRoleIds([]);
      setIsSecondModalOpen(false);
    } else {
      getResponePopup(response);
      setIsLoading(false);
      setUserName([]);
      setRoleIds([]);
    }
  };
  const handleUserSelect = (id, email) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter((userId) => userId !== id));
      setUserName(userName.filter((e) => e !== email));
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
      setUserName([...userName, email]);
    }
  };

  const handleSelectAll = () => {
    if (selectedUserIds?.length === userDetails?.length) {
      setSelectedUserIds([]);
      setUserName([])
    } else {
      const allIds = userDetails?.map((user) => user?.id);
      setSelectedUserIds(allIds);
      setUserName(userDetails?.map((user) => user?.email));
    }
  };

  const handleRoleSelect = (id) => {
    if (roleIds?.includes(id)) {
      setRoleIds(roleIds.filter((userId) => userId !== id));
    } else {
      setRoleIds([...roleIds, id]);
    }
  };
  const handleRoleSelectAll = () => {
    if (roleIds?.length === allRoles?.content?.length) {
      setRoleIds([]);
    } else {
      const allIds = allRoles?.content?.map((user) => user.roleId);
      setRoleIds(allIds);
    }
  };

  useEffect(() => {
    getUserList({ search });
  }, [search]);

  useEffect(() => {
    getAllRoles({ searchText: search || "" });
  }, [search]);
  return (
    <div>
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setActiveCard("");
          setUserName([]);
          setSearch("");
          setSelectedUserIds([]);
          setRoleIds([]);
        }}
        title="Select User"
        footer={false}
        width={700}
        height={100}
        className={"custom-modal"}
      >
        <div class="form-group d-flex align-items-center justify-content-between has-search">
          <FontAwesomeIcon
            className="fa fa-search form-control-feedback"
            icon={faSearch}
          />
          <InputText
            autoComplete="off"
            id="search-input"
            name="search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=" w-50 form-control new-form-control"
            placeholder="Search"
            maxLength={25}
            onKeyDown={(e) => {
              if (e.key === "\\") {
                e.preventDefault();
              }
            }}
          />
          {userDetails?.length > 0 ? (
            <div className="d-flex align-items-center ">
              <div className="fontWeight3 font3">Select All</div>
              <input
                className={`mx-4  ${styles.checkbox} ${styles.bodyCheckbox}${
                  selectedUserIds?.length === userDetails?.length
                    ? styles.customChecked2
                    : ""
                } `}
                type="checkbox"
                id="selectAll"
                checked={selectedUserIds?.length === userDetails?.length}
                onChange={handleSelectAll}
              />
            </div>
          ) : (
            ""
          )}
        </div>
        {usersLoader ? (
          <TableSkeleton />
        ) : userDetails?.length > 0 ? (
          <div className={modalStyle.scroll}>
            {userDetails?.map((item) => (
              <div className="mt-4 ">
                <div
                  className={`form-control new-item-control my-2 p-0 ${
                    item?.id == activeCard
                      ? modalStyle.listContentLarge
                      : modalStyle.listContent
                  }`}
                >
                  <div className="d-flex justify-content-between">
                    <div className="d-flex">
                      <Avatar
                        size={65}
                        shape="square"
                        style={{ backgroundColor: "#04306F" }}
                      >
                        {item?.firstName || item?.lastName ? (
                          getInitials(item?.firstName, item?.lastName)
                        ) : (
                          <FontAwesomeIcon
                            className="fa fa-search"
                            icon={faUser}
                          />
                        )}
                      </Avatar>
                      <div className="p-3">
                        <p className={`${modalStyle.listName} mb-1`}>
                          {item?.firstName + " " + item?.lastName}
                        </p>
                        <p className={`${modalStyle.listRole}`}>
                          {item?.role
                            ? item?.role?.map((item) => (
                                <span className="px-1">{item}</span>
                              ))
                            : null}
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedUserIds?.includes(item?.id)}
                      onChange={() => handleUserSelect(item?.id, item?.email)}
                      className={` me-2 ms-3 align-self-center cursor-pointer rounded  ${styles.bodyCheckbox}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <div className="d-flex align-items-center justify-content-center mt-5">
              No users available. Please create users.
            </div>
          </div>
        )}
        {userDetails?.length > 0 ? (
          <div className="d-flex justify-content-center mt-3">
            <RegularButton
              name={"Next"}
              type="submit"
              onClick={() => {
                setIsSecondModalOpen(true);
                setOpen(false);
              }}
              disabled={userName?.length === 0}
            />
          </div>
        ) : (
          ""
        )}
      </Modal>
      <Modal
        open={isSecondModalOpen}
        onCancel={() => {
          setRoleIds([]);
          setIsSecondModalOpen(false);
          setSelectedUserIds([]);
          setIsLoading(false);
          setUserName([]);
        }}
        footer={null}
        width="35%"
      >
        <div class="form-group d-flex align-items-center justify-content-between has-search">
          <FontAwesomeIcon
            className="fa fa-search form-control-feedback"
            icon={faSearch}
          />
          <InputText
            autoComplete="off"
            id="search-input"
            name="search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=" w-50 form-control new-form-control"
            placeholder="Search"
            maxLength={25}
            onKeyDown={(e) => {
              if (e.key === "\\") {
                e.preventDefault();
              }
            }}
          />
          <div className="d-flex align-items-center ">
            <div className="fontWeight3 font3">Select All</div>
            <input
              className={`mx-4 ${styles.bodyCheckbox}  ${styles.checkbox}${
                roleIds?.length === allRoles?.userRoles?.length
                  ? styles.customChecked2
                  : ""
              } `}
              type="checkbox"
              id="selectAll"
              checked={roleIds?.length === allRoles?.content?.length}
              onChange={handleRoleSelectAll}
            />
          </div>
        </div>
        {usersLoader ? (
          <TableSkeleton />
        ) : allRoles?.content?.length > 0 ? (
          <div className={modalStyle.scroll}>
            {allRoles?.content?.map((item) => (
              <div className="mt-4 ">
                <div
                  className={`form-control new-item-control my-2 p-0 ${
                    item?.id == activeCard
                      ? modalStyle.listContentLarge
                      : modalStyle.listContent
                  }`}
                >
                  <div className="d-flex justify-content-between">
                    <div className="p-3 mt-3">
                      <p className={`${modalStyle.listName} mb-1`}>
                        {item?.roleName?.split("_")?.join(" ")}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={roleIds?.includes(item?.roleId)}
                      onChange={() => handleRoleSelect(item?.roleId)}
                      className={` me-2 ms-3 align-self-center cursor-pointer rounded  ${styles.bodyCheckbox}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <Empty />
          </div>
        )}
        <>
          <div className="d-flex justify-content-center">
            <RegularButton
              name="Assign"
              onClick={setRoles}
              loading={isLoading}
              disabled={roleIds?.length === 0}
            />
          </div>
        </>
      </Modal>
    </div>
  );
};

const connector = connect(
  (state) => ({
    usersLoader: state?.tenantAdmin?.users?.usersLoader,
    allRoles: state?.tenantAdmin?.users?.getUsersRoles?.data?.response,
    usersData:
      state?.tenantAdmin?.users?.getAllUsersData?.data?.response?.content,
  }),
  {
    getAllRoles: allActions.usersAllRoles,
    getAllUsersList: allActions.getUsers,
    assignedUsers: allActions.usersAssigned,
  }
);
export default connector(UsersModal);
