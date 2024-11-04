import {render,fireEvent} from '@testing-library/react';
import Buttonscroller from '../../src/components/buttonSroller/index';
import styles from '../../src/components/buttonSroller/style.module.css';

describe("Buttonscroller", () => {
  it("should render the correct number of labels", () => {
    const buttons = [
      { title: "Button 1" },
      { title: "Button 2" },
      { title: "Button 3" },
    ];
    const { getAllByText } = render(<Buttonscroller Buttons={buttons} />);
    buttons.forEach((btn) => {
      expect(getAllByText(btn.title)).toHaveLength(1);
    });
    expect(getAllByText(/Button/)).toHaveLength(buttons.length);
  });

//   it("should render the correct label text", () => {
//     const buttons = [
//       { title: "Button 1" },
//       { title: "Button 2" },
//       { title: "Button 3" },
//     ];
//     const { getAllByRole } = render(<Buttonscroller Buttons={buttons} />);
//     const labelElements = getAllByRole("label");
//     expect(labelElements[0]).toHaveTextContent("Button 1");
//     expect(labelElements[1]).toHaveTextContent("Button 2");
//     expect(labelElements[2]).toHaveTextContent("Button 3");
//   });
//   it("should call the handleButtonClick function when a label is clicked", () => {
//     const handleButtonClick = jest.fn();
//     const buttons = [
//       { title: "Button 1" },
//       { title: "Button 2" },
//       { title: "Button 3" },
//     ];
//     const { getAllByRole } = render(<Buttonscroller Buttons={buttons} handleButtonClick={handleButtonClick} />);
//     const labelElements = getAllByRole("label");
//     fireEvent.click(labelElements[0]);
//     expect(handleButtonClick).toHaveBeenCalledTimes(1);
//   });
//   it("should render the correct active label", () => {
//     const buttons = [
//       { title: "Button 1" },
//       { title: "Button 2" },
//       { title: "Button 3" },
//     ];
//     const { getAllByRole } = render(<Buttonscroller Buttons={buttons} activeButton={1} />);
//     const labelElements = getAllByRole("label");
//     expect(labelElements[1]).toHaveClass("btnActive");
//   });
//   it("should render the correct inactive labels", () => {
//     const buttons = [
//       { title: "Button 1" },
//       { title: "Button 2" },
//       { title: "Button 3" },
//     ];
//     const { getAllByRole } = render(<Buttonscroller Buttons={buttons} activeButton={1} />);
//     const labelElements = getAllByRole("label");
//     expect(labelElements[0]).toHaveClass("btnInactive");
//     expect(labelElements[2]).toHaveClass("btnInactive");
//   });
});