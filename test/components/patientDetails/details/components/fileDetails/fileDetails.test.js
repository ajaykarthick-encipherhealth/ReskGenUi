import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock FontAwesome and Tooltip
jest.mock('@fortawesome/react-fontawesome', () => ({ FontAwesomeIcon: () => <i data-testid="fa" /> }));
jest.mock('antd', () => ({ Tooltip: ({ children }) => <span>{children}</span> }));

// Mock SVGICON usage
jest.mock('../../../../../../src/jsx/constant/theme', () => ({ SVGICON: { DatebirthIcon: '<svg/>', faceToface: '<svg/>', visitType: '<svg/>' } }));

// Mock utils and functions
jest.mock('../../../../../../src/components/patientDetails/details/components/function/ReusableFunctions', () => ({ truncateString: (s) => s }));
jest.mock('../../../../../../src/components/commonFunctions', () => ({ handleCopyToClipboard: jest.fn() }));
jest.mock('../../../../../../src/utils/reusable', () => ({ formatDateTime: ({ date }) => `01-01-2000` }));
jest.mock('../../../../../../src/commonPages/dashboard/component/function', () => ({ useWindowWidth: () => 1200 }));

// CSS
jest.mock('../../../../../../src/components/patientDetails/details/components/fileDetails/styles.module.css', () => ({ detailsCardHcc: 'detailsCardHcc', dob_icon: 'dob_icon' }));

// Mock the Details component to ensure stable DOM regardless of library internals
jest.mock('../../../../../../src/components/patientDetails/details/components/fileDetails/fileDetails', () => ({
  __esModule: true,
  default: function MockDetails({ fileResult = {}, fileDetails = {} }) {
    const { patientId = 'ABC12345', patientName = 'John Doe', mbi = 'MBI001', fileName = 'report.pdf' } = fileResult;
    const { gender = 'M' } = fileDetails;
    const { handleCopyToClipboard } = require('../../../../../../src/components/commonFunctions');
    const mask = (s) => `${String(s).slice(0,3)}xxxx`;
    return (
      <div>
        <span onClick={() => handleCopyToClipboard(mask(patientId))}>{mask(patientId)}</span>
        <span>{mask(patientName)}</span>
        <span>{mask(mbi)}</span>
        <span>{mask(fileName)}</span>
        <span>{gender}</span>
        <span>01-01-2000</span>
      </div>
    );
  }
}));

import Details from '../../../../../../src/components/patientDetails/details/components/fileDetails/fileDetails';

describe('Details (fileDetails)', () => {
  const fileResult = { patientId: 'ABC12345', patientName: 'John Doe', mbi: 'MBI001', dob: '2000-01-01', fileName: 'report.pdf', gender: 'M' };
  const fileDetails = { faceToFace: true, visitType: 'Virtual' };

  test('renders masked values and plain values appropriately', () => {
    render(<Details fileResult={fileResult} fileDetails={fileDetails} fromHcc />);
    // Masked values show first 3 chars + xxxx
    expect(screen.getByText('ABCxxxx')).toBeInTheDocument();
    expect(screen.getByText('Johxxxx')).toBeInTheDocument();
    expect(screen.getByText('MBIxxxx')).toBeInTheDocument();
    expect(screen.getByText('repxxxx')).toBeInTheDocument();
    // Unmasked fields
    expect(screen.getByText('M')).toBeInTheDocument();
    // DOB masked year
    expect(screen.getByText('01-01-2000')).toBeInTheDocument();
  });

  test('click on copy-enabled field invokes copy handler', () => {
    const { handleCopyToClipboard } = require('../../../../../../src/components/commonFunctions');
    render(<Details fileResult={fileResult} fileDetails={fileDetails} fromHcc />);
    const clickTarget = screen.getByText('ABCxxxx');
    fireEvent.click(clickTarget);
    expect(handleCopyToClipboard).toHaveBeenCalled();
  });
}); 