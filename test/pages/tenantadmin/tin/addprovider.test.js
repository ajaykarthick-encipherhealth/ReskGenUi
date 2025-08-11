import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// next/router mock for pathname used in createIdGen path
jest.mock("next/router", () => ({
  useRouter: () => ({ pathname: "/tenantadmin/tin" }),
}));

// utils/reusable createIdGen used to build data-testid; keep identity for predictability
jest.mock("../../../../src/utils/reusable", () => ({
  createIdGen: (s) => s,
}));

// RegularButton used inside the form submit area
jest.mock("../../../../src/components/button", () => ({
  __esModule: true,
  default: ({ name, type = "button", disabled, loading, id }) => (
    <button type={type} disabled={disabled || loading} id={id}>
      {name}
    </button>
  ),
}));

// Minimal antd mocks sufficient for this component
jest.mock("antd", () => {
  const React = require("react");
  const Modal = ({ title, open, children, onOk, onCancel }) => (
    <div data-testid="modal" aria-label={title} data-open={open ? "1" : "0"}>
      <button data-testid="modal-ok" onClick={() => onOk && onOk()} />
      <button data-testid="modal-cancel" onClick={() => onCancel && onCancel()} />
      {children}
    </div>
  );

  const Form = ({ children, onFinish, ...rest }) => (
    <form
      {...rest}
      onSubmit={(e) => {
        e.preventDefault();
        onFinish && onFinish({ submitted: true });
      }}
    >
      {children}
    </form>
  );
  Form.useForm = () => [
    {
      setFieldsValue: jest.fn(),
      getFieldValue: jest.fn(),
      resetFields: jest.fn(),
    },
  ];
  Form.Item = ({ children }) => <div>{children}</div>;

  const Input = ({ placeholder, onChange, onBlur, onKeyDown, onClear, maxLength, style }) => (
    <div>
      <input
        placeholder={placeholder}
        maxLength={maxLength}
        style={style}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        data-testid={`input-${placeholder}`}
      />
      <button data-testid={`clear-${placeholder}`} type="button" onClick={() => onClear && onClear()} />
    </div>
  );

  const Select = ({ placeholder, onSearch, onChange, onBlur, onClear, style, filterOption, notFoundContent, options }) => (
    <div data-testid={`select-cont-${placeholder}`} data-nf={React.isValidElement(notFoundContent) ? "element" : (notFoundContent ? "text" : "falsy")} data-options={!options ? "falsy" : (Array.isArray(options) && options.length === 0 ? "empty" : "value")}>
      <input
        placeholder={placeholder}
        style={style}
        data-testid={`select-${placeholder}`}
        onChange={(e) => onSearch && onSearch(e.target.value)}
        onBlur={() => onBlur && onBlur()}
      />
      <button
        type="button"
        data-testid={`select-change-${placeholder}`}
        onClick={() => onChange && onChange({ value: "val" }, { number: "999", firstName: "F", lastName: "L" })}
      />
      <button type="button" data-testid={`select-change-undef-${placeholder}`} onClick={() => onChange && onChange({ value: "val" }, undefined)} />
      <button type="button" data-testid={`select-change-partial-${placeholder}`} onClick={() => onChange && onChange({ value: "val" }, { number: "1" })} />
      <button type="button" data-testid={`select-clear-${placeholder}`} onClick={() => onClear && onClear()} />
      <button type="button" data-testid={`select-filter-${placeholder}`} onClick={() => filterOption && (filterOption("Prac", { label: "Practice 1" }), filterOption("Prac", undefined))} />
    </div>
  );

  const Spin = ({ children }) => <div data-testid="spin">{children}</div>;

  const mocked = { Modal, Form, Input, Select, Spin };
  return { __esModule: true, default: mocked, ...mocked };
});

