import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock CSS
jest.mock('../../../src/components/buttonSroller/styles.module.css', () => ({
  btnContainer: 'btnContainer',
  btnActive: 'btnActive',
  btnInactive: 'btnInactive'
}));

import Buttonscroller from '../../../src/components/buttonSroller';

describe('Buttonscroller', () => {
  const buttons = [{ title: 'A' }, { title: 'B' }, { title: 'C' }];

  test('renders labels and applies active/inactive classes', () => {
    const { container } = render(
      <Buttonscroller
        Buttons={buttons}
        activeButton={1}
        activeBg="blue"
        inActiveBg="gray"
        activeColor="white"
        inActiveColor="black"
        containerBg="pink"
      />
    );
    expect(container.querySelector('.btnContainer')).toBeInTheDocument();
    expect(screen.getByText('A').className).toContain('btnInactive');
    expect(screen.getByText('B').className).toContain('btnActive');
  });

  test('clicking label invokes handleButtonClick with index and title', () => {
    const handleButtonClick = jest.fn();
    render(
      <Buttonscroller Buttons={buttons} activeButton={0} handleButtonClick={handleButtonClick} />
    );
    fireEvent.click(screen.getByText('C'));
    expect(handleButtonClick).toHaveBeenCalledWith(2, 'C');
  });

  test('negative: handles missing Buttons gracefully', () => {
    render(<Buttonscroller />);
    expect(document.querySelectorAll('label').length).toBe(0);
  });
}); 