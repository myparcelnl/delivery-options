import Vue from 'vue';
import{ isObject } from 'lodash-unified';

/**
 * Add a data-test attribute(s) to an element with 'v-test', but only if the environment is 'test'. If you don't provide
 *  a value in v-test, the vnode's key will be used, if possible. You can also provide an object, to have each entry
 *  added as data-test-<key>=<value>.
 *
 * @param {Element} el - The element with the v-test attribute.
 * @param {Object} binding - The value for the attribute.
 * @param {import('vue').VNode} vnode
 */
export const vTest = (el, binding, vnode) => {
  // if (__NODE_ENV__ !== 'test') {
  //   return;
  // }

  if (isObject(binding.value)) {
    Object.keys(binding.value).forEach((value) => {
      el.setAttribute(`data-test-${value}`, binding.value[value]);
    });
    return;
  }

  let testKey = binding.value || vnode.key;

  if (!testKey && el.id) {
    testKey = el.id.replace(`${Vue.prototype.$classBase}__`, '');
  }

  if (!testKey) {
    throw new Error('Couldn\'t automatically determine a v-test key for this element.');
  }

  el.setAttribute('data-test-id', testKey);
};
