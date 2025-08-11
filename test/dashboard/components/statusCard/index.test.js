import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusCard from '../../../../src/commonPages/dashboard/component/statusCard';

// Mock the FontAwesome components
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }) => <span data-testid="fontawesome-icon">{icon.iconName}</span>
}));

// Mock the utility function
jest.mock('../../../../src/utils/reusable', () => ({
  statusFormate: jest.fn((status) => status)
}));

// Mock the CSS module
jest.mock('./styles.module.css', () => ({
  headerFont: 'header-font',
  labelFont: 'label-font',
  subtitleFont: 'subtitle-font'
}));

// Mock the image imports
jest.mock('../../../../images/dashboard/allocatedbg.webp', () => 'allocatedbg.webp');
jest.mock('../../../../images/dashboard/pendingbg.webp', () => 'pendingbg.webp');
jest.mock('../../../../images/dashboard/completedbg.webp', () => 'completedbg.webp');
jest.mock('../../../../images/dashboard/declinedbg.webp', () => 'declinedbg.webp');
jest.mock('../../../../images/dashboard/patientCount.png', () => ({ src: 'allocated.png' }));
jest.mock('../../../../images/dashboard/dosCount.png', () => ({ src: 'pending.png' }));
jest.mock('../../../../images/dashboard/pages.png', () => ({ src: 'completed.png' }));
jest.mock('../../../../images/dashboard/completedContainer.png', () => ({ src: 'reassignedPending.png' }));
jest.mock('../../../../images/dashboard/failedContainer.png', () => ({ src: 'queryCompleted.png' }));
jest.mock('../../../../images/dashboard/processingContainer.png', () => ({ src: 'reassignedCompleted.png' }));

describe("StatusCard component", () => {
  test("renders with default props", () => {
    render(<StatusCard />);
    
    expect(screen.getByText('Allocated')).toBeInTheDocument();
    expect(screen.getByText('0 Charts')).toBeInTheDocument();
  });

  test("renders with custom status and value", () => {
    render(
      <StatusCard 
        status="Completed"
        value={25}
        label="Tasks"
      />
    );
    
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('25 Tasks')).toBeInTheDocument();
  });

  test("renders with InProgress status", () => {
    render(
      <StatusCard 
        status="InProgress"
        value={10}
        label="Items"
      />
    );
    
    expect(screen.getByText('InProgress')).toBeInTheDocument();
    expect(screen.getByText('10 Items')).toBeInTheDocument();
  });

  test("renders with custom coder name and subtitle", () => {
    render(
      <StatusCard 
        coderName="CODER_2"
        status="ReassignedPending"
        value={5}
        label="Projects"
        subtitle="Last week"
      />
    );
    
    expect(screen.getByText('ReassignedPending')).toBeInTheDocument();
    expect(screen.getByText('5 Projects')).toBeInTheDocument();
  });
});