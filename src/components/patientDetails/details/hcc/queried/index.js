import React from 'react';
import StatusCard from './card';

const Index = ({queriedData}) => {
  const data = {
    status: "SUCCESS",
    message: "Success!!",
    response: [
      {
        roleId: "3",
        approvalStatus: "REJECTED",
        queryReason: "Clarification on diagnosis",
        queriedTo: "jonsnow@encipherhealthinternal.onmicrosoft.com",
        queriedOn: "2025-04-17T13:36:41.054Z",
        performedOn: null,
        rejectedReason: null,
        queriedAlllocated: {
          firstName: "john",
          lastName: "smith"
        }
      },
      {
        roleId: "3",
        approvalStatus: "APPROVED",
        queryReason: "Clarification on diagnosis data",
        queriedTo: "jonsnow@encipherhealthinternal.onmicrosoft.com",
        queriedOn: "2025-04-17T13:36:41.054Z",
        performedOn: null,
        rejectedReason: null,
        queriedAlllocated: {
          firstName: "john",
          lastName: "smith"
        }
      },
      {
        roleId: "3",
        approvalStatus: "PENDING",
        queryReason: "Clarification on diagnosis data",
        queriedTo: "jonsnow@encipherhealthinternal.onmicrosoft.com",
        queriedOn: "2025-04-17T13:36:41.054Z",
        performedOn: null,
        rejectedReason: null,
        queriedAlllocated: {
          firstName: "john",
          lastName: "smith"
        }
      },
      {
        roleId: "3",
        approvalStatus: "QUERIED",
        queryReason: "Clarification on diagnosis data",
        queriedTo: "jonsnow@encipherhealthinternal.onmicrosoft.com",
        queriedOn: "2025-04-17T13:36:41.054Z",
        performedOn: null,
        rejectedReason: null,
        queriedAlllocated: {
          firstName: "john",
          lastName: "smith"
        }
      }
    ]
  };

  return (
    <div style={{ background: "#F5F9FE", height: "100%" , overflowY:"scroll" }} className="container py-5">
      <div >
        {data.response.map((item, index) => (
          <StatusCard
            key={index}
            number={item.queriedAlllocated.firstName.charAt(0).toUpperCase()}
            name={`${item.queriedAlllocated.firstName} ${item.queriedAlllocated.lastName}`}
            status={item.approvalStatus}
            reason={item.queryReason}
            date={(item.queriedOn)}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
