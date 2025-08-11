import React from 'react';
import { render } from '@testing-library/react';

jest.mock('../../../src/components/logoLoader/styles.module.css', () => ({
  progress_loader: 'progress_loader',
  loading_spinner: 'loading_spinner',
  logo: 'logo',
  spinner: 'spinner',
  path: 'path'
}));

import LogoLoader from '../../../src/components/logoLoader';

describe('LogoLoader Component', () => {
  test('renders structure with classes', () => {
    const { container } = render(<LogoLoader />);
    expect(container.querySelector('.progress_loader')).toBeInTheDocument();
    expect(container.querySelector('.loading_spinner')).toBeInTheDocument();
    expect(container.querySelector('.logo')).toBeInTheDocument();
    expect(container.querySelector('svg.spinner')).toBeInTheDocument();
    const circle = container.querySelector('svg.spinner circle');
    expect(circle).toBeInTheDocument();
    expect(circle?.getAttribute('cx')).toBe('50');
    expect(circle?.getAttribute('cy')).toBe('50');
    expect(circle?.getAttribute('r')).toBe('20');
  });
}); 