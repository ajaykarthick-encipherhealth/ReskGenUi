import React from 'react'
import CodersTable from '../../../commonPages/codersTable';

const Reassign =  () => {
    const userId = getStorage("userId")
  return (
    <div>
      <CodersTable patientAllocated={userId} isReAssigned={true} pageId="e76aaa6c-319e-44d3-b7ae-aadb17dfb664" />
    </div>
  );
}

export default Reassign;
