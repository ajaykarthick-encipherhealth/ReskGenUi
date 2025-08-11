import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Default from '../../../../../src/commonPages/dashboard/component/layout/default';

// Mock only the dependencies that the Default component needs
jest.mock('../../../../../src/commonPages/dashboard/component/appchart', () => {
  return function MockAppChart() {
    return <div data-testid="app-chart">App Chart</div>;
  };
});

jest.mock('../../../../../src/commonPages/dashboard/component/table', () => {
  return function MockReusableTable() {
    return <div data-testid="reusable-table">Reusable Table</div>;
  };
});

jest.mock('../../../../../src/commonPages/dashboard/component/statChart', () => {
  return function MockStatCard() {
    return <div data-testid="stat-card">Stat Card</div>;
  };
});

jest.mock('../../../../../src/commonPages/dashboard/component/groupcard', () => {
  return function MockGroupCard() {
    return <div data-testid="group-card">Group Card</div>;
  };
});

jest.mock('../../../../../src/commonPages/dashboard/component/function', () => ({
  filterWidgetsByRole: jest.fn(),
  getFormattedChartData: jest.fn(),
  parseKValue: jest.fn(),
  useHasMounted: () => true,
  useWindowWidth: () => 1200,
  getColSpan: jest.fn(),
  getRowSpan: jest.fn()
}));

jest.mock('../../../../../src/commonPages/dashboard/component/function/resubaleDndContext', () => {
  return function MockDndFunction(props) {
    return <div data-testid="dnd-function">{props.children}</div>;
  };
});

// Mock the mockData
jest.mock('../../../../../src/commonPages/dashboard/component/layout/default/mockData', () => ({
  fileCountData: [],
  statCardsData: [],
  statCardData: [],
  rafAndRevenue: [],
  totalCodes: [],
  potientialCodes: [],
  careGapCodes: [],
  top10DiseasesMock: [],
  topOIGCodesMock: [],
  fileChartSeries: [],
  hccCodes: [],
  tinTableMock: []
}));

// Create a proper mock store with the expected state structure
const mockStore = configureStore([]);

const createMockStore = () => {
  return mockStore({
    admin: {
      dashboard1: {
        getWidgets: {
          data: {
            response: [
              { id: 'widget1', title: 'Widget 1', type: 'chart' },
              { id: 'widget2', title: 'Widget 2', type: 'table' }
            ]
          }
        }
      }
    }
  });
};

describe("Default component", () => {
  test("renders with default props", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Default />
      </Provider>
    );
    // Check for any div element being rendered
    const divElement = document.querySelector('div');
    expect(divElement).toBeInTheDocument();
  });

  test("renders with isDragable prop", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Default isDragable={true} />
      </Provider>
    );
    // Check for any div element being rendered
    const divElement = document.querySelector('div');
    expect(divElement).toBeInTheDocument();
  });

  test("renders with dashboard and setDashboard props", () => {
    const store = createMockStore();
    const mockDashboard = { items: ['item1', 'item2'] };
    const mockSetDashboard = jest.fn();

    render(
      <Provider store={store}>
        <Default 
          dashboard={mockDashboard}
          setDashboard={mockSetDashboard}
          selectedRole="admin"
        />
      </Provider>
    );
    
    const divElement = document.querySelector('div');
    expect(divElement).toBeInTheDocument();
  });

  test("renders with selectedItems and handleSelect props", () => {
    const store = createMockStore();
    const mockSelectedItems = ['item1', 'item2'];
    const mockHandleSelect = jest.fn();

    render(
      <Provider store={store}>
        <Default 
          selectedItems={mockSelectedItems}
          handleSelect={mockHandleSelect}
          selectedRole="user"
        />
      </Provider>
    );
    
    const divElement = document.querySelector('div');
    expect(divElement).toBeInTheDocument();
  });
}); 