import * as STRINGS from '@/data/keys/stringsKeys';
import { PICKUP, formConfigPickup } from '@/config/formConfig';
import { PACKAGE_TYPE } from '@/data/keys/configKeys';
import { PACKAGE_TYPE_PACKAGE, PACKAGE_TYPE_PACKAGE_SMALL } from '@/data/keys/settingsConsts';
import { configBus } from '../../config/configBus';
import { createPickupOptions } from '@/delivery-options/data/pickup/createPickupOptions';
import { getPriceLabelFromFormConfig } from '@/delivery-options/data/prices/getPriceLabelFromFormConfig';

/**
 * Get the pickup options if they are enabled in the config.
 *
 * @returns {Object|undefined}
 */
export function getPickupLocations() {
  if (!configBus.carrierDataWithPickupLocations.length || ![PACKAGE_TYPE_PACKAGE, PACKAGE_TYPE_PACKAGE_SMALL].includes(configBus.get(PACKAGE_TYPE))) {
    return;
  }

  return {
    name: PICKUP,
    label: STRINGS.PICKUP_TITLE,
    priceTag: getPriceLabelFromFormConfig(formConfigPickup),
    options: createPickupOptions,
  };
}
