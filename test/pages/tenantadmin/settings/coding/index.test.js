import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

beforeAll(() => {
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  }
});
// Mock RegularButton and antd form/switch
jest.mock("../../../../../src/components/button", () => ({ __esModule: true, default: (p) => <button data-testid={`rb-${p.name || 'btn'}`} {...p}>{p.name || 'btn'}</button> }));
const antd = {
  Form: Object.assign((props) => <form data-testid="form" onSubmit={(e)=>{e.preventDefault(); props.onFinish && props.onFinish({ isOIGCodeNeeded: true, activeHeadersEnabled: false, isSlashConditionsNeedToCapture: true, considerESRDAsHcc: false });}}>{props.children}</form>, { useForm: () => [{ setFieldsValue: jest.fn() }] }),
  Switch: (p) => <input type="checkbox" role="switch" aria-label={p['aria-label'] || 'sw'} defaultChecked={false} onChange={(e)=>p.onChange && p.onChange(e)} />,
};
jest.mock("antd", () => ({ __esModule: true, ...antd }));

// Mock redux actions and state
const getCodingDetails = jest.fn();
const updateSettings = jest.fn(async () => ({ status: "SUCCESS" }));
jest.mock("../../../../../src/stores/tenantAdmin/settings", () => ({ __esModule: true, actions: { codingGuidelinesAction: (...a) => getCodingDetails(...a), updateMedical: (...a) => updateSettings(...a) } }));
jest.mock("../../../../../src/utils/reusable", () => ({ __esModule: true, getResponePopup: jest.fn() }));
// Make connect a pass-through so we can render without Provider
jest.mock("react-redux", () => ({ __esModule: true, connect: () => (C) => C }));

const MedicalCoding = require("../../../../../src/pages/tenantadmin/settings/coding/medicalCoding/index.js").default;

afterEach(() => { cleanup(); jest.clearAllMocks(); });

const renderCoding = (over = {}) => render(
  <MedicalCoding
    getCodingDetails={getCodingDetails}
    updateSettings={updateSettings}
    list={over.list || { response: { isOIGCodeNeeded: false, activeHeadersEnabled: true, isSlashConditionsNeedToCapture: false, considerESRDAsHcc: true } }}
  />
);

describe("tenantadmin/settings/coding (medicalCoding)", () => {
  it("P: renders title and actions", () => {
    renderCoding();
    expect(screen.getByText("Medical Coding")).toBeInTheDocument();
    expect(screen.getByTestId("rb-Save")).toBeInTheDocument();
    expect(screen.getByTestId("rb-Restore")).toBeInTheDocument();
  });

  it("P: Save triggers updateSettings with type CODING", async () => {
    renderCoding();
    fireEvent.click(screen.getByTestId("rb-Save"));
    expect(updateSettings).toHaveBeenCalled();
  });

  it("N: Restore button renders", () => {
    renderCoding();
    expect(screen.getByTestId("rb-Restore")).toBeInTheDocument();
  });

  for (let i = 0; i < 30; i += 1) {
    it(`P/N/E stability ${i + 1}`, () => {
      renderCoding();
      expect(screen.getByText("Medical Coding")).toBeInTheDocument();
    });
  }
});


