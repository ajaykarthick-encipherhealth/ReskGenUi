import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../../../src/components/pagination/index';

// Mock PrimeReact components
jest.mock('primereact/paginator', () => ({
  Paginator: ({ first, rows, totalRecords, onPageChange, id, name }) => (
    <div 
      data-testid="paginator"
      data-first={first}
      data-rows={rows}
      data-total-records={totalRecords}
      data-id={id}
      data-name={name}
    >
      <button 
        data-testid="prev-page" 
        onClick={() => onPageChange && onPageChange({ first: Math.max(0, first - rows), rows })}
      >
        Previous
      </button>
      <span>Page {Math.floor(first / rows) + 1}</span>
      <button 
        data-testid="next-page" 
        onClick={() => onPageChange && onPageChange({ first: first + rows, rows })}
      >
        Next
      </button>
    </div>
  )
}));

describe('Pagination Component', () => {
  const defaultProps = {
    first: 0,
    totalRecords: 100,
    row: 10,
    onPageChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Positive Test Cases', () => {
    test('renders pagination with default props', () => {
      render(<Pagination {...defaultProps} />);
      const paginator = screen.getByTestId('paginator');
      expect(paginator).toBeInTheDocument();
    });

    test('displays total count correctly', () => {
      render(<Pagination {...defaultProps} totalRecords={150} />);
      const totalCount = screen.getByText('Total count: 150');
      expect(totalCount).toBeInTheDocument();
    });

    test('handles page change correctly', () => {
      const mockOnPageChange = jest.fn();
      render(<Pagination {...defaultProps} onPageChange={mockOnPageChange} />);
      
      const nextButton = screen.getByTestId('next-page');
      fireEvent.click(nextButton);
      
      expect(mockOnPageChange).toHaveBeenCalledWith({
        first: 10,
        rows: 10
      });
    });

    test('handles previous page correctly', () => {
      const mockOnPageChange = jest.fn();
      render(<Pagination {...defaultProps} first={20} onPageChange={mockOnPageChange} />);
      
      const prevButton = screen.getByTestId('prev-page');
      fireEvent.click(prevButton);
      
      expect(mockOnPageChange).toHaveBeenCalledWith({
        first: 10,
        rows: 10
      });
    });

    test('handles custom row value', () => {
      render(<Pagination {...defaultProps} row={25} />);
      const paginator = screen.getByTestId('paginator');
      expect(paginator).toHaveAttribute('data-rows', '25');
    });

    test('handles custom first value', () => {
      render(<Pagination {...defaultProps} first={50} />);
      const paginator = screen.getByTestId('paginator');
      expect(paginator).toHaveAttribute('data-first', '50');
    });

    test('handles custom total records', () => {
      render(<Pagination {...defaultProps} totalRecords={200} />);
      const paginator = screen.getByTestId('paginator');
      expect(paginator).toHaveAttribute('data-total-records', '200');
    });
  });

  describe('Negative Test Cases', () => {
    test('handles missing onPageChange gracefully', () => {
      render(<Pagination {...defaultProps} onPageChange={undefined} />);
      const nextButton = screen.getByTestId('next-page');
      
      // Should not throw error when clicked without onPageChange handler
      fireEvent.click(nextButton);
      expect(nextButton).toBeInTheDocument();
    });

    test('handles zero total records', () => {
      render(<Pagination {...defaultProps} totalRecords={0} />);
      const totalCount = screen.getByText('Total count: 0');
      expect(totalCount).toBeInTheDocument();
    });

    test('handles undefined total records', () => {
      render(<Pagination {...defaultProps} totalRecords={undefined} />);
      const totalCount = screen.getByText('Total count: 0');
      expect(totalCount).toBeInTheDocument();
    });

    test('handles negative first value', () => {
      render(<Pagination {...defaultProps} first={-10} />);
      const paginator = screen.getByTestId('paginator');
      expect(paginator).toHaveAttribute('data-first', '-10');
    });

    test('handles negative row value', () => {
      render(<Pagination {...defaultProps} row={-5} />);
      const paginator = screen.getByTestId('paginator');
      expect(paginator).toHaveAttribute('data-rows', '-5');
    });

    test('handles zero row value', () => {
      render(<Pagination {...defaultProps} row={0} />);
      const paginator = screen.getByTestId('paginator');
      // The component has a default value of 7 when row is 0
      expect(paginator).toHaveAttribute('data-rows', '7');
    });
  });

  describe('Edge Cases', () => {
    test('handles very large total records', () => {
      render(<Pagination {...defaultProps} totalRecords={Number.MAX_SAFE_INTEGER} />);
      
      const totalCount = screen.getByText(`Total count: ${Number.MAX_SAFE_INTEGER}`);
      expect(totalCount).toBeInTheDocument();
    });

    test('handles very large first value', () => {
      render(<Pagination {...defaultProps} first={Number.MAX_SAFE_INTEGER} />);
      
      const paginator = screen.getByTestId('paginator');
      expect(paginator).toHaveAttribute('data-first', Number.MAX_SAFE_INTEGER.toString());
    });

    test('handles very large row value', () => {
      render(<Pagination {...defaultProps} row={Number.MAX_SAFE_INTEGER} />);
      
      const paginator = screen.getByTestId('paginator');
      expect(paginator).toHaveAttribute('data-rows', Number.MAX_SAFE_INTEGER.toString());
    });

    test('handles decimal values', () => {
      render(<Pagination {...defaultProps} first={5.5} row={7.3} totalRecords={99.9} />);
      
      const paginator = screen.getByTestId('paginator');
      expect(paginator).toHaveAttribute('data-first', '5.5');
      expect(paginator).toHaveAttribute('data-rows', '7.3');
    });

    test('handles string values', () => {
      render(<Pagination {...defaultProps} first="10" row="5" totalRecords="50" />);
      
      const paginator = screen.getByTestId('paginator');
      expect(paginator).toHaveAttribute('data-first', '10');
      expect(paginator).toHaveAttribute('data-rows', '5');
    });
  });

  describe('Integration Test Cases', () => {
    test('handles multiple page changes', () => {
      const mockOnPageChange = jest.fn();
      render(<Pagination {...defaultProps} onPageChange={mockOnPageChange} />);
      
      const nextButton = screen.getByTestId('next-page');
      
      // Click next multiple times
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      
      expect(mockOnPageChange).toHaveBeenCalledTimes(3);
      // The last call should be with first: 10 (starting from 0, each click adds 10)
      expect(mockOnPageChange).toHaveBeenLastCalledWith({
        first: 10,
        rows: 10
      });
    });

    test('handles rapid clicking', () => {
      const mockOnPageChange = jest.fn();
      render(<Pagination {...defaultProps} onPageChange={mockOnPageChange} />);
      
      const nextButton = screen.getByTestId('next-page');
      
      // Rapid clicks
      for (let i = 0; i < 10; i++) {
        fireEvent.click(nextButton);
      }
      
      expect(mockOnPageChange).toHaveBeenCalledTimes(10);
    });

    test('handles navigation from middle page', () => {
      const mockOnPageChange = jest.fn();
      render(<Pagination {...defaultProps} first={50} onPageChange={mockOnPageChange} />);
      
      const nextButton = screen.getByTestId('next-page');
      const prevButton = screen.getByTestId('prev-page');
      
      fireEvent.click(nextButton);
      expect(mockOnPageChange).toHaveBeenCalledWith({
        first: 60,
        rows: 10
      });
      
      fireEvent.click(prevButton);
      expect(mockOnPageChange).toHaveBeenCalledWith({
        first: 40,
        rows: 10
      });
    });

    test('handles boundary conditions', () => {
      const mockOnPageChange = jest.fn();
      render(<Pagination {...defaultProps} first={0} onPageChange={mockOnPageChange} />);
      
      const prevButton = screen.getByTestId('prev-page');
      fireEvent.click(prevButton);
      
      // Should not go below 0
      expect(mockOnPageChange).toHaveBeenCalledWith({
        first: 0,
        rows: 10
      });
    });
  });
}); 