import React from 'react'
import CodersTable from '../../../commonPages/codersTable';
import { getStorage } from '../../../utils/storages';

const Queried =  () => {
  const userId = getStorage("userId")
  const roleId = getStorage("roleId")
  return (
    <div>
      <CodersTable
        patientAllocated={userId}
        isQueried={true}
        pageId="a9d5c555-7954-4382-a2ef-3f66b292cf8f"
        route="/reviewer/queried/details"
        tin
        backRoute="/reviewer/queried"
        roleId={roleId}
      />
    </div>
  );
}

export default Queried;