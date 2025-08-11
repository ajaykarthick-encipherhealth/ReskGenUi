import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock functions used by the component
const handleSelectorMock = jest.fn();
const resetPageNumberMock = jest.fn();
jest.mock('../../../src/components/headerFilters/functions', () => ({
  handleSelector: (...args) => handleSelectorMock(...args),
  resetPageNumber: (...args) => resetPageNumberMock(...args)
}));

import Selector from '../../../src/components/selector';

describe('Selector (singular) Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Positive scenarios', () => {
    test('renders label and Select with expected attributes and default value', () => {
      const setSelectedOption = jest.fn();
      const setDefaultValue = jest.fn();
      const setPageNo = jest.fn();
      const onChanges = jest.fn();

      const selectOptions = [
        { value: 'v1', label: 'L1' },
        { value: 'v2', label: 'L2' },
      ];

      const { container } = render(
        <Selector
          selectlabel="MyLabel"
          setSelectedOption={setSelectedOption}
          selectOptions={selectOptions}
          selectDefaultValue={{ value: 'v0', label: 'L0' }}
          setDefaultValue={setDefaultValue}
          setPageNo={setPageNo}
          onChanges={onChanges}
          defaultSelectValue1="Fallback"
          parentId="parent-id"
          parentName="parent-name"
        />
      );

      // Label
      expect(screen.getByText('MyLabel')).toBeInTheDocument();
      const label = screen.getByText('MyLabel');
      const labelId = label.getAttribute('id');
      expect(labelId).toBe(`select-label-MyLabel`);

      // AntD Select wrapper
      const selectWrapper = container.querySelector('.ant-select');
      expect(selectWrapper).toBeInTheDocument();
      // allowClear true adds this class
      expect(selectWrapper?.className).toMatch(/ant-select-allow-clear/);
      // name attribute is set on wrapper
      expect(selectWrapper).toHaveAttribute('name', 'MyLabel');

      // The combobox input should be labelled by the label id and have id equal to selectlabel
      const combo = container.querySelector('.ant-select-selection-search-input');
      expect(combo).toHaveAttribute('aria-labelledby', labelId);
      expect(combo).toHaveAttribute('id', 'MyLabel');

      // Default selected item is visible
      expect(screen.getByText('L0')).toBeInTheDocument();
    });
  });

  describe('Negative scenarios', () => {
    test('handles missing optional handlers and values gracefully and shows fallback placeholder', () => {
      const { container } = render(
        <Selector
          selectlabel={''}
          setSelectedOption={undefined}
          selectOptions={undefined}
          selectDefaultValue={undefined}
          setDefaultValue={undefined}
          setPageNo={undefined}
          onChanges={undefined}
          defaultSelectValue1="Fallback"
        />
      );

      // Placeholder should appear when no value is set
      const placeholder = container.querySelector('.ant-select-selection-placeholder');
      expect(placeholder).toBeInTheDocument();
      expect(placeholder).toHaveTextContent('Fallback');

      // No side-effects expected without interactions; ensure no resetPage called implicitly
      expect(resetPageNumberMock).not.toHaveBeenCalled();
    });

    test('respects provided parent attributes on container', () => {
      const { container } = render(
        <Selector
          selectlabel="LabelX"
          setSelectedOption={jest.fn()}
          selectOptions={[]}
          parentId="container-id"
          parentName="container-name"
        />
      );
      const containerDiv = container.querySelector('.form-group.has-search.custom-react-select');
      expect(containerDiv).toBeInTheDocument();
      expect(containerDiv).toHaveAttribute('id', 'container-id');
      expect(containerDiv).toHaveAttribute('name', 'container-name');
    });
  });
}); 