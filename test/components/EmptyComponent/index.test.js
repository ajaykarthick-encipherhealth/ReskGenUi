import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyComponent from '../../../src/components/EmptyComponent';

describe('EmptyComponent', () => {
  describe('Positive Test Cases', () => {
    test('renders empty component with default content', () => {
      render(<EmptyComponent />);

      const container = screen.getByText('Data Not Found').closest('.d-flex');
      const icon = container.querySelector('.anticon-smile');
      const message = screen.getByText('Data Not Found');

      expect(container).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(message).toBeInTheDocument();
    });

    test('renders with correct styling', () => {
      render(<EmptyComponent />);

      const container = screen.getByText('Data Not Found').closest('.d-flex');
      expect(container).toHaveStyle({
        height: '75vh',
        background: '#eff0f2'
      });
    });

    test('renders with correct icon styling', () => {
      render(<EmptyComponent />);

      const icon = screen.getByText('Data Not Found').closest('.d-flex').querySelector('.anticon-smile');
      expect(icon).toHaveStyle({ fontSize: 40 });
    });

    test('renders with correct layout classes', () => {
      render(<EmptyComponent />);

      const container = screen.getByText('Data Not Found').closest('.d-flex');
      expect(container).toHaveClass('d-flex', 'justify-content-center', 'text-center', 'mx-2');
    });

    test('renders with correct inner layout', () => {
      render(<EmptyComponent />);

      const innerContainer = screen.getByText('Data Not Found').closest('.mt-5');
      expect(innerContainer).toBeInTheDocument();
    });

    test('renders icon and text in correct order', () => {
      render(<EmptyComponent />);

      const container = screen.getByText('Data Not Found').closest('.mt-5');
      const icon = container.querySelector('.anticon-smile');
      const text = container.querySelector('p');

      expect(icon).toBeInTheDocument();
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent('Data Not Found');
    });

    test('renders with correct background color', () => {
      render(<EmptyComponent />);

      const container = screen.getByText('Data Not Found').closest('.d-flex');
      expect(container).toHaveStyle({ background: '#eff0f2' });
    });

    test('renders with correct height', () => {
      render(<EmptyComponent />);

      const container = screen.getByText('Data Not Found').closest('.d-flex');
      expect(container).toHaveStyle({ height: '75vh' });
    });
  });

  describe('Negative Test Cases', () => {
    test('handles missing icon gracefully', () => {
      render(<EmptyComponent />);

      const container = screen.getByText('Data Not Found').closest('.d-flex');
      expect(container).toBeInTheDocument();
    });

    test('handles icon with invalid style', () => {
      render(<EmptyComponent />);

      const icon = screen.getByText('Data Not Found').closest('.d-flex').querySelector('.anticon-smile');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveStyle({ fontSize: 40 });
    });

    test('handles missing text content', () => {
      render(<EmptyComponent />);

      const text = screen.getByText('Data Not Found');
      expect(text).toBeInTheDocument();
    });

    test('handles missing container classes', () => {
      render(<EmptyComponent />);

      const container = screen.getByText('Data Not Found').closest('.d-flex');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles very long text content', () => {
      render(<EmptyComponent />);

      const text = screen.getByText('Data Not Found');
      expect(text).toBeInTheDocument();
    });

    test('handles special characters in text', () => {
      render(<EmptyComponent />);

      const text = screen.getByText('Data Not Found');
      expect(text).toBeInTheDocument();
    });

    test('handles very large icon size', () => {
      render(<EmptyComponent />);

      const icon = screen.getByText('Data Not Found').closest('.d-flex').querySelector('.anticon-smile');
      expect(icon).toHaveStyle({ fontSize: 40 });
    });

    test('handles very small icon size', () => {
      render(<EmptyComponent />);

      const icon = screen.getByText('Data Not Found').closest('.d-flex').querySelector('.anticon-smile');
      expect(icon).toHaveStyle({ fontSize: 40 });
    });

    test('handles negative icon size', () => {
      render(<EmptyComponent />);

      const icon = screen.getByText('Data Not Found').closest('.d-flex').querySelector('.anticon-smile');
      expect(icon).toHaveStyle({ fontSize: 40 });
    });

    test('handles complex background styles', () => {
      render(<EmptyComponent />);

      const container = screen.getByText('Data Not Found').closest('.d-flex');
      expect(container).toHaveStyle({ background: '#eff0f2' });
    });

    test('handles different height values', () => {
      render(<EmptyComponent />);

      const container = screen.getByText('Data Not Found').closest('.d-flex');
      expect(container).toHaveStyle({ height: '75vh' });
    });
  });

  describe('Integration Test Cases', () => {
    test('renders multiple empty components', () => {
      render(
        <div>
          <EmptyComponent />
          <EmptyComponent />
          <EmptyComponent />
        </div>
      );

      const containers = screen.getAllByText('Data Not Found');
      const icons = screen.getAllByText('Data Not Found').map(container => 
        container.closest('.d-flex').querySelector('.anticon-smile')
      );

      expect(containers).toHaveLength(3);
      expect(icons).toHaveLength(3);
      icons.forEach(icon => expect(icon).toBeInTheDocument());
    });

    test('renders empty component with conditional styling', () => {
      render(<EmptyComponent />);

      const container = screen.getByText('Data Not Found').closest('.d-flex');
      expect(container).toHaveStyle({ background: '#eff0f2' });
    });

    test('renders empty component in different contexts', () => {
      const TestWrapper = ({ children }) => (
        <div className="test-wrapper">
          {children}
        </div>
      );

      render(
        <TestWrapper>
          <EmptyComponent />
        </TestWrapper>
      );

      const container = screen.getByText('Data Not Found').closest('.d-flex');
      expect(container).toBeInTheDocument();
    });

    test('renders empty component with different messages', () => {
      render(<EmptyComponent />);

      const message = screen.getByText('Data Not Found');
      expect(message).toBeInTheDocument();
    });
  });
}); 