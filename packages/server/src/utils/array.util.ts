export const splitArrayIntoChunks = (array: Array<any>, chunk = 100) => {
  return Array(Math.ceil(array.length / chunk))
    .fill(null)
    .map((_, index) => index * chunk)
    .map(begin => array.slice(begin, begin + chunk));
};
