import React from 'react';
import { render, screen } from '@testing-library/react';
import SpinnerDots from '../../../src/components/spinner';

// Mock react-loader-spinner
jest.mock('react-loader-spinner', () => ({
  ThreeDots: ({ height, width, radius, color, ariaLabel, wrapperStyle, wrapperClass, timeout }) => (
    <div 
      data-testid="three-dots-spinner"
      data-height={height}
      data-width={width}
      data-radius={radius}
      data-color={color}
      data-aria-label={ariaLabel}
      data-timeout={timeout}
      style={wrapperStyle}
      className={wrapperClass}
    >
      Loading...
    </div>
  )
}));

describe('SpinnerDots Component', () => {
  describe('Positive Test Cases', () => {
    test('renders spinner with default props', () => {
      render(<SpinnerDots />);
      
      const spinner = screen.getByTestId('three-dots-spinner');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('data-height', '80');
      expect(spinner).toHaveAttribute('data-width', '80');
      expect(spinner).toHaveAttribute('data-radius', '9');
      expect(spinner).toHaveAttribute('data-color', '#04306f');
      expect(spinner).toHaveAttribute('data-aria-label', 'loading');
      expect(spinner).toHaveAttribute('data-timeout', '5000');
    });

    test('renders with custom topHeight', () => {
      render(<SpinnerDots topHeight="50pc" />);
      
      const container = screen.getByText('Loading...').closest('.content-body');
      expect(container).toBeInTheDocument();
    });

    test('renders with custom background', () => {
      render(<SpinnerDots background="#f0f0f0" />);
      
      const container = screen.getByText('Loading...').closest('.container-fluid');
      expect(container).toHaveStyle({ background: '#f0f0f0' });
    });

    test('renders with both custom props', () => {
      render(<SpinnerDots topHeight="100px" background="linear-gradient(45deg, #ff6b6b, #4ecdc4)" />);
      
      const container = screen.getByText('Loading...').closest('.container-fluid');
      expect(container).toHaveStyle({ background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)' });
    });

    test('renders with numeric topHeight', () => {
      render(<SpinnerDots topHeight={100} />);
      
      const container = screen.getByText('Loading...').closest('.content-body');
      expect(container).toBeInTheDocument();
    });

    test('renders with zero topHeight', () => {
      render(<SpinnerDots topHeight={0} />);
      
      const container = screen.getByText('Loading...').closest('.content-body');
      expect(container).toBeInTheDocument();
    });

    test('renders with negative topHeight', () => {
      render(<SpinnerDots topHeight={-50} />);
      
      const container = screen.getByText('Loading...').closest('.content-body');
      expect(container).toBeInTheDocument();
    });

    test('renders with very large topHeight', () => {
      render(<SpinnerDots topHeight="9999px" />);
      
      const container = screen.getByText('Loading...').closest('.content-body');
      expect(container).toBeInTheDocument();
    });

    test('renders with complex background', () => {
      const complexBackground = "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100\" height=\"100\" fill=\"red\"/></svg>')";
      render(<SpinnerDots background={complexBackground} />);
      
      const container = screen.getByText('Loading...').closest('.container-fluid');
      expect(container).toHaveStyle({ background: complexBackground });
    });
  });

  describe('Negative Test Cases', () => {
    test('handles null topHeight', () => {
      render(<SpinnerDots topHeight={null} />);
      
      const container = screen.getByText('Loading...').closest('.content-body');
      expect(container).toBeInTheDocument();
    });

    test('handles undefined topHeight', () => {
      render(<SpinnerDots topHeight={undefined} />);
      
      const container = screen.getByText('Loading...').closest('.content-body');
      expect(container).toBeInTheDocument();
    });

    test('handles null background', () => {
      render(<SpinnerDots background={null} />);
      
      const container = screen.getByText('Loading...').closest('.container-fluid');
      expect(container).toHaveStyle({ background: 'null' });
    });

    test('handles undefined background', () => {
      render(<SpinnerDots background={undefined} />);
      
      const container = screen.getByText('Loading...').closest('.container-fluid');
      expect(container).toHaveStyle({ background: 'undefined' });
    });

    test('handles empty string background', () => {
      render(<SpinnerDots background="" />);
      
      const container = screen.getByText('Loading...').closest('.container-fluid');
      expect(container).toHaveStyle({ background: '' });
    });

    test('handles empty string topHeight', () => {
      render(<SpinnerDots topHeight="" />);
      
      const container = screen.getByText('Loading...').closest('.content-body');
      expect(container).toBeInTheDocument();
    });

    test('handles boolean background', () => {
      render(<SpinnerDots background={true} />);
      
      const container = screen.getByText('Loading...').closest('.container-fluid');
      expect(container).toHaveStyle({ background: 'true' });
    });

    test('handles boolean topHeight', () => {
      render(<SpinnerDots topHeight={false} />);
      
      const container = screen.getByText('Loading...').closest('.content-body');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles very long topHeight value', () => {
      const longValue = 'A'.repeat(1000) + 'px';
      render(<SpinnerDots topHeight={longValue} />);
      
      const container = screen.getByText('Loading...').closest('.content-body');
      expect(container).toBeInTheDocument();
    });

    test('handles very long background value', () => {
      const longBackground = 'A'.repeat(1000);
      render(<SpinnerDots background={longBackground} />);
      
      const container = screen.getByText('Loading...').closest('.container-fluid');
      expect(container).toHaveStyle({ background: longBackground });
    });

    test('handles special characters in topHeight', () => {
      render(<SpinnerDots topHeight="50% + 20px" />);
      
      const container = screen.getByText('Loading...').closest('.content-body');
      expect(container).toBeInTheDocument();
    });

    test('handles special characters in background', () => {
      const specialBackground = "url('test<script>alert('xss')</script>.jpg')";
      render(<SpinnerDots background={specialBackground} />);
      
      const container = screen.getByText('Loading...').closest('.container-fluid');
      expect(container).toHaveStyle({ background: specialBackground });
    });

    test('handles numeric background', () => {
      render(<SpinnerDots background={123} />);
      
      const container = screen.getByText('Loading...').closest('.container-fluid');
      // The component applies the numeric value directly, so it becomes '123px'
      expect(container).toHaveStyle({ background: '123px' });
    });

    test('handles object background', () => {
      render(<SpinnerDots background={{ color: 'red' }} />);
      
      const container = screen.getByText('Loading...').closest('.container-fluid');
      expect(container).toHaveStyle({ background: '[object Object]' });
    });

    test('handles array background', () => {
      render(<SpinnerDots background={['red', 'blue']} />);
      
      const container = screen.getByText('Loading...').closest('.container-fluid');
      expect(container).toHaveStyle({ background: 'red,blue' });
    });

    test('handles function topHeight', () => {
      const mockFunction = jest.fn();
      render(<SpinnerDots topHeight={mockFunction} />);
      
      const container = screen.getByText('Loading...').closest('.content-body');
      expect(container).toBeInTheDocument();
    });

    test('handles function background', () => {
      const mockFunction = jest.fn();
      render(<SpinnerDots background={mockFunction} />);
      
      const container = screen.getByText('Loading...').closest('.container-fluid');
      expect(container).toHaveStyle({ background: mockFunction.toString() });
    });
  });

  describe('Integration Test Cases', () => {
    test('renders multiple spinners with different props', () => {
      render(
        <div>
          <SpinnerDots topHeight="10px" background="#ff0000" />
          <SpinnerDots topHeight="20px" background="#00ff00" />
          <SpinnerDots topHeight="30px" background="#0000ff" />
        </div>
      );
      
      const spinners = screen.getAllByTestId('three-dots-spinner');
      expect(spinners).toHaveLength(3);
    });

    test('renders spinner with conditional props', () => {
      const ConditionalSpinner = ({ showBackground, customTopHeight }) => (
        <SpinnerDots 
          background={showBackground ? '#ff0000' : undefined}
          topHeight={customTopHeight || '25pc'}
        />
      );
      
      const { rerender } = render(<ConditionalSpinner showBackground={true} customTopHeight="50px" />);
      let container = screen.getByText('Loading...').closest('.container-fluid');
      expect(container).toHaveStyle({ background: '#ff0000' });
      
      rerender(<ConditionalSpinner showBackground={false} customTopHeight="75px" />);
      container = screen.getByText('Loading...').closest('.container-fluid');
      expect(container).toHaveStyle({ background: 'undefined' });
    });

    test('renders spinner in different contexts', () => {
      const TestContainer = ({ isLoading, error }) => {
        if (error) return <div>Error: {error}</div>;
        if (isLoading) return <SpinnerDots background="#f0f0f0" />;
        return <div>Content loaded</div>;
      };
      
      const { rerender } = render(<TestContainer isLoading={true} error={null} />);
      expect(screen.getByTestId('three-dots-spinner')).toBeInTheDocument();
      
      rerender(<TestContainer isLoading={false} error={null} />);
      expect(screen.getByText('Content loaded')).toBeInTheDocument();
      
      rerender(<TestContainer isLoading={false} error="Network error" />);
      expect(screen.getByText('Error: Network error')).toBeInTheDocument();
    });
  });
}); 