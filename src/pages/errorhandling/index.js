import { Button } from "antd";
import { connect } from "react-redux";
import { actions as allActions } from "../../stores/tenantAdmin/patientAllocation";

const ErrorSimulation = ({ setError }) => {
  const handle403Error = async () => {
    const payload = { exceptionhandling: "FORBIDDEN" };
    await setError({ data: payload });
  };
  const handle500Error = async () => {
    const payload = { exceptionhandling: "INTERNAL_SERVER_ERROR" };
    await setError({ data: payload });
  };
  const handle513Error = async () => {
    const payload = { exceptionhandling: "USER_DEFINED_ERROR" };
    await setError({ data: payload });
  };
  const handle512Error = async () => {
    const payload = { exceptionhandling: "EXCEPTION" };
    await setError({ data: payload });
  };

  return (
    <>
      {
        <>
          <Button onClick={handle403Error}>Simulate 403 Error</Button>
          <Button onClick={handle500Error}>Simulate 500 Error</Button>
          <Button onClick={handle513Error}>Simulate 513 Error</Button>
          <Button onClick={handle512Error}>Simulate 512 Error</Button>
        </>
      }
    </>
  );
};

const connector = connect((state) => ({}), {
  setError: allActions.setErrorHandling,
});
export default connector(ErrorSimulation);