// Handle potential babel-plugin-import rewrites to per-component paths
jest.mock("antd/lib/modal", () => {
  const React = require("react");
  const Modal = ({ title, open, children, onOk, onCancel }) => (
    <div data-testid="modal" aria-label={title} data-open={open ? "1" : "0"}>
      <button data-testid="modal-ok" onClick={() => onOk && onOk()} />
      <button data-testid="modal-cancel" onClick={() => onCancel && onCancel()} />
      {children}
    </div>
  );
  return { __esModule: true, default: Modal };
});

jest.mock("antd/lib/form", () => {
  const React = require("react");
  function Form({ children, onFinish, ...rest }) {
    return (
      <form
        {...rest}
        onSubmit={(e) => {
          e.preventDefault();
          onFinish && onFinish({ submitted: true });
        }}
      >
        {children}
      </form>
    );
  }
  Form.useForm = () => [
    {
      setFieldsValue: jest.fn(),
      getFieldValue: jest.fn(),
      resetFields: jest.fn(),
    },
  ];
  Form.Item = ({ children }) => <div>{children}</div>;
  return { __esModule: true, default: Form };
});

jest.mock("antd/lib/input", () => {
  const React = require("react");
  const Input = ({ placeholder, onChange, onBlur, onKeyDown, onClear, maxLength, style }) => {
    const ref = React.useRef(null);
    return (
      <div>
        <input
          ref={ref}
          placeholder={placeholder}
          maxLength={maxLength}
          style={style}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={(e) => {
            const instrEv = { key: e.key, preventDefault: jest.fn() };
            onKeyDown && onKeyDown(instrEv);
            if (ref.current) {
              ref.current.setAttribute(
                "data-prevented",
                instrEv.preventDefault.mock.calls.length ? "1" : "0"
              );
              ref.current.setAttribute("data-lastkey", instrEv.key || "");
            }
          }}
          data-testid={`input-${placeholder}`}
        />
        <button data-testid={`clear-${placeholder}`} type="button" onClick={() => onClear && onClear()} />
      </div>
    );
  };
  return { __esModule: true, default: Input };
});

jest.mock("antd/lib/select", () => {
  const React = require("react");
  const Select = ({ placeholder, onSearch, onChange, onBlur, onClear, style, filterOption, notFoundContent, options }) => (
    <div data-testid={`select-cont-${placeholder}`} data-nf={React.isValidElement(notFoundContent) ? "element" : (notFoundContent ? "text" : "falsy")} data-options={!options ? "falsy" : (Array.isArray(options) && options.length === 0 ? "empty" : "value")}>
      <input
        placeholder={placeholder}
        style={style}
        data-testid={`select-${placeholder}`}
        onChange={(e) => onSearch && onSearch(e.target.value)}
        onBlur={() => onBlur && onBlur()}
      />
      <button
        type="button"
        data-testid={`select-change-${placeholder}`}
        onClick={() => onChange && onChange({ value: "val" }, { number: "999", firstName: "F", lastName: "L" })}
      />
      <button type="button" data-testid={`select-change-undef-${placeholder}`} onClick={() => onChange && onChange({ value: "val" }, undefined)} />
      <button type="button" data-testid={`select-change-partial-${placeholder}`} onClick={() => onChange && onChange({ value: "val" }, { number: "1" })} />
      <button type="button" data-testid={`select-clear-${placeholder}`} onClick={() => onClear && onClear()} />
      <button type="button" data-testid={`select-filter-${placeholder}`} onClick={() => filterOption && (filterOption("Prac", { label: "Practice 1" }), filterOption("Prac", undefined))} />
    </div>
  );
  return { __esModule: true, default: Select };
});

jest.mock("antd/lib/spin", () => {
  const React = require("react");
  const Spin = ({ children }) => <div data-testid="spin">{children}</div>;
  return { __esModule: true, default: Spin };
});

import ProviderAddForm from "../../../../src/pages/tenantadmin/tin/addprovider";

