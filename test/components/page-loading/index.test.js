import React from 'react';
import { render, screen } from '@testing-library/react';
import PageLoading from '../../../src/components/page-loading';

describe('PageLoading Component', () => {
  test('renders full-screen container with loading image', () => {
    render(<PageLoading />);
    const img = screen.getByAltText('Loading');
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toContain('giphy.com');
  });

  test('has container styles and classes applied', () => {
    const { container } = render(<PageLoading />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveStyle('height: 100vh');
    expect(wrapper).toHaveClass('d-flex');
    expect(wrapper).toHaveClass('justify-content-center');
    expect(wrapper).toHaveClass('align-items-center');
  });
}); 