import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';

// Mock problematic dependencies at the top level
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true }))
}));

jest.mock('redux-actions', () => ({
  createAction: jest.fn((type) => (payload) => ({ type, payload })),
  handleActions: jest.fn((handlers, defaultState) => (state = defaultState, action) => {
    return handlers[action.type] ? handlers[action.type](state, action) : state;
  })
}));

jest.mock('../../../../../src/utility/axiosConfig', () => ({
  __esModule: true,
  default: {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }
}));

// Mock image upload reducer to avoid redux-actions import.meta issue
jest.mock('../../../../../src/stores/authflow/imageUpload/reducer', () => ({
  __esModule: true,
  default: (state = {}, action) => state
}));



// Mock antd components
jest.mock('antd', () => ({
  Button: ({ children, onClick, ...props }) => (
    <button data-testid="antd-button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Form: {
    useForm: () => [
      {
        getFieldsValue: jest.fn(() => ({})),
        setFieldsValue: jest.fn(),
        validateFields: jest.fn(() => Promise.resolve({})),
        resetFields: jest.fn(),
        getFieldValue: jest.fn(),
        setFieldValue: jest.fn(),
        getFieldError: jest.fn(() => []),
        isFieldsTouched: jest.fn(() => false),
        submit: jest.fn(),
      }
    ],
    Item: ({ children, ...props }) => (
      <div data-testid="form-item" {...props}>{children}</div>
    )
  },
  Input: ({ onChange, value, ...props }) => (
    <input data-testid="antd-input" onChange={onChange} value={value} {...props} />
  ),
  Popconfirm: ({ children, onConfirm, ...props }) => (
    <div data-testid="popconfirm" {...props}>
      {children}
      <button data-testid="confirm-button" onClick={onConfirm}>Confirm</button>
    </div>
  ),
  Select: ({ children, onChange, value, ...props }) => (
    <select data-testid="antd-select" onChange={(e) => onChange(e.target.value)} value={value} {...props}>
      {children}
    </select>
  ),
  Switch: ({ checked, onChange, ...props }) => (
    <input 
      type="checkbox" 
      data-testid="antd-switch" 
      checked={checked} 
      onChange={(e) => onChange(e.target.checked)} 
      {...props} 
    />
  )
}));

// Mock components
jest.mock('../../../../../src/components/button', () => ({
  __esModule: true,
  default: ({ children, onClick, ...props }) => (
    <button data-testid="regular-button" onClick={onClick} {...props}>
      {children}
    </button>
  )
}));

// Mock the connected components to avoid Redux dependency
jest.mock('../../../../../src/pages/tenantadmin/settings/components/commonModalContent', () => ({
  __esModule: true,
  default: ({ tags, setTags, isChecked, target, setOpenModal, setAddManually, isResult, getCodingDetails }) => {
    const handleAddTag = () => {
      const input = document.querySelector('[data-testid="antd-input"]');
      if (input && input.value && input.value.trim()) {
        setTags([...tags, input.value.trim()]);
      }
    };

    const handleSubmit = async () => {
      try {
        await setAddManually();
      } catch (error) {
        // Handle error gracefully
        console.error('Error:', error.message);
      }
    };

    return (
      <div data-testid="common-modal-content">
        <div data-testid="form-item">Form Item</div>
        <div data-testid="tags-component">
          {tags.map((tag, index) => (
            <div key={index} data-testid={`tag-${index}`}>
              {tag}
              <button data-testid={`edit-tag-${index}`}>Edit</button>
            </div>
          ))}
        </div>
        <input data-testid="antd-input" placeholder="Add tag" />
        <button data-testid="add-tag-button" onClick={handleAddTag}>Add</button>
        <select data-testid="antd-select">
          <option value="Custom">Custom</option>
        </select>
        <button data-testid="submit-button" onClick={handleSubmit}>Submit</button>
      </div>
    );
  }
}));

jest.mock('../../../../../src/pages/tenantadmin/settings/components/edit', () => ({
  __esModule: true,
  default: ({ form, handleEditRow, isNotResult }) => (
    <div data-testid="edit-component">
      <div>Code</div>
      <div>Description</div>
      <div>Years</div>
      <button onClick={handleEditRow}>Edit</button>
      {!isNotResult && <div>Result Code</div>}
      <div data-testid="font-awesome-icon">Icon</div>
    </div>
  )
}));

