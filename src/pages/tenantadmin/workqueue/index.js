import React from 'react'
import CodersTable from '../../../commonPages/codersTable';
import { getStorage } from '../../../utils/storages';
import { workQueuePageId } from '../../../utils/pageIds';

const Patients =  () => {
  const userId = getStorage("userId")
  return (
    <div>
      <CodersTable
        patientAllocated={userId}
        pageId={workQueuePageId}
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