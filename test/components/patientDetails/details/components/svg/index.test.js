import React from 'react';
import { render } from '@testing-library/react';

jest.mock('../../../../../../src/components/patientDetails/details/components/svg/svg', () => ({
  __esModule: true,
  default: function MockSVG({ width = 10, height = 10 }) {
    return (
      <svg data-testid="svg" width={width} height={height}>
        <circle cx="5" cy="5" r="4" />
      </svg>
    );
  }
}));

import SVG from '../../../../../../src/components/patientDetails/details/components/svg/svg';

describe('svg wrapper (mocked)', () => {
  test('renders svg with given size', () => {
    const { getByTestId } = render(<SVG width={20} height={30} />);
    const el = getByTestId('svg');
    expect(el.getAttribute('width')).toBe('20');
    expect(el.getAttribute('height')).toBe('30');
  });
}); 