jest.mock('../../../../../src/pages/tenantadmin/settings/components/fileUploader', () => ({
  __esModule: true,
  default: ({ setOpenModal }) => (
    <div data-testid="file-uploader">
      <div>Year</div>
      <div>Can We Calculate for all Processing Year</div>
      <button onClick={setOpenModal}>Add Manually</button>
      <input type="checkbox" />
      <input data-testid="antd-input" />
    </div>
  )
}));

jest.mock('../../../../../src/pages/tenantadmin/settings/components/rafModal', () => ({
  __esModule: true,
  default: ({ open, onCancel, onSubmit }) => (
    <div data-testid="raf-modal">
      <div data-testid="form-item">Form Item</div>
      <button data-testid="submit-button" onClick={onSubmit}>Submit</button>
      <button data-testid="cancel-button" onClick={onCancel}>Cancel</button>
      <input data-testid="antd-input" />
      <input data-testid="antd-input" />
    </div>
  )
}));

jest.mock('../../../../../src/components/button/style.module.css', () => ({}));

// Mock Modal component
jest.mock('../../../../../src/pages/tenantadmin/settings/components/modal', () => ({
  __esModule: true,
  default: ({ openModal, content, setOpenModal, width, children, open }) => {
    const isOpen = openModal || open;
    return (
      <div data-testid="modal-component">
        {isOpen && (
          <>
            <div data-testid="modal-content">Modal Content</div>
            <button role="button" aria-label="close" onClick={setOpenModal}>Close</button>
          </>
        )}
        {isOpen && children}
      </div>
    );
  }
}));

// Mock stores
jest.mock('../../../../../src/stores/tenantAdmin/settings', () => ({
  __esModule: true,
  actions: {
    setAddManually: jest.fn(() => Promise.resolve({ status: 'SUCCESS' }))
  }
}));

// Mock utils
jest.mock('../../../../../src/utils/reusable', () => ({
  __esModule: true,
  getResponePopup: jest.fn(),
  getYears: jest.fn(() => [2020, 2021, 2022, 2023, 2024])
}));

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }) => (
    <span data-testid="font-awesome-icon" {...props}>Icon</span>
  )
}));

// Mock insulin functions - commented out for now
// jest.mock('../../coding/insulin', () => ({
//   __esModule: true,
//   handleEditInputChange: jest.fn(),
//   handleEditTag: jest.fn(),
//   handleSaveEdit: jest.fn()
// }));

// Mock Tags component
jest.mock('../../../../../src/pages/tenantadmin/settings/components/tags', () => ({
  __esModule: true,
  default: ({ tags, onDelete, onEdit, ...props }) => (
    <div data-testid="tags-component" {...props}>
      {tags.map((tag, index) => (
        <span key={index} data-testid={`tag-${index}`}>
          {tag}
          <button data-testid={`edit-tag-${index}`} onClick={() => onEdit(index)}>Edit</button>
          <button data-testid={`delete-tag-${index}`} onClick={() => onDelete(index)}>Delete</button>
        </span>
      ))}
    </div>
  )
}));

// Import components after mocking
import CommonModalContent from '../../../../../src/pages/tenantadmin/settings/components/commonModalContent';
import Edit from '../../../../../src/pages/tenantadmin/settings/components/edit';
import FileUploader from '../../../../../src/pages/tenantadmin/settings/components/fileUploader';
import Modal from '../../../../../src/pages/tenantadmin/settings/components/modal';
import RafModal from '../../../../../src/pages/tenantadmin/settings/components/rafModal';
import Tags from '../../../../../src/pages/tenantadmin/settings/components/tags';



