import { splitArrayIntoChunks } from '../array.utils';

describe('array.utils', () => {
  describe('splitArrayIntoChunks()', () => {
    it('should split an array into chunks of the specified size', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const chunkSize = 3;
      const expectedChunks = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]];

      const result = splitArrayIntoChunks(array, chunkSize);

      expect(result).toEqual(expectedChunks);
    });

    it('should return an empty array if the input array is empty', () => {
      const array: number[] = [];
      const chunkSize = 3;
      const expectedChunks: number[][] = [];

      const result = splitArrayIntoChunks(array, chunkSize);

      expect(result).toEqual(expectedChunks);
    });

    it('should return an array with a single chunk if the chunk size is greater than the array length', () => {
      const array = [1, 2, 3];
      const chunkSize = 5;
      const expectedChunks = [[1, 2, 3]];

      const result = splitArrayIntoChunks(array, chunkSize);

      expect(result).toEqual(expectedChunks);
    });
  });
});
