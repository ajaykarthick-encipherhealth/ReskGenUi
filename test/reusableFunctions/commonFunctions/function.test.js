
import { render } from '@testing-library/react';
import { getButtonStatus } from '../../../src/components/commonFunctions'
import { truncateString } from '../../../src/components/patientDetails/details/components/function/ReusableFunctions'
import Style from './style.module.css';


describe('getButtonStatus', () => {
  it('renders Pending status', () => {
    const { container } = render(getButtonStatus("pending"));
    expect(container.firstChild).toHaveClass(Style.status);
    expect(container.firstChild).toHaveClass(Style.pending);
    expect(container.textContent).toBe("Pending");
  });

  it('renders Approved status', () => {
    const { container } = render(getButtonStatus("approved"));
    expect(container.firstChild).toHaveClass(Style.status);
    expect(container.firstChild).toHaveClass(Style.approved);
    expect(container.textContent).toBe("Approved");
  });

  it('renders Decline status', () => {
    const { container } = render(getButtonStatus("decline"));
    expect(container.firstChild).toHaveClass(Style.status);
    expect(container.firstChild).toHaveClass(Style.decline);
    expect(container.textContent).toBe("Decline");
  });

  it('renders default case', () => {
    const { container } = render(getButtonStatus("unknown"));
    expect(container.textContent).toBe("Test");
  });
});



describe('truncateString', () => {
  it('should truncate the string if its length exceeds the specified number', () => {
    expect(truncateString('Hello, world!', 5)).toBe('Hello...');
    expect(truncateString('Lorem ipsum dolor sit amet', 10)).toBe('Lorem ipsu...');
  });

  it('should return the original string if its length is less than or equal to the specified number', () => {
    expect(truncateString('Short', 10)).toBe('Short');
    expect(truncateString('Exactly ten', 11)).toBe('Exactly ten');
  });

  it('should handle empty strings correctly', () => {
    expect(truncateString('', 5)).toBe('');
  });

  it('should handle undefined inputs', () => {
    expect(truncateString(undefined, 5)).toBe(undefined);
  });

  it('should handle null inputs', () => {
    expect(truncateString(null, 5)).toBe(null);
  });

  it('should return an empty string when num is 0', () => {
    expect(truncateString('Hello, world!', 0)).toBe('...');
  });
});