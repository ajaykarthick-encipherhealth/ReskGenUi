import { requestPortal } from "../../utils/network";

export async function getAllOnBoarding(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `securityservice/tenant/full/onboarding`,
    options
  );
  return data;
}

export async function getAlltenantOnBoarding(obj) {
  const options = {
    method: "POST",
    body: JSON.stringify(obj),
  };
  const data = await requestPortal(
    `securityservice/auth/organization/create`,
    options
  );
  return data;
}


