import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('react-loader-spinner', () => ({
  ThreeDots: ({ height, width, radius, color, ariaLabel, timeout }) => (
    <div data-testid="three-dots"
         data-height={String(height)}
         data-width={String(width)}
         data-radius={String(radius)}
         data-color={color}
         data-aria={ariaLabel}
         data-timeout={String(timeout)}
    />
  )
}));

import SpinnerDots from '../../../src/components/loadingSpinner';

describe('SpinnerDots Component', () => {
  test('renders ThreeDots with configured props', () => {
    render(<SpinnerDots />);
    const el = screen.getByTestId('three-dots');
    expect(el).toHaveAttribute('data-height', '80');
    expect(el).toHaveAttribute('data-width', '80');
    expect(el).toHaveAttribute('data-radius', '9');
    expect(el).toHaveAttribute('data-color', '#04306f');
    expect(el).toHaveAttribute('data-aria', 'loading');
    expect(el).toHaveAttribute('data-timeout', '5000');
  });
}); 