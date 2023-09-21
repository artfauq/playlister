export const splitArrayIntoChunks = <TData>(array: TData[], chunk = 100) => {
  return Array(Math.ceil(array.length / chunk))
    .fill(null)
    .map((_, index) => index * chunk)
    .map(begin => array.slice(begin, begin + chunk));
};
