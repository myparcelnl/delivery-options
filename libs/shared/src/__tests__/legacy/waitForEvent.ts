/**
 * @param {String} event - Event name.
 * @param {Vue|Document} subject
 *
 * @returns {Promise<CustomEvent>}
 */
export function waitForEvent(event, subject = document) {
  const isVue = subject instanceof Vue;

  const add = isVue ? '$on' : 'addEventListener';
  const remove = isVue ? '$off' : 'removeEventListener';

  return new Promise((resolve) => {
    const listener = (e) => {
      subject[remove](event, listener);
      resolve(e);
    };

    subject[add](event, listener);
  });
}
