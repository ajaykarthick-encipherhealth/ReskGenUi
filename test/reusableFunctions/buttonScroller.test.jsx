import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Buttonscroller from '../../src/components/buttonSroller/index';

describe('Buttonscroller component', () => {
  const mockHandleButtonClick = jest.fn();
  const mockButtons = [
    { title: 'Button 1' },
    { title: 'Button 2' },
    { title: 'Button 3' },
  ];

  const renderComponent = (activeButton = 0) => {
    return render(
      <Buttonscroller
        Buttons={mockButtons}
        activeButton={activeButton}
        handleButtonClick={mockHandleButtonClick}
        activeColor="white"
        inActiveColor="black"
        activeBg="blue"
        inActiveBg="gray"
        containerBg="lightgray"
        width={true}
      />
    );
  };

  test('renders all buttons and applies correct active/inactive styles', () => {
    renderComponent(1);
    mockButtons.forEach((btn) => {
      expect(screen.getByText(btn.title)).toBeInTheDocument();
    });
    const activeButton = screen.getByText('Button 2');
    expect(activeButton).toHaveStyle({
      backgroundColor: 'blue',
      color: 'white',
      borderRadius: '16px',
      width: '150px',
    });

    const inactiveButtons = [screen.getByText('Button 1'), screen.getByText('Button 3')];
    inactiveButtons.forEach((button) => {
      expect(button).toHaveStyle({
        backgroundColor: 'gray',
        color: 'black',
        width: '150px',
      });
    });
  });

  test('clicking a button calls handleButtonClick with correct arguments', () => {
    renderComponent();

    const button = screen.getByText('Button 3');
    fireEvent.click(button);

    expect(mockHandleButtonClick).toHaveBeenCalledWith(2, 'Button 3');
  });

 
});
