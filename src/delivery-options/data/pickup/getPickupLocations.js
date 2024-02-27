import * as STRINGS from '@/data/keys/stringsKeys';
import {PACKAGE_TYPE_PACKAGE, PACKAGE_TYPE_PACKAGE_SMALL} from '@/data/keys/settingsConsts';
import {PICKUP, formConfigPickup} from '@/config/formConfig';
import {PACKAGE_TYPE} from '@/data/keys/configKeys';
import {configBus} from '../../config/configBus';
import {createPickupOptions} from '@/delivery-options/data/pickup/createPickupOptions';
import {getPriceLabelFromFormConfig} from '@/delivery-options/data/prices/getPriceLabelFromFormConfig';
import {NETHERLANDS, BELGIUM} from '@myparcel/js-sdk/dist/constant/countries-iso2';

/**
 * Get the pickup options if they are enabled in the config.
 *
 * @returns {Object|undefined}
 */
export function getPickupLocations() {
  if (!isPickupAllowed()) {
    return;
  }

  return {
    name: PICKUP,
    label: STRINGS.PICKUP_TITLE,
    priceTag: getPriceLabelFromFormConfig(formConfigPickup),
    options: createPickupOptions,
  };
}

/**
 * @returns {boolean}
 */
function isPickupAllowed() {
  const packageType = configBus.get(PACKAGE_TYPE);

  const hasCarrierWithPickup = configBus.carrierDataWithPickupLocations.length;
  const packageTypeCanHavePickup = [PACKAGE_TYPE_PACKAGE, PACKAGE_TYPE_PACKAGE_SMALL].includes(packageType);
  const isNlAndPackageSmall = PACKAGE_TYPE_PACKAGE_SMALL === packageType && [
    NETHERLANDS,
    BELGIUM,
  ].includes(configBus.address.cc);

  return !hasCarrierWithPickup || !packageTypeCanHavePickup || !isNlAndPackageSmall;
}
