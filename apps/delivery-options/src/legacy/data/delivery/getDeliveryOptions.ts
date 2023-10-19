import * as STRINGS from '@/data/keys/stringsKeys';
import { CARRIER, DELIVER, formConfigDelivery } from '@/config/formConfig';
import { configBus } from '../../config/configBus';
import { createDeliveryOptions } from '@/delivery-options/data/delivery/createDeliveryOptions';
import { cssClassBase } from '@/delivery-options/cssClassBase';
import { getPriceLabelFromFormConfig } from '@/delivery-options/data/prices/getPriceLabelFromFormConfig';

/**
 * Get delivery options for carriers in the config.
 *
 * @returns {Object|undefined}
 */
export function getDeliveryOptions() {
  if (!configBus.carrierDataWithDeliveryOptions.length) {
    return;
  }

  return {
    name: DELIVER,
    label: STRINGS.DELIVERY_TITLE,
    priceTag: getPriceLabelFromFormConfig(formConfigDelivery),
    type: 'radio',
    // If multi carrier, return another level of settings and their options based on carrier.
    options: [{
      name: CARRIER,
      type: configBus.carrierDataWithDeliveryOptions.length > 1 ? 'radio' : 'heading',
      choices: configBus.carrierDataWithDeliveryOptions.map((carrier) => ({
        ...carrier,
        name: carrier.identifier,
        class: `${cssClassBase}__spacing--md`,
        priceTag: getPriceLabelFromFormConfig(formConfigDelivery, carrier.identifier),
        options: () => createDeliveryOptions(carrier.identifier),
      })),
    }],
  };
}
