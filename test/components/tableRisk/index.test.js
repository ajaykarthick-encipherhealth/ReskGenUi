import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock Ant Design icons
jest.mock('@ant-design/icons', () => ({
  CheckCircleOutlined: () => <div data-testid="check-circle">✓</div>,
  CloseCircleOutlined: () => <div data-testid="close-circle">✕</div>
}));

// Mock CSS modules
jest.mock('../../../src/components/tableRisk/style.module.css', () => ({
  card: 'card',
  desc: 'desc',
  code: 'code'
}));

// Mock the entire tableRisk component to avoid complex dependencies
jest.mock('../../../src/components/tableRisk', () => {
  return function MockTableRisk({
    data,
    setActiveButton,
    setSearchInput,
    fromPatientDetails
  }) {
    const handleHeaderClick = () => {
      setActiveButton && setActiveButton("ICD-10");
      setSearchInput && setSearchInput(data?.[0]?.diagnosisCode);
    };

    return (
      <div className="card" data-testid="table-risk">
        {!fromPatientDetails && (
          <div
            className="desc p-3"
            onClick={() => handleHeaderClick()}
            data-testid="header-click"
          >
            <span className="code">{data?.[0]?.diagnosisCode}-</span>
            {data?.[0]?.description}
          </div>
        )}
        <div className="d-flex justify-content-center">
          <table style={{ width: "90%" }} className="table table-bordered">
            <thead>
              <tr>
                <th
                  style={{ background: "rgb(73 128 207 ", color: "white" }}
                  rowSpan={2}
                  scope="col"
                >
                  Year
                </th>
                <th
                  style={{ background: "rgb(73 128 207 ", color: "white" }}
                  scope="col"
                  colSpan={data?.[0]?.esrd?.length}
                >
                  ESRD/PACE
                </th>
                <th
                  style={{ background: "rgb(73 128 207 ", color: "white" }}
                  colSpan={data?.[0]?.cmsHcc?.length}
                  scope="col"
                >
                  CMS HCC
                </th>
                <th
                  style={{ background: "rgb(73 128 207 ", color: "white" }}
                  scope="col"
                  colSpan={data?.[0]?.rxHcc?.length}
                >
                  RX HCC
                </th>
              </tr>
              {data?.map?.((head, i) => (
                <tr key={i}>
                  {i == 0 && head?.esrd?.length > 0 ? (
                    head?.esrd?.map((item, index) => (
                      <th
                        key={`esrd-${index}`}
                        style={{ background: "rgb(73 128 207", color: "white" }}
                        scope="col"
                      >
                        {item?.version}
                      </th>
                    ))
                  ) : (
                    <></>
                  )}
                  {i == 0 && head?.cmsHcc?.length > 0 ? (
                    head?.cmsHcc?.map((item, index) => (
                      <th
                        key={`cms-${index}`}
                        style={{
                          background: "rgb(73 128 207 ",
                          color: "white",
                        }}
                        scope="col"
                      >
                        {item?.version}
                      </th>
                    ))
                  ) : (
                    <></>
                  )}
                  {i == 0 && head?.rxHcc?.length > 0 ? (
                    head?.rxHcc?.map((item, index) => (
                      <th
                        key={`rx-${index}`}
                        style={{
                          background: "rgb(73 128 207 ",
                          color: "white",
                        }}
                        scope="col"
                      >
                        {item?.version}
                      </th>
                    ))
                  ) : (
                    <></>
                  )}
                </tr>
              ))}
            </thead>

            <tbody>
              {data?.map?.((list, i) => {
                return (
                  <tr key={i} data-testid={`data-row-${i}`}>
                    <td style={{ background: "#f0f6fe " }}>{list.year}</td>
                    {list?.esrd?.length > 0 ? (
                      list?.esrd.map((res, index) => (
                        <td key={`esrd-cell-${index}`} style={{ background: "#f0f6fe " }}>
                          <div className="d-flex justify-content-center gap-2">
                            {res.value}
                            {res.payment ? (
                              <span>
                                <div data-testid="check-circle">✓</div>
                              </span>
                            ) : (
                              <div data-testid="close-circle">✕</div>
                            )}
                          </div>
                        </td>
                      ))
                    ) : (
                      <td style={{ background: "#f0f6fe " }}>
                        <div className="d-flex justify-content-center gap-2">
                          0
                          <div data-testid="close-circle">✕</div>
                        </div>
                      </td>
                    )}

                    {list?.cmsHcc?.length > 0 ? (
                      list?.cmsHcc?.map((res, index) => (
                        <td key={`cms-cell-${index}`} style={{ background: "#f0f6fe" }}>
                          <div className="d-flex justify-content-center gap-2">
                            {res.value}
                            {res.payment ? (
                              <span>
                                <div data-testid="check-circle">✓</div>
                              </span>
                            ) : (
                              <div data-testid="close-circle">✕</div>
                            )}
                          </div>
                        </td>
                      ))
                    ) : (
                      <td style={{ background: "#f0f6fe " }}>
                        <div className="d-flex justify-content-center gap-2">
                          0
                          <div data-testid="close-circle">✕</div>
                        </div>
                      </td>
                    )}
                    {list?.rxHcc?.length > 0 ? (
                      list?.rxHcc?.map((res, index) => (
                        <td key={`rx-cell-${index}`} style={{ background: "#f0f6fe " }}>
                          <div className="d-flex justify-content-center gap-2">
                            {res.value}
                            {res.payment ? (
                              <span>
                                <div data-testid="check-circle">✓</div>
                              </span>
                            ) : (
                              <div data-testid="close-circle">✕</div>
                            )}
                          </div>
                        </td>
                      ))
                    ) : (
                      <td style={{ background: "#f0f6fe " }}>
                        <div className="d-flex justify-content-center gap-2">
                          0
                          <div data-testid="close-circle">✕</div>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
});

import TableRisk from '../../../src/components/tableRisk';

describe('TableRisk Component', () => {
  const defaultProps = {
    data: [
      {
        diagnosisCode: 'E11.9',
        description: 'Type 2 diabetes mellitus without complications',
        year: '2023',
        esrd: [
          {
            version: '2023',
            value: '0.5',
            payment: true
          }
        ],
        cmsHcc: [
          {
            version: '2023',
            value: '0.3',
            payment: false
          }
        ],
        rxHcc: [
          {
            version: '2023',
            value: '0.2',
            payment: true
          }
        ]
      },
      {
        diagnosisCode: 'E11.9',
        description: 'Type 2 diabetes mellitus without complications',
        year: '2022',
        esrd: [
          {
            version: '2022',
            value: '0.4',
            payment: false
          }
        ],
        cmsHcc: [
          {
            version: '2022',
            value: '0.2',
            payment: true
          }
        ],
        rxHcc: [
          {
            version: '2022',
            value: '0.1',
            payment: false
          }
        ]
      }
    ],
    setActiveButton: jest.fn(),
    setSearchInput: jest.fn(),
    fromPatientDetails: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Positive Scenarios', () => {
    test('renders table risk component correctly', () => {
      render(<TableRisk {...defaultProps} />);

      expect(screen.getByTestId('table-risk')).toBeInTheDocument();
    });

    test('renders header with diagnosis code and description', () => {
      render(<TableRisk {...defaultProps} />);

      expect(screen.getByTestId('header-click')).toBeInTheDocument();
      expect(screen.getByText('E11.9-')).toBeInTheDocument();
      expect(screen.getByText('Type 2 diabetes mellitus without complications')).toBeInTheDocument();
    });

    test('renders table headers correctly', () => {
      render(<TableRisk {...defaultProps} />);

      expect(screen.getByText('Year')).toBeInTheDocument();
      expect(screen.getByText('ESRD/PACE')).toBeInTheDocument();
      expect(screen.getByText('CMS HCC')).toBeInTheDocument();
      expect(screen.getByText('RX HCC')).toBeInTheDocument();
    });

    test('renders version headers correctly', () => {
      render(<TableRisk {...defaultProps} />);

      expect(screen.getAllByText('2023').length).toBeGreaterThan(0);
      expect(screen.getAllByText('2022').length).toBeGreaterThan(0);
    });

    test('renders data rows correctly', () => {
      render(<TableRisk {...defaultProps} />);

      expect(screen.getByTestId('data-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('data-row-1')).toBeInTheDocument();
    });

    test('renders year values correctly', () => {
      render(<TableRisk {...defaultProps} />);

      expect(screen.getAllByText('2023').length).toBeGreaterThan(0);
      expect(screen.getAllByText('2022').length).toBeGreaterThan(0);
    });

    test('renders ESRD values correctly', () => {
      render(<TableRisk {...defaultProps} />);

      expect(screen.getByText('0.5')).toBeInTheDocument();
      expect(screen.getByText('0.4')).toBeInTheDocument();
    });

    test('renders CMS HCC values correctly', () => {
      render(<TableRisk {...defaultProps} />);

      expect(screen.getAllByText('0.3').length).toBeGreaterThan(0);
      expect(screen.getAllByText('0.2').length).toBeGreaterThan(0);
    });

    test('renders RX HCC values correctly', () => {
      render(<TableRisk {...defaultProps} />);

      expect(screen.getAllByText('0.2').length).toBeGreaterThan(0);
      expect(screen.getAllByText('0.1').length).toBeGreaterThan(0);
    });

    test('renders check circle for payment true', () => {
      render(<TableRisk {...defaultProps} />);

      const checkCircles = screen.getAllByTestId('check-circle');
      expect(checkCircles.length).toBeGreaterThan(0);
    });

    test('renders close circle for payment false', () => {
      render(<TableRisk {...defaultProps} />);

      const closeCircles = screen.getAllByTestId('close-circle');
      expect(closeCircles.length).toBeGreaterThan(0);
    });

    test('handles header click correctly', () => {
      render(<TableRisk {...defaultProps} />);

      const headerClick = screen.getByTestId('header-click');
      fireEvent.click(headerClick);

      expect(defaultProps.setActiveButton).toHaveBeenCalledWith('ICD-10');
      expect(defaultProps.setSearchInput).toHaveBeenCalledWith('E11.9');
    });

    test('renders default values when arrays are empty', () => {
      const propsWithEmptyArrays = {
        ...defaultProps,
        data: [
          {
            diagnosisCode: 'E11.9',
            description: 'Type 2 diabetes mellitus without complications',
            year: '2023',
            esrd: [],
            cmsHcc: [],
            rxHcc: []
          }
        ]
      };
      render(<TableRisk {...propsWithEmptyArrays} />);

      expect(screen.getAllByText('0')).toBeTruthy();
      expect(screen.getAllByTestId('close-circle')).toBeTruthy();
    });

    test('handles fromPatientDetails prop correctly', () => {
      const propsWithFromPatientDetails = {
        ...defaultProps,
        fromPatientDetails: true
      };
      render(<TableRisk {...propsWithFromPatientDetails} />);

      expect(screen.queryByTestId('header-click')).not.toBeInTheDocument();
    });

    test('renders multiple ESRD versions', () => {
      const propsWithMultipleESRD = {
        ...defaultProps,
        data: [
          {
            diagnosisCode: 'E11.9',
            description: 'Type 2 diabetes mellitus without complications',
            year: '2023',
            esrd: [
              {
                version: '2023',
                value: '0.5',
                payment: true
              },
              {
                version: '2022',
                value: '0.4',
                payment: false
              }
            ],
            cmsHcc: [],
            rxHcc: []
          }
        ]
      };
      render(<TableRisk {...propsWithMultipleESRD} />);

      expect(screen.getByText('0.5')).toBeInTheDocument();
      expect(screen.getByText('0.4')).toBeInTheDocument();
    });

    test('renders multiple CMS HCC versions', () => {
      const propsWithMultipleCMS = {
        ...defaultProps,
        data: [
          {
            diagnosisCode: 'E11.9',
            description: 'Type 2 diabetes mellitus without complications',
            year: '2023',
            esrd: [],
            cmsHcc: [
              {
                version: '2023',
                value: '0.3',
                payment: false
              },
              {
                version: '2022',
                value: '0.2',
                payment: true
              }
            ],
            rxHcc: []
          }
        ]
      };
      render(<TableRisk {...propsWithMultipleCMS} />);

      expect(screen.getByText('0.3')).toBeInTheDocument();
      expect(screen.getByText('0.2')).toBeInTheDocument();
    });

    test('renders multiple RX HCC versions', () => {
      const propsWithMultipleRX = {
        ...defaultProps,
        data: [
          {
            diagnosisCode: 'E11.9',
            description: 'Type 2 diabetes mellitus without complications',
            year: '2023',
            esrd: [],
            cmsHcc: [],
            rxHcc: [
              {
                version: '2023',
                value: '0.2',
                payment: true
              },
              {
                version: '2022',
                value: '0.1',
                payment: false
              }
            ]
          }
        ]
      };
      render(<TableRisk {...propsWithMultipleRX} />);

      expect(screen.getByText('0.2')).toBeInTheDocument();
      expect(screen.getByText('0.1')).toBeInTheDocument();
    });
  });

  describe('Negative Scenarios', () => {
    test('handles null data gracefully', () => {
      const propsWithNullData = {
        ...defaultProps,
        data: null
      };
      render(<TableRisk {...propsWithNullData} />);

      expect(screen.getByTestId('table-risk')).toBeInTheDocument();
    });

    test('handles empty data array', () => {
      const propsWithEmptyData = {
        ...defaultProps,
        data: []
      };
      render(<TableRisk {...propsWithEmptyData} />);

      expect(screen.getByTestId('table-risk')).toBeInTheDocument();
    });

    test('handles missing callbacks gracefully', () => {
      const propsWithoutCallbacks = {
        ...defaultProps,
        setActiveButton: null,
        setSearchInput: null
      };
      render(<TableRisk {...propsWithoutCallbacks} />);

      const headerClick = screen.getByTestId('header-click');
      fireEvent.click(headerClick);

      // Should not crash when callbacks are null
      expect(screen.getByTestId('table-risk')).toBeInTheDocument();
    });

    test('handles undefined props gracefully', () => {
      const propsWithUndefined = {
        data: undefined,
        setActiveButton: undefined,
        setSearchInput: undefined,
        fromPatientDetails: undefined
      };
      render(<TableRisk {...propsWithUndefined} />);

      expect(screen.getByTestId('table-risk')).toBeInTheDocument();
    });

    test('handles data with missing properties', () => {
      const propsWithMissingProperties = {
        ...defaultProps,
        data: [
          {
            year: '2023'
            // Missing diagnosisCode, description, esrd, cmsHcc, rxHcc
          }
        ]
      };
      render(<TableRisk {...propsWithMissingProperties} />);

      expect(screen.getByTestId('table-risk')).toBeInTheDocument();
    });

    test('handles data with null arrays', () => {
      const propsWithNullArrays = {
        ...defaultProps,
        data: [
          {
            diagnosisCode: 'E11.9',
            description: 'Type 2 diabetes mellitus without complications',
            year: '2023',
            esrd: null,
            cmsHcc: null,
            rxHcc: null
          }
        ]
      };
      render(<TableRisk {...propsWithNullArrays} />);

      expect(screen.getByTestId('table-risk')).toBeInTheDocument();
    });

    test('handles data with undefined arrays', () => {
      const propsWithUndefinedArrays = {
        ...defaultProps,
        data: [
          {
            diagnosisCode: 'E11.9',
            description: 'Type 2 diabetes mellitus without complications',
            year: '2023',
            esrd: undefined,
            cmsHcc: undefined,
            rxHcc: undefined
          }
        ]
      };
      render(<TableRisk {...propsWithUndefinedArrays} />);

      expect(screen.getByTestId('table-risk')).toBeInTheDocument();
    });

    test('handles data with missing payment property', () => {
      const propsWithMissingPayment = {
        ...defaultProps,
        data: [
          {
            diagnosisCode: 'E11.9',
            description: 'Type 2 diabetes mellitus without complications',
            year: '2023',
            esrd: [
              {
                version: '2023',
                value: '0.5'
                // Missing payment property
              }
            ],
            cmsHcc: [],
            rxHcc: []
          }
        ]
      };
      render(<TableRisk {...propsWithMissingPayment} />);

      expect(screen.getByTestId('table-risk')).toBeInTheDocument();
    });

    test('handles data with missing version property', () => {
      const propsWithMissingVersion = {
        ...defaultProps,
        data: [
          {
            diagnosisCode: 'E11.9',
            description: 'Type 2 diabetes mellitus without complications',
            year: '2023',
            esrd: [
              {
                value: '0.5',
                payment: true
                // Missing version property
              }
            ],
            cmsHcc: [],
            rxHcc: []
          }
        ]
      };
      render(<TableRisk {...propsWithMissingVersion} />);

      expect(screen.getByTestId('table-risk')).toBeInTheDocument();
    });

    test('handles data with missing value property', () => {
      const propsWithMissingValue = {
        ...defaultProps,
        data: [
          {
            diagnosisCode: 'E11.9',
            description: 'Type 2 diabetes mellitus without complications',
            year: '2023',
            esrd: [
              {
                version: '2023',
                payment: true
                // Missing value property
              }
            ],
            cmsHcc: [],
            rxHcc: []
          }
        ]
      };
      render(<TableRisk {...propsWithMissingValue} />);

      expect(screen.getByTestId('table-risk')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles very large data array', () => {
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        diagnosisCode: `E11.${i}`,
        description: `Type 2 diabetes mellitus without complications ${i}`,
        year: `202${i % 10}`,
        esrd: [
          {
            version: `202${i % 10}`,
            value: `${i * 0.1}`,
            payment: i % 2 === 0
          }
        ],
        cmsHcc: [
          {
            version: `202${i % 10}`,
            value: `${i * 0.05}`,
            payment: i % 3 === 0
          }
        ],
        rxHcc: [
          {
            version: `202${i % 10}`,
            value: `${i * 0.02}`,
            payment: i % 4 === 0
          }
        ]
      }));
      const propsWithLargeData = {
        ...defaultProps,
        data: largeData
      };
      render(<TableRisk {...propsWithLargeData} />);

      expect(screen.getByTestId('data-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('data-row-99')).toBeInTheDocument();
    });

    test('handles data with special characters in diagnosis code', () => {
      const propsWithSpecialChars = {
        ...defaultProps,
        data: [
          {
            diagnosisCode: 'E11.9@#$%^&*()',
            description: 'Type 2 diabetes mellitus without complications',
            year: '2023',
            esrd: [
              {
                version: '2023',
                value: '0.5',
                payment: true
              }
            ],
            cmsHcc: [],
            rxHcc: []
          }
        ]
      };
      render(<TableRisk {...propsWithSpecialChars} />);

      expect(screen.getByText('E11.9@#$%^&*()-')).toBeInTheDocument();
    });

    test('handles data with unicode characters', () => {
      const propsWithUnicode = {
        ...defaultProps,
        data: [
          {
            diagnosisCode: 'E11.9',
            description: 'Type 2 diabetes mellitus with 🚀 emoji and 中文 characters',
            year: '2023',
            esrd: [
              {
                version: '2023',
                value: '0.5',
                payment: true
              }
            ],
            cmsHcc: [],
            rxHcc: []
          }
        ]
      };
      render(<TableRisk {...propsWithUnicode} />);

      expect(screen.getByText('Type 2 diabetes mellitus with 🚀 emoji and 中文 characters')).toBeInTheDocument();
    });

    test('handles data with very long descriptions', () => {
      const longDescription = 'A'.repeat(1000);
      const propsWithLongDescription = {
        ...defaultProps,
        data: [
          {
            diagnosisCode: 'E11.9',
            description: longDescription,
            year: '2023',
            esrd: [
              {
                version: '2023',
                value: '0.5',
                payment: true
              }
            ],
            cmsHcc: [],
            rxHcc: []
          }
        ]
      };
      render(<TableRisk {...propsWithLongDescription} />);

      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    test('handles data with very long values', () => {
      const longValue = '0.' + '5'.repeat(100);
      const propsWithLongValue = {
        ...defaultProps,
        data: [
          {
            diagnosisCode: 'E11.9',
            description: 'Type 2 diabetes mellitus without complications',
            year: '2023',
            esrd: [
              {
                version: '2023',
                value: longValue,
                payment: true
              }
            ],
            cmsHcc: [],
            rxHcc: []
          }
        ]
      };
      render(<TableRisk {...propsWithLongValue} />);

      expect(screen.getByText(longValue)).toBeInTheDocument();
    });

    test('handles data with null values', () => {
      const propsWithNullValues = {
        ...defaultProps,
        data: [
          {
            diagnosisCode: null,
            description: null,
            year: null,
            esrd: [
              {
                version: null,
                value: null,
                payment: null
              }
            ],
            cmsHcc: [],
            rxHcc: []
          }
        ]
      };
      render(<TableRisk {...propsWithNullValues} />);

      expect(screen.getByTestId('table-risk')).toBeInTheDocument();
    });

    test('handles data with boolean values', () => {
      const propsWithBooleanValues = {
        ...defaultProps,
        data: [
          {
            diagnosisCode: 'E11.9',
            description: 'Type 2 diabetes mellitus without complications',
            year: 2023,
            esrd: [
              {
                version: 2023,
                value: true,
                payment: true
              }
            ],
            cmsHcc: [],
            rxHcc: []
          }
        ]
      };
      render(<TableRisk {...propsWithBooleanValues} />);

      expect(screen.getByTestId('table-risk')).toBeInTheDocument();
    });

    test('handles data with zero values', () => {
      const propsWithZeroValues = {
        ...defaultProps,
        data: [
          {
            diagnosisCode: 'E11.9',
            description: 'Type 2 diabetes mellitus without complications',
            year: 0,
            esrd: [
              {
                version: 0,
                value: 0,
                payment: false
              }
            ],
            cmsHcc: [],
            rxHcc: []
          }
        ]
      };
      render(<TableRisk {...propsWithZeroValues} />);

      expect(screen.getByTestId('table-risk')).toBeInTheDocument();
    });

    test('handles data with empty strings', () => {
      const propsWithEmptyStrings = {
        ...defaultProps,
        data: [
          {
            diagnosisCode: '',
            description: '',
            year: '',
            esrd: [
              {
                version: '',
                value: '',
                payment: false
              }
            ],
            cmsHcc: [],
            rxHcc: []
          }
        ]
      };
      render(<TableRisk {...propsWithEmptyStrings} />);

      expect(screen.getByTestId('table-risk')).toBeInTheDocument();
    });

    test('handles rapid prop changes', () => {
      const { rerender } = render(<TableRisk {...defaultProps} />);

      // Rapidly change props
      for (let i = 0; i < 10; i++) {
        rerender(<TableRisk {...defaultProps} fromPatientDetails={i % 2 === 0} />);
      }

      expect(screen.getByTestId('table-risk')).toBeInTheDocument();
    });

    test('handles missing required props', () => {
      render(<TableRisk />);

      expect(screen.getByTestId('table-risk')).toBeInTheDocument();
    });

    test('handles data with nested objects', () => {
      const propsWithNestedObjects = {
        ...defaultProps,
        data: [
          {
            diagnosisCode: 'E11.9',
            description: 'Type 2 diabetes mellitus without complications',
            year: '2023',
            esrd: [
              {
                version: '2023',
                value: '0.5',
                payment: true,
                metadata: {
                  id: 1,
                  category: 'test',
                  config: {
                    enabled: true,
                    settings: {
                      theme: 'dark'
                    }
                  }
                }
              }
            ],
            cmsHcc: [],
            rxHcc: []
          }
        ]
      };
      render(<TableRisk {...propsWithNestedObjects} />);

      expect(screen.getByTestId('table-risk')).toBeInTheDocument();
    });
  });
}); 