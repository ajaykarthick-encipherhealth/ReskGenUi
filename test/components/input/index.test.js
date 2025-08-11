import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.useFakeTimers();

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: (props) => <i data-testid="searchPrefix" {...props} />
}));

// Mock headerFilters reset
const resetPageNumberMock = jest.fn();
jest.mock('../../../src/components/headerFilters/functions', () => ({
  resetPageNumber: (...args) => resetPageNumberMock(...args)
}));

import InputField from '../../../src/components/input';

describe('InputField Component', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders with search prefix when isSearch is true', () => {
    render(<InputField isSearch placeholder="Search here" />);
    expect(screen.getByTestId('searchPrefix')).toBeInTheDocument();
  });

  test('calls setInputValue via debounce when no activeTab', () => {
    const setInputValue = jest.fn();
    const { container } = render(<InputField setInputValue={setInputValue} placeholder="Type" />);
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: 'abc' } });
    jest.runAllTimers();
    expect(setInputValue).toHaveBeenCalledWith('abc');
  });

  test('routes to tab-specific setters when activeTab is set', () => {
    const setSearchVal = jest.fn();
    const setCoderSearch = jest.fn();
    const { container } = render(<InputField activeTab="CoderReport" setSearchVal={setSearchVal} setCoderSearch={setCoderSearch} />);
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: 'coder' } });
    jest.runAllTimers();
    expect(setCoderSearch).toHaveBeenCalledWith('coder');
  });

  test('resets page number on change when setPageNo provided', () => {
    const setPageNo = jest.fn();
    const { container } = render(<InputField setPageNo={setPageNo} />);
    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: 'x' } });
    expect(resetPageNumberMock).toHaveBeenCalledWith(setPageNo);
  });

  test('respects disabled and class names', () => {
    const { container } = render(<InputField isReport isDisabled />);
    const wrapper = container.querySelector('.new-search-control1');
    const input = container.querySelector('input');
    expect(wrapper).toBeInTheDocument();
    expect(input).toBeDisabled();
  });

  test('handles value propagation from props', () => {
    const { rerender, container } = render(<InputField value="init" />);
    let input = container.querySelector('input');
    expect(input).toHaveValue('init');
    rerender(<InputField value="changed" />);
    input = container.querySelector('input');
    expect(input).toHaveValue('changed');
  });

  test('attaches keydown handler without crash', () => {
    const { container } = render(<InputField />);
    const input = container.querySelector('input');
      expect(input).toBeInTheDocument();
  });
}); 