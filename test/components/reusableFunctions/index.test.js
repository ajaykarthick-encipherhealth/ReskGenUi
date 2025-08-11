import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock heavy dependencies
jest.mock('next/image', () => (props) => <img data-testid="next-image" {...props} />);
jest.mock('../../../src/styles/visitdata.module.css', () => ({
  name_missed: 'name_missed',
  dob_missed: 'dob_missed',
  id_missed: 'id_missed',
  sign_missed: 'sign_missed',
  signature_missed: 'signature_missed',
  cred_missed: 'cred_missed',
  sign_status: 'sign_status',
  no_hcc_found: 'no_hcc_found',
  no_doc_found: 'no_doc_found',
  patient_diseased: 'patient_diseased',
  patient_inactive: 'patient_inactive'
}));
jest.mock('../../../src/jsx/constant/theme', () => ({
  SVGICON: {
    emptyFlagSmallLarge: <span data-testid="flag-icon">flag</span>,
    emptyFlag: <span data-testid="flag-empty">flag-empty</span>
  },
  IMAGES: {
    queried: '/queried.png'
  }
}));

// Mock AntD Tooltip and Skeleton.Input
jest.mock('antd', () => ({
  Tooltip: ({ title, placement, children }) => (
    <div data-testid="tooltip" data-title={title} data-placement={placement}>{children}</div>
  ),
  Skeleton: {
    Input: ({ style, active }) => <div data-testid="skeleton-input" data-active={String(!!active)} style={style} />
  }
}));

import {
  getFlag,
  getFlags,
  getStatusIcon,
  selectTab,
  renderSkeleton,
  renderSkeletonHold
} from '../../../src/components/reuseableFunctions';

