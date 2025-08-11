import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock InputField to a simple controlled input-like component
jest.mock('../../../src/components/input', () => {
  return function MockInputField({ inputValue, setInputValue, delay, type, placeholder, isSearch }) {
    return (
      <input
        data-testid="input-field"
        value={inputValue ?? ''}
        placeholder={placeholder}
        onChange={(e) => setInputValue && setInputValue(e.target.value)}
      />
    );
  };
});

import Search from '../../../src/components/searchField';

describe('SearchField Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = (props = {}) => {
    const defaultProps = {
      searchlabel: 'Search Label',
      activeTab: '',
      search: 'general',
      coderSearch: 'coder',
      receivedSearch: 'received',
      sentSearch: 'sent',
      setSearch: jest.fn(),
      setCoderSearch: jest.fn(),
      setReceivedSearch: jest.fn(),
      setSentSearch: jest.fn()
    };
    const allProps = { ...defaultProps, ...props };
    const utils = render(<Search {...allProps} />);
    return { allProps, ...utils };
  };

  describe('Positive scenarios', () => {
    test('renders label and InputField with general search value by default', () => {
      setup();
      expect(screen.getByText('Search Label')).toBeInTheDocument();
      const input = screen.getByTestId('input-field');
      expect(input).toHaveValue('general');
      expect(input).toHaveAttribute('placeholder', 'Search');
    });

    test('uses coderSearch value and setter when activeTab is CoderReport', () => {
      const { allProps } = setup({ activeTab: 'CoderReport' });
      const input = screen.getByTestId('input-field');
      expect(input).toHaveValue('coder');
      fireEvent.change(input, { target: { value: 'new coder' } });
      expect(allProps.setCoderSearch).toHaveBeenCalledWith('new coder');
    });

    test('uses receivedSearch value and setter when activeTab is ReceivedReport', () => {
      const { allProps } = setup({ activeTab: 'ReceivedReport' });
      const input = screen.getByTestId('input-field');
      expect(input).toHaveValue('received');
      fireEvent.change(input, { target: { value: 'new received' } });
      expect(allProps.setReceivedSearch).toHaveBeenCalledWith('new received');
    });

    test('uses sentSearch value and setter when activeTab is SentReport', () => {
      const { allProps } = setup({ activeTab: 'SentReport' });
      const input = screen.getByTestId('input-field');
      expect(input).toHaveValue('sent');
      fireEvent.change(input, { target: { value: 'new sent' } });
      expect(allProps.setSentSearch).toHaveBeenCalledWith('new sent');
    });

    test('uses general search and setter when activeTab is other', () => {
      const { allProps } = setup({ activeTab: 'Other' });
      const input = screen.getByTestId('input-field');
      expect(input).toHaveValue('general');
      fireEvent.change(input, { target: { value: 'new general' } });
      expect(allProps.setSearch).toHaveBeenCalledWith('new general');
    });
  });

  describe('Negative/Edge scenarios', () => {
    test('resets all tab searches when activeTab changes (effect)', () => {
      const setCoderSearch = jest.fn();
      const setReceivedSearch = jest.fn();
      const setSentSearch = jest.fn();

      const { rerender } = render(
        <Search
          searchlabel="Search Label"
          activeTab=""
          search="general"
          coderSearch="coder"
          receivedSearch="received"
          sentSearch="sent"
          setSearch={jest.fn()}
          setCoderSearch={setCoderSearch}
          setReceivedSearch={setReceivedSearch}
          setSentSearch={setSentSearch}
        />
      );

      // Change activeTab to trigger useEffect
      rerender(
        <Search
          searchlabel="Search Label"
          activeTab="CoderReport"
          search="general"
          coderSearch="coder"
          receivedSearch="received"
          sentSearch="sent"
          setSearch={jest.fn()}
          setCoderSearch={setCoderSearch}
          setReceivedSearch={setReceivedSearch}
          setSentSearch={setSentSearch}
        />
      );

      expect(setCoderSearch).toHaveBeenCalledWith('');
      expect(setReceivedSearch).toHaveBeenCalledWith('');
      expect(setSentSearch).toHaveBeenCalledWith('');
    });

    test('handles undefined setters gracefully', () => {
      render(
        <Search
          searchlabel="Search Label"
          activeTab=""
          search="general"
          coderSearch="coder"
          receivedSearch="received"
          sentSearch="sent"
          setSearch={undefined}
          setCoderSearch={undefined}
          setReceivedSearch={undefined}
          setSentSearch={undefined}
        />
      );
      // With no active tab and undefined setters, it still renders without crashing
      const input = screen.getByTestId('input-field');
      expect(input).toHaveValue('general');
    });
  });
}); 