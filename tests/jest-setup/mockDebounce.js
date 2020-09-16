/**
 * Mock lodash debounce with another debounce function that does NOT use `Date`. Normal debounce goes into infinite loop
 *  when using `MockDate.set()`.
 */
jest.mock('lodash-es/debounce', () => jest.fn((func, wait, immediate = false) => {
  let timeout;
  return function debounce() {
    const args = arguments;
    const later = () => {
      timeout = null;

      if (!immediate) {
        func.apply(this, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(this, args);
    }
  };
}));