describe('reusableFunctions module', () => {
  describe('getFlag', () => {
    const cases = [
      { flags: 'PATIENT_NAME_MISSED', expected: 'Patient name missed' },
      { flags: 'PATIENT_DOB_MISSED', expected: 'Patient dob missed' },
      { flags: 'MRN_ID_MISMATCH', expected: 'MRN id Mismatch' },
      { flags: 'PROVIDER_SIGN_MISSED', expected: 'Provider Sign Missed' },
      { flags: 'PROVIDER_SIGNATURE_MISSED', expected: 'Provider Signature Missed' },
      { flags: 'PROVIDER_CREDENTIAL_MISSED', expected: 'Provider Credential Missed' },
      { flags: 'PROVIDER_SIGN_STATUS_PENDING', expected: 'Provider Sign Status Pending' },
      { flags: 'NO_HCC_FOUND', expected: 'No HCC Found' },
      { flags: 'NO_VALID_DOCUMENT_FOUND', expected: 'No Valid Document Found' },
      { flags: 'PATIENT_DISEASED', expected: 'Patient Diseased' },
      { flags: 'PATIENT_INACTIVE', expected: 'Patient Inactive' },
      { flags: '', expected: 'None' }
    ];

    test.each(cases)('renders flag for %p', ({ flags, expected }) => {
      const ui = getFlag({ flags });
      const { container } = render(<div>{ui}</div>);
      const icon = screen.queryByTestId('flag-icon') || screen.getByTestId('flag-empty');
      expect(icon).toBeInTheDocument();
      expect(container).toHaveTextContent(expected);
    });

    test('returns undefined for unknown flag', () => {
      const ui = getFlag({ flags: 'UNKNOWN' });
      expect(ui).toBeUndefined();
    });
  });

  describe('getFlags', () => {
    test('returns null when data missing or year absent', () => {
      expect(getFlags(null)).toBeNull();
      expect(getFlags({})).toBeNull();
      const res = getFlags({ '2023': [] });
      expect(res === null || res === undefined).toBe(true);
    });

    test('renders tooltip with proper title for known flag', () => {
      const data = { '2023': [{ flag: 'PATIENT_NAME_MISSED' }] };
      const ui = getFlags(data);
      const { container } = render(<div>{ui}</div>);
      // Real AntD Tooltip clones child and sets aria-describedby; assert icon present and class applied
      expect(container.querySelector('.name_missed')).toBeInTheDocument();
      expect(screen.getByTestId('flag-icon')).toBeInTheDocument();
    });

    test('renders empty flag for empty flag string', () => {
      const data = { '2023': [{ flag: '' }] };
      render(<div>{getFlags(data)}</div>);
      expect(screen.getByTestId('flag-empty')).toBeInTheDocument();
    });
  });

  describe('getStatusIcon', () => {
    const statusCases = [
      { status: 'COMPLETED', alt: 'completed' },
      { status: 'QUERIED', alt: undefined },
      { status: 'PENDING', alt: 'pending' },
      { status: 'DECLINED', alt: 'declined' },
      { status: 'NOTCOMPUTED', alt: 'notComputed' },
      { status: 'COMPUTED', alt: 'computed' },
      { status: 'HOLD', alt: 'hold' },
      { status: 'ABORTED_BY_CRON', alt: 'abort' },
      { status: 'AUDIT_PENDING', alt: 'auditPending' },
      { status: 'AUDITHOLD', alt: 'auditHold' },
      { status: 'REAUDIT', alt: 'reAudit' },
      { status: 'AUDITED', alt: 'audited' },
      { status: 'NOT_AUDIT', alt: 'notAudit' },
      { status: 'AUDIT_DECLINED', alt: 'auditDeclined' },
      { status: null, alt: null }
    ];

    test.each(statusCases)('handles status %p', ({ status, alt }) => {
      const ui = getStatusIcon(status);
      const { container } = render(<div>{ui}</div>);
      if (status === null) {
        expect(container.querySelector('.patient-status')).toBeInTheDocument();
      } else {
        // either tooltip with an image or queried which uses IMAGES.queried
        const img = container.querySelector('img');
        expect(img).toBeTruthy();
        if (alt) {
          // our mocked next/image forwards alt prop
          expect(img?.getAttribute('alt')).toBe(alt);
        }
      }
    });
  });

  describe('selectTab', () => {
    test('sets flags and heads appropriately', () => {
      const setFlagTagActive = jest.fn();
      const setActiveTabHead = jest.fn();
      const setActiveComboTree = jest.fn();
      const setPopoverVisible = jest.fn();
      const setActiveMeatTitle = jest.fn();

      selectTab(2, setFlagTagActive, setActiveTabHead, setActiveComboTree, setPopoverVisible, setActiveMeatTitle);
      expect(setFlagTagActive).toHaveBeenCalledWith(true);
      expect(setActiveTabHead).toHaveBeenCalledWith(2);

      selectTab(3, setFlagTagActive, setActiveTabHead, setActiveComboTree, setPopoverVisible, setActiveMeatTitle);
      expect(setActiveComboTree).toHaveBeenCalledWith(null);

      selectTab(4, setFlagTagActive, setActiveTabHead, setActiveComboTree, setPopoverVisible, setActiveMeatTitle);
      expect(setActiveMeatTitle).toHaveBeenCalledWith(null);

      selectTab(1, setFlagTagActive, setActiveTabHead, setActiveComboTree, setPopoverVisible, setActiveMeatTitle);
      expect(setPopoverVisible).toHaveBeenCalledWith(false);
    });
  });

  describe('renderSkeleton helpers', () => {
    test('renderSkeleton outputs header and 6 rows', () => {
      const { container } = render(<div>{renderSkeleton()}</div>);
      expect(container.querySelectorAll('.skeleton-header').length).toBe(1);
      expect(container.querySelectorAll('.skeleton-row').length).toBe(6);
      expect(container.querySelectorAll('.ant-skeleton-input').length).toBe(7); // header + 6 rows
    });

    test('renderSkeletonHold outputs header and 6 rows with narrower width', () => {
      const { container } = render(<div>{renderSkeletonHold()}</div>);
      expect(container.querySelectorAll('.skeleton-header').length).toBe(1);
      expect(container.querySelectorAll('.skeleton-row').length).toBe(6);
      expect(container.querySelectorAll('.ant-skeleton-input').length).toBe(7);
    });
  });
}); 