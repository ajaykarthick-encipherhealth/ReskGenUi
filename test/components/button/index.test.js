import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RegularButton from '../../../src/components/button';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/test-page'
  })
}));

// Mock the utility function
jest.mock('../../../src/utils/reusable', () => ({
  createIdGen: jest.fn((prefix) => `${prefix}-test-id`)
}));

describe('RegularButton Component', () => {
  const defaultProps = {
    name: 'Test Button',
    onClick: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Positive Test Cases', () => {
    test('renders button with default props', () => {
      render(<RegularButton {...defaultProps} />);
      const button = screen.getByRole('button', { name: 'Test Button' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Test Button');
    });

    test('renders button with outline type', () => {
      render(<RegularButton {...defaultProps} type="outline" />);
      const button = screen.getByRole('button', { name: 'Test Button' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('outer');
    });

    test('renders button with custom width and height', () => {
      render(<RegularButton {...defaultProps} width="200px" height="50px" />);
      const button = screen.getByRole('button', { name: 'Test Button' });
      expect(button).toHaveStyle({ width: '200px', height: '50px' });
    });

    test('renders button with custom padding', () => {
      render(<RegularButton {...defaultProps} padding="10px 20px" />);
      const button = screen.getByRole('button', { name: 'Test Button' });
      expect(button).toHaveStyle({ padding: '10px 20px' });
    });

    test('calls onClick when clicked', () => {
      const mockOnClick = jest.fn();
      render(<RegularButton {...defaultProps} onClick={mockOnClick} />);
      const button = screen.getByRole('button', { name: 'Test Button' });
      fireEvent.click(button);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('renders loading state', () => {
      render(<RegularButton {...defaultProps} loading={true} />);
      const button = screen.getByRole('button', { name: 'LOADING...' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('LOADING...');
    });

    test('renders button with submit type', () => {
      render(<RegularButton {...defaultProps} method="submit" />);
      const button = screen.getByRole('button', { name: 'Test Button' });
      expect(button).toHaveAttribute('type', 'submit');
    });

    test('renders button with reset type', () => {
      render(<RegularButton {...defaultProps} method="reset" />);
      const button = screen.getByRole('button', { name: 'Test Button' });
      expect(button).toHaveAttribute('type', 'reset');
    });

    test('renders button with button type', () => {
      render(<RegularButton {...defaultProps} method="button" />);
      const button = screen.getByRole('button', { name: 'Test Button' });
      expect(button).toHaveAttribute('type', 'button');
    });

    test('renders button with custom id', () => {
      render(<RegularButton {...defaultProps} id="custom-id" />);
      const button = screen.getByRole('button', { name: 'Test Button' });
      expect(button).toHaveAttribute('id', 'reusableBtncustom-id-test-id');
    });

    test('renders disabled button', () => {
      render(<RegularButton {...defaultProps} disabled={true} />);
      const button = screen.getByRole('button', { name: 'Test Button' });
      expect(button).toBeDisabled();
    });
  });

  describe('Negative Test Cases', () => {
    test('does not call onClick when disabled', () => {
      const mockOnClick = jest.fn();
      render(<RegularButton {...defaultProps} onClick={mockOnClick} disabled={true} />);
      const button = screen.getByRole('button', { name: 'Test Button' });
      fireEvent.click(button);
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    test('renders with empty name', () => {
      render(<RegularButton name="" onClick={jest.fn()} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('');
    });

    test('handles null onClick prop', () => {
      render(<RegularButton name="Test" onClick={null} />);
      const button = screen.getByRole('button', { name: 'Test' });
      expect(button).toBeInTheDocument();
      // Should not throw error when clicked
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    test('handles undefined props gracefully', () => {
      render(<RegularButton />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('renders with very long name', () => {
      const longName = 'A'.repeat(100);
      render(<RegularButton name={longName} onClick={jest.fn()} />);
      const button = screen.getByRole('button', { name: longName });
      expect(button).toBeInTheDocument();
    });

    test('renders with special characters in name', () => {
      const specialName = 'Test & Button <script>';
      render(<RegularButton name={specialName} onClick={jest.fn()} />);
      const button = screen.getByRole('button', { name: specialName });
      expect(button).toBeInTheDocument();
    });

    test('handles multiple rapid clicks', () => {
      const mockOnClick = jest.fn();
      render(<RegularButton {...defaultProps} onClick={mockOnClick} />);
      const button = screen.getByRole('button', { name: 'Test Button' });
      
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });
  });
}); 