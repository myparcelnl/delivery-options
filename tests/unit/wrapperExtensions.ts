import { dataTest } from '@Tests/unit/selectors';

/**
 * @param {Wrapper} wrapper
 * @returns {Wrapper}
 */
export const addWrapperExtensions = (wrapper) => {
  const extensions = {
    /**
     * @param {String} id
     * @returns {Wrapper}
     */
    findByTestId(id) {
      return wrapper.find(dataTest(id));
    },

    /**
     * @param {String} id
     * @returns {WrapperArray}
     */
    findAllByTestId(id) {
      return wrapper.findAll(dataTest(id));
    },

    /**
     * @param {String} id
     * @param {String} choice
     * @returns {Wrapper}
     */
    findChoice(id, choice) {
      const idSelector = dataTest(id);
      const choiceSelector = dataTest(choice, 'choice');

      return wrapper.find(idSelector + choiceSelector);
    },
  };

  Object.keys(extensions).forEach((extension) => {
    wrapper[extension] = extensions[extension];
  });

  return wrapper;
};
