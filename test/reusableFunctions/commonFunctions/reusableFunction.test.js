import { removeDuplicatesArray,removeDuplicates,moveToStrightAction } from '../../../src/components/patientDetails/details/components/function/ReusableFunctions'

describe('removeDuplicatesArray', () => {

  test('returns original array if no duplicates', () => {
    const input = [
      { header: 'header1', data: 'data1' },
      { header: 'header2', data: 'data2' },
    ];
    const expectedOutput = input;
    
    const result = removeDuplicatesArray(input);
    expect(result).toEqual(expectedOutput);
  });

  test('returns empty array when input is empty', () => {
    const input = [];
    const expectedOutput = [];
    
    const result = removeDuplicatesArray(input);
    expect(result).toEqual(expectedOutput);
  });

  test('removes cogent_dos header', () => {
    const input = [
      { header: 'header1', data: 'data1' },
      { header: 'cogent_dos', data: 'data2' },
    ];
    const expectedOutput = [
      { header: 'header1', data: 'data1' },
    ];
    
    const result = removeDuplicatesArray(input);
    expect(result).toEqual(expectedOutput);
  });
});
  
  describe('removeDuplicates', () => {
    test('removes duplicates from an array', () => {
      expect(removeDuplicates([1, 2, 2, 3, 4, 4, 5])).toEqual([1, 2, 3, 4, 5]);
    });
  
    test('returns the same array if there are no duplicates', () => {
      expect(removeDuplicates([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
    });
  
    test('returns an empty array when input is an empty array', () => {
      expect(removeDuplicates([])).toEqual([]);
    });
  
    test('returns an empty array when input is undefined', () => {
      expect(removeDuplicates(undefined)).toEqual([]);
    });
  
    test('handles arrays with different data types', () => {
      expect(removeDuplicates([1, '1', 2, '2', 2, 1])).toEqual([1, '1', 2, '2']);
    });
  });


describe('moveToStrightAction', () => {
  test('calls setIsValidAction with correct parameters', () => {
    const mockSetIsValidAction = jest.fn();
    const name = 'Sample Name';
    const title = 'Sample Title';

    moveToStrightAction(mockSetIsValidAction, name, title);

    expect(mockSetIsValidAction).toHaveBeenCalledWith({
      name: name,
      title: title,
    });
  });

  test('handles empty name and title', () => {
    const mockSetIsValidAction = jest.fn();
    const name = '';
    const title = '';

    moveToStrightAction(mockSetIsValidAction, name, title);

    expect(mockSetIsValidAction).toHaveBeenCalledWith({
      name: name,
      title: title,
    });
  });

  test('calls setIsValidAction with undefined parameters', () => {
    const mockSetIsValidAction = jest.fn();
    const name = undefined;
    const title = undefined;

    moveToStrightAction(mockSetIsValidAction, name, title);

    expect(mockSetIsValidAction).toHaveBeenCalledWith({
      name: name,
      title: title,
    });
  });
});
