import fs from 'node:fs';
import plugin from 'tailwindcss/plugin';
import postcss from 'postcss';

const ROOT_SELECTOR = '.myparcel-delivery-options';

const WHITELIST = Object.freeze([
  '*',
  '::after',
  '::before',
  'a',
  'button',
  'div',
  'img',
  'label',
  'li',
  'p',
  'span',
  'svg',
  'ul',
]);

/**
 * Replacement for the default preflight plugin, which removes selectors not in the whitelist and prepends a class
 * to the root element
 */
export const tailwindPreflightPlugin = plugin(({addBase}) => {
  /**
   * Get the plain CSS from the preflight file
   */
  const plainCss = fs.readFileSync(require.resolve('tailwindcss/lib/css/preflight.css'), 'utf8');
  const preflightStyles = postcss.parse(plainCss);

  preflightStyles.walkRules((rule) => {
    rule.selector = rule.selector
      .split(',')
      .map((selector) => selector.trim())
      /**
       * Delete selectors that are not whitelisted
       */
      .filter((selector) => {
        if (!selector) {
          return false;
        }

        return WHITELIST.includes(selector) || WHITELIST.some((item) => selector.startsWith(`${item}:`));
      })
      /**
       * Prefix with the base selector
       */
      .map((selector) => `${ROOT_SELECTOR} ${selector}`)
      .join(',');

    if (!rule.selector) {
      rule.remove();
    }
  });

  // @ts-expect-error this works and is also done this way by tailwind itself
  addBase(preflightStyles.nodes);
});
