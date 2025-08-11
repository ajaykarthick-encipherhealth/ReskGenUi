import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock CSS
jest.mock('../../../src/components/btnSelect/style.module.css', () => ({
  containerBtn: 'containerBtn',
  btns: 'btns',
  textColor: 'textColor',
  successActive: 'successActive',
  btnColor: 'btnColor'
}));

import SelectButton from '../../../src/components/btnSelect';

describe('SelectButton', () => {
  test('renders all letters and applies classes based on props', () => {
    render(<SelectButton select={'E'} setSelect={jest.fn()} completed={['M', 'E']} />);
    expect(screen.getByText('M').className).toContain('textColor');
    expect(screen.getByText('E').className).toContain('successActive');
    expect(screen.getByText('A').className).toContain('btns');
  });

  test('clicking updates selection via setSelect', () => {
    const setSelect = jest.fn();
    render(<SelectButton select={'M'} setSelect={setSelect} completed={[]} />);
    fireEvent.click(screen.getByText('T'));
    expect(setSelect).toHaveBeenCalledWith('T');
  });

  test('negative: handles missing completed prop', () => {
    render(<SelectButton select={'A'} setSelect={jest.fn()} />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });
}); 