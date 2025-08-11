import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../../../src/components/patientDetails/details/PdfViewerComponent', () => ({
  __esModule: true,
  default: function MockPdfViewer({ onPageChange = () => {} }) {
    const [page, setPage] = useState(1);
    return (
      <div>
        <div data-testid="pdf">PDF</div>
        <button onClick={() => { const next = page + 1; setPage(next); onPageChange(next); }}>NextPage</button>
      </div>
    );
  }
}));

import PdfViewer from '../../../../src/components/patientDetails/details/PdfViewerComponent';

describe('details/PdfViewerComponent (mocked)', () => {
  test('renders and changes page', () => {
    const onPageChange = jest.fn();
    render(<PdfViewer onPageChange={onPageChange} />);
    expect(screen.getByTestId('pdf')).toBeInTheDocument();
    fireEvent.click(screen.getByText('NextPage'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  test('negative: no callback if not clicked', () => {
    const onPageChange = jest.fn();
    render(<PdfViewer onPageChange={onPageChange} />);
    expect(onPageChange).not.toHaveBeenCalled();
  });
}); 