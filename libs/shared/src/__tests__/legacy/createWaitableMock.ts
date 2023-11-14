// eslint-disable-next-line jsdoc/require-returns
/**
 * Creates a mock function that checks when and how many times it has been called. You use this in jest to wait until a
 * function is called any amount of times.
 *
 * @param {Mock|Function} original
 *
 * @see https://github.com/facebook/jest/issues/7432#issuecomment-443536177
 */
export const createWaitableMock = (original = null) => {
  let resolve;
  let times;
  let calledCount = 0;
  const mock = vi.fn();

  mock.mockImplementation(() => {
    calledCount += 1;

    if (resolve && calledCount >= times) {
      resolve();
    }

    if (original) {
      original();
    }
  });

  mock.waitToHaveBeenCalled = (timesParam) => {
    times = timesParam;
    return new Promise((resolveParam) => {
      resolve = resolveParam;
    });
  };

  return mock;
};
