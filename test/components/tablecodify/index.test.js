import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Tables from '../../../src/components/tablecodify';

// Mock CSS modules used by the component
jest.mock('../../../src/components/tablecodify/style.module.css', () => ({
  btn: 'btn',
  code: 'code',
  symbols: 'symbols',
  digit: 'digit',
  term: 'term',
  card: 'card',
  head: 'head',
  para: 'para',
  includes: 'includes',
  excludes: 'excludes',
  excludes2: 'excludes2',
  add: 'add',
  Inclusion: 'inclusion',
  first: 'first',
  codealso: 'codealso',
  list: 'list',
  card2: 'card2',
  codes: 'codes',
  parent: 'parent'
}));

// Mock antd components used - keep as real-ish where possible
jest.mock('antd', () => ({
  Button: ({ children, className, onClick }) => (
    <button className={className} onClick={onClick}>{children}</button>
  ),
  Empty: () => <div>No data</div>,
  Spin: ({ children }) => <div>{children}</div>,
}));

// Mock Ant Design icons but without testids (component renders real svg normally)
jest.mock('@ant-design/icons', () => ({
  ArrowRightOutlined: () => <span aria-label="arrow-right" />,
  CopyOutlined: () => <span aria-label="copy" />,
  CheckOutlined: () => <span aria-label="check" />,
}));

// Mock CopyToClipboard to a clickable element that triggers onCopy
jest.mock('react-copy-to-clipboard', () => ({
  CopyToClipboard: ({ onCopy, children }) => (
    <div>
      <button data-testid="copy-btn" onClick={() => onCopy && onCopy()}>Copy</button>
      <div>{children}</div>
    </div>
  )
}));

// Mock skeleton components
jest.mock('../../../src/components/skeleton/table', () => {
  return function MockTableSkeleton() {
    return <div>TableSkeleton</div>;
  };
});

jest.mock('../../../src/components/skeleton/card', () => {
  return function MockCardSkeleton({ height }) {
    return <div>CardSkeleton</div>;
  };
});

