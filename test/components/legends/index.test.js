import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('../../../src/components/legends/styles.module.css', () => ({
  container: 'legend-container',
  header: 'legend-header',
  bulletsData: 'legend-bullets',
  bgColor: 'legend-bg'
}));

import Legends from '../../../src/components/legends';

describe('Legends Component', () => {
  test('renders title and nested option bullets with colors', () => {
    const bullets = [
      {
        title: 'Main',
        option: [
          { name: 'Open', color: '#0f0' },
          { name: 'Closed', color: '#f00' }
        ]
      }
    ];
    const { container } = render(<Legends bullets={bullets} display="flex" padding={8} />);
    expect(container.querySelector('.legend-container')).toBeInTheDocument();
    expect(screen.getByText('Main')).toHaveClass('legend-header');
    const items = container.querySelectorAll('.legend-bullets');
    expect(items.length).toBe(2);
    const firstBg = container.querySelector('.legend-bg');
    expect(firstBg).toHaveStyle('background-color: #0f0');
  });

  test('renders simple bullets when no option provided', () => {
    const bullets = [{ name: 'Single', color: '#123' }];
    const { container } = render(<Legends bullets={bullets} />);
    const item = container.querySelector('.legend-bullets');
    expect(item).toBeInTheDocument();
    const bg = container.querySelector('.legend-bg');
    expect(bg).toHaveStyle('background-color: #123');
    expect(screen.getByText('Single')).toBeInTheDocument();
  });

  test('handles empty bullets gracefully', () => {
    const { container } = render(<Legends bullets={[]} />);
    expect(container.querySelector('.legend-bullets')).toBeNull();
  });
}); 