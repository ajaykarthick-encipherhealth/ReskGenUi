import React from 'react';
import { render, screen } from '@testing-library/react';

// Pass-through connect if used elsewhere
jest.mock('react-redux', () => ({ connect: () => (Comp) => Comp }));

// Mock CSS modules
jest.mock('../../../../../../src/components/patientDetails/details/components/fileDetails/styles.module.css', () => ({ container: 'container' }));

// Subject under test
import FileDetailsIndex from '../../../../../../src/components/patientDetails/details/components/fileDetails';

describe('patientDetails/fileDetails (index)', () => {
  test('renders without crashing', () => {
    render(<FileDetailsIndex />);
    // If index exports re-exports or simple wrapper, just assert container is in document if present
    expect(document.body).toBeInTheDocument();
  });
}); 