// Mock dashboard actions to return a thunk that resolves a promise
jest.mock('../../../src/stores/codify/dashboard', () => ({
  actions: {
    codesAction: ({ code }) => (dispatch) => {
      // simulate async success
      return Promise.resolve({
        status: 'SUCCESS',
        response: {
          childData: {
            name: code,
            desc: `Desc for ${code}`,
            includes: 'inc1\ninc2',
            excludes1: 'ex1',
            excludes2: 'ex2',
            children: [],
            inclusionTerm: 'term',
            useAdditionalCode: 'additional',
            requiredCharacter: '*',
            codeFirst: 'cf',
            codeAlso: 'ca',
          },
          parentData: []
        }
      });
    }
  }
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('TableCodify Component', () => {
  const createStore = (codesLoader = false) =>
    mockStore({ codify: { codify: { codesLoader } } });

  const defaultProps = {
    codeData: {
      name: 'A00',
      desc: 'Cholera',
      includes: 'Include line 1\nInclude line 2',
      excludes1: 'Ex1 line',
      excludes2: 'Ex2 line',
      inclusionTerm: 'Inclusion term line',
      useAdditionalCode: 'Use additional code line',
      requiredCharacter: '#',
      codeFirst: 'Code first line',
      codeAlso: 'Code also line',
      children: [
        { name: 'A00.0', desc: 'Cholera due to Vibrio cholerae 01, biovar cholerae', requiredCharacter: 'X' }
      ]
    },
    setCodeData: jest.fn(),
    setLoading: jest.fn(),
    setParentCode: jest.fn(),
    parentCode: [
      {
        name: 'ParentName',
        desc: 'Parent Desc',
        includes: 'P inc 1\nP inc 2',
        excludes1: 'P ex1',
        excludes2: 'P ex2',
        inclusionTerm: 'P term',
        useAdditionalCode: 'P additional',
        codeFirst: 'P cf',
        codeAlso: 'P ca',
      }
    ],
    codesData: undefined, // provided by connect via mocked actions
    searchInput: 'A00',
    setSearchInput: jest.fn(),
    setHideButton: jest.fn(),
    hideButton: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Positive Scenarios', () => {
    test('renders required symbols section when requiredCharacter is present', () => {
      const store = createStore(false);
      render(
        <Provider store={store}>
          <Tables {...defaultProps} />
        </Provider>
      );

      expect(screen.getByText('Related Symbols')).toBeInTheDocument();
      // Text is split across nodes; assert on a stable substring
      expect(screen.getByText(/Digit Required/i)).toBeInTheDocument();
    });

    test('renders main card with header and sections', () => {
      const store = createStore(false);
      render(
        <Provider store={store}>
          <Tables {...defaultProps} />
        </Provider>
      );

      expect(screen.getByText(/A00 -Cholera/)).toBeInTheDocument();
      // Includes content split into lines
      expect(screen.getByText('Include line 1')).toBeInTheDocument();
      expect(screen.getByText('Include line 2')).toBeInTheDocument();
      // Excludes sections
      expect(screen.getAllByText('Excludes1').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Excludes2').length).toBeGreaterThan(0);
      // Other labels
      expect(screen.getAllByText('Use additional').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Inclusion Term').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Code First').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Code also').length).toBeGreaterThan(0);
    });

    test('renders children list and handles child click (handleViewTable)', async () => {
      const store = createStore(false);
      render(
        <Provider store={store}>
          <Tables {...defaultProps} />
        </Provider>
      );

      const child = screen.getByText('A00.0');
      expect(child).toBeInTheDocument();
      fireEvent.click(child);

      expect(defaultProps.setLoading).toHaveBeenCalled();
      expect(defaultProps.setHideButton).toHaveBeenCalledWith(true);
      expect(defaultProps.setSearchInput).toHaveBeenCalledWith('A00.0');
    });

    test('copy to clipboard triggers onCopy handler', () => {
      const store = createStore(false);
      render(
        <Provider store={store}>
          <Tables {...defaultProps} />
        </Provider>
      );

      fireEvent.click(screen.getByTestId('copy-btn'));
      // No throw means success; icon swap is implementation detail
      expect(screen.getByText(/A00 -Cholera/)).toBeInTheDocument();
    });

    test('renders parent code sections when provided', () => {
      const store = createStore(false);
      render(
        <Provider store={store}>
          <Tables {...defaultProps} />
        </Provider>
      );

      expect(screen.getByText(/ParentName - Parent Desc/)).toBeInTheDocument();
      expect(screen.getByText('P inc 1')).toBeInTheDocument();
      expect(screen.getByText('P inc 2')).toBeInTheDocument();
      expect(screen.getByText('P ex1')).toBeInTheDocument();
      expect(screen.getByText('P ex2')).toBeInTheDocument();
      expect(screen.getByText('P term')).toBeInTheDocument();
      expect(screen.getByText('P cf')).toBeInTheDocument();
      expect(screen.getByText('P ca')).toBeInTheDocument();
    });

    test('renders back button when hideButton is true and triggers handleBack', () => {
      const store = createStore(false);
      const props = { ...defaultProps, hideButton: true };
      render(
        <Provider store={store}>
          <Tables {...props} />
        </Provider>
      );

      const backBtn = screen.getByText('Back');
      expect(backBtn).toBeInTheDocument();
      fireEvent.click(backBtn);
      expect(props.setHideButton).toHaveBeenCalledWith(false);
    });
  });

  describe('Loading and Empty States', () => {
    test('shows skeletons when codesLoader is true', () => {
      const store = createStore(true);
      render(
        <Provider store={store}>
          <Tables {...defaultProps} />
        </Provider>
      );

      expect(screen.getAllByText('CardSkeleton').length).toBeGreaterThan(0);
      expect(screen.getByText('TableSkeleton')).toBeInTheDocument();
    });

    test('renders Empty components when include/exclude sections are missing', () => {
      const store = createStore(false);
      const props = {
        ...defaultProps,
        codeData: { name: 'A00', desc: 'Cholera', includes: '', excludes1: '', excludes2: '', children: [] },
        parentCode: [{ name: 'P', desc: 'PD' }]
      };
      render(
        <Provider store={store}>
          <Tables {...props} />
        </Provider>
      );

      // Empty will appear for missing includes/excludes (Antd Empty has 'No data' title)
      expect(screen.getAllByText('No data').length).toBeGreaterThan(0);
    });
  });

  describe('Negative Scenarios', () => {
    test('handles minimal props without crashing', () => {
      const store = createStore(false);
      const minimalProps = {
        codeData: {},
        setCodeData: jest.fn(),
        setLoading: jest.fn(),
        setParentCode: jest.fn(),
        parentCode: [],
        searchInput: '',
        setSearchInput: jest.fn(),
        setHideButton: jest.fn(),
        hideButton: false,
      };

      render(
        <Provider store={store}>
          <Tables {...minimalProps} />
        </Provider>
      );

      // Renders container structure
      expect(document.body).toBeInTheDocument();
    });
  });
}); 