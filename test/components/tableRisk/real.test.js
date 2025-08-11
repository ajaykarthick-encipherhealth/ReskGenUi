import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock Ant Design icons to simple elements
jest.mock('@ant-design/icons', () => ({
  CheckCircleOutlined: () => <span data-testid="check-circle" />,
  CloseCircleOutlined: () => <span data-testid="close-circle" />
}));

// Mock CSS module
jest.mock('../../../src/components/tableRisk/style.module.css', () => ({
  card: 'card',
  desc: 'desc',
  code: 'code'
}));

import TableRisk from '../../../src/components/tableRisk';

describe('TableRisk (real component) coverage', () => {
  const baseData = [
    {
      diagnosisCode: 'E11.9',
      description: 'Type 2 diabetes mellitus without complications',
      year: '2023',
      esrd: [{ version: '2023', value: '0.5', payment: true }],
      cmsHcc: [{ version: '2023', value: '0.3', payment: false }],
      rxHcc: [{ version: '2023', value: '0.2', payment: true }]
    },
    {
      diagnosisCode: 'E11.9',
      description: 'Type 2 diabetes mellitus without complications',
      year: '2022',
      esrd: [{ version: '2022', value: '0.4', payment: false }],
      cmsHcc: [{ version: '2022', value: '0.2', payment: true }],
      rxHcc: [{ version: '2022', value: '0.1', payment: false }]
    }
  ];

  test('renders headers and values; click header triggers callbacks', () => {
    const setActiveButton = jest.fn();
    const setSearchInput = jest.fn();

    render(
      <TableRisk
        data={baseData}
        setActiveButton={setActiveButton}
        setSearchInput={setSearchInput}
        fromPatientDetails={false}
      />
    );

    // Header text exists
    expect(screen.getByText('Type 2 diabetes mellitus without complications')).toBeInTheDocument();

    // Click header triggers actions
    fireEvent.click(screen.getByText('Type 2 diabetes mellitus without complications'));
    expect(setActiveButton).toHaveBeenCalledWith('ICD-10');
    expect(setSearchInput).toHaveBeenCalledWith('E11.9');

    // Column section labels
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByText('ESRD/PACE')).toBeInTheDocument();
    expect(screen.getByText('CMS HCC')).toBeInTheDocument();
    expect(screen.getByText('RX HCC')).toBeInTheDocument();

    // Values present and icons rendered (AntD icons use aria-label attributes)
    expect(screen.getAllByText('2023').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2022').length).toBeGreaterThan(0);
    expect(screen.getByText('0.5')).toBeInTheDocument();
    expect(screen.getByText('0.4')).toBeInTheDocument();
    expect(screen.getAllByLabelText('check-circle').length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText('close-circle').length).toBeGreaterThan(0);
  });

  test('fromPatientDetails hides header section; empty arrays render default cells', () => {
    const data = [
      { year: '2023', diagnosisCode: 'X', description: 'D', esrd: [], cmsHcc: [], rxHcc: [] }
    ];
    render(
      <TableRisk
        data={data}
        setActiveButton={jest.fn()}
        setSearchInput={jest.fn()}
        fromPatientDetails
      />
    );

    // Header is hidden
    expect(screen.queryByText('D')).not.toBeInTheDocument();
    // Fallback zeros exist
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText('close-circle').length).toBeGreaterThan(0);
  });
}); 