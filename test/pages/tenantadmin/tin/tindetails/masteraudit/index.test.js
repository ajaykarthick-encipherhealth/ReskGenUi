import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

jest.mock("react-redux", () => ({ connect: () => (Comp) => Comp }));

const DetailsMock = jest.fn(() => <div data-testid="details-masteraudit" />);
jest.mock("../../../../../../src/components/patientDetails/details", () => ({
  __esModule: true,
  default: (props) => DetailsMock(props),
}));

import MasterAuditPage from "../../../../../../src/pages/tenantadmin/tin/tindetails/masteraudit";

describe("TIN tindetails/masteraudit page unit tests", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("renders and calls Details once", () => {
    render(<MasterAuditPage />);
    expect(screen.getByTestId("details-masteraudit")).toBeInTheDocument();
    expect(DetailsMock).toHaveBeenCalledTimes(1);
  });

  it("passes no props to Details", () => {
    render(<MasterAuditPage />);
    const callArgs = DetailsMock.mock.calls[0]?.[0] || {};
    expect(Object.keys(callArgs)).toHaveLength(0);
  });
});
