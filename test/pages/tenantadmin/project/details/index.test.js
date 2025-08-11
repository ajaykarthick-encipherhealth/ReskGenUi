import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

jest.mock("react-redux", () => ({ connect: () => (Comp) => Comp }));

const DetailsMock = jest.fn(() => <div data-testid="details-project" />);
jest.mock("../../../../../src/components/patientDetails/details", () => ({
  __esModule: true,
  default: (props) => DetailsMock(props),
}));

import ProjectDetailsPage from "../../../../../src/pages/tenantadmin/project/details";

describe("tenantadmin/project/details page unit tests", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("P: renders Details once", () => {
    render(<ProjectDetailsPage />);
    expect(screen.getByTestId("details-project")).toBeInTheDocument();
    expect(DetailsMock).toHaveBeenCalledTimes(1);
  });

  it("N: passes no props to Details", () => {
    render(<ProjectDetailsPage />);
    const args = DetailsMock.mock.calls[0]?.[0] || {};
    expect(Object.keys(args)).toHaveLength(0);
  });

  it("E: unmount and fresh render works", () => {
    const { unmount } = render(<ProjectDetailsPage />);
    unmount();
    render(<ProjectDetailsPage />);
    expect(screen.getByTestId("details-project")).toBeInTheDocument();
  });
});
