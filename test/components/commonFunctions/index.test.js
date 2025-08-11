import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('antd', () => ({ notification: { success: jest.fn() } }));

import { getButtonStatus, handleCopyToClipboard } from '../../../src/components/commonFunctions';

describe('commonFunctions', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getButtonStatus', () => {
    test('returns Pending status', () => {
      render(<div>{getButtonStatus('pending')}</div>);
      const el = screen.getByText('Pending');
      expect(el).toBeInTheDocument();
    });

    test('returns Approved status', () => {
      render(<div>{getButtonStatus('approved')}</div>);
      expect(screen.getByText('Approved')).toBeInTheDocument();
    });

    test('returns Decline status', () => {
      render(<div>{getButtonStatus('decline')}</div>);
      expect(screen.getByText('Decline')).toBeInTheDocument();
    });

    test('returns default Test for unknown value', () => {
      render(<div>{getButtonStatus('other')}</div>);
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('handleCopyToClipboard', () => {
    const originalClipboard = { ...navigator.clipboard };
    const writeTextMock = jest.fn();

    beforeAll(() => {
      Object.assign(navigator, {
        clipboard: { writeText: writeTextMock }
      });
    });

    afterAll(() => {
      Object.assign(navigator, { clipboard: originalClipboard });
    });

    test('copies text and sets copied flag when provided', () => {
      const setCopied = jest.fn();
      handleCopyToClipboard({ text: 'hello', setCopied });
      expect(writeTextMock).toHaveBeenCalledWith('hello');
      expect(setCopied).toHaveBeenCalledWith(true);
    });

    test('handles missing setCopied gracefully', () => {
      handleCopyToClipboard({ text: 'world', setCopied: undefined });
      expect(writeTextMock).toHaveBeenCalledWith('world');
    });
  });
}); 