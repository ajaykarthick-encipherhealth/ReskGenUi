import { requestPortal } from "../../../utils/network";

export async function PatientsList({ physicianId, patientId }) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/comparison?physicianId=${physicianId}&patientId=${patientId}
    `,
    options
  );
  return data;
}

export async function getPatientList({
  physicianId="",
  from="",
  to="",
  priority="",
  search="",
}) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/get-patients-list/filter?physicianId=${physicianId}&from=${from}&to=${to}&priority=${priority}&search=${search}
    `,
    options
  );
  return data;
}

export async function getColors() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/section/color/getallsections
    `,
    options
  );
  return data;
}

export async function getCalendarData({ physicianId, month, year }) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/calender?physicianId=${physicianId}&month=${month}&year=${year}
    `,
    options
  );
  return data;
}

export async function GraphContent({
  physicianId,
  currentBtn,
  selectedMonth,
  selectedYear,
}) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/statistics?physicianId=${physicianId}&year=${selectedYear}&month=${selectedMonth}&date=${currentdate}&range=${currentBtn}
    `,
    options
  );
  return data;
}
