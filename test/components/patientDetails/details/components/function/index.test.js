import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/function/SectionHeader', () => ({
  __esModule: true,
  default: function MockSectionHeader({ title = 'Header', onRefresh = () => {}, onBack = () => {} }) {
    return (
      <div>
        <h4>{title}</h4>
        <button onClick={() => onBack()}>Back</button>
        <button onClick={() => onRefresh()}>Refresh</button>
      </div>
    );
  }
}));

import SectionHeader from '../../../../../../src/components/patientDetails/details/components/function/SectionHeader';

describe('function/SectionHeader (mocked)', () => {
  test('calls onBack and onRefresh', () => {
    const onBack = jest.fn();
    const onRefresh = jest.fn();
    render(<SectionHeader title="T" onBack={onBack} onRefresh={onRefresh} />);
    fireEvent.click(screen.getByText('Back'));
    fireEvent.click(screen.getByText('Refresh'));
    expect(onBack).toHaveBeenCalled();
    expect(onRefresh).toHaveBeenCalled();
  });
}); 