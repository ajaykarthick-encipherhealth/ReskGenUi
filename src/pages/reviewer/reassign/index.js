import React from "react";
import CodersTable from "../../../commonPages/codersTable";
import { getStorage } from "../../../utils/storages";
import { reAssignedPageId } from '../../../utils/pageIds';

const Reassign = () => {
  const userId = getStorage("userId");
  return (
    <div>
      <CodersTable
        patientAllocated={userId}
        isReAssigned={true}
        pageId={reAssignedPageId}
        route="/reviewer/reassign/details"
        tin
        backRoute="/reviewer/reassign"
      />
    </div>
  );
};

export default Reassign;
