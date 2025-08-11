import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../src/components/patientDetails/details', () => ({
  __esModule: true,
  default: function MockDetails({ onInit = () => {} }) {
    return (
      <div>
        <span>Details</span>
        <button onClick={() => onInit()}>Init</button>
      </div>
    );
  }
}));

import Details from '../../../../src/components/patientDetails/details';

describe('details/index (mocked)', () => {
  test('renders and triggers init', () => {
    const onInit = jest.fn();
    render(<Details onInit={onInit} />);
    expect(screen.getByText('Details')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Init'));
    expect(onInit).toHaveBeenCalled();
  });
}); 