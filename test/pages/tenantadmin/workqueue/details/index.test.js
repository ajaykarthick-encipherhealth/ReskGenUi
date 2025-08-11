import React from "react";
import { render, cleanup } from "@testing-library/react";

// Pass-through connect if used anywhere
jest.mock("react-redux", () => ({ connect: () => (Comp) => Comp }));

// Mock the child Details component to observe usage
const DetailsMock = jest.fn(() => <div data-testid="details" />);
jest.mock("../../../../../src/components/patientDetails/details", () => ({
  __esModule: true,
  default: (...args) => DetailsMock(...args),
}));

import Page from "../../../../../src/pages/tenantadmin/workqueue/details";

describe("tenantadmin/workqueue/details wrapper unit tests", () => {
  afterEach(() => {
    cleanup();
    DetailsMock.mockClear();
  });

  it("P: renders Details once without props", () => {
    render(<Page />);
    expect(DetailsMock).toHaveBeenCalledTimes(1);
    expect(DetailsMock.mock.calls[0][0]).toEqual({});
  });

  it("N: unmount does not call Details again", () => {
    const { unmount } = render(<Page />);
    unmount();
    expect(DetailsMock).toHaveBeenCalledTimes(1);
  });

  it("E: separate render after cleanup still calls once", () => {
    render(<Page />);
    cleanup();
    DetailsMock.mockClear();
    render(<Page />);
    expect(DetailsMock).toHaveBeenCalledTimes(1);
  });

  // Props should not be forwarded from wrapper to Details
  it("P: ignores arbitrary string prop", () => {
    render(<Page anyProp="x" />);
    expect(DetailsMock).toHaveBeenCalledTimes(1);
    expect(DetailsMock.mock.calls[0][0]).toEqual({});
  });

  it("P: ignores number prop", () => {
    render(<Page num={123} />);
    expect(DetailsMock.mock.calls[0][0]).toEqual({});
  });

  it("P: ignores boolean prop", () => {
    render(<Page flag />);
    expect(DetailsMock.mock.calls[0][0]).toEqual({});
  });

  it("P: ignores object prop", () => {
    render(<Page obj={{ a: 1 }} />);
    expect(DetailsMock.mock.calls[0][0]).toEqual({});
  });

  it("P: ignores array prop", () => {
    render(<Page list={[1, 2, 3]} />);
    expect(DetailsMock.mock.calls[0][0]).toEqual({});
  });

  it("E: ignores function prop", () => {
    const fn = () => {};
    render(<Page cb={fn} />);
    expect(DetailsMock.mock.calls[0][0]).toEqual({});
  });

  it("E: ignores symbol prop", () => {
    // @ts-ignore
    render(<Page sym={Symbol("s")} />);
    expect(DetailsMock.mock.calls[0][0]).toEqual({});
  });

  it("E: ignores null/undefined props", () => {
    // @ts-ignore
    render(<Page n={null} u={undefined} />);
    expect(DetailsMock.mock.calls[0][0]).toEqual({});
  });

  // Children should not be rendered or forwarded
  it("P: children are not forwarded to Details", () => {
    render(
      <Page>
        <span data-testid="child">child</span>
      </Page>
    );
    expect(DetailsMock).toHaveBeenCalledTimes(1);
    expect(DetailsMock.mock.calls[0][0]).toEqual({});
  });

  it("N: children content not present in DOM", () => {
    const { queryByTestId } = render(
      <Page>
        <span data-testid="child">child</span>
      </Page>
    );
    expect(queryByTestId("child")).toBeNull();
  });

  // Multiple renders and stability
  it("P: consecutive renders each call Details once", () => {
    render(<Page />);
    cleanup();
    DetailsMock.mockClear();
    render(<Page />);
    expect(DetailsMock).toHaveBeenCalledTimes(1);
  });

  it("E: rerender same element keeps single call per render", () => {
    const { rerender } = render(<Page />);
    expect(DetailsMock).toHaveBeenCalledTimes(1);
    DetailsMock.mockClear();
    rerender(<Page />);
    expect(DetailsMock).toHaveBeenCalledTimes(1);
  });

  // Try a variety of prop shapes to ensure non-forwarding
  it("E: ignores deeply nested props", () => {
    render(<Page deep={{ a: { b: { c: 3 } } }} />);
    expect(DetailsMock.mock.calls[0][0]).toEqual({});
  });

  it("E: ignores Date prop", () => {
    render(<Page when={new Date()} />);
    expect(DetailsMock.mock.calls[0][0]).toEqual({});
  });

  it("E: ignores regex prop", () => {
    render(<Page re={/abc/} />);
    expect(DetailsMock.mock.calls[0][0]).toEqual({});
  });

  it("E: ignores Map/Set props", () => {
    render(<Page m={new Map()} s={new Set()} />);
    expect(DetailsMock.mock.calls[0][0]).toEqual({});
  });

  it("E: ignores BigInt prop", () => {
    // @ts-ignore
    render(<Page big={BigInt(10)} />);
    expect(DetailsMock.mock.calls[0][0]).toEqual({});
  });

  // Ensure only one Details element exists
  it("P: only one Details element is rendered", () => {
    const { getAllByTestId } = render(<Page />);
    expect(getAllByTestId("details").length).toBe(1);
  });

  // Render via createElement
  it("P: React.createElement(Page) behaves the same", () => {
    render(React.createElement(Page, null));
    expect(DetailsMock).toHaveBeenCalledTimes(1);
    expect(DetailsMock.mock.calls[0][0]).toEqual({});
  });

  // Render inside a wrapper div does not change behavior
  it("E: parent wrappers do not affect Details props", () => {
    const Wrapper = ({ children }) => <div>{children}</div>;
    render(
      <Wrapper>
        <Page />
      </Wrapper>
    );
    expect(DetailsMock).toHaveBeenCalledTimes(1);
    expect(DetailsMock.mock.calls[0][0]).toEqual({});
  });

  // Multiple different prop combinations still not forwarded
  it("E: mixture of props is ignored", () => {
    render(
      <Page
        a={1}
        b="str"
        c
        d={{ k: "v" }}
        e={[1, 2]}
        // @ts-ignore
        f={Symbol("f")}
      />
    );
    expect(DetailsMock).toHaveBeenCalledTimes(1);
    expect(DetailsMock.mock.calls[0][0]).toEqual({});
  });

  it("N: rendering null children still not forwarded", () => {
    render(<Page>{null}</Page>);
    expect(DetailsMock.mock.calls[0][0]).toEqual({});
  });

  it("E: rendering undefined children still not forwarded", () => {
    render(<Page>{undefined}</Page>);
    expect(DetailsMock.mock.calls[0][0]).toEqual({});
  });

  it("E: rendering boolean children still not forwarded", () => {
    render(<Page>{false}</Page>);
    expect(DetailsMock.mock.calls[0][0]).toEqual({});
  });

  it("P: wrapper returns Details as sole child", () => {
    render(<Page />);
    expect(DetailsMock).toHaveBeenCalledTimes(1);
  });
});
