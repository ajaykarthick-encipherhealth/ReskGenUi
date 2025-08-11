import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../../../src/components/card/index';

describe('Card Component', () => {
  const defaultProps = {
    children: 'Card Content',
    'data-testid': 'card',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Positive Test Cases', () => {
    test('renders card with children', () => {
      render(<Card {...defaultProps} />);
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveTextContent('Card Content');
    });

    test('renders card with custom data-testid', () => {
      render(<Card {...defaultProps} data-testid="custom-card" />);
      const card = screen.getByTestId('custom-card');
      expect(card).toBeInTheDocument();
    });

    test('renders card with background color', () => {
      render(<Card {...defaultProps} bg="blue" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveStyle({ background: 'blue' });
    });

    test('renders card with border radius', () => {
      render(<Card {...defaultProps} borderRadius="10px" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveStyle({ borderRadius: '10px' });
    });

    test('renders card with padding', () => {
      render(<Card {...defaultProps} padding="20px" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveStyle({ padding: '20px' });
    });

    test('renders card with width', () => {
      render(<Card {...defaultProps} width="300px" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveStyle({ width: '300px' });
    });

    test('renders card with height', () => {
      render(<Card {...defaultProps} height="200px" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveStyle({ height: '200px' });
    });
  });

  describe('Negative Test Cases', () => {
    test('handles missing children gracefully', () => {
      render(<Card data-testid="card" />);
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
    });

    test('handles null props gracefully', () => {
      render(<Card data-testid="card" />);
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles very long content', () => {
      const longContent = 'A'.repeat(1000);
      render(<Card {...defaultProps} children={longContent} />);
      const card = screen.getByTestId('card');
      expect(card).toHaveTextContent(longContent);
    });

    test('handles special characters in content', () => {
      const specialContent = 'Test & < > " \' @ # $ % ^ * ( )';
      render(<Card {...defaultProps} children={specialContent} />);
      const card = screen.getByTestId('card');
      expect(card).toHaveTextContent(specialContent);
    });

    test('handles zero width and height', () => {
      render(<Card {...defaultProps} width="0px" height="0px" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveStyle({ width: '0px', height: '0px' });
    });

    test('handles very large width and height', () => {
      render(<Card {...defaultProps} width="9999px" height="9999px" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveStyle({ width: '9999px', height: '9999px' });
    });

    test('handles complex children (React elements)', () => {
      const complexChildren = (
        <div>
          <h1>Title</h1>
          <p>Paragraph</p>
          <button>Click me</button>
        </div>
      );
      render(<Card {...defaultProps} children={complexChildren} />);
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveTextContent('Title');
      expect(card).toHaveTextContent('Paragraph');
      expect(card).toHaveTextContent('Click me');
    });
  });

  describe('Integration Test Cases', () => {
    test('handles multiple props together', () => {
      const multipleProps = {
        ...defaultProps,
        bg: 'green',
        borderRadius: '15px',
        padding: '25px',
        width: '400px',
        height: '300px'
      };
      
      render(<Card {...multipleProps} />);
      const card = screen.getByTestId('card');
      
      expect(card).toHaveStyle({
        background: 'green',
        borderRadius: '15px',
        padding: '25px',
        width: '400px',
        height: '300px'
      });
    });
  });
}); 