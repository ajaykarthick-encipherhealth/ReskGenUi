import {requestApiPortal} from "../../../utils/network"



export const codify = async ({ diseases})  => {
  console.log(diseases,"diseases")
  // http://localhost:9003/controlzen/getDiags?q=Cholera
  const options = {
    method: "GET",
  };
  const url = `q=${diseases}`
  const data = await requestApiPortal(`controlzen/getDiags?${url}`,
  options
);
  return data;

};




