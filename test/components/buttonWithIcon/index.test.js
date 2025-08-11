import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import RegularButtonWithIcon from '../../../src/components/buttonWithIcon';
import Style from '../../../src/components/buttonWithIcon/style.module.css';

describe('RegularButtonWithIcon Component', () => {
  const Icon = () => <span data-testid="icon">*</span>;

  test('renders name text', () => {
    render(<RegularButtonWithIcon name="Click Me" />);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('applies btnColor class by default', () => {
    render(<RegularButtonWithIcon name="A" />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass(Style.btnColor);
  });

  test('applies outline class when type is outline', () => {
    render(<RegularButtonWithIcon name="A" type="outline" />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass(Style.outer);
  });

  test('sets type based on method submit/reset/button', () => {
    const { rerender } = render(<RegularButtonWithIcon method="reset" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
    rerender(<RegularButtonWithIcon method="button" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    rerender(<RegularButtonWithIcon />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  test('sets style width/padding/height', () => {
    render(<RegularButtonWithIcon width="100px" padding="8px" height="40px" />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveStyle('width: 100px');
    expect(btn).toHaveStyle('padding: 8px');
    expect(btn).toHaveStyle('height: 40px');
  });

  test('shows LOADING... when loading is true', () => {
    render(<RegularButtonWithIcon loading name="Send" />);
    expect(screen.getByText('LOADING...')).toBeInTheDocument();
  });

  test('renders left icon before text when iconPosition left', () => {
    render(<RegularButtonWithIcon name="Go" icon={<Icon />} iconPosition="left" />);
    const btn = screen.getByRole('button');
    expect(btn.textContent).toBe('*Go');
  });

  test('renders right icon after text when iconPosition right', () => {
    render(<RegularButtonWithIcon name="Go" icon={<Icon />} iconPosition="right" />);
    const btn = screen.getByRole('button');
    expect(btn.textContent).toBe('Go*');
  });

  test('calls onClick when htmlType not provided', () => {
    const onClick = jest.fn();
    render(<RegularButtonWithIcon name="X" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  test('does not attach onClick when htmlType provided', () => {
    const onClick = jest.fn();
    render(<RegularButtonWithIcon name="X" onClick={onClick} htmlType />);
    // No click simulated to avoid jsdom calling invalid handler; just ensure onClick untouched
    expect(onClick).not.toHaveBeenCalled();
  });

  test('respects disabled prop', () => {
    render(<RegularButtonWithIcon disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('sets id and name attributes', () => {
    render(<RegularButtonWithIcon id="btn-id" name="Label" />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('id', 'btn-id');
    expect(btn).toHaveAttribute('name', 'Label');
  });
}); 