import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Avoid network/action imports chains
jest.mock('../../../src/stores/authflow/imageUpload', () => ({ actions: {} }));
jest.mock('../../../src/stores/supervisor/users', () => ({ actions: {} }));

// Pass-through connect
jest.mock('react-redux', () => ({ connect: () => (Comp) => Comp }));

// Mock CSS
jest.mock('../../../src/components/imageUploading/styles.module.css', () => ({ cover: 'cover', videoflex: 'videoflex' }));

// Mock next/image
jest.mock('next/image', () => ({ __esModule: true, default: (p) => <img alt="img" /> }));

import ImageUploader from '../../../src/components/imageUploading/ImageUploader';

describe('ImageUploader', () => {
  test('renders spinner when loading', () => {
    const { container } = render(<ImageUploader loading={true} />);
    expect(container.querySelector('.ant-spin')).toBeInTheDocument();
  });

  test('renders upload icon and default text when not loading and no file selected', () => {
    render(<ImageUploader loading={false} isFolderUplaod={false} />);
    expect(screen.getByText('Upload Profile')).toBeInTheDocument();
  });

  test('shows selected file name when provided', () => {
    render(<ImageUploader loading={false} selectedFile={{ name: 'avatar.png' }} />);
    expect(screen.getByText('avatar.png')).toBeInTheDocument();
  });

  test('folder upload shows correct label and accept attribute', () => {
    const { container } = render(<ImageUploader loading={false} isFolderUplaod={true} />);
    expect(screen.getByText('Upload a File')).toBeInTheDocument();
    const input = container.querySelector('#uploadInput');
    expect(input.getAttribute('accept')).toBe('.xl,.csv');
  });

  test('positive: change event invokes handleChange', () => {
    const handleChange = jest.fn();
    const { container } = render(<ImageUploader loading={false} handleChange={handleChange} />);
    const input = container.querySelector('#uploadInput');
    const file = new File(['x'], 'pic.jpg', { type: 'image/jpeg' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(handleChange).toHaveBeenCalled();
  });

  test('negative: multiple prop toggles based on isFolderUplaod', () => {
    const { rerender, container } = render(<ImageUploader loading={false} isFolderUplaod={false} />);
    let input = container.querySelector('#uploadInput');
    expect(input.multiple).toBe(false);
    rerender(<ImageUploader loading={false} isFolderUplaod={true} />);
    input = container.querySelector('#uploadInput');
    expect(input.multiple).toBe(true);
  });
}); 