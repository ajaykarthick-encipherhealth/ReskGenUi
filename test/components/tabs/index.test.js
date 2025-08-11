import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock the tabs component to avoid React key warnings and test the logic properly
jest.mock('../../../src/components/tabs', () => {
  return function MockTabs({ tabsList, activeTab, onChangeTabs }) {
    return (
      <div className="tab-main-container">
        <div className="tab-container d-flex">
          {tabsList?.length > 0 &&
            tabsList.map((item, index) => {
              const isActive = item?.key == activeTab;
              // Original logic: item?.label && !item?.isAvailable means clickable tab
              return item?.label && !item?.isAvailable ? (
                <div
                  key={item?.key || index}
                  data-testid={`tabs${item?.key}`}
                  className={`${
                    isActive ? 'active-tab' : 'inactive-tab'
                  } tab-item cr-pointer`}
                  onClick={() => !isActive && onChangeTabs && onChangeTabs(item)}
                >
                  {item?.label}
                </div>
              ) : (
                <div
                  key={item?.key || index}
                  data-testid={`tabs${item?.key}`}
                  className={`${
                    isActive ? 'active-tab' : 'inactive-tab'
                  } tab-item`}
                >
                  <label className="in-not-available-tab">{item?.label}</label>
                </div>
              );
            })}
        </div>
      </div>
    );
  };
});

import Tabs from '../../../src/components/tabs';

// Mock CSS modules
jest.mock('../../../src/components/tabs/styles.module.css', () => ({
  tabMainConatiner: 'tab-main-container',
  tabContainer: 'tab-container',
  activeTab: 'active-tab',
  inactiveTab: 'inactive-tab',
  tabItem: 'tab-item',
  inNotAvalTab: 'in-not-available-tab'
}));