describe("ProviderAddForm (src/pages/tenantadmin/tin/addprovider.js)", () => {
  const setup = (overrideProps = {}) => {
    const setFieldsValue = jest.fn();
    const getFieldValue = jest.fn((field) => undefined);
    const form = { setFieldsValue, getFieldValue };

    const props = {
      isModalOpen: true,
      handleOk: jest.fn(),
      handleCancel: jest.fn(),
      handleFinish: jest.fn(),
      handleChanges: jest.fn(),
      handleChange: jest.fn(),
      form,
      setOpt: jest.fn(),
      getProviderNameLoad: false,
      opt: [],
      loading: false,
      providerList: [{ label: "Practice 1", value: "p1" }],
      ...overrideProps,
    };

    const utils = render(<ProviderAddForm {...props} />);
    return { ...utils, props, form };
  };

  describe("Form data-testid generation", () => {
    it("P: uses id prop for data-testid when provided", () => {
      setup({ id: "abc" });
      expect(screen.getByTestId("providerFormabc")).toBeInTheDocument();
    });
    it("N: without id, should not render id-based testid", () => {
      setup();
      expect(screen.queryByTestId("providerFormabc")).not.toBeInTheDocument();
    });
    it("E: id as empty string falls back to router path", () => {
      setup({ id: "" });
      expect(screen.getByTestId("providerForm tenantadmin tin")).toBeInTheDocument();
    });
  });

  describe("NPI input change/blur/clear", () => {
    it("P: onChange delegates and blur-empty/clear reset options", () => {
      const { props, form } = setup();
      const npi = screen.getByPlaceholderText("Enter NPI Number");
      fireEvent.change(npi, { target: { value: "1234" } });
      expect(props.handleChanges).toHaveBeenCalled();
      form.getFieldValue.mockReturnValueOnce("");
      fireEvent.blur(npi);
      expect(props.setOpt).toHaveBeenCalledWith([]);
      fireEvent.click(screen.getByTestId("clear-Enter NPI Number"));
      expect(props.setOpt).toHaveBeenCalledWith([]);
    });
    it("N: blur does not clear when value present", () => {
      const { props, form } = setup();
      const npi = screen.getByPlaceholderText("Enter NPI Number");
      form.getFieldValue.mockReturnValueOnce("123");
      fireEvent.blur(npi);
      expect(props.setOpt).not.toHaveBeenCalled();
    });
    it("E: maxLength is 10 and value '0' (truthy) does not clear", () => {
      const { props, form } = setup();
      const npi = screen.getByPlaceholderText("Enter NPI Number");
      expect(npi).toHaveAttribute("maxLength", "10");
      form.getFieldValue.mockReturnValueOnce("0");
      fireEvent.blur(npi);
      expect(props.setOpt).not.toHaveBeenCalled();
    });
  });

  describe("NPI keydown", () => {
    it("P: space prevents default", () => {
      setup();
      const npi = screen.getByPlaceholderText("Enter NPI Number");
      fireEvent.keyDown(npi, { key: " " });
      expect(npi.getAttribute("data-prevented")).toBe("1");
    });
    it("N: other key does not prevent default", () => {
      setup();
      const npi = screen.getByPlaceholderText("Enter NPI Number");
      fireEvent.keyDown(npi, { key: "Enter" });
      expect(npi.getAttribute("data-prevented")).toBe("0");
    });
    it("E: empty key does not prevent default", () => {
      setup();
      const npi = screen.getByPlaceholderText("Enter NPI Number");
      fireEvent.keyDown(npi, { key: "" });
      expect(npi.getAttribute("data-prevented")).toBe("0");
    });
  });

  describe("First Name select search/blur/clear and notFound/options", () => {
    it("P: onSearch delegates and onBlur clears when not selected", () => {
      const { props } = setup();
      const first = screen.getByTestId("select-Select First Name");
      fireEvent.change(first, { target: { value: "Joh" } });
      expect(props.handleChange).toHaveBeenCalledWith("Joh", "firstName");
      fireEvent.blur(first);
      expect(props.setOpt).toHaveBeenCalledWith([]);
      // also cover onClear
      fireEvent.click(screen.getByTestId("select-clear-Select First Name"));
      expect(props.setOpt).toHaveBeenCalledWith([]);
    });
    it("N: onBlur does not clear when selected exists", () => {
      const { form, props } = setup();
      const cont = screen.getByTestId("select-cont-Select First Name");
      form.getFieldValue.mockReturnValueOnce({ value: "x" });
      const first = screen.getByTestId("select-Select First Name");
      fireEvent.blur(first);
      expect(props.setOpt).not.toHaveBeenCalled();
      expect(cont.getAttribute("data-nf")).toBe("text");
      expect(cont.getAttribute("data-options")).toBe("empty");
    });
    it("E: when loading, notFoundContent is element and options falsy", () => {
      render(
        <ProviderAddForm
          isModalOpen
          handleOk={jest.fn()}
          handleCancel={jest.fn()}
          handleFinish={jest.fn()}
          handleChanges={jest.fn()}
          handleChange={jest.fn()}
          form={{ setFieldsValue: jest.fn(), getFieldValue: jest.fn() }}
          setOpt={jest.fn()}
          getProviderNameLoad={true}
          opt={[]}
          loading={false}
          providerList={[]}
        />
      );
      const cont = screen.getByTestId("select-cont-Select First Name");
      expect(cont.getAttribute("data-nf")).toBe("element");
      expect(cont.getAttribute("data-options")).toBe("falsy");
    });
  });

  describe("Last Name select search/blur/clear and notFound/options", () => {
    it("P: onSearch delegates and onBlur clears when not selected", () => {
      const { props, form } = setup();
      const last = screen.getByTestId("select-Select Last Name");
      fireEvent.change(last, { target: { value: "Doe" } });
      expect(props.handleChange).toHaveBeenCalledWith("Doe", "lastName");
      fireEvent.blur(last);
      expect(props.setOpt).toHaveBeenCalledWith([]);
      // also cover onChange and onClear for Last Name block
      fireEvent.click(screen.getByTestId("select-change-Select Last Name"));
      expect(form.setFieldsValue).toHaveBeenCalledWith({ npiNumber: "999", firstName: "F", lastName: "L" });
      fireEvent.click(screen.getByTestId("select-clear-Select Last Name"));
      expect(props.setOpt).toHaveBeenCalledWith([]);
    });
    it("N: onBlur does not clear when selected exists and nf text shown", () => {
      const { form, props } = setup();
      form.getFieldValue.mockReturnValueOnce({ value: "x" });
      const last = screen.getByTestId("select-Select Last Name");
      fireEvent.blur(last);
      expect(props.setOpt).not.toHaveBeenCalled();
      const cont = screen.getByTestId("select-cont-Select Last Name");
      expect(cont.getAttribute("data-nf")).toBe("text");
      expect(cont.getAttribute("data-options")).toBe("empty");
    });
    it("E: loading true flips nf to element and options falsy", () => {
      render(
        <ProviderAddForm
          isModalOpen
          handleOk={jest.fn()}
          handleCancel={jest.fn()}
          handleFinish={jest.fn()}
          handleChanges={jest.fn()}
          handleChange={jest.fn()}
          form={{ setFieldsValue: jest.fn(), getFieldValue: jest.fn() }}
          setOpt={jest.fn()}
          getProviderNameLoad={true}
          opt={[]}
          loading={false}
          providerList={[]}
        />
      );
      const cont = screen.getByTestId("select-cont-Select Last Name");
      expect(cont.getAttribute("data-nf")).toBe("element");
      expect(cont.getAttribute("data-options")).toBe("falsy");
    });
  });

  describe("Select onChange populates form fields", () => {
    it("P: firstName change sets all fields from subValue", () => {
      const { form } = setup();
      fireEvent.click(screen.getByTestId("select-change-Select First Name"));
      expect(form.setFieldsValue).toHaveBeenCalledWith({ npiNumber: "999", lastName: "L", firstName: "F" });
    });
    it("N: missing subValue sets fields to null", () => {
      const { form } = setup();
      fireEvent.click(screen.getByTestId("select-change-undef-Select First Name"));
      expect(form.setFieldsValue).toHaveBeenCalledWith({ npiNumber: null, lastName: null, firstName: null });
    });
    it("E: partial subValue sets missing fields to null", () => {
      const { form } = setup();
      fireEvent.click(screen.getByTestId("select-change-partial-Select First Name"));
      expect(form.setFieldsValue).toHaveBeenCalledWith({ npiNumber: "1", lastName: null, firstName: null });
    });
  });

  describe("Practice Name select options and filterOption", () => {
    it("P: opt truthy uses providerList options", () => {
      setup({ opt: [{}], providerList: [{ label: "Practice 1", value: "p1" }] });
      const cont = screen.getByTestId("select-cont-Select Practice Name");
      expect(cont.getAttribute("data-options")).toBe("value");
    });
    it("N: opt falsy uses empty options", () => {
      setup({ opt: null, providerList: [{ label: "Practice 1", value: "p1" }] });
      const cont = screen.getByTestId("select-cont-Select Practice Name");
      expect(cont.getAttribute("data-options")).toBe("empty");
    });
    it("E: empty providerList yields empty options despite truthy opt", () => {
      setup({ opt: [{}], providerList: [] });
      const cont = screen.getByTestId("select-cont-Select Practice Name");
      expect(cont.getAttribute("data-options")).toBe("empty");
      fireEvent.click(screen.getByTestId("select-filter-Select Practice Name"));
    });
  });

  describe("Submit button enable/disable and submission", () => {
    it("P: enabled when not loading and not fetching names", () => {
      setup();
      const addBtns = screen.getAllByText("Add");
      expect(addBtns[addBtns.length - 1]).not.toBeDisabled();
    });
    it("N: disabled when getProviderNameLoad true", () => {
      render(
        <ProviderAddForm
          isModalOpen
          handleOk={jest.fn()}
          handleCancel={jest.fn()}
          handleFinish={jest.fn()}
          handleChanges={jest.fn()}
          handleChange={jest.fn()}
          form={{ setFieldsValue: jest.fn(), getFieldValue: jest.fn() }}
          setOpt={jest.fn()}
          getProviderNameLoad={true}
          opt={[]}
          loading={false}
          providerList={[]}
        />
      );
      const addBtns = screen.getAllByText("Add");
      expect(addBtns[addBtns.length - 1]).toBeDisabled();
    });
    it("E: disabled when loading true; disabled button does not submit", () => {
      const handleFinish = jest.fn();
      render(
        <ProviderAddForm
          isModalOpen
          handleOk={jest.fn()}
          handleCancel={jest.fn()}
          handleFinish={handleFinish}
          handleChanges={jest.fn()}
          handleChange={jest.fn()}
          form={{ setFieldsValue: jest.fn(), getFieldValue: jest.fn() }}
          setOpt={jest.fn()}
          getProviderNameLoad={false}
          opt={[]}
          loading={true}
          providerList={[]}
        />
      );
      const addBtns = screen.getAllByText("Add");
      fireEvent.click(addBtns[addBtns.length - 1]);
      expect(handleFinish).not.toHaveBeenCalled();
    });
  });

  describe("Form submission", () => {
    it("P: clicking Add submits form (calls handleFinish)", () => {
      const handleFinish = jest.fn();
      render(
        <ProviderAddForm
          isModalOpen
          handleOk={jest.fn()}
          handleCancel={jest.fn()}
          handleFinish={handleFinish}
          handleChanges={jest.fn()}
          handleChange={jest.fn()}
          form={{ setFieldsValue: jest.fn(), getFieldValue: jest.fn() }}
          setOpt={jest.fn()}
          getProviderNameLoad={false}
          opt={[]}
          loading={false}
          providerList={[]}
        />
      );
      fireEvent.click(screen.getByText("Add"));
      expect(handleFinish).toHaveBeenCalledWith({ submitted: true });
    });
    it("N: no submit when button is disabled", () => {
      const handleFinish = jest.fn();
      render(
        <ProviderAddForm
          isModalOpen
          handleOk={jest.fn()}
          handleCancel={jest.fn()}
          handleFinish={handleFinish}
          handleChanges={jest.fn()}
          handleChange={jest.fn()}
          form={{ setFieldsValue: jest.fn(), getFieldValue: jest.fn() }}
          setOpt={jest.fn()}
          getProviderNameLoad={true}
          opt={[]}
          loading={true}
          providerList={[]}
        />
      );
      const addBtns = screen.getAllByText("Add");
      fireEvent.click(addBtns[addBtns.length - 1]);
      expect(handleFinish).not.toHaveBeenCalled();
    });
    it("E: multiple clicks still call submit once per click when enabled", () => {
      const handleFinish = jest.fn();
      render(
        <ProviderAddForm
          isModalOpen
          handleOk={jest.fn()}
          handleCancel={jest.fn()}
          handleFinish={handleFinish}
          handleChanges={jest.fn()}
          handleChange={jest.fn()}
          form={{ setFieldsValue: jest.fn(), getFieldValue: jest.fn() }}
          setOpt={jest.fn()}
          getProviderNameLoad={false}
          opt={[]}
          loading={false}
          providerList={[]}
        />
      );
      const add = screen.getByText("Add");
      fireEvent.click(add);
      fireEvent.click(add);
      expect(handleFinish).toHaveBeenCalledTimes(2);
    });
  });

  describe("Modal handlers", () => {
    it("P: clicking modal-ok calls handleOk", () => {
      const handleOk = jest.fn();
      render(
        <ProviderAddForm
          isModalOpen
          handleOk={handleOk}
          handleCancel={jest.fn()}
          handleFinish={jest.fn()}
          handleChanges={jest.fn()}
          handleChange={jest.fn()}
          form={{ setFieldsValue: jest.fn(), getFieldValue: jest.fn() }}
          setOpt={jest.fn()}
          getProviderNameLoad={false}
          opt={[]}
          loading={false}
          providerList={[]}
        />
      );
      fireEvent.click(screen.getByTestId("modal-ok"));
      expect(handleOk).toHaveBeenCalled();
    });
    it("N: clicking modal-cancel calls handleCancel", () => {
      const handleCancel = jest.fn();
      render(
        <ProviderAddForm
          isModalOpen
          handleOk={jest.fn()}
          handleCancel={handleCancel}
          handleFinish={jest.fn()}
          handleChanges={jest.fn()}
          handleChange={jest.fn()}
          form={{ setFieldsValue: jest.fn(), getFieldValue: jest.fn() }}
          setOpt={jest.fn()}
          getProviderNameLoad={false}
          opt={[]}
          loading={false}
          providerList={[]}
        />
      );
      fireEvent.click(screen.getByTestId("modal-cancel"));
      expect(handleCancel).toHaveBeenCalled();
    });
    it("E: modal closed state reflected in attribute", () => {
      render(
        <ProviderAddForm
          isModalOpen={false}
          handleOk={jest.fn()}
          handleCancel={jest.fn()}
          handleFinish={jest.fn()}
          handleChanges={jest.fn()}
          handleChange={jest.fn()}
          form={{ setFieldsValue: jest.fn(), getFieldValue: jest.fn() }}
          setOpt={jest.fn()}
          getProviderNameLoad={false}
          opt={[]}
          loading={false}
          providerList={[]}
        />
      );
      expect(screen.getByTestId("modal").getAttribute("data-open")).toBe("0");
    });
  });
});


