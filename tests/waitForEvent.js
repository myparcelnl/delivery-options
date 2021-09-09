import Vue from 'vue';
import { debounce } from 'lodash-es/function';

/**
 * @param {string} event - Event name.
 * @param {Vue|Document} subject
 * @param {number} debounceDelay
 * @returns {Promise}
 */
export function waitForEvent(event, subject = document, debounceDelay = 0) {
  const isVue = subject instanceof Vue;

  const add = isVue ? '$on' : 'addEventListener';
  const remove = isVue ? '$off' : 'removeEventListener';

  return new Promise((resolve) => {
    const listener = () => {
      subject[remove](event, listener);
      resolve();
    };

    if (debounceDelay > 0) {
      subject[add](event, debounce(listener, debounceDelay));
    } else {
      subject[add](event, listener);
    }
  });
}
