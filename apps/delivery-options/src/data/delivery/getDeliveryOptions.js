import {STRINGS} from '../../data';
import { CARRIER, DELIVER, formConfigDelivery } from '../../config';
import { configBus } from '../../config';
import { createDeliveryOptions } from './createDeliveryOptions';
import { cssClassBase } from '../../services';
import { getPriceLabelFromFormConfig } from '../prices';

/**
 * Get deliver options for carriers in the config.
 *
 * @returns {Object}
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
      type: configBus.hasMultipleDeliveryCarriers ? 'radio' : 'heading',
      choices: configBus.carrierDataWithDeliveryOptions.map((carrier) => {
        const choices = {
          ...carrier,
          class: `${cssClassBase}__spacing--md`,
          priceTag: getPriceLabelFromFormConfig(formConfigDelivery, carrier.name),
          options: () => createDeliveryOptions(carrier.name),
        };

        if (!configBus.hasMultipleDeliveryCarriers) {
          delete choices.image;
        }

        return choices;
      }),
    }],
  };
}
