import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock InputField to a simple component exposing props and simulating changes
jest.mock('../../../src/components/input', () => {
  return function MockInputField(props) {
    const {
      delay,
      type,
      placeholder,
      isSearch,
      activeTab,
      setSentSearch,
      setReceivedSearch,
      setCoderSearch,
      searchVal,
      setSearchVal,
      setInputValue,
      setPageNo,
      id,
      name,
      value
    } = props;

    return (
      <div data-testid="input-field"
        data-delay={delay}
        data-type={type}
        data-placeholder={placeholder}
        data-issearch={String(!!isSearch)}
        data-activetab={activeTab || ''}
        data-searchval={searchVal || ''}
        data-id={id}
        data-name={name}
        data-value={value || ''}
        onClick={() => {
          // Simulate a change dispatch on click for testing
          setInputValue && setInputValue('new');
          setSearchVal && setSearchVal('newSV');
          setPageNo && setPageNo(1);
          if (activeTab === 'CoderReport') setCoderSearch && setCoderSearch('c');
          if (activeTab === 'ReceivedReport') setReceivedSearch && setReceivedSearch('r');
          if (activeTab === 'SentReport') setSentSearch && setSentSearch('s');
        }}
      >
        MockInput
      </div>
    );
  };
});

import Search from '../../../src/components/search';

describe('Search Component', () => {
  beforeEach(() => jest.clearAllMocks());

  const setup = (props = {}) => {
    const defaultProps = {
      searchlabel: 'Search Label',
      setSearch: jest.fn(),
      setSentSearch: jest.fn(),
      setReceivedSearch: jest.fn(),
      setCoderSearch: jest.fn(),
      activeTab: '',
      searchVal: '',
      setSearchVal: jest.fn(),
      setPageNo: jest.fn(),
      id: 'search',
      name: 'search',
      value: ''
    };
    const allProps = { ...defaultProps, ...props };
    const utils = render(<Search {...allProps} />);
    return { allProps, ...utils };
  };

  describe('Positive scenarios', () => {
    test('renders label and passes base props to InputField', () => {
      setup();
      expect(screen.getByText('Search Label')).toBeInTheDocument();
      const input = screen.getByTestId('input-field');
      expect(input).toHaveAttribute('data-delay', '1000');
      expect(input).toHaveAttribute('data-type', 'text');
      expect(input).toHaveAttribute('data-placeholder', 'Search');
      expect(input).toHaveAttribute('data-issearch', 'true');
      expect(input).toHaveAttribute('data-id', 'search');
      expect(input).toHaveAttribute('data-name', 'search');
    });

    test('click triggers setInputValue, setSearchVal, and setPageNo', () => {
      const { allProps } = setup();
      const input = screen.getByTestId('input-field');
      fireEvent.click(input);
      expect(allProps.setSearch).toHaveBeenCalledWith('new');
      expect(allProps.setSearchVal).toHaveBeenCalledWith('newSV');
      expect(allProps.setPageNo).toHaveBeenCalledWith(1);
    });

    test('when activeTab is CoderReport, clicking triggers setCoderSearch', () => {
      const { allProps } = setup({ activeTab: 'CoderReport' });
      const input = screen.getByTestId('input-field');
      fireEvent.click(input);
      expect(allProps.setCoderSearch).toHaveBeenCalledWith('c');
    });

    test('when activeTab is ReceivedReport, clicking triggers setReceivedSearch', () => {
      const { allProps } = setup({ activeTab: 'ReceivedReport' });
      const input = screen.getByTestId('input-field');
      fireEvent.click(input);
      expect(allProps.setReceivedSearch).toHaveBeenCalledWith('r');
    });

    test('when activeTab is SentReport, clicking triggers setSentSearch', () => {
      const { allProps } = setup({ activeTab: 'SentReport' });
      const input = screen.getByTestId('input-field');
      fireEvent.click(input);
      expect(allProps.setSentSearch).toHaveBeenCalledWith('s');
    });
  });

  describe('Negative scenarios', () => {
    test('handles missing optional handlers and values gracefully', () => {
      const { allProps } = setup({
        setSearch: undefined,
        setSearchVal: undefined,
        setPageNo: undefined,
        setCoderSearch: undefined,
        setReceivedSearch: undefined,
        setSentSearch: undefined,
        searchVal: undefined,
        value: undefined
      });
      const input = screen.getByTestId('input-field');
      expect(input).toHaveAttribute('data-searchval', '');
      expect(input).toHaveAttribute('data-value', '');
      fireEvent.click(input);
      // Should not throw when handlers are undefined
      expect(true).toBe(true);
    });

    test('supports custom id and name props passthrough', () => {
      setup({ id: 'custom-id', name: 'custom-name', value: 'x' });
      const input = screen.getByTestId('input-field');
      expect(input).toHaveAttribute('data-id', 'custom-id');
      expect(input).toHaveAttribute('data-name', 'custom-name');
      expect(input).toHaveAttribute('data-value', 'x');
    });
  });
}); 