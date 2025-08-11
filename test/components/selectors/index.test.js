import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock react-select to a lightweight component exposing received props
jest.mock('react-select', () => {
  return function MockReactSelect(props) {
    return (
      <div
        data-testid="react-select"
        data-isClearable={String(!!props.isClearable)}
        data-isSearchable={String(!!props.isSearchable)}
        data-classname={props.className}
        data-ariaLabelledby={props['aria-labelledby']}
        data-inputid={props.inputId}
        data-options-count={(props.options || []).length}
        onClick={() => props.onChange && props.onChange({ value: 'opt1', label: 'Option 1' })}
      >
        SelectMock
      </div>
    );
  };
});

// Mock handleSelector utility
const handleSelectorMock = jest.fn();
jest.mock('../../../src/components/headerFilters/functions', () => ({
  handleSelector: (...args) => handleSelectorMock(...args)
}));

import Selector from '../../../src/components/selectors';

describe('Selector Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Positive scenarios', () => {
    test('renders label, passes props to react-select, and handles onChange', () => {
      const setSelectedOption = jest.fn();
      const selectOptions = [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2' }
      ];

      render(
        <Selector
          selectlabel="Choose Option"
          setSelectedOption={setSelectedOption}
          selectOptions={selectOptions}
          isClose={true}
        />
      );

      // Label
      expect(screen.getByText('Choose Option')).toBeInTheDocument();

      // React-select mock and received props
      const select = screen.getByTestId('react-select');
      expect(select).toBeInTheDocument();
      expect(select).toHaveAttribute('data-isClearable', 'true');
      expect(select).toHaveAttribute('data-isSearchable', 'false');
      expect(select).toHaveAttribute('data-classname', 'custom-react-select');
      expect(select).toHaveAttribute('data-ariaLabelledby', 'select-label');
      expect(select).toHaveAttribute('data-inputid', 'select-label');
      expect(select).toHaveAttribute('data-options-count', '2');

      // Trigger onChange via click
      select.click();
      expect(handleSelectorMock).toHaveBeenCalledWith(
        { value: 'opt1', label: 'Option 1' },
        setSelectedOption
      );
    });
  });

  describe('Negative scenarios', () => {
    test('handles missing options and setSelectedOption gracefully, isClearable defaults to false', () => {
      render(
        <Selector
          selectlabel={undefined}
          setSelectedOption={undefined}
          selectOptions={undefined}
          // isClose omitted -> should default to false
        />
      );

      const select = screen.getByTestId('react-select');
      expect(select).toBeInTheDocument();
      expect(select).toHaveAttribute('data-options-count', '0');
      expect(select).toHaveAttribute('data-isClearable', 'false');
      expect(select).toHaveAttribute('data-isSearchable', 'false');

      // Still calls handleSelector with undefined setter and no crash
      select.click();
      expect(handleSelectorMock).toHaveBeenCalledWith(
        { value: 'opt1', label: 'Option 1' },
        undefined
      );
    });

    test('renders without label text when selectlabel is empty', () => {
      render(
        <Selector
          selectlabel=""
          setSelectedOption={jest.fn()}
          selectOptions={[]}
        />
      );
      // Label element exists but has no text content; verify presence and attributes
      const labelEl = document.querySelector('label.labelStyle.responsiveLabel');
      expect(labelEl).toBeInTheDocument();
      expect(labelEl).toHaveAttribute('for', 'select-label');
    });
  });
}); 