export const delayedPromises = <TData>(promises: Array<Promise<TData>>, delayIncrement = 200) => {
  let delay = 0;

  return Promise.all(
    promises.map(promise => {
      delay += delayIncrement;

      return new Promise(resolve => {
        setTimeout(resolve, delay);
      }).then(() => promise);
    }),
  );
};

export const runPromisesSequentially = <T>(
  promises: Array<() => Promise<T>>,
  delay: number,
): Promise<T[]> => {
  const result: T[] = [];

  return promises
    .reduce((prevPromise: Promise<T>, currentPromise: () => Promise<T>) => {
      return prevPromise
        .then((res: T) => {
          result.push(res);
          return new Promise(resolve => {
            setTimeout(resolve, delay);
          });
        })
        .then(currentPromise);
    }, Promise.resolve() as Promise<T>)
    .then((res: T) => {
      result.push(res);
      return result;
    });
};
