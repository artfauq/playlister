export const mapObjectsByKey = <T extends object, K extends keyof T>(
  objects: T[],
  key: K,
): Array<T[K]> => {
  return objects.map(object => object[key]);
};