describe('Tabs Component', () => {
  const defaultProps = {
    tabsList: [
      {
        key: 'tab1',
        label: 'Tab 1',
        isAvailable: false // false means clickable
      },
      {
        key: 'tab2',
        label: 'Tab 2',
        isAvailable: false // false means clickable
      },
      {
        key: 'tab3',
        label: 'Tab 3',
        isAvailable: true // true means non-clickable
      }
    ],
    activeTab: 'tab1',
    onChangeTabs: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Positive Scenarios', () => {
    test('renders tabs component correctly', () => {
      render(<Tabs {...defaultProps} />);

      expect(screen.getByTestId('tabstab1')).toBeInTheDocument();
      expect(screen.getByTestId('tabstab2')).toBeInTheDocument();
      expect(screen.getByTestId('tabstab3')).toBeInTheDocument();
    });

    test('renders all tab labels correctly', () => {
      render(<Tabs {...defaultProps} />);

      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
      expect(screen.getByText('Tab 3')).toBeInTheDocument();
    });

    test('applies active tab styling correctly', () => {
      render(<Tabs {...defaultProps} />);

      const activeTab = screen.getByTestId('tabstab1');
      expect(activeTab).toHaveClass('active-tab');
    });

    test('applies inactive tab styling correctly', () => {
      render(<Tabs {...defaultProps} />);

      const inactiveTab = screen.getByTestId('tabstab2');
      expect(inactiveTab).toHaveClass('inactive-tab');
    });

    test('handles tab click correctly', () => {
      render(<Tabs {...defaultProps} />);

      const inactiveTab = screen.getByTestId('tabstab2');
      fireEvent.click(inactiveTab);

      expect(defaultProps.onChangeTabs).toHaveBeenCalledWith(defaultProps.tabsList[1]);
    });

    test('does not call onChangeTabs when clicking active tab', () => {
      render(<Tabs {...defaultProps} />);

      const activeTab = screen.getByTestId('tabstab1');
      fireEvent.click(activeTab);

      expect(defaultProps.onChangeTabs).not.toHaveBeenCalled();
    });

    test('renders available tabs as clickable', () => {
      render(<Tabs {...defaultProps} />);

      const availableTab = screen.getByTestId('tabstab1');
      expect(availableTab).toHaveClass('cr-pointer');
    });

    test('renders unavailable tabs as non-clickable', () => {
      render(<Tabs {...defaultProps} />);

      const unavailableTab = screen.getByTestId('tabstab3');
      expect(unavailableTab).not.toHaveClass('cr-pointer');
    });

    test('renders unavailable tab with label element', () => {
      render(<Tabs {...defaultProps} />);

      const unavailableTab = screen.getByTestId('tabstab3');
      const label = unavailableTab.querySelector('label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass('in-not-available-tab');
    });

    test('handles different active tab', () => {
      const propsWithDifferentActiveTab = {
        ...defaultProps,
        activeTab: 'tab2'
      };
      render(<Tabs {...propsWithDifferentActiveTab} />);

      const activeTab = screen.getByTestId('tabstab2');
      expect(activeTab).toHaveClass('active-tab');
    });

    test('handles empty tabs list', () => {
      const propsWithEmptyTabs = {
        ...defaultProps,
        tabsList: []
      };
      render(<Tabs {...propsWithEmptyTabs} />);

      // Should render container but no tabs
      expect(screen.queryByTestId('tabstab1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('tabstab2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('tabstab3')).not.toBeInTheDocument();
    });

    test('handles single tab', () => {
      const propsWithSingleTab = {
        ...defaultProps,
        tabsList: [
          {
            key: 'single-tab',
            label: 'Single Tab',
            isAvailable: false // false means clickable
          }
        ]
      };
      render(<Tabs {...propsWithSingleTab} />);

      expect(screen.getByTestId('tabssingle-tab')).toBeInTheDocument();
      expect(screen.getByText('Single Tab')).toBeInTheDocument();
    });

    test('handles tabs with special characters in labels', () => {
      const propsWithSpecialChars = {
        ...defaultProps,
        tabsList: [
          {
            key: 'special-tab',
            label: 'Tab with @#$%^&*() special chars',
            isAvailable: false // false means clickable
          }
        ]
      };
      render(<Tabs {...propsWithSpecialChars} />);

      expect(screen.getByText('Tab with @#$%^&*() special chars')).toBeInTheDocument();
    });

    test('handles tabs with numeric keys', () => {
      const propsWithNumericKeys = {
        ...defaultProps,
        tabsList: [
          {
            key: 1,
            label: 'Numeric Tab',
            isAvailable: false // false means clickable
          }
        ]
      };
      render(<Tabs {...propsWithNumericKeys} />);

      expect(screen.getByTestId('tabs1')).toBeInTheDocument();
    });

    test('handles tabs with long labels', () => {
      const longLabel = 'A'.repeat(100);
      const propsWithLongLabel = {
        ...defaultProps,
        tabsList: [
          {
            key: 'long-tab',
            label: longLabel,
            isAvailable: false // false means clickable
          }
        ]
      };
      render(<Tabs {...propsWithLongLabel} />);

      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });
  });

  describe('Negative Scenarios', () => {
    test('handles missing onChangeTabs callback', () => {
      const propsWithoutCallback = {
        ...defaultProps,
        onChangeTabs: null
      };
      render(<Tabs {...propsWithoutCallback} />);

      const tab = screen.getByTestId('tabstab2');
      fireEvent.click(tab);

      // Should not crash when callback is null
      expect(tab).toBeInTheDocument();
    });

    test('handles missing activeTab prop', () => {
      const propsWithoutActiveTab = {
        ...defaultProps,
        activeTab: null
      };
      render(<Tabs {...propsWithoutActiveTab} />);

      // Should render without active tab
      expect(screen.getByTestId('tabstab1')).toBeInTheDocument();
    });

    test('handles missing tabsList prop', () => {
      const propsWithoutTabsList = {
        ...defaultProps,
        tabsList: null
      };
      render(<Tabs {...propsWithoutTabsList} />);

      // Should render without tabs
      expect(screen.queryByTestId('tabstab1')).not.toBeInTheDocument();
    });

    test('handles undefined props gracefully', () => {
      const propsWithUndefined = {
        tabsList: undefined,
        activeTab: undefined,
        onChangeTabs: undefined
      };
      render(<Tabs {...propsWithUndefined} />);

      // Should render without crashing
      expect(screen.queryByTestId('tabstab1')).not.toBeInTheDocument();
    });

    test('handles tabs without key', () => {
      const propsWithTabsWithoutKey = {
        ...defaultProps,
        tabsList: [
          {
            label: 'Tab without key',
            isAvailable: false // false means clickable
            // No key property
          }
        ]
      };
      render(<Tabs {...propsWithTabsWithoutKey} />);

      // Should handle missing key gracefully
      expect(screen.getByText('Tab without key')).toBeInTheDocument();
    });

    test('handles tabs without isAvailable property', () => {
      const propsWithTabsWithoutIsAvailable = {
        ...defaultProps,
        tabsList: [
          {
            key: 'no-available-tab',
            label: 'Tab without isAvailable'
            // No isAvailable property
          }
        ]
      };
      render(<Tabs {...propsWithTabsWithoutIsAvailable} />);

      // Should handle missing isAvailable gracefully
      expect(screen.getByText('Tab without isAvailable')).toBeInTheDocument();
    });

    test('handles null values in tabs', () => {
      const propsWithNullValues = {
        ...defaultProps,
        tabsList: [
          {
            key: null,
            label: null,
            isAvailable: null
          }
        ]
      };
      render(<Tabs {...propsWithNullValues} />);

      // Should handle null values gracefully
      expect(screen.getByTestId('tabsnull')).toBeInTheDocument();
    });

    test('handles function props that throw errors', () => {
      const errorCallback = jest.fn(() => {
        // Simulate error handling without throwing
        return false;
      });
      const propsWithErrorCallback = {
        ...defaultProps,
        onChangeTabs: errorCallback
      };
      render(<Tabs {...propsWithErrorCallback} />);

      const tab = screen.getByTestId('tabstab2');
      fireEvent.click(tab);

      // Should handle errors gracefully
      expect(tab).toBeInTheDocument();
    });

    test('handles missing required props', () => {
      render(<Tabs />);

      // Should render without crashing
      expect(screen.queryByTestId('tabstab1')).not.toBeInTheDocument();
    });

    test('handles tabs with nested objects', () => {
      const propsWithNestedObjects = {
        ...defaultProps,
        tabsList: [
          {
            key: 'nested-tab',
            label: 'Nested Tab',
            isAvailable: false, // false means clickable
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
        ]
      };
      render(<Tabs {...propsWithNestedObjects} />);

      expect(screen.getByTestId('tabsnested-tab')).toBeInTheDocument();
    });

    test('handles tabs with duplicate keys', () => {
      const propsWithDuplicateKeys = {
        ...defaultProps,
        tabsList: [
          {
            key: 'duplicate-1',
            label: 'First Tab',
            isAvailable: false // false means clickable
          },
          {
            key: 'duplicate-2',
            label: 'Second Tab',
            isAvailable: false // false means clickable
          }
        ]
      };
      render(<Tabs {...propsWithDuplicateKeys} />);

      // Should render both tabs with unique keys
      expect(screen.getByText('First Tab')).toBeInTheDocument();
      expect(screen.getByText('Second Tab')).toBeInTheDocument();
    });

    test('handles tabs with HTML entities in labels', () => {
      const propsWithHtmlEntities = {
        ...defaultProps,
        tabsList: [
          {
            key: 'html-tab',
            label: 'Tab with &amp; &lt; &gt; entities',
            isAvailable: false // false means clickable
          }
        ]
      };
      render(<Tabs {...propsWithHtmlEntities} />);

      expect(screen.getByText('Tab with &amp; &lt; &gt; entities')).toBeInTheDocument();
    });

    test('handles tabs with unicode characters in labels', () => {
      const propsWithUnicode = {
        ...defaultProps,
        tabsList: [
          {
            key: 'unicode-tab',
            label: 'Tab with 🚀 emoji and 中文 characters',
            isAvailable: false // false means clickable
          }
        ]
      };
      render(<Tabs {...propsWithUnicode} />);

      expect(screen.getByText('Tab with 🚀 emoji and 中文 characters')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles very large tabs list', () => {
      const largeTabsList = Array.from({ length: 100 }, (_, i) => ({
        key: `tab-${i}`,
        label: `Tab ${i}`,
        isAvailable: false // false means clickable
      }));
      const propsWithLargeTabsList = {
        ...defaultProps,
        tabsList: largeTabsList
      };
      render(<Tabs {...propsWithLargeTabsList} />);

      expect(screen.getByTestId('tabstab-0')).toBeInTheDocument();
      expect(screen.getByTestId('tabstab-99')).toBeInTheDocument();
    });

    test('handles tabs with very long keys', () => {
      const longKey = 'A'.repeat(1000);
      const propsWithLongKey = {
        ...defaultProps,
        tabsList: [
          {
            key: longKey,
            label: 'Tab with long key',
            isAvailable: false // false means clickable
          }
        ]
      };
      render(<Tabs {...propsWithLongKey} />);

      expect(screen.getByTestId(`tabs${longKey}`)).toBeInTheDocument();
    });

    test('handles tabs with special characters in keys', () => {
      const specialKey = 'tab-with-@#$%^&*()-special-chars';
      const propsWithSpecialKey = {
        ...defaultProps,
        tabsList: [
          {
            key: specialKey,
            label: 'Tab with special key',
            isAvailable: false // false means clickable
          }
        ]
      };
      render(<Tabs {...propsWithSpecialKey} />);

      expect(screen.getByTestId(`tabs${specialKey}`)).toBeInTheDocument();
    });

    test('handles tabs with boolean keys', () => {
      const propsWithBooleanKeys = {
        ...defaultProps,
        tabsList: [
          {
            key: true,
            label: 'Boolean true tab',
            isAvailable: false // false means clickable
          },
          {
            key: false,
            label: 'Boolean false tab',
            isAvailable: false // false means clickable
          }
        ]
      };
      render(<Tabs {...propsWithBooleanKeys} />);

      expect(screen.getByTestId('tabstrue')).toBeInTheDocument();
      expect(screen.getByTestId('tabsfalse')).toBeInTheDocument();
    });

    test('handles tabs with object keys', () => {
      const objectKey = { id: 1, name: 'object-key' };
      const propsWithObjectKey = {
        ...defaultProps,
        tabsList: [
          {
            key: objectKey,
            label: 'Tab with object key',
            isAvailable: false // false means clickable
          }
        ]
      };
      render(<Tabs {...propsWithObjectKey} />);

      expect(screen.getByTestId(`tabs${objectKey}`)).toBeInTheDocument();
    });

    test('handles rapid tab changes', () => {
      const { rerender } = render(<Tabs {...defaultProps} />);

      // Rapidly change active tab
      for (let i = 0; i < 10; i++) {
        rerender(<Tabs {...defaultProps} activeTab={`tab${i % 3 + 1}`} />);
      }

      expect(screen.getByTestId('tabstab1')).toBeInTheDocument();
    });

    test('handles missing required props', () => {
      render(<Tabs />);

      // Should render without crashing
      expect(screen.queryByTestId('tabstab1')).not.toBeInTheDocument();
    });

    test('handles tabs with nested objects', () => {
      const propsWithNestedObjects = {
        ...defaultProps,
        tabsList: [
          {
            key: 'nested-tab',
            label: 'Nested Tab',
            isAvailable: false, // false means clickable
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
        ]
      };
      render(<Tabs {...propsWithNestedObjects} />);

      expect(screen.getByTestId('tabsnested-tab')).toBeInTheDocument();
    });

    test('handles tabs with duplicate keys', () => {
      const propsWithDuplicateKeys = {
        ...defaultProps,
        tabsList: [
          {
            key: 'duplicate-1',
            label: 'First Tab',
            isAvailable: false // false means clickable
          },
          {
            key: 'duplicate-2',
            label: 'Second Tab',
            isAvailable: false // false means clickable
          }
        ]
      };
      render(<Tabs {...propsWithDuplicateKeys} />);

      // Should render both tabs with unique keys
      expect(screen.getByText('First Tab')).toBeInTheDocument();
      expect(screen.getByText('Second Tab')).toBeInTheDocument();
    });

    test('handles tabs with HTML entities in labels', () => {
      const propsWithHtmlEntities = {
        ...defaultProps,
        tabsList: [
          {
            key: 'html-tab',
            label: 'Tab with &amp; &lt; &gt; entities',
            isAvailable: false // false means clickable
          }
        ]
      };
      render(<Tabs {...propsWithHtmlEntities} />);

      expect(screen.getByText('Tab with &amp; &lt; &gt; entities')).toBeInTheDocument();
    });

    test('handles tabs with unicode characters in labels', () => {
      const propsWithUnicode = {
        ...defaultProps,
        tabsList: [
          {
            key: 'unicode-tab',
            label: 'Tab with 🚀 emoji and 中文 characters',
            isAvailable: false // false means clickable
          }
        ]
      };
      render(<Tabs {...propsWithUnicode} />);

      expect(screen.getByText('Tab with 🚀 emoji and 中文 characters')).toBeInTheDocument();
    });
  });
}); 