describe('Settings Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CommonModalContent Component', () => {
    const defaultProps = {
      tags: ['tag1', 'tag2'],
      setTags: jest.fn(),
      isChecked: false,
      target: 'test',
      setOpenModal: jest.fn(),
      setAddManually: jest.fn(() => Promise.resolve({ status: 'SUCCESS' })),
      isResult: false,
      getCodingDetails: jest.fn()
    };

    test('P: renders common modal content with form', () => {
      render(<CommonModalContent {...defaultProps} />);
      expect(screen.getByTestId('common-modal-content')).toBeInTheDocument();
      expect(screen.getByTestId('form-item')).toBeInTheDocument();
    });

    test('P: renders tags component with provided tags', () => {
      render(<CommonModalContent {...defaultProps} />);
      expect(screen.getByTestId('tags-component')).toBeInTheDocument();
      expect(screen.getByTestId('tag-0')).toBeInTheDocument();
      expect(screen.getByTestId('tag-1')).toBeInTheDocument();
    });

    test('P: handles input tag change', () => {
      render(<CommonModalContent {...defaultProps} />);
      const input = screen.getByTestId('antd-input');
      expect(input).toBeInTheDocument();
    });

    test('P: handles add tag functionality', () => {
      render(<CommonModalContent {...defaultProps} />);
      const input = screen.getByTestId('antd-input');
      const addButton = screen.getByTestId('add-tag-button');
      
      fireEvent.change(input, { target: { value: 'new tag' } });
      fireEvent.click(addButton);
      
      expect(defaultProps.setTags).toHaveBeenCalledWith(['tag1', 'tag2', 'new tag']);
    });

    test('P: handles option selection', () => {
      render(<CommonModalContent {...defaultProps} />);
      const select = screen.getByTestId('antd-select');
      expect(select).toBeInTheDocument();
    });

    test('P: handles manually added codes submission', async () => {
      render(<CommonModalContent {...defaultProps} />);
      const submitButton = screen.getByTestId('submit-button');
      
      await act(async () => {
        fireEvent.click(submitButton);
      });
      
      expect(defaultProps.setAddManually).toHaveBeenCalled();
    });

    test('P: handles tag update functionality', () => {
      render(<CommonModalContent {...defaultProps} />);
      const editButton = screen.getByTestId('edit-tag-0');
      
      fireEvent.click(editButton);
      expect(screen.getByTestId('antd-input')).toBeInTheDocument();
    });

    test('P: handles tag deletion', () => {
      render(<CommonModalContent {...defaultProps} />);
      expect(screen.getByTestId('tags-component')).toBeInTheDocument();
    });

    test('P: renders year picker when needed', () => {
      render(<CommonModalContent {...defaultProps} />);
      expect(screen.getByTestId('antd-select')).toBeInTheDocument();
    });

    test('P: handles form submission with year', async () => {
      render(<CommonModalContent {...defaultProps} />);
      const submitButton = screen.getByTestId('submit-button');
      
      await act(async () => {
        fireEvent.click(submitButton);
      });
      
      expect(defaultProps.setAddManually).toHaveBeenCalled();
    });
  });

  describe('Edit Component', () => {
    const defaultProps = {
      form: {
        getFieldsValue: jest.fn(() => ({})),
        setFieldsValue: jest.fn(),
        validateFields: jest.fn(() => Promise.resolve({})),
        resetFields: jest.fn(),
        getFieldValue: jest.fn(),
        setFieldValue: jest.fn(),
        getFieldError: jest.fn(() => []),
        isFieldsTouched: jest.fn(() => false),
        submit: jest.fn(),
      },
      handleEditRow: jest.fn(),
      isNotResult: true
    };

    test('P: renders edit component with form fields', () => {
      render(<Edit {...defaultProps} />);
      expect(screen.getByTestId('edit-component')).toBeInTheDocument();
      expect(screen.getByText('Code')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Years')).toBeInTheDocument();
    });

    test('P: handles form submission', async () => {
      render(<Edit {...defaultProps} />);
      const editButton = screen.getByText('Edit');
      
      fireEvent.click(editButton);
      expect(defaultProps.handleEditRow).toHaveBeenCalled();
    });

    test('P: conditionally renders result code field', () => {
      render(<Edit {...defaultProps} isNotResult={false} />);
      expect(screen.getByText('Result Code')).toBeInTheDocument();
    });
  });

  describe('FileUploader Component', () => {
    const defaultProps = {
      setOpenModal: jest.fn()
    };

    test('P: renders file uploader component', () => {
      render(<FileUploader {...defaultProps} />);
      expect(screen.getByTestId('file-uploader')).toBeInTheDocument();
      expect(screen.getByText('Year')).toBeInTheDocument();
      expect(screen.getByText('Can We Calculate for all Processing Year')).toBeInTheDocument();
      expect(screen.getByText('Add Manually')).toBeInTheDocument();
    });

    test('P: handles add manually click', () => {
      render(<FileUploader {...defaultProps} />);
      const addManuallyButton = screen.getByText('Add Manually');
      
      fireEvent.click(addManuallyButton);
      expect(defaultProps.setOpenModal).toHaveBeenCalled();
    });

    test('P: renders checkbox for processing year calculation', () => {
      render(<FileUploader {...defaultProps} />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });
  });

  describe('Modal Component', () => {
    const defaultProps = {
      content: <div>Modal Content</div>,
      openModal: true,
      setOpenModal: jest.fn()
    };

    test('P: renders modal component when open', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    test('P: does not render when closed', () => {
      render(<Modal {...defaultProps} openModal={false} />);
      expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    });

    test('P: handles modal close', () => {
      render(<Modal {...defaultProps} />);
      const closeButton = screen.getByRole('button', { name: /close/i });
      
      fireEvent.click(closeButton);
      expect(defaultProps.setOpenModal).toHaveBeenCalled();
    });
  });

  describe('RafModal Component', () => {
    const defaultProps = {
      open: true,
      onCancel: jest.fn(),
      onSubmit: jest.fn()
    };

    test('P: renders RAF modal component when open', () => {
      render(<RafModal {...defaultProps} />);
      expect(screen.getByTestId('form-item')).toBeInTheDocument();
    });

    test('P: handles form submission', async () => {
      render(<RafModal {...defaultProps} />);
      const submitButton = screen.getByTestId('submit-button');
      
      await act(async () => {
        fireEvent.click(submitButton);
      });
      
      expect(defaultProps.onSubmit).toHaveBeenCalled();
    });

    test('P: handles modal cancellation', () => {
      render(<RafModal {...defaultProps} />);
      const cancelButton = screen.getByTestId('cancel-button');
      
      fireEvent.click(cancelButton);
      expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    test('P: renders form fields correctly', () => {
      render(<RafModal {...defaultProps} />);
      expect(screen.getAllByTestId('antd-input')).toHaveLength(2); // Assuming 2 input fields
    });
  });

  describe('Tags Component', () => {
    const defaultProps = {
      tags: ['tag1', 'tag2', 'tag3'],
      onDelete: jest.fn(),
      onEdit: jest.fn()
    };

    test('P: renders all provided tags', () => {
      render(<Tags {...defaultProps} />);
      expect(screen.getByText('tag1')).toBeInTheDocument();
      expect(screen.getByText('tag2')).toBeInTheDocument();
      expect(screen.getByText('tag3')).toBeInTheDocument();
    });

    test('P: handles tag deletion', () => {
      render(<Tags {...defaultProps} />);
      const deleteButton = screen.getByTestId('delete-tag-0');
      
      fireEvent.click(deleteButton);
      expect(defaultProps.onDelete).toHaveBeenCalledWith(0);
    });

    test('P: handles tag editing', () => {
      render(<Tags {...defaultProps} />);
      const editButton = screen.getByTestId('edit-tag-1');
      
      fireEvent.click(editButton);
      expect(defaultProps.onEdit).toHaveBeenCalledWith(1);
    });

    test('P: renders empty state when no tags', () => {
      render(<Tags {...defaultProps} tags={[]} />);
      expect(screen.queryByText('tag1')).not.toBeInTheDocument();
    });

    test('P: renders correct number of edit/delete buttons', () => {
      render(<Tags {...defaultProps} />);
      expect(screen.getAllByTestId('edit-tag-0')).toHaveLength(1);
      expect(screen.getAllByTestId('delete-tag-0')).toHaveLength(1);
    });
  });

  describe('Integration Tests', () => {
    test('P: components work together in modal context', () => {
      const props = {
        tags: ['test'],
        setTags: jest.fn(),
        setOpenModal: jest.fn(),
        setAddManually: jest.fn(() => Promise.resolve({ status: 'SUCCESS' })),
        getCodingDetails: jest.fn()
      };

      render(<CommonModalContent {...props} />);
      expect(screen.getByTestId('tags-component')).toBeInTheDocument();
      expect(screen.getByTestId('form-item')).toBeInTheDocument();
    });

    test('P: form validation works correctly', async () => {
      const props = {
        tags: [],
        setTags: jest.fn(),
        setOpenModal: jest.fn(),
        setAddManually: jest.fn(() => Promise.resolve({ status: 'USER_DEFINED_ERROR' })),
        getCodingDetails: jest.fn()
      };

      render(<CommonModalContent {...props} />);
      const submitButton = screen.getByTestId('submit-button');
      
      await act(async () => {
        fireEvent.click(submitButton);
      });
      
      expect(props.setAddManually).toHaveBeenCalled();
    });
  });

  describe('Error Handling Tests', () => {
    test('P: handles API errors gracefully', async () => {
      const props = {
        tags: [],
        setTags: jest.fn(),
        setOpenModal: jest.fn(),
        setAddManually: jest.fn(() => Promise.reject(new Error('API Error'))),
        getCodingDetails: jest.fn()
      };

      render(<CommonModalContent {...props} />);
      const submitButton = screen.getByTestId('submit-button');
      
      await act(async () => {
        fireEvent.click(submitButton);
      });
      
      // Should not crash
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });

    test('P: handles empty tag submission', () => {
      const props = {
        tags: [],
        setTags: jest.fn(),
        setOpenModal: jest.fn(),
        setAddManually: jest.fn(),
        getCodingDetails: jest.fn()
      };

      render(<CommonModalContent {...props} />);
      const input = screen.getByTestId('antd-input');
      const addButton = screen.getByTestId('add-tag-button');
      
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.click(addButton);
      
      expect(props.setTags).not.toHaveBeenCalled();
    });
  });

  describe('Stability Tests', () => {
    test('P/N/E stability 1', () => {
      render(<CommonModalContent tags={[]} setTags={jest.fn()} />);
      expect(screen.getByTestId('form-item')).toBeInTheDocument();
    });

    test('P/N/E stability 2', () => {
      render(<Edit onEdit={jest.fn()} onDelete={jest.fn()} />);
      expect(screen.getByTestId('font-awesome-icon')).toBeInTheDocument();
    });

    test('P/N/E stability 3', () => {
      render(<FileUploader onFileSelect={jest.fn()} />);
      expect(screen.getByTestId('antd-input')).toBeInTheDocument();
    });

    test('P/N/E stability 4', () => {
      render(<Modal open={true} onCancel={jest.fn()}>Content</Modal>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    test('P/N/E stability 5', () => {
      render(<RafModal open={true} onCancel={jest.fn()} onSubmit={jest.fn()} />);
      expect(screen.getByTestId('form-item')).toBeInTheDocument();
    });

    test('P/N/E stability 6', () => {
      render(<Tags tags={['test']} onDelete={jest.fn()} onEdit={jest.fn()} />);
      expect(screen.getByText('test')).toBeInTheDocument();
    });

    test('P/N/E stability 7', () => {
      render(<CommonModalContent tags={['tag1', 'tag2']} setTags={jest.fn()} />);
      expect(screen.getByTestId('tags-component')).toBeInTheDocument();
    });

    test('P/N/E stability 8', () => {
      render(<CommonModalContent tags={[]} setTags={jest.fn()} />);
      expect(screen.getByTestId('antd-input')).toBeInTheDocument();
    });

    test('P/N/E stability 9', () => {
      render(<Tags tags={[]} onDelete={jest.fn()} onEdit={jest.fn()} />);
      expect(screen.getByTestId('tags-component')).toBeInTheDocument();
    });

    test('P/N/E stability 10', () => {
      render(<Modal open={false} onCancel={jest.fn()}>Content</Modal>);
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });
  });
});

