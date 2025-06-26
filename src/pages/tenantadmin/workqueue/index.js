import React from 'react'
import CodersTable from '../../../commonPages/codersTable';
import { getStorage } from '../../../utils/storages';

const Patients =  () => {
  const userId = getStorage("userId")
  return (
    <div>
      <CodersTable
        patientAllocated={userId}
        pageId={"da4958c3-7795-4bcc-8ab0-24d93cd52c25"}
        isReAssigned={false}
        isQueried={false}
        route="/tenantadmin/workqueue/details"
        tin
        backRoute="/tenantadmin/workqueue"
      />
    </div>
  );
}

export default Patients;