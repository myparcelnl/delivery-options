import '@myparcel/js-sdk/dist/endpoint/public/carriers';
import '@myparcel/js-sdk/dist/endpoint/public/delivery-options';
import '@myparcel/js-sdk/dist/endpoint/public/pickup-locations';
import { ACCEPT_JSON, HEADER_ACCEPT, HEADER_ACCEPT_LANGUAGE, HEADER_USER_AGENT, METHOD_GET } from '../endpoints';
import { DEFAULT_LOCALE } from '../../../data/locales/nl/config';
import { LOCALE } from '@/data/keys/configKeys';
import { configBus } from '@/delivery-options/config/configBus';
import { getApiUrl } from '@/delivery-options/data/request/getApiUrl';
import isEqual from 'lodash-es/isEqual';
import memoize from 'lodash-es/memoize';

const memoizedFetch = memoize(async function fetchFunc(definition, options = {}) {
  let response = [];

  // Set default options and override with given options.
  options = {
    method: METHOD_GET,
    ...options,
  };

  let url = getApiUrl() + definition.endpoint;

  if (options.path) {
    url += `/${options.path}`;
  }

  if (options.params) {
    const params = new URLSearchParams(options.params);
    url += `?${params.toString()}`;
  }

  try {
    const result = await fetch(url, {
      method: options.method,
      headers: {
        [HEADER_ACCEPT]: ACCEPT_JSON,
        ...options.headers,
        [HEADER_ACCEPT_LANGUAGE]: configBus ? configBus.get(LOCALE) : DEFAULT_LOCALE,
        [HEADER_USER_AGENT]: `MyParcelDeliveryOptions/${process.env.VERSION}`,
      },
    });

    const json = await result.json();

    if (!result.ok) {
      throw json;
    }

    response = json.data[definition.property ?? definition.endpoint] ?? [];
  } catch (e) {
    if (!configBus) {
      return;
    }

    return {
      response: [],
      error: e,
    };
  }

  return {
    response,
    error: null,
  };
}, (...args) => JSON.stringify(args));

/**
 * Fetch data from an endpoint, handle any errors and return an object containing the response.
 *
 * @param {Object} endpoint - Endpoint definition to use.
 *
 * @param {Object} options - Options.
 * @param {string} options.method? - Method.
 * @param {Object} options.params? - URL parameters.
 *
 * @returns {Promise<{response: Array, errors: Array}>}
 */
export const fetchFromEndpoint = async(endpoint, options = {}) => {
  const {
    response,
    error,
  } = await memoizedFetch(endpoint, options);

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
      configBus.addError({
        type: 'fatal',
        endpoint,
        error,
      });
    }
  }

  return response;
};
