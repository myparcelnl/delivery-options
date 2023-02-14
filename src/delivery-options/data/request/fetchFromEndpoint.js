import '@myparcel/js-sdk/dist/endpoint/public/carriers';
import '@myparcel/js-sdk/dist/endpoint/public/delivery-options';
import '@myparcel/js-sdk/dist/endpoint/public/pickup-locations';
import Client from '@myparcel/js-sdk/dist/client';
import { LOCALE } from '@/data/keys/configKeys';
import { configBus } from '@/delivery-options/config/configBus';
import { getApiUrl } from '@/delivery-options/data/request/getApiUrl';
import isEqual from 'lodash-es/isEqual';
import memoize from 'lodash-es/memoize';

export const METHOD_GET = 'get';
export const METHOD_SEARCH = 'search';

const memoizedFetch = memoize(async function fetchFunc(endpoint, options = {}) {
  const client = new Client();

  client.config.acceptLanguage = configBus ? configBus.get(LOCALE) : 'nl-NL';
  client.config.url = getApiUrl();

  let response = [];

  // Set default options and override with given options.
  options = {
    method: METHOD_GET,
    ...options,
  };

  try {
    response = await client[endpoint][options.method](options.params) || [];
  } catch (e) {
    if (!configBus) {
      return;
    }

    return {
      response: [],
      error: e,
    };
  }
  return { response, error: null };
}, (...args) => JSON.stringify(args));

/**
 * Fetch data from an endpoint, handle any errors and return an object containing the response.
 *
 * @param {string} endpoint - Endpoint to use.
 *
 * @param {Object} options - Options.
 * @param {string} options.method? - Method.
 * @param {Object} options.params? - URL parameters.
 *
 * @returns {Promise<{response: Array, errors: Array}>}
 */
export const fetchFromEndpoint = async(endpoint, options = {}) => {
  const { response, error } = await memoizedFetch(endpoint, options);

  if (error) {
    const { errors } = error;

    configBus.errors = [];

    if (errors && errors.length && !isEqual([{ code: 0 }], errors)) {
      errors.forEach((error) => {
        configBus.addError({
          type: 'api',
          endpoint,
          ...error,
        });
      });
    } else {
      configBus.addError({ type: 'fatal', endpoint, error });
    }
  }

  return response;
};
