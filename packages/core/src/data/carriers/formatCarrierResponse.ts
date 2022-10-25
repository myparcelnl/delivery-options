import {useAppConfig} from '@myparcel/delivery-options-shared/src/config';

/**
 * Format the carriers response to fit in the checkout form.
 *
 * @param {Array} response - Response array from /carriers.
 *
 * @returns {Array}
 */
export const formatCarrierResponse = (response) => {
  const appConfig = useAppConfig();

  return response.map((carrier) => ({
    id: carrier.id,
    name: carrier.name,
    label: carrier.human,
    image: appConfig.assetsUrl + carrier.meta.logo_svg,
  }));
};
