import React from 'react';
import { render } from '@testing-library/react';

import TableSkeleton from '../../../src/components/skeleton/table';
import CardSkeleton from '../../../src/components/skeleton/card';

describe('Skeleton Components', () => {
  describe('TableSkeleton', () => {
    test('renders header and 8 row skeletons (total 9 inputs)', () => {
      const { container } = render(<TableSkeleton />);

      // Ant Design renders Skeleton.Input as span.ant-skeleton-input
      const inputs = container.querySelectorAll('.ant-skeleton-input');
      expect(inputs.length).toBe(9);

      // Check structure classes
      const header = container.querySelector('.skeleton-header');
      const rows = container.querySelectorAll('.skeleton-row');
      expect(header).toBeInTheDocument();
      expect(rows.length).toBe(8);

      // Verify active and block classes are applied on wrapper
      expect(container.querySelectorAll('.ant-skeleton-active').length).toBeGreaterThan(0);
      expect(container.querySelectorAll('.ant-skeleton-block').length).toBeGreaterThan(0);
    });
  });

  describe('CardSkeleton', () => {
    test('renders 1 input by default with height 100px', () => {
      const { container } = render(<CardSkeleton />);
      const inputs = container.querySelectorAll('.ant-skeleton-input');
      expect(inputs.length).toBe(1);
      expect(inputs[0]).toHaveStyle('height: 100px');
    });

    test('renders multiple inputs based on count prop', () => {
      const { container } = render(<CardSkeleton count={3} />);
      const inputs = container.querySelectorAll('.ant-skeleton-input');
      expect(inputs.length).toBe(3);
    });

    test('applies custom height, display and gap styles', () => {
      const { container } = render(<CardSkeleton count={2} height={180} display="flex" gap={12} />);
      const inputs = container.querySelectorAll('.ant-skeleton-input');
      expect(inputs.length).toBe(2);
      inputs.forEach((el) => {
        expect(el).toHaveStyle('height: 180px');
        expect(el).toHaveStyle('display: flex');
        expect(el).toHaveStyle('gap: 12px');
      });
    });

    test('renders zero inputs when count is 0', () => {
      const { container } = render(<CardSkeleton count={0} />);
      const inputs = container.querySelectorAll('.ant-skeleton-input');
      expect(inputs.length).toBe(0);
    });
  });
}); 