import React from 'react'
import CodersTable from '../../../commonPages/codersTable';
import { getStorage } from '../../../utils/storages';
import { queriedPageId } from '../../../utils/pageIds';

const Queried =  () => {
  const userId = getStorage("userId")
  const roleId = getStorage("roleId")
  return (
    <div>
      <CodersTable
        patientAllocated={userId}
        isQueried={true}
        pageId={queriedPageId}
        route="/reviewer/queried/details"
        tin
        backRoute="/reviewer/queried"
        roleId={roleId}
      />
    </div>
  );
}

export default Queried;