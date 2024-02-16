import { Button, Result } from 'antd';
import { useRouter } from 'next/router';
import React from 'react'

const UnAuthorized = () => {
  const route=useRouter()
  return (
    <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={<Button type="primary" onClick={()=>route.back()}> Go Back </Button>}
  />
  )
}

export default UnAuthorized;