export const delayedPromises = (promises: Promise<any>[], delayIncrement = 200) => {
  let delay = 0;

  return Promise.all(
    promises.map(promise => {
      delay += delayIncrement;

      return new Promise(resolve => setTimeout(resolve, delay)).then(() => promise);
    }),
  );
};
