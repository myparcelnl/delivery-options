import {FORM_PACKAGE_TYPE, formConfigPickup, PACKAGE_TYPE_PACKAGE, PICKUP, STRINGS} from '@myparcel-do/shared';
import {getPriceLabelFromFormConfig} from '../prices';
import {createPickupOptions} from './createPickupOptions';

/**
 * Get the pickup options if they are enabled in the config.
 *
 * @returns {Object|undefined}
 */
export function getPickupLocations() {
  if (!configBus.carrierDataWithPickupLocations.length || configBus.get(FORM_PACKAGE_TYPE) !== PACKAGE_TYPE_PACKAGE) {
    return;
  }

  return {
    name: PICKUP,
    label: STRINGS.PICKUP_TITLE,
    priceTag: getPriceLabelFromFormConfig(formConfigPickup),
    options: createPickupOptions,
  };